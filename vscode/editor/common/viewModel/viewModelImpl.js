var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "vs/base/common/strings", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/modes", "vs/editor/common/modes/textToHtmlTokenizer", "vs/editor/common/viewModel/viewModelDecorations", "vs/editor/common/viewModel/viewModel", "vs/editor/common/viewModel/splitLinesCollection", "vs/editor/common/view/viewEvents", "vs/editor/common/view/minimapCharRenderer", "vs/editor/common/model/textModelEvents", "vs/editor/common/viewModel/characterHardWrappingLineMapper", "vs/editor/common/viewLayout/viewLayout", "vs/base/common/color"], function (require, exports, strings, position_1, range_1, editorCommon, modes_1, textToHtmlTokenizer_1, viewModelDecorations_1, viewModel_1, splitLinesCollection_1, viewEvents, minimapCharRenderer_1, textModelEvents, characterHardWrappingLineMapper_1, viewLayout_1, color_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var USE_IDENTITY_LINES_COLLECTION = true;
    var ViewModel = (function (_super) {
        __extends(ViewModel, _super);
        function ViewModel(editorId, configuration, model, scheduleAtNextAnimationFrame) {
            var _this = _super.call(this) || this;
            _this.editorId = editorId;
            _this.configuration = configuration;
            _this.model = model;
            if (USE_IDENTITY_LINES_COLLECTION && _this.model.isTooLargeForTokenization()) {
                _this.lines = new splitLinesCollection_1.IdentityLinesCollection(_this.model);
            }
            else {
                var conf = _this.configuration.editor;
                var hardWrappingLineMapperFactory = new characterHardWrappingLineMapper_1.CharacterHardWrappingLineMapperFactory(conf.wrappingInfo.wordWrapBreakBeforeCharacters, conf.wrappingInfo.wordWrapBreakAfterCharacters, conf.wrappingInfo.wordWrapBreakObtrusiveCharacters);
                _this.lines = new splitLinesCollection_1.SplitLinesCollection(_this.model, hardWrappingLineMapperFactory, _this.model.getOptions().tabSize, conf.wrappingInfo.wrappingColumn, conf.fontInfo.typicalFullwidthCharacterWidth / conf.fontInfo.typicalHalfwidthCharacterWidth, conf.wrappingInfo.wrappingIndent);
            }
            _this.coordinatesConverter = _this.lines.createCoordinatesConverter();
            _this.viewLayout = _this._register(new viewLayout_1.ViewLayout(_this.configuration, _this.getLineCount(), scheduleAtNextAnimationFrame));
            _this._register(_this.viewLayout.onDidScroll(function (e) {
                _this._emit([new viewEvents.ViewScrollChangedEvent(e)]);
            }));
            _this._isDisposing = false;
            _this._centeredViewLine = -1;
            _this.decorations = new viewModelDecorations_1.ViewModelDecorations(_this.editorId, _this.model, _this.configuration, _this.coordinatesConverter);
            _this._register(_this.model.addBulkListener(function (events) {
                if (_this._isDisposing) {
                    // Disposing the lines might end up sending model decoration changed events
                    // ...we no longer care about them...
                    return;
                }
                var eventsCollector = new viewModel_1.ViewEventsCollector();
                _this._onModelEvents(eventsCollector, events);
                _this._emit(eventsCollector.finalize());
            }));
            _this._register(_this.configuration.onDidChange(function (e) {
                var eventsCollector = new viewModel_1.ViewEventsCollector();
                _this._onConfigurationChanged(eventsCollector, e);
                _this._emit(eventsCollector.finalize());
            }));
            _this._register(minimapCharRenderer_1.MinimapTokensColorTracker.getInstance().onDidChange(function () {
                _this._emit([new viewEvents.ViewTokensColorsChangedEvent()]);
            }));
            return _this;
        }
        ViewModel.prototype.dispose = function () {
            this._isDisposing = true;
            this.decorations.dispose();
            this.lines.dispose();
            _super.prototype.dispose.call(this);
        };
        ViewModel.prototype._onConfigurationChanged = function (eventsCollector, e) {
            // We might need to restore the current centered view range, so save it (if available)
            var previousCenteredModelRange = this.getCenteredRangeInViewport();
            var revealPreviousCenteredModelRange = false;
            var conf = this.configuration.editor;
            if (this.lines.setWrappingSettings(conf.wrappingInfo.wrappingIndent, conf.wrappingInfo.wrappingColumn, conf.fontInfo.typicalFullwidthCharacterWidth / conf.fontInfo.typicalHalfwidthCharacterWidth)) {
                eventsCollector.emit(new viewEvents.ViewFlushedEvent());
                eventsCollector.emit(new viewEvents.ViewLineMappingChangedEvent());
                eventsCollector.emit(new viewEvents.ViewDecorationsChangedEvent());
                this.decorations.onLineMappingChanged();
                this.viewLayout.onFlushed(this.getLineCount());
                if (this.viewLayout.getCurrentScrollTop() !== 0) {
                    // Never change the scroll position from 0 to something else...
                    revealPreviousCenteredModelRange = true;
                }
            }
            if (e.readOnly) {
                // Must read again all decorations due to readOnly filtering
                this.decorations.reset();
                eventsCollector.emit(new viewEvents.ViewDecorationsChangedEvent());
            }
            eventsCollector.emit(new viewEvents.ViewConfigurationChangedEvent(e));
            this.viewLayout.onConfigurationChanged(e);
            if (revealPreviousCenteredModelRange && previousCenteredModelRange) {
                // modelLine -> viewLine
                var newCenteredViewRange = this.coordinatesConverter.convertModelRangeToViewRange(previousCenteredModelRange);
                // Send a reveal event to restore the centered content
                eventsCollector.emit(new viewEvents.ViewRevealRangeRequestEvent(newCenteredViewRange, 1 /* Center */, false));
            }
        };
        ViewModel.prototype._onModelEvents = function (eventsCollector, events) {
            // A quick check if there are model content change events incoming
            // in order to update the configuration and reset the centered view line
            for (var i = 0, len = events.length; i < len; i++) {
                var eventType = events[i].type;
                if (eventType === textModelEvents.TextModelEventType.ModelRawContentChanged2) {
                    // There is a content change event
                    this._centeredViewLine = -1;
                    this.configuration.setMaxLineNumber(this.model.getLineCount());
                    break;
                }
            }
            var hadOtherModelChange = false;
            var hadModelLineChangeThatChangedLineMapping = false;
            for (var i = 0, len = events.length; i < len; i++) {
                var _e = events[i];
                var type = _e.type;
                var data = _e.data;
                switch (type) {
                    case textModelEvents.TextModelEventType.ModelRawContentChanged2: {
                        var e = data;
                        var changes = e.changes;
                        var versionId = e.versionId;
                        for (var j = 0, lenJ = changes.length; j < lenJ; j++) {
                            var change = changes[j];
                            switch (change.changeType) {
                                case 1 /* Flush */: {
                                    this.lines.onModelFlushed();
                                    eventsCollector.emit(new viewEvents.ViewFlushedEvent());
                                    this.decorations.reset();
                                    this.viewLayout.onFlushed(this.getLineCount());
                                    hadOtherModelChange = true;
                                    break;
                                }
                                case 3 /* LinesDeleted */: {
                                    var linesDeletedEvent = this.lines.onModelLinesDeleted(versionId, change.fromLineNumber, change.toLineNumber);
                                    if (linesDeletedEvent !== null) {
                                        eventsCollector.emit(linesDeletedEvent);
                                        this.viewLayout.onLinesDeleted(linesDeletedEvent.fromLineNumber, linesDeletedEvent.toLineNumber);
                                    }
                                    hadOtherModelChange = true;
                                    break;
                                }
                                case 4 /* LinesInserted */: {
                                    var linesInsertedEvent = this.lines.onModelLinesInserted(versionId, change.fromLineNumber, change.toLineNumber, change.detail.split('\n'));
                                    if (linesInsertedEvent !== null) {
                                        eventsCollector.emit(linesInsertedEvent);
                                        this.viewLayout.onLinesInserted(linesInsertedEvent.fromLineNumber, linesInsertedEvent.toLineNumber);
                                    }
                                    hadOtherModelChange = true;
                                    break;
                                }
                                case 2 /* LineChanged */: {
                                    var _a = this.lines.onModelLineChanged(versionId, change.lineNumber, change.detail), lineMappingChanged = _a[0], linesChangedEvent = _a[1], linesInsertedEvent = _a[2], linesDeletedEvent = _a[3];
                                    hadModelLineChangeThatChangedLineMapping = lineMappingChanged;
                                    if (linesChangedEvent) {
                                        eventsCollector.emit(linesChangedEvent);
                                    }
                                    if (linesInsertedEvent) {
                                        eventsCollector.emit(linesInsertedEvent);
                                        this.viewLayout.onLinesInserted(linesInsertedEvent.fromLineNumber, linesInsertedEvent.toLineNumber);
                                    }
                                    if (linesDeletedEvent) {
                                        eventsCollector.emit(linesDeletedEvent);
                                        this.viewLayout.onLinesDeleted(linesDeletedEvent.fromLineNumber, linesDeletedEvent.toLineNumber);
                                    }
                                    break;
                                }
                                case 5 /* EOLChanged */: {
                                    // Nothing to do. The new version will be accepted below
                                    break;
                                }
                            }
                        }
                        this.lines.acceptVersionId(versionId);
                        break;
                    }
                    case textModelEvents.TextModelEventType.ModelTokensChanged: {
                        var e = data;
                        var viewRanges = [];
                        for (var j = 0, lenJ = e.ranges.length; j < lenJ; j++) {
                            var modelRange = e.ranges[j];
                            var viewStartLineNumber = this.coordinatesConverter.convertModelPositionToViewPosition(new position_1.Position(modelRange.fromLineNumber, 1)).lineNumber;
                            var viewEndLineNumber = this.coordinatesConverter.convertModelPositionToViewPosition(new position_1.Position(modelRange.toLineNumber, this.model.getLineMaxColumn(modelRange.toLineNumber))).lineNumber;
                            viewRanges[j] = {
                                fromLineNumber: viewStartLineNumber,
                                toLineNumber: viewEndLineNumber
                            };
                        }
                        eventsCollector.emit(new viewEvents.ViewTokensChangedEvent(viewRanges));
                        break;
                    }
                    case textModelEvents.TextModelEventType.ModelLanguageChanged: {
                        // That's ok, a model tokens changed event will follow shortly
                        break;
                    }
                    case textModelEvents.TextModelEventType.ModelContentChanged: {
                        // Ignore
                        break;
                    }
                    case textModelEvents.TextModelEventType.ModelOptionsChanged: {
                        // A tab size change causes a line mapping changed event => all view parts will repaint OK, no further event needed here
                        if (this.lines.setTabSize(this.model.getOptions().tabSize)) {
                            eventsCollector.emit(new viewEvents.ViewFlushedEvent());
                            eventsCollector.emit(new viewEvents.ViewLineMappingChangedEvent());
                            eventsCollector.emit(new viewEvents.ViewDecorationsChangedEvent());
                            this.decorations.onLineMappingChanged();
                            this.viewLayout.onFlushed(this.getLineCount());
                        }
                        break;
                    }
                    case textModelEvents.TextModelEventType.ModelDecorationsChanged: {
                        var e = data;
                        this.decorations.onModelDecorationsChanged(e);
                        eventsCollector.emit(new viewEvents.ViewDecorationsChangedEvent());
                        break;
                    }
                    case textModelEvents.TextModelEventType.ModelDispose: {
                        // Ignore, since the editor will take care of this and destroy the view shortly
                        break;
                    }
                    default:
                        console.info('View received unknown event: ');
                        console.info(type, data);
                }
            }
            if (!hadOtherModelChange && hadModelLineChangeThatChangedLineMapping) {
                eventsCollector.emit(new viewEvents.ViewLineMappingChangedEvent());
                eventsCollector.emit(new viewEvents.ViewDecorationsChangedEvent());
                this.decorations.onLineMappingChanged();
            }
        };
        ViewModel.prototype.setHiddenAreas = function (ranges) {
            var eventsCollector = new viewModel_1.ViewEventsCollector();
            var lineMappingChanged = this.lines.setHiddenAreas(ranges);
            if (lineMappingChanged) {
                eventsCollector.emit(new viewEvents.ViewFlushedEvent());
                eventsCollector.emit(new viewEvents.ViewLineMappingChangedEvent());
                eventsCollector.emit(new viewEvents.ViewDecorationsChangedEvent());
                this.decorations.onLineMappingChanged();
                this.viewLayout.onFlushed(this.getLineCount());
            }
            this._emit(eventsCollector.finalize());
        };
        ViewModel.prototype.getCenteredRangeInViewport = function () {
            if (this._centeredViewLine === -1) {
                // Never got rendered or not rendered since last content change event
                return null;
            }
            var viewLineNumber = this._centeredViewLine;
            var currentCenteredViewRange = new range_1.Range(viewLineNumber, this.getLineMinColumn(viewLineNumber), viewLineNumber, this.getLineMaxColumn(viewLineNumber));
            return this.coordinatesConverter.convertViewRangeToModelRange(currentCenteredViewRange);
        };
        ViewModel.prototype.getCompletelyVisibleViewRange = function () {
            var partialData = this.viewLayout.getLinesViewportData();
            var startViewLineNumber = partialData.completelyVisibleStartLineNumber;
            var endViewLineNumber = partialData.completelyVisibleEndLineNumber;
            return new range_1.Range(startViewLineNumber, this.getLineMinColumn(startViewLineNumber), endViewLineNumber, this.getLineMaxColumn(endViewLineNumber));
        };
        ViewModel.prototype.getCompletelyVisibleViewRangeAtScrollTop = function (scrollTop) {
            var partialData = this.viewLayout.getLinesViewportDataAtScrollTop(scrollTop);
            var startViewLineNumber = partialData.completelyVisibleStartLineNumber;
            var endViewLineNumber = partialData.completelyVisibleEndLineNumber;
            return new range_1.Range(startViewLineNumber, this.getLineMinColumn(startViewLineNumber), endViewLineNumber, this.getLineMaxColumn(endViewLineNumber));
        };
        ViewModel.prototype.getTabSize = function () {
            return this.model.getOptions().tabSize;
        };
        ViewModel.prototype.getLineCount = function () {
            return this.lines.getViewLineCount();
        };
        /**
         * Gives a hint that a lot of requests are about to come in for these line numbers.
         */
        ViewModel.prototype.setViewport = function (startLineNumber, endLineNumber, centeredLineNumber) {
            this._centeredViewLine = centeredLineNumber;
            this.lines.warmUpLookupCache(startLineNumber, endLineNumber);
        };
        ViewModel.prototype.getLineIndentGuide = function (lineNumber) {
            return this.lines.getViewLineIndentGuide(lineNumber);
        };
        ViewModel.prototype.getLineContent = function (lineNumber) {
            return this.lines.getViewLineContent(lineNumber);
        };
        ViewModel.prototype.getLineMinColumn = function (lineNumber) {
            return this.lines.getViewLineMinColumn(lineNumber);
        };
        ViewModel.prototype.getLineMaxColumn = function (lineNumber) {
            return this.lines.getViewLineMaxColumn(lineNumber);
        };
        ViewModel.prototype.getLineFirstNonWhitespaceColumn = function (lineNumber) {
            var result = strings.firstNonWhitespaceIndex(this.getLineContent(lineNumber));
            if (result === -1) {
                return 0;
            }
            return result + 1;
        };
        ViewModel.prototype.getLineLastNonWhitespaceColumn = function (lineNumber) {
            var result = strings.lastNonWhitespaceIndex(this.getLineContent(lineNumber));
            if (result === -1) {
                return 0;
            }
            return result + 2;
        };
        ViewModel.prototype.getDecorationsInViewport = function (visibleRange) {
            return this.decorations.getDecorationsViewportData(visibleRange).decorations;
        };
        ViewModel.prototype.getViewLineRenderingData = function (visibleRange, lineNumber) {
            var mightContainRTL = this.model.mightContainRTL();
            var mightContainNonBasicASCII = this.model.mightContainNonBasicASCII();
            var tabSize = this.getTabSize();
            var lineData = this.lines.getViewLineData(lineNumber);
            var allInlineDecorations = this.decorations.getDecorationsViewportData(visibleRange).inlineDecorations;
            var inlineDecorations = allInlineDecorations[lineNumber - visibleRange.startLineNumber];
            return new viewModel_1.ViewLineRenderingData(lineData.minColumn, lineData.maxColumn, lineData.content, mightContainRTL, mightContainNonBasicASCII, lineData.tokens, inlineDecorations, tabSize);
        };
        ViewModel.prototype.getMinimapLinesRenderingData = function (startLineNumber, endLineNumber, needed) {
            var result = this.lines.getViewLinesData(startLineNumber, endLineNumber, needed);
            return new viewModel_1.MinimapLinesRenderingData(this.getTabSize(), result);
        };
        ViewModel.prototype.getAllOverviewRulerDecorations = function () {
            return this.decorations.getAllOverviewRulerDecorations();
        };
        ViewModel.prototype.getValueInRange = function (range, eol) {
            var modelRange = this.coordinatesConverter.convertViewRangeToModelRange(range);
            return this.model.getValueInRange(modelRange, eol);
        };
        ViewModel.prototype.getModelLineMaxColumn = function (modelLineNumber) {
            return this.model.getLineMaxColumn(modelLineNumber);
        };
        ViewModel.prototype.validateModelPosition = function (position) {
            return this.model.validatePosition(position);
        };
        ViewModel.prototype.deduceModelPositionRelativeToViewPosition = function (viewAnchorPosition, deltaOffset, lineFeedCnt) {
            var modelAnchor = this.coordinatesConverter.convertViewPositionToModelPosition(viewAnchorPosition);
            if (this.model.getEOL().length === 2) {
                // This model uses CRLF, so the delta must take that into account
                if (deltaOffset < 0) {
                    deltaOffset -= lineFeedCnt;
                }
                else {
                    deltaOffset += lineFeedCnt;
                }
            }
            var modelAnchorOffset = this.model.getOffsetAt(modelAnchor);
            var resultOffset = modelAnchorOffset + deltaOffset;
            return this.model.getPositionAt(resultOffset);
        };
        ViewModel.prototype.getPlainTextToCopy = function (ranges, emptySelectionClipboard) {
            var newLineCharacter = this.model.getEOL();
            if (ranges.length === 1) {
                var range = ranges[0];
                if (range.isEmpty()) {
                    if (emptySelectionClipboard) {
                        var modelLineNumber = this.coordinatesConverter.convertViewPositionToModelPosition(new position_1.Position(range.startLineNumber, 1)).lineNumber;
                        return this.model.getLineContent(modelLineNumber) + newLineCharacter;
                    }
                    else {
                        return '';
                    }
                }
                return this.getValueInRange(range, editorCommon.EndOfLinePreference.TextDefined);
            }
            else {
                ranges = ranges.slice(0).sort(range_1.Range.compareRangesUsingStarts);
                var result = [];
                for (var i = 0; i < ranges.length; i++) {
                    result.push(this.getValueInRange(ranges[i], editorCommon.EndOfLinePreference.TextDefined));
                }
                return result.join(newLineCharacter);
            }
        };
        ViewModel.prototype.getHTMLToCopy = function (viewRanges, emptySelectionClipboard) {
            if (this.model.getLanguageIdentifier().id === 1 /* PlainText */) {
                return null;
            }
            if (viewRanges.length !== 1) {
                // no multiple selection support at this time
                return null;
            }
            var range = this.coordinatesConverter.convertViewRangeToModelRange(viewRanges[0]);
            if (range.isEmpty()) {
                if (!emptySelectionClipboard) {
                    // nothing to copy
                    return null;
                }
                var lineNumber = range.startLineNumber;
                range = new range_1.Range(lineNumber, this.model.getLineMinColumn(lineNumber), lineNumber, this.model.getLineMaxColumn(lineNumber));
            }
            var fontInfo = this.configuration.editor.fontInfo;
            var colorMap = this._getColorMap();
            return ("<div style=\""
                + ("color: " + colorMap[1 /* DefaultForeground */] + ";")
                + ("background-color: " + colorMap[2 /* DefaultBackground */] + ";")
                + ("font-family: " + fontInfo.fontFamily + ";")
                + ("font-weight: " + fontInfo.fontWeight + ";")
                + ("font-size: " + fontInfo.fontSize + "px;")
                + ("line-height: " + fontInfo.lineHeight + "px;")
                + "white-space: pre;"
                + "\">"
                + this._getHTMLToCopy(range, colorMap)
                + '</div>');
        };
        ViewModel.prototype._getHTMLToCopy = function (modelRange, colorMap) {
            var startLineNumber = modelRange.startLineNumber;
            var startColumn = modelRange.startColumn;
            var endLineNumber = modelRange.endLineNumber;
            var endColumn = modelRange.endColumn;
            var tabSize = this.getTabSize();
            var result = '';
            for (var lineNumber = startLineNumber; lineNumber <= endLineNumber; lineNumber++) {
                var lineTokens = this.model.getLineTokens(lineNumber);
                var lineContent = lineTokens.getLineContent();
                var startOffset = (lineNumber === startLineNumber ? startColumn - 1 : 0);
                var endOffset = (lineNumber === endLineNumber ? endColumn - 1 : lineContent.length);
                if (lineContent === '') {
                    result += '<br>';
                }
                else {
                    result += textToHtmlTokenizer_1.tokenizeLineToHTML(lineContent, lineTokens.inflate(), colorMap, startOffset, endOffset, tabSize);
                }
            }
            return result;
        };
        ViewModel.prototype._getColorMap = function () {
            var colorMap = modes_1.TokenizationRegistry.getColorMap();
            var result = [null];
            for (var i = 1, len = colorMap.length; i < len; i++) {
                result[i] = color_1.Color.Format.CSS.formatHex(colorMap[i]);
            }
            return result;
        };
        return ViewModel;
    }(viewEvents.ViewEventEmitter));
    exports.ViewModel = ViewModel;
});
//# sourceMappingURL=viewModelImpl.js.map