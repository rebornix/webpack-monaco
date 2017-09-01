/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/async", "vs/base/common/lifecycle", "vs/base/common/objects", "vs/base/browser/dom", "vs/base/common/severity", "vs/base/browser/fastDomNode", "vs/base/browser/ui/sash/sash", "vs/platform/instantiation/common/instantiation", "vs/platform/contextkey/common/contextkey", "vs/editor/common/services/codeEditorService", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/services/editorWorkerService", "vs/editor/common/viewLayout/lineDecorations", "vs/editor/common/viewLayout/viewLineRenderer", "vs/editor/browser/codeEditor", "vs/editor/common/core/viewLineToken", "vs/editor/browser/config/configuration", "vs/editor/common/viewModel/viewModel", "vs/platform/instantiation/common/serviceCollection", "vs/base/common/event", "vs/editor/common/config/editorOptions", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/editor/common/view/overviewZoneManager", "vs/editor/common/model/textModelWithDecorations", "vs/editor/browser/widget/diffReview", "vs/platform/message/common/message", "vs/editor/common/core/stringBuilder", "vs/css!./media/diffEditor"], function (require, exports, nls, async_1, lifecycle_1, objects, dom, severity_1, fastDomNode_1, sash_1, instantiation_1, contextkey_1, codeEditorService_1, range_1, editorCommon, editorWorkerService_1, lineDecorations_1, viewLineRenderer_1, codeEditor_1, viewLineToken_1, configuration_1, viewModel_1, serviceCollection_1, event_1, editorOptions, themeService_1, colorRegistry_1, overviewZoneManager_1, textModelWithDecorations_1, diffReview_1, message_1, stringBuilder_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var VisualEditorState = (function () {
        function VisualEditorState() {
            this._zones = [];
            this._zonesMap = {};
            this._decorations = [];
        }
        VisualEditorState.prototype.getForeignViewZones = function (allViewZones) {
            var _this = this;
            return allViewZones.filter(function (z) { return !_this._zonesMap[String(z.id)]; });
        };
        VisualEditorState.prototype.clean = function (editor) {
            var _this = this;
            // (1) View zones
            if (this._zones.length > 0) {
                editor.changeViewZones(function (viewChangeAccessor) {
                    for (var i = 0, length_1 = _this._zones.length; i < length_1; i++) {
                        viewChangeAccessor.removeZone(_this._zones[i]);
                    }
                });
            }
            this._zones = [];
            this._zonesMap = {};
            // (2) Model decorations
            if (this._decorations.length > 0) {
                editor.changeDecorations(function (changeAccessor) {
                    changeAccessor.deltaDecorations(_this._decorations, []);
                });
            }
            this._decorations = [];
        };
        VisualEditorState.prototype.apply = function (editor, overviewRuler, newDecorations) {
            var _this = this;
            // view zones
            editor.changeViewZones(function (viewChangeAccessor) {
                for (var i = 0, length_2 = _this._zones.length; i < length_2; i++) {
                    viewChangeAccessor.removeZone(_this._zones[i]);
                }
                _this._zones = [];
                _this._zonesMap = {};
                for (var i = 0, length_3 = newDecorations.zones.length; i < length_3; i++) {
                    newDecorations.zones[i].suppressMouseDown = true;
                    var zoneId = viewChangeAccessor.addZone(newDecorations.zones[i]);
                    _this._zones.push(zoneId);
                    _this._zonesMap[String(zoneId)] = true;
                }
            });
            // decorations
            this._decorations = editor.deltaDecorations(this._decorations, newDecorations.decorations);
            // overview ruler
            if (overviewRuler) {
                overviewRuler.setZones(newDecorations.overviewZones);
            }
        };
        return VisualEditorState;
    }());
    var DIFF_EDITOR_ID = 0;
    var DiffEditorWidget = (function (_super) {
        __extends(DiffEditorWidget, _super);
        function DiffEditorWidget(domElement, options, editorWorkerService, contextKeyService, instantiationService, codeEditorService, themeService, messageService) {
            var _this = _super.call(this) || this;
            _this._onDidDispose = _this._register(new event_1.Emitter());
            _this.onDidDispose = _this._onDidDispose.event;
            _this._onDidUpdateDiff = _this._register(new event_1.Emitter());
            _this.onDidUpdateDiff = _this._onDidUpdateDiff.event;
            _this._lastOriginalWarning = null;
            _this._lastModifiedWarning = null;
            _this._editorWorkerService = editorWorkerService;
            _this._codeEditorService = codeEditorService;
            _this._contextKeyService = contextKeyService.createScoped(domElement);
            _this._contextKeyService.createKey('isInDiffEditor', true);
            _this._themeService = themeService;
            _this._messageService = messageService;
            _this.id = (++DIFF_EDITOR_ID);
            _this._domElement = domElement;
            options = options || {};
            // renderSideBySide
            _this._renderSideBySide = true;
            if (typeof options.renderSideBySide !== 'undefined') {
                _this._renderSideBySide = options.renderSideBySide;
            }
            // ignoreTrimWhitespace
            _this._ignoreTrimWhitespace = true;
            if (typeof options.ignoreTrimWhitespace !== 'undefined') {
                _this._ignoreTrimWhitespace = options.ignoreTrimWhitespace;
            }
            // renderIndicators
            _this._renderIndicators = true;
            if (typeof options.renderIndicators !== 'undefined') {
                _this._renderIndicators = options.renderIndicators;
            }
            _this._originalIsEditable = false;
            if (typeof options.originalEditable !== 'undefined') {
                _this._originalIsEditable = Boolean(options.originalEditable);
            }
            _this._updateDecorationsRunner = _this._register(new async_1.RunOnceScheduler(function () { return _this._updateDecorations(); }, 0));
            _this._containerDomElement = document.createElement('div');
            _this._containerDomElement.className = DiffEditorWidget._getClassName(_this._themeService.getTheme(), _this._renderSideBySide);
            _this._containerDomElement.style.position = 'relative';
            _this._containerDomElement.style.height = '100%';
            _this._domElement.appendChild(_this._containerDomElement);
            _this._overviewViewportDomElement = fastDomNode_1.createFastDomNode(document.createElement('div'));
            _this._overviewViewportDomElement.setClassName('diffViewport');
            _this._overviewViewportDomElement.setPosition('absolute');
            _this._overviewDomElement = document.createElement('div');
            _this._overviewDomElement.className = 'diffOverview';
            _this._overviewDomElement.style.position = 'absolute';
            _this._overviewDomElement.appendChild(_this._overviewViewportDomElement.domNode);
            _this._register(dom.addStandardDisposableListener(_this._overviewDomElement, 'mousedown', function (e) {
                _this.modifiedEditor.delegateVerticalScrollbarMouseDown(e);
            }));
            _this._containerDomElement.appendChild(_this._overviewDomElement);
            _this._createLeftHandSide();
            _this._createRightHandSide();
            _this._beginUpdateDecorationsTimeout = -1;
            _this._currentlyChangingViewZones = false;
            _this._diffComputationToken = 0;
            _this._originalEditorState = new VisualEditorState();
            _this._modifiedEditorState = new VisualEditorState();
            _this._isVisible = true;
            _this._isHandlingScrollEvent = false;
            _this._width = 0;
            _this._height = 0;
            _this._reviewHeight = 0;
            _this._lineChanges = null;
            var services = new serviceCollection_1.ServiceCollection();
            services.set(contextkey_1.IContextKeyService, _this._contextKeyService);
            var scopedInstantiationService = instantiationService.createChild(services);
            _this._createLeftHandSideEditor(options, scopedInstantiationService);
            _this._createRightHandSideEditor(options, scopedInstantiationService);
            _this._reviewPane = new diffReview_1.DiffReview(_this);
            _this._containerDomElement.appendChild(_this._reviewPane.domNode.domNode);
            _this._containerDomElement.appendChild(_this._reviewPane.shadow.domNode);
            _this._containerDomElement.appendChild(_this._reviewPane.actionBarContainer.domNode);
            if (options.automaticLayout) {
                _this._measureDomElementToken = window.setInterval(function () { return _this._measureDomElement(false); }, 100);
            }
            // enableSplitViewResizing
            _this._enableSplitViewResizing = true;
            if (typeof options.enableSplitViewResizing !== 'undefined') {
                _this._enableSplitViewResizing = options.enableSplitViewResizing;
            }
            if (_this._renderSideBySide) {
                _this._setStrategy(new DiffEdtorWidgetSideBySide(_this._createDataSource(), _this._enableSplitViewResizing));
            }
            else {
                _this._setStrategy(new DiffEdtorWidgetInline(_this._createDataSource(), _this._enableSplitViewResizing));
            }
            _this._codeEditorService.addDiffEditor(_this);
            _this._register(themeService.onThemeChange(function (t) {
                if (_this._strategy && _this._strategy.applyColors(t)) {
                    _this._updateDecorationsRunner.schedule();
                }
                _this._containerDomElement.className = DiffEditorWidget._getClassName(_this._themeService.getTheme(), _this._renderSideBySide);
            }));
            return _this;
        }
        Object.defineProperty(DiffEditorWidget.prototype, "ignoreTrimWhitespace", {
            get: function () {
                return this._ignoreTrimWhitespace;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DiffEditorWidget.prototype, "renderSideBySide", {
            get: function () {
                return this._renderSideBySide;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DiffEditorWidget.prototype, "renderIndicators", {
            get: function () {
                return this._renderIndicators;
            },
            enumerable: true,
            configurable: true
        });
        DiffEditorWidget.prototype.hasWidgetFocus = function () {
            return dom.isAncestor(document.activeElement, this._domElement);
        };
        DiffEditorWidget.prototype.diffReviewNext = function () {
            this._reviewPane.next();
        };
        DiffEditorWidget.prototype.diffReviewPrev = function () {
            this._reviewPane.prev();
        };
        DiffEditorWidget._getClassName = function (theme, renderSideBySide) {
            var result = 'monaco-diff-editor monaco-editor-background ';
            if (renderSideBySide) {
                result += 'side-by-side ';
            }
            result += themeService_1.getThemeTypeSelector(theme.type);
            return result;
        };
        DiffEditorWidget.prototype._recreateOverviewRulers = function () {
            if (this._originalOverviewRuler) {
                this._overviewDomElement.removeChild(this._originalOverviewRuler.getDomNode());
                this._originalOverviewRuler.dispose();
            }
            this._originalOverviewRuler = this.originalEditor.createOverviewRuler('original diffOverviewRuler', 4, Number.MAX_VALUE);
            this._overviewDomElement.appendChild(this._originalOverviewRuler.getDomNode());
            if (this._modifiedOverviewRuler) {
                this._overviewDomElement.removeChild(this._modifiedOverviewRuler.getDomNode());
                this._modifiedOverviewRuler.dispose();
            }
            this._modifiedOverviewRuler = this.modifiedEditor.createOverviewRuler('modified diffOverviewRuler', 4, Number.MAX_VALUE);
            this._overviewDomElement.appendChild(this._modifiedOverviewRuler.getDomNode());
            this._layoutOverviewRulers();
        };
        DiffEditorWidget.prototype._createLeftHandSide = function () {
            this._originalDomNode = document.createElement('div');
            this._originalDomNode.className = 'editor original';
            this._originalDomNode.style.position = 'absolute';
            this._originalDomNode.style.height = '100%';
            this._containerDomElement.appendChild(this._originalDomNode);
        };
        DiffEditorWidget.prototype._createRightHandSide = function () {
            this._modifiedDomNode = document.createElement('div');
            this._modifiedDomNode.className = 'editor modified';
            this._modifiedDomNode.style.position = 'absolute';
            this._modifiedDomNode.style.height = '100%';
            this._containerDomElement.appendChild(this._modifiedDomNode);
        };
        DiffEditorWidget.prototype._createLeftHandSideEditor = function (options, instantiationService) {
            var _this = this;
            this.originalEditor = this._createInnerEditor(instantiationService, this._originalDomNode, this._adjustOptionsForLeftHandSide(options, this._originalIsEditable));
            this._register(this.originalEditor.onDidScrollChange(function (e) {
                if (_this._isHandlingScrollEvent) {
                    return;
                }
                if (!e.scrollTopChanged && !e.scrollLeftChanged && !e.scrollHeightChanged) {
                    return;
                }
                _this._isHandlingScrollEvent = true;
                _this.modifiedEditor.setScrollPosition({
                    scrollLeft: e.scrollLeft,
                    scrollTop: e.scrollTop
                });
                _this._isHandlingScrollEvent = false;
                _this._layoutOverviewViewport();
            }));
            this._register(this.originalEditor.onDidChangeViewZones(function () {
                _this._onViewZonesChanged();
            }));
            this._register(this.originalEditor.onDidChangeModelContent(function () {
                if (_this._isVisible) {
                    _this._beginUpdateDecorationsSoon();
                }
            }));
        };
        DiffEditorWidget.prototype._createRightHandSideEditor = function (options, instantiationService) {
            var _this = this;
            this.modifiedEditor = this._createInnerEditor(instantiationService, this._modifiedDomNode, this._adjustOptionsForRightHandSide(options));
            this._register(this.modifiedEditor.onDidScrollChange(function (e) {
                if (_this._isHandlingScrollEvent) {
                    return;
                }
                if (!e.scrollTopChanged && !e.scrollLeftChanged && !e.scrollHeightChanged) {
                    return;
                }
                _this._isHandlingScrollEvent = true;
                _this.originalEditor.setScrollPosition({
                    scrollLeft: e.scrollLeft,
                    scrollTop: e.scrollTop
                });
                _this._isHandlingScrollEvent = false;
                _this._layoutOverviewViewport();
            }));
            this._register(this.modifiedEditor.onDidChangeViewZones(function () {
                _this._onViewZonesChanged();
            }));
            this._register(this.modifiedEditor.onDidChangeConfiguration(function (e) {
                if (e.fontInfo && _this.modifiedEditor.getModel()) {
                    _this._onViewZonesChanged();
                }
            }));
            this._register(this.modifiedEditor.onDidChangeModelContent(function () {
                if (_this._isVisible) {
                    _this._beginUpdateDecorationsSoon();
                }
            }));
        };
        DiffEditorWidget.prototype._createInnerEditor = function (instantiationService, container, options) {
            return instantiationService.createInstance(codeEditor_1.CodeEditor, container, options);
        };
        DiffEditorWidget.prototype.destroy = function () {
            this.dispose();
        };
        DiffEditorWidget.prototype.dispose = function () {
            this._codeEditorService.removeDiffEditor(this);
            window.clearInterval(this._measureDomElementToken);
            this._cleanViewZonesAndDecorations();
            this._originalOverviewRuler.dispose();
            this._modifiedOverviewRuler.dispose();
            this.originalEditor.dispose();
            this.modifiedEditor.dispose();
            this._strategy.dispose();
            this._reviewPane.dispose();
            this._onDidDispose.fire();
            _super.prototype.dispose.call(this);
        };
        //------------ begin IDiffEditor methods
        DiffEditorWidget.prototype.getId = function () {
            return this.getEditorType() + ':' + this.id;
        };
        DiffEditorWidget.prototype.getEditorType = function () {
            return editorCommon.EditorType.IDiffEditor;
        };
        DiffEditorWidget.prototype.getLineChanges = function () {
            return this._lineChanges;
        };
        DiffEditorWidget.prototype.getOriginalEditor = function () {
            return this.originalEditor;
        };
        DiffEditorWidget.prototype.getModifiedEditor = function () {
            return this.modifiedEditor;
        };
        DiffEditorWidget.prototype.updateOptions = function (newOptions) {
            // Handle side by side
            var renderSideBySideChanged = false;
            if (typeof newOptions.renderSideBySide !== 'undefined') {
                if (this._renderSideBySide !== newOptions.renderSideBySide) {
                    this._renderSideBySide = newOptions.renderSideBySide;
                    renderSideBySideChanged = true;
                }
            }
            var beginUpdateDecorations = false;
            if (typeof newOptions.ignoreTrimWhitespace !== 'undefined') {
                if (this._ignoreTrimWhitespace !== newOptions.ignoreTrimWhitespace) {
                    this._ignoreTrimWhitespace = newOptions.ignoreTrimWhitespace;
                    // Begin comparing
                    beginUpdateDecorations = true;
                }
            }
            if (typeof newOptions.renderIndicators !== 'undefined') {
                if (this._renderIndicators !== newOptions.renderIndicators) {
                    this._renderIndicators = newOptions.renderIndicators;
                    beginUpdateDecorations = true;
                }
            }
            if (beginUpdateDecorations) {
                this._beginUpdateDecorations();
            }
            if (typeof newOptions.originalEditable !== 'undefined') {
                this._originalIsEditable = Boolean(newOptions.originalEditable);
            }
            this.modifiedEditor.updateOptions(this._adjustOptionsForRightHandSide(newOptions));
            this.originalEditor.updateOptions(this._adjustOptionsForLeftHandSide(newOptions, this._originalIsEditable));
            // enableSplitViewResizing
            if (typeof newOptions.enableSplitViewResizing !== 'undefined') {
                this._enableSplitViewResizing = newOptions.enableSplitViewResizing;
            }
            this._strategy.setEnableSplitViewResizing(this._enableSplitViewResizing);
            // renderSideBySide
            if (renderSideBySideChanged) {
                if (this._renderSideBySide) {
                    this._setStrategy(new DiffEdtorWidgetSideBySide(this._createDataSource(), this._enableSplitViewResizing));
                }
                else {
                    this._setStrategy(new DiffEdtorWidgetInline(this._createDataSource(), this._enableSplitViewResizing));
                }
                // Update class name
                this._containerDomElement.className = DiffEditorWidget._getClassName(this._themeService.getTheme(), this._renderSideBySide);
            }
        };
        DiffEditorWidget.prototype.getValue = function (options) {
            if (options === void 0) { options = null; }
            return this.modifiedEditor.getValue(options);
        };
        DiffEditorWidget.prototype.getModel = function () {
            return {
                original: this.originalEditor.getModel(),
                modified: this.modifiedEditor.getModel()
            };
        };
        DiffEditorWidget.prototype.setModel = function (model) {
            // Guard us against partial null model
            if (model && (!model.original || !model.modified)) {
                throw new Error(!model.original ? 'DiffEditorWidget.setModel: Original model is null' : 'DiffEditorWidget.setModel: Modified model is null');
            }
            // Remove all view zones & decorations
            this._cleanViewZonesAndDecorations();
            // Update code editor models
            this.originalEditor.setModel(model ? model.original : null);
            this.modifiedEditor.setModel(model ? model.modified : null);
            this._updateDecorationsRunner.cancel();
            if (model) {
                this.originalEditor.setScrollTop(0);
                this.modifiedEditor.setScrollTop(0);
            }
            // Disable any diff computations that will come in
            this._lineChanges = null;
            this._diffComputationToken++;
            if (model) {
                this._recreateOverviewRulers();
                // Begin comparing
                this._beginUpdateDecorations();
            }
            else {
                this._lineChanges = null;
            }
            this._layoutOverviewViewport();
        };
        DiffEditorWidget.prototype.getDomNode = function () {
            return this._domElement;
        };
        DiffEditorWidget.prototype.getVisibleColumnFromPosition = function (position) {
            return this.modifiedEditor.getVisibleColumnFromPosition(position);
        };
        DiffEditorWidget.prototype.getPosition = function () {
            return this.modifiedEditor.getPosition();
        };
        DiffEditorWidget.prototype.setPosition = function (position, reveal, revealVerticalInCenter, revealHorizontal) {
            this.modifiedEditor.setPosition(position, reveal, revealVerticalInCenter, revealHorizontal);
        };
        DiffEditorWidget.prototype.revealLine = function (lineNumber) {
            this.modifiedEditor.revealLine(lineNumber);
        };
        DiffEditorWidget.prototype.revealLineInCenter = function (lineNumber) {
            this.modifiedEditor.revealLineInCenter(lineNumber);
        };
        DiffEditorWidget.prototype.revealLineInCenterIfOutsideViewport = function (lineNumber) {
            this.modifiedEditor.revealLineInCenterIfOutsideViewport(lineNumber);
        };
        DiffEditorWidget.prototype.revealPosition = function (position, revealVerticalInCenter, revealHorizontal) {
            if (revealVerticalInCenter === void 0) { revealVerticalInCenter = false; }
            if (revealHorizontal === void 0) { revealHorizontal = false; }
            this.modifiedEditor.revealPosition(position, revealVerticalInCenter, revealHorizontal);
        };
        DiffEditorWidget.prototype.revealPositionInCenter = function (position) {
            this.modifiedEditor.revealPositionInCenter(position);
        };
        DiffEditorWidget.prototype.revealPositionInCenterIfOutsideViewport = function (position) {
            this.modifiedEditor.revealPositionInCenterIfOutsideViewport(position);
        };
        DiffEditorWidget.prototype.getSelection = function () {
            return this.modifiedEditor.getSelection();
        };
        DiffEditorWidget.prototype.getSelections = function () {
            return this.modifiedEditor.getSelections();
        };
        DiffEditorWidget.prototype.setSelection = function (something, reveal, revealVerticalInCenter, revealHorizontal) {
            this.modifiedEditor.setSelection(something, reveal, revealVerticalInCenter, revealHorizontal);
        };
        DiffEditorWidget.prototype.setSelections = function (ranges) {
            this.modifiedEditor.setSelections(ranges);
        };
        DiffEditorWidget.prototype.revealLines = function (startLineNumber, endLineNumber) {
            this.modifiedEditor.revealLines(startLineNumber, endLineNumber);
        };
        DiffEditorWidget.prototype.revealLinesInCenter = function (startLineNumber, endLineNumber) {
            this.modifiedEditor.revealLinesInCenter(startLineNumber, endLineNumber);
        };
        DiffEditorWidget.prototype.revealLinesInCenterIfOutsideViewport = function (startLineNumber, endLineNumber) {
            this.modifiedEditor.revealLinesInCenterIfOutsideViewport(startLineNumber, endLineNumber);
        };
        DiffEditorWidget.prototype.revealRange = function (range, revealVerticalInCenter, revealHorizontal) {
            if (revealVerticalInCenter === void 0) { revealVerticalInCenter = false; }
            if (revealHorizontal === void 0) { revealHorizontal = true; }
            this.modifiedEditor.revealRange(range, revealVerticalInCenter, revealHorizontal);
        };
        DiffEditorWidget.prototype.revealRangeInCenter = function (range) {
            this.modifiedEditor.revealRangeInCenter(range);
        };
        DiffEditorWidget.prototype.revealRangeInCenterIfOutsideViewport = function (range) {
            this.modifiedEditor.revealRangeInCenterIfOutsideViewport(range);
        };
        DiffEditorWidget.prototype.revealRangeAtTop = function (range) {
            this.modifiedEditor.revealRangeAtTop(range);
        };
        DiffEditorWidget.prototype.getActions = function () {
            return this.modifiedEditor.getActions();
        };
        DiffEditorWidget.prototype.getSupportedActions = function () {
            return this.modifiedEditor.getSupportedActions();
        };
        DiffEditorWidget.prototype.getAction = function (id) {
            return this.modifiedEditor.getAction(id);
        };
        DiffEditorWidget.prototype.saveViewState = function () {
            var originalViewState = this.originalEditor.saveViewState();
            var modifiedViewState = this.modifiedEditor.saveViewState();
            return {
                original: originalViewState,
                modified: modifiedViewState
            };
        };
        DiffEditorWidget.prototype.restoreViewState = function (s) {
            if (s.original && s.original) {
                var diffEditorState = s;
                this.originalEditor.restoreViewState(diffEditorState.original);
                this.modifiedEditor.restoreViewState(diffEditorState.modified);
            }
        };
        DiffEditorWidget.prototype.layout = function (dimension) {
            this._measureDomElement(false, dimension);
        };
        DiffEditorWidget.prototype.focus = function () {
            this.modifiedEditor.focus();
        };
        DiffEditorWidget.prototype.isFocused = function () {
            return this.originalEditor.isFocused() || this.modifiedEditor.isFocused();
        };
        DiffEditorWidget.prototype.onVisible = function () {
            this._isVisible = true;
            this.originalEditor.onVisible();
            this.modifiedEditor.onVisible();
            // Begin comparing
            this._beginUpdateDecorations();
        };
        DiffEditorWidget.prototype.onHide = function () {
            this._isVisible = false;
            this.originalEditor.onHide();
            this.modifiedEditor.onHide();
            // Remove all view zones & decorations
            this._cleanViewZonesAndDecorations();
        };
        DiffEditorWidget.prototype.trigger = function (source, handlerId, payload) {
            this.modifiedEditor.trigger(source, handlerId, payload);
        };
        DiffEditorWidget.prototype.changeDecorations = function (callback) {
            return this.modifiedEditor.changeDecorations(callback);
        };
        //------------ end IDiffEditor methods
        //------------ begin layouting methods
        DiffEditorWidget.prototype._measureDomElement = function (forceDoLayoutCall, dimensions) {
            dimensions = dimensions || {
                width: this._containerDomElement.clientWidth,
                height: this._containerDomElement.clientHeight
            };
            if (dimensions.width <= 0) {
                this._width = 0;
                this._height = 0;
                this._reviewHeight = 0;
                return;
            }
            if (!forceDoLayoutCall && dimensions.width === this._width && dimensions.height === this._height) {
                // Nothing has changed
                return;
            }
            this._width = dimensions.width;
            this._height = dimensions.height;
            this._reviewHeight = this._reviewPane.isVisible() ? this._height : 0;
            this._doLayout();
        };
        DiffEditorWidget.prototype._layoutOverviewRulers = function () {
            var freeSpace = DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH - 2 * DiffEditorWidget.ONE_OVERVIEW_WIDTH;
            var layoutInfo = this.modifiedEditor.getLayoutInfo();
            if (layoutInfo) {
                this._originalOverviewRuler.setLayout({
                    top: 0,
                    width: DiffEditorWidget.ONE_OVERVIEW_WIDTH,
                    right: freeSpace + DiffEditorWidget.ONE_OVERVIEW_WIDTH,
                    height: (this._height - this._reviewHeight)
                });
                this._modifiedOverviewRuler.setLayout({
                    top: 0,
                    right: 0,
                    width: DiffEditorWidget.ONE_OVERVIEW_WIDTH,
                    height: (this._height - this._reviewHeight)
                });
            }
        };
        //------------ end layouting methods
        DiffEditorWidget.prototype._onViewZonesChanged = function () {
            if (this._currentlyChangingViewZones) {
                return;
            }
            this._updateDecorationsRunner.schedule();
        };
        DiffEditorWidget.prototype._beginUpdateDecorationsSoon = function () {
            var _this = this;
            // Clear previous timeout if necessary
            if (this._beginUpdateDecorationsTimeout !== -1) {
                window.clearTimeout(this._beginUpdateDecorationsTimeout);
                this._beginUpdateDecorationsTimeout = -1;
            }
            this._beginUpdateDecorationsTimeout = window.setTimeout(function () { return _this._beginUpdateDecorations(); }, DiffEditorWidget.UPDATE_DIFF_DECORATIONS_DELAY);
        };
        DiffEditorWidget._equals = function (a, b) {
            if (!a && !b) {
                return true;
            }
            if (!a || !b) {
                return false;
            }
            return (a.toString() === b.toString());
        };
        DiffEditorWidget.prototype._beginUpdateDecorations = function () {
            var _this = this;
            this._beginUpdateDecorationsTimeout = -1;
            var currentOriginalModel = this.originalEditor.getModel();
            var currentModifiedModel = this.modifiedEditor.getModel();
            if (!currentOriginalModel || !currentModifiedModel) {
                return;
            }
            // Prevent old diff requests to come if a new request has been initiated
            // The best method would be to call cancel on the Promise, but this is not
            // yet supported, so using tokens for now.
            this._diffComputationToken++;
            var currentToken = this._diffComputationToken;
            if (!this._editorWorkerService.canComputeDiff(currentOriginalModel.uri, currentModifiedModel.uri)) {
                if (!DiffEditorWidget._equals(currentOriginalModel.uri, this._lastOriginalWarning)
                    || !DiffEditorWidget._equals(currentModifiedModel.uri, this._lastModifiedWarning)) {
                    this._lastOriginalWarning = currentOriginalModel.uri;
                    this._lastModifiedWarning = currentModifiedModel.uri;
                    this._messageService.show(severity_1.default.Warning, nls.localize("diff.tooLarge", "Cannot compare files because one file is too large."));
                }
                return;
            }
            this._editorWorkerService.computeDiff(currentOriginalModel.uri, currentModifiedModel.uri, this._ignoreTrimWhitespace).then(function (result) {
                if (currentToken === _this._diffComputationToken
                    && currentOriginalModel === _this.originalEditor.getModel()
                    && currentModifiedModel === _this.modifiedEditor.getModel()) {
                    _this._lineChanges = result;
                    _this._updateDecorationsRunner.schedule();
                    _this._onDidUpdateDiff.fire();
                }
            }, function (error) {
                if (currentToken === _this._diffComputationToken
                    && currentOriginalModel === _this.originalEditor.getModel()
                    && currentModifiedModel === _this.modifiedEditor.getModel()) {
                    _this._lineChanges = null;
                    _this._updateDecorationsRunner.schedule();
                }
            });
        };
        DiffEditorWidget.prototype._cleanViewZonesAndDecorations = function () {
            this._originalEditorState.clean(this.originalEditor);
            this._modifiedEditorState.clean(this.modifiedEditor);
        };
        DiffEditorWidget.prototype._updateDecorations = function () {
            if (!this.originalEditor.getModel() || !this.modifiedEditor.getModel()) {
                return;
            }
            var lineChanges = this._lineChanges || [];
            var foreignOriginal = this._originalEditorState.getForeignViewZones(this.originalEditor.getWhitespaces());
            var foreignModified = this._modifiedEditorState.getForeignViewZones(this.modifiedEditor.getWhitespaces());
            var diffDecorations = this._strategy.getEditorsDiffDecorations(lineChanges, this._ignoreTrimWhitespace, this._renderIndicators, foreignOriginal, foreignModified, this.originalEditor, this.modifiedEditor);
            try {
                this._currentlyChangingViewZones = true;
                this._originalEditorState.apply(this.originalEditor, this._originalOverviewRuler, diffDecorations.original);
                this._modifiedEditorState.apply(this.modifiedEditor, this._modifiedOverviewRuler, diffDecorations.modified);
            }
            finally {
                this._currentlyChangingViewZones = false;
            }
        };
        DiffEditorWidget.prototype._adjustOptionsForSubEditor = function (options) {
            var clonedOptions = objects.clone(options || {});
            clonedOptions.inDiffEditor = true;
            clonedOptions.wordWrap = 'off';
            clonedOptions.wordWrapMinified = false;
            clonedOptions.automaticLayout = false;
            clonedOptions.scrollbar = clonedOptions.scrollbar || {};
            clonedOptions.scrollbar.vertical = 'visible';
            clonedOptions.folding = false;
            clonedOptions.codeLens = false;
            clonedOptions.fixedOverflowWidgets = true;
            clonedOptions.lineDecorationsWidth = '2ch';
            if (!clonedOptions.minimap) {
                clonedOptions.minimap = {};
            }
            clonedOptions.minimap.enabled = false;
            return clonedOptions;
        };
        DiffEditorWidget.prototype._adjustOptionsForLeftHandSide = function (options, isEditable) {
            var result = this._adjustOptionsForSubEditor(options);
            result.readOnly = !isEditable;
            result.overviewRulerLanes = 1;
            result.extraEditorClassName = 'original-in-monaco-diff-editor';
            return result;
        };
        DiffEditorWidget.prototype._adjustOptionsForRightHandSide = function (options) {
            var result = this._adjustOptionsForSubEditor(options);
            result.revealHorizontalRightPadding = editorOptions.EDITOR_DEFAULTS.viewInfo.revealHorizontalRightPadding + DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH;
            result.scrollbar.verticalHasArrows = false;
            result.extraEditorClassName = 'modified-in-monaco-diff-editor';
            return result;
        };
        DiffEditorWidget.prototype.doLayout = function () {
            this._measureDomElement(true);
        };
        DiffEditorWidget.prototype._doLayout = function () {
            var splitPoint = this._strategy.layout();
            this._originalDomNode.style.width = splitPoint + 'px';
            this._originalDomNode.style.left = '0px';
            this._modifiedDomNode.style.width = (this._width - splitPoint) + 'px';
            this._modifiedDomNode.style.left = splitPoint + 'px';
            this._overviewDomElement.style.top = '0px';
            this._overviewDomElement.style.height = (this._height - this._reviewHeight) + 'px';
            this._overviewDomElement.style.width = DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH + 'px';
            this._overviewDomElement.style.left = (this._width - DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH) + 'px';
            this._overviewViewportDomElement.setWidth(DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH);
            this._overviewViewportDomElement.setHeight(30);
            this.originalEditor.layout({ width: splitPoint, height: (this._height - this._reviewHeight) });
            this.modifiedEditor.layout({ width: this._width - splitPoint - DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH, height: (this._height - this._reviewHeight) });
            if (this._originalOverviewRuler || this._modifiedOverviewRuler) {
                this._layoutOverviewRulers();
            }
            this._reviewPane.layout(this._height - this._reviewHeight, this._width, this._reviewHeight);
            this._layoutOverviewViewport();
        };
        DiffEditorWidget.prototype._layoutOverviewViewport = function () {
            var layout = this._computeOverviewViewport();
            if (!layout) {
                this._overviewViewportDomElement.setTop(0);
                this._overviewViewportDomElement.setHeight(0);
            }
            else {
                this._overviewViewportDomElement.setTop(layout.top);
                this._overviewViewportDomElement.setHeight(layout.height);
            }
        };
        DiffEditorWidget.prototype._computeOverviewViewport = function () {
            var layoutInfo = this.modifiedEditor.getLayoutInfo();
            if (!layoutInfo) {
                return null;
            }
            var scrollTop = this.modifiedEditor.getScrollTop();
            var scrollHeight = this.modifiedEditor.getScrollHeight();
            var computedAvailableSize = Math.max(0, layoutInfo.contentHeight);
            var computedRepresentableSize = Math.max(0, computedAvailableSize - 2 * 0);
            var computedRatio = scrollHeight > 0 ? (computedRepresentableSize / scrollHeight) : 0;
            var computedSliderSize = Math.max(0, Math.floor(layoutInfo.contentHeight * computedRatio));
            var computedSliderPosition = Math.floor(scrollTop * computedRatio);
            return {
                height: computedSliderSize,
                top: computedSliderPosition
            };
        };
        DiffEditorWidget.prototype._createDataSource = function () {
            var _this = this;
            return {
                getWidth: function () {
                    return _this._width;
                },
                getHeight: function () {
                    return (_this._height - _this._reviewHeight);
                },
                getContainerDomNode: function () {
                    return _this._containerDomElement;
                },
                relayoutEditors: function () {
                    _this._doLayout();
                },
                getOriginalEditor: function () {
                    return _this.originalEditor;
                },
                getModifiedEditor: function () {
                    return _this.modifiedEditor;
                }
            };
        };
        DiffEditorWidget.prototype._setStrategy = function (newStrategy) {
            if (this._strategy) {
                this._strategy.dispose();
            }
            this._strategy = newStrategy;
            newStrategy.applyColors(this._themeService.getTheme());
            if (this._lineChanges) {
                this._updateDecorations();
            }
            // Just do a layout, the strategy might need it
            this._measureDomElement(true);
        };
        DiffEditorWidget.prototype._getLineChangeAtOrBeforeLineNumber = function (lineNumber, startLineNumberExtractor) {
            if (this._lineChanges.length === 0 || lineNumber < startLineNumberExtractor(this._lineChanges[0])) {
                // There are no changes or `lineNumber` is before the first change
                return null;
            }
            var min = 0, max = this._lineChanges.length - 1;
            while (min < max) {
                var mid = Math.floor((min + max) / 2);
                var midStart = startLineNumberExtractor(this._lineChanges[mid]);
                var midEnd = (mid + 1 <= max ? startLineNumberExtractor(this._lineChanges[mid + 1]) : Number.MAX_VALUE);
                if (lineNumber < midStart) {
                    max = mid - 1;
                }
                else if (lineNumber >= midEnd) {
                    min = mid + 1;
                }
                else {
                    // HIT!
                    min = mid;
                    max = mid;
                }
            }
            return this._lineChanges[min];
        };
        DiffEditorWidget.prototype._getEquivalentLineForOriginalLineNumber = function (lineNumber) {
            var lineChange = this._getLineChangeAtOrBeforeLineNumber(lineNumber, function (lineChange) { return lineChange.originalStartLineNumber; });
            if (!lineChange) {
                return lineNumber;
            }
            var originalEquivalentLineNumber = lineChange.originalStartLineNumber + (lineChange.originalEndLineNumber > 0 ? -1 : 0);
            var modifiedEquivalentLineNumber = lineChange.modifiedStartLineNumber + (lineChange.modifiedEndLineNumber > 0 ? -1 : 0);
            var lineChangeOriginalLength = (lineChange.originalEndLineNumber > 0 ? (lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1) : 0);
            var lineChangeModifiedLength = (lineChange.modifiedEndLineNumber > 0 ? (lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1) : 0);
            var delta = lineNumber - originalEquivalentLineNumber;
            if (delta <= lineChangeOriginalLength) {
                return modifiedEquivalentLineNumber + Math.min(delta, lineChangeModifiedLength);
            }
            return modifiedEquivalentLineNumber + lineChangeModifiedLength - lineChangeOriginalLength + delta;
        };
        DiffEditorWidget.prototype._getEquivalentLineForModifiedLineNumber = function (lineNumber) {
            var lineChange = this._getLineChangeAtOrBeforeLineNumber(lineNumber, function (lineChange) { return lineChange.modifiedStartLineNumber; });
            if (!lineChange) {
                return lineNumber;
            }
            var originalEquivalentLineNumber = lineChange.originalStartLineNumber + (lineChange.originalEndLineNumber > 0 ? -1 : 0);
            var modifiedEquivalentLineNumber = lineChange.modifiedStartLineNumber + (lineChange.modifiedEndLineNumber > 0 ? -1 : 0);
            var lineChangeOriginalLength = (lineChange.originalEndLineNumber > 0 ? (lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1) : 0);
            var lineChangeModifiedLength = (lineChange.modifiedEndLineNumber > 0 ? (lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1) : 0);
            var delta = lineNumber - modifiedEquivalentLineNumber;
            if (delta <= lineChangeModifiedLength) {
                return originalEquivalentLineNumber + Math.min(delta, lineChangeOriginalLength);
            }
            return originalEquivalentLineNumber + lineChangeOriginalLength - lineChangeModifiedLength + delta;
        };
        DiffEditorWidget.prototype.getDiffLineInformationForOriginal = function (lineNumber) {
            if (!this._lineChanges) {
                // Cannot answer that which I don't know
                return null;
            }
            return {
                equivalentLineNumber: this._getEquivalentLineForOriginalLineNumber(lineNumber)
            };
        };
        DiffEditorWidget.prototype.getDiffLineInformationForModified = function (lineNumber) {
            if (!this._lineChanges) {
                // Cannot answer that which I don't know
                return null;
            }
            return {
                equivalentLineNumber: this._getEquivalentLineForModifiedLineNumber(lineNumber)
            };
        };
        DiffEditorWidget.ONE_OVERVIEW_WIDTH = 15;
        DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH = 30;
        DiffEditorWidget.UPDATE_DIFF_DECORATIONS_DELAY = 200; // ms
        DiffEditorWidget = __decorate([
            __param(2, editorWorkerService_1.IEditorWorkerService),
            __param(3, contextkey_1.IContextKeyService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, codeEditorService_1.ICodeEditorService),
            __param(6, themeService_1.IThemeService),
            __param(7, message_1.IMessageService)
        ], DiffEditorWidget);
        return DiffEditorWidget;
    }(lifecycle_1.Disposable));
    exports.DiffEditorWidget = DiffEditorWidget;
    var DiffEditorWidgetStyle = (function (_super) {
        __extends(DiffEditorWidgetStyle, _super);
        function DiffEditorWidgetStyle(dataSource) {
            var _this = _super.call(this) || this;
            _this._dataSource = dataSource;
            return _this;
        }
        DiffEditorWidgetStyle.prototype.applyColors = function (theme) {
            var newInsertColor = (theme.getColor(colorRegistry_1.diffInserted) || colorRegistry_1.defaultInsertColor).transparent(2);
            var newRemoveColor = (theme.getColor(colorRegistry_1.diffRemoved) || colorRegistry_1.defaultRemoveColor).transparent(2);
            var hasChanges = !newInsertColor.equals(this._insertColor) || !newRemoveColor.equals(this._removeColor);
            this._insertColor = newInsertColor;
            this._removeColor = newRemoveColor;
            return hasChanges;
        };
        DiffEditorWidgetStyle.prototype.getEditorsDiffDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalWhitespaces, modifiedWhitespaces, originalEditor, modifiedEditor) {
            // Get view zones
            modifiedWhitespaces = modifiedWhitespaces.sort(function (a, b) {
                return a.afterLineNumber - b.afterLineNumber;
            });
            originalWhitespaces = originalWhitespaces.sort(function (a, b) {
                return a.afterLineNumber - b.afterLineNumber;
            });
            var zones = this._getViewZones(lineChanges, originalWhitespaces, modifiedWhitespaces, originalEditor, modifiedEditor, renderIndicators);
            // Get decorations & overview ruler zones
            var originalDecorations = this._getOriginalEditorDecorations(lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor);
            var modifiedDecorations = this._getModifiedEditorDecorations(lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor);
            return {
                original: {
                    decorations: originalDecorations.decorations,
                    overviewZones: originalDecorations.overviewZones,
                    zones: zones.original
                },
                modified: {
                    decorations: modifiedDecorations.decorations,
                    overviewZones: modifiedDecorations.overviewZones,
                    zones: zones.modified
                }
            };
        };
        DiffEditorWidgetStyle.prototype._getViewZones = function (lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor, renderIndicators) {
            return null;
        };
        DiffEditorWidgetStyle.prototype._getOriginalEditorDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor) {
            return null;
        };
        DiffEditorWidgetStyle.prototype._getModifiedEditorDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor) {
            return null;
        };
        return DiffEditorWidgetStyle;
    }(lifecycle_1.Disposable));
    var ForeignViewZonesIterator = (function () {
        function ForeignViewZonesIterator(source) {
            this._source = source;
            this._index = -1;
            this.advance();
        }
        ForeignViewZonesIterator.prototype.advance = function () {
            this._index++;
            if (this._index < this._source.length) {
                this.current = this._source[this._index];
            }
            else {
                this.current = null;
            }
        };
        return ForeignViewZonesIterator;
    }());
    var ViewZonesComputer = (function () {
        function ViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ) {
            this.lineChanges = lineChanges;
            this.originalForeignVZ = originalForeignVZ;
            this.modifiedForeignVZ = modifiedForeignVZ;
        }
        ViewZonesComputer.prototype.getViewZones = function () {
            var result = {
                original: [],
                modified: []
            };
            var lineChangeModifiedLength = 0;
            var lineChangeOriginalLength = 0;
            var originalEquivalentLineNumber = 0;
            var modifiedEquivalentLineNumber = 0;
            var originalEndEquivalentLineNumber = 0;
            var modifiedEndEquivalentLineNumber = 0;
            var sortMyViewZones = function (a, b) {
                return a.afterLineNumber - b.afterLineNumber;
            };
            var addAndCombineIfPossible = function (destination, item) {
                if (item.domNode === null && destination.length > 0) {
                    var lastItem = destination[destination.length - 1];
                    if (lastItem.afterLineNumber === item.afterLineNumber && lastItem.domNode === null) {
                        lastItem.heightInLines += item.heightInLines;
                        return;
                    }
                }
                destination.push(item);
            };
            var modifiedForeignVZ = new ForeignViewZonesIterator(this.modifiedForeignVZ);
            var originalForeignVZ = new ForeignViewZonesIterator(this.originalForeignVZ);
            // In order to include foreign view zones after the last line change, the for loop will iterate once more after the end of the `lineChanges` array
            for (var i = 0, length_4 = this.lineChanges.length; i <= length_4; i++) {
                var lineChange = (i < length_4 ? this.lineChanges[i] : null);
                if (lineChange !== null) {
                    originalEquivalentLineNumber = lineChange.originalStartLineNumber + (lineChange.originalEndLineNumber > 0 ? -1 : 0);
                    modifiedEquivalentLineNumber = lineChange.modifiedStartLineNumber + (lineChange.modifiedEndLineNumber > 0 ? -1 : 0);
                    lineChangeOriginalLength = (lineChange.originalEndLineNumber > 0 ? (lineChange.originalEndLineNumber - lineChange.originalStartLineNumber + 1) : 0);
                    lineChangeModifiedLength = (lineChange.modifiedEndLineNumber > 0 ? (lineChange.modifiedEndLineNumber - lineChange.modifiedStartLineNumber + 1) : 0);
                    originalEndEquivalentLineNumber = Math.max(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber);
                    modifiedEndEquivalentLineNumber = Math.max(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber);
                }
                else {
                    // Increase to very large value to get the producing tests of foreign view zones running
                    originalEquivalentLineNumber += 10000000 + lineChangeOriginalLength;
                    modifiedEquivalentLineNumber += 10000000 + lineChangeModifiedLength;
                    originalEndEquivalentLineNumber = originalEquivalentLineNumber;
                    modifiedEndEquivalentLineNumber = modifiedEquivalentLineNumber;
                }
                // Each step produces view zones, and after producing them, we try to cancel them out, to avoid empty-empty view zone cases
                var stepOriginal = [];
                var stepModified = [];
                // ---------------------------- PRODUCE VIEW ZONES
                // [PRODUCE] View zone(s) in original-side due to foreign view zone(s) in modified-side
                while (modifiedForeignVZ.current && modifiedForeignVZ.current.afterLineNumber <= modifiedEndEquivalentLineNumber) {
                    var viewZoneLineNumber = void 0;
                    if (modifiedForeignVZ.current.afterLineNumber <= modifiedEquivalentLineNumber) {
                        viewZoneLineNumber = originalEquivalentLineNumber - modifiedEquivalentLineNumber + modifiedForeignVZ.current.afterLineNumber;
                    }
                    else {
                        viewZoneLineNumber = originalEndEquivalentLineNumber;
                    }
                    stepOriginal.push({
                        afterLineNumber: viewZoneLineNumber,
                        heightInLines: modifiedForeignVZ.current.heightInLines,
                        domNode: null
                    });
                    modifiedForeignVZ.advance();
                }
                // [PRODUCE] View zone(s) in modified-side due to foreign view zone(s) in original-side
                while (originalForeignVZ.current && originalForeignVZ.current.afterLineNumber <= originalEndEquivalentLineNumber) {
                    var viewZoneLineNumber = void 0;
                    if (originalForeignVZ.current.afterLineNumber <= originalEquivalentLineNumber) {
                        viewZoneLineNumber = modifiedEquivalentLineNumber - originalEquivalentLineNumber + originalForeignVZ.current.afterLineNumber;
                    }
                    else {
                        viewZoneLineNumber = modifiedEndEquivalentLineNumber;
                    }
                    stepModified.push({
                        afterLineNumber: viewZoneLineNumber,
                        heightInLines: originalForeignVZ.current.heightInLines,
                        domNode: null
                    });
                    originalForeignVZ.advance();
                }
                if (lineChange !== null && isChangeOrInsert(lineChange)) {
                    var r = this._produceOriginalFromDiff(lineChange, lineChangeOriginalLength, lineChangeModifiedLength);
                    if (r) {
                        stepOriginal.push(r);
                    }
                }
                if (lineChange !== null && isChangeOrDelete(lineChange)) {
                    var r = this._produceModifiedFromDiff(lineChange, lineChangeOriginalLength, lineChangeModifiedLength);
                    if (r) {
                        stepModified.push(r);
                    }
                }
                // ---------------------------- END PRODUCE VIEW ZONES
                // ---------------------------- EMIT MINIMAL VIEW ZONES
                // [CANCEL & EMIT] Try to cancel view zones out
                var stepOriginalIndex = 0;
                var stepModifiedIndex = 0;
                stepOriginal = stepOriginal.sort(sortMyViewZones);
                stepModified = stepModified.sort(sortMyViewZones);
                while (stepOriginalIndex < stepOriginal.length && stepModifiedIndex < stepModified.length) {
                    var original = stepOriginal[stepOriginalIndex];
                    var modified = stepModified[stepModifiedIndex];
                    var originalDelta = original.afterLineNumber - originalEquivalentLineNumber;
                    var modifiedDelta = modified.afterLineNumber - modifiedEquivalentLineNumber;
                    if (originalDelta < modifiedDelta) {
                        addAndCombineIfPossible(result.original, original);
                        stepOriginalIndex++;
                    }
                    else if (modifiedDelta < originalDelta) {
                        addAndCombineIfPossible(result.modified, modified);
                        stepModifiedIndex++;
                    }
                    else if (original.shouldNotShrink) {
                        addAndCombineIfPossible(result.original, original);
                        stepOriginalIndex++;
                    }
                    else if (modified.shouldNotShrink) {
                        addAndCombineIfPossible(result.modified, modified);
                        stepModifiedIndex++;
                    }
                    else {
                        if (original.heightInLines >= modified.heightInLines) {
                            // modified view zone gets removed
                            original.heightInLines -= modified.heightInLines;
                            stepModifiedIndex++;
                        }
                        else {
                            // original view zone gets removed
                            modified.heightInLines -= original.heightInLines;
                            stepOriginalIndex++;
                        }
                    }
                }
                // [EMIT] Remaining original view zones
                while (stepOriginalIndex < stepOriginal.length) {
                    addAndCombineIfPossible(result.original, stepOriginal[stepOriginalIndex]);
                    stepOriginalIndex++;
                }
                // [EMIT] Remaining modified view zones
                while (stepModifiedIndex < stepModified.length) {
                    addAndCombineIfPossible(result.modified, stepModified[stepModifiedIndex]);
                    stepModifiedIndex++;
                }
                // ---------------------------- END EMIT MINIMAL VIEW ZONES
            }
            var ensureDomNode = function (z) {
                if (!z.domNode) {
                    z.domNode = createFakeLinesDiv();
                }
            };
            result.original.forEach(ensureDomNode);
            result.modified.forEach(ensureDomNode);
            return result;
        };
        return ViewZonesComputer;
    }());
    function createDecoration(startLineNumber, startColumn, endLineNumber, endColumn, options) {
        return {
            range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
            options: options
        };
    }
    var DECORATIONS = {
        charDelete: textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'char-delete'
        }),
        charDeleteWholeLine: textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'char-delete',
            isWholeLine: true
        }),
        charInsert: textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'char-insert'
        }),
        charInsertWholeLine: textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'char-insert',
            isWholeLine: true
        }),
        lineInsert: textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'line-insert',
            marginClassName: 'line-insert',
            isWholeLine: true
        }),
        lineInsertWithSign: textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'line-insert',
            linesDecorationsClassName: 'insert-sign',
            marginClassName: 'line-insert',
            isWholeLine: true
        }),
        lineDelete: textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'line-delete',
            marginClassName: 'line-delete',
            isWholeLine: true
        }),
        lineDeleteWithSign: textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'line-delete',
            linesDecorationsClassName: 'delete-sign',
            marginClassName: 'line-delete',
            isWholeLine: true
        }),
        lineDeleteMargin: textModelWithDecorations_1.ModelDecorationOptions.register({
            marginClassName: 'line-delete',
        })
    };
    var DiffEdtorWidgetSideBySide = (function (_super) {
        __extends(DiffEdtorWidgetSideBySide, _super);
        function DiffEdtorWidgetSideBySide(dataSource, enableSplitViewResizing) {
            var _this = _super.call(this, dataSource) || this;
            _this._disableSash = (enableSplitViewResizing === false);
            _this._sashRatio = null;
            _this._sashPosition = null;
            _this._sash = _this._register(new sash_1.Sash(_this._dataSource.getContainerDomNode(), _this));
            if (_this._disableSash) {
                _this._sash.disable();
            }
            _this._sash.addListener('start', function () { return _this.onSashDragStart(); });
            _this._sash.addListener('change', function (e) { return _this.onSashDrag(e); });
            _this._sash.addListener('end', function () { return _this.onSashDragEnd(); });
            _this._sash.addListener('reset', function () { return _this.onSashReset(); });
            return _this;
        }
        DiffEdtorWidgetSideBySide.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        DiffEdtorWidgetSideBySide.prototype.setEnableSplitViewResizing = function (enableSplitViewResizing) {
            var newDisableSash = (enableSplitViewResizing === false);
            if (this._disableSash !== newDisableSash) {
                this._disableSash = newDisableSash;
                if (this._disableSash) {
                    this._sash.disable();
                }
                else {
                    this._sash.enable();
                }
            }
        };
        DiffEdtorWidgetSideBySide.prototype.layout = function (sashRatio) {
            if (sashRatio === void 0) { sashRatio = this._sashRatio; }
            var w = this._dataSource.getWidth();
            var contentWidth = w - DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH;
            var sashPosition = Math.floor((sashRatio || 0.5) * contentWidth);
            var midPoint = Math.floor(0.5 * contentWidth);
            sashPosition = this._disableSash ? midPoint : sashPosition || midPoint;
            if (contentWidth > DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH * 2) {
                if (sashPosition < DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH) {
                    sashPosition = DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH;
                }
                if (sashPosition > contentWidth - DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH) {
                    sashPosition = contentWidth - DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH;
                }
            }
            else {
                sashPosition = midPoint;
            }
            if (this._sashPosition !== sashPosition) {
                this._sashPosition = sashPosition;
                this._sash.layout();
            }
            return this._sashPosition;
        };
        DiffEdtorWidgetSideBySide.prototype.onSashDragStart = function () {
            this._startSashPosition = this._sashPosition;
        };
        DiffEdtorWidgetSideBySide.prototype.onSashDrag = function (e) {
            var w = this._dataSource.getWidth();
            var contentWidth = w - DiffEditorWidget.ENTIRE_DIFF_OVERVIEW_WIDTH;
            var sashPosition = this.layout((this._startSashPosition + (e.currentX - e.startX)) / contentWidth);
            this._sashRatio = sashPosition / contentWidth;
            this._dataSource.relayoutEditors();
        };
        DiffEdtorWidgetSideBySide.prototype.onSashDragEnd = function () {
            this._sash.layout();
        };
        DiffEdtorWidgetSideBySide.prototype.onSashReset = function () {
            this._sashRatio = 0.5;
            this._dataSource.relayoutEditors();
            this._sash.layout();
        };
        DiffEdtorWidgetSideBySide.prototype.getVerticalSashTop = function (sash) {
            return 0;
        };
        DiffEdtorWidgetSideBySide.prototype.getVerticalSashLeft = function (sash) {
            return this._sashPosition;
        };
        DiffEdtorWidgetSideBySide.prototype.getVerticalSashHeight = function (sash) {
            return this._dataSource.getHeight();
        };
        DiffEdtorWidgetSideBySide.prototype._getViewZones = function (lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor) {
            var c = new SideBySideViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ);
            return c.getViewZones();
        };
        DiffEdtorWidgetSideBySide.prototype._getOriginalEditorDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor) {
            var result = {
                decorations: [],
                overviewZones: []
            };
            var originalModel = originalEditor.getModel();
            for (var i = 0, length_5 = lineChanges.length; i < length_5; i++) {
                var lineChange = lineChanges[i];
                if (isChangeOrDelete(lineChange)) {
                    result.decorations.push({
                        range: new range_1.Range(lineChange.originalStartLineNumber, 1, lineChange.originalEndLineNumber, Number.MAX_VALUE),
                        options: (renderIndicators ? DECORATIONS.lineDeleteWithSign : DECORATIONS.lineDelete)
                    });
                    if (!isChangeOrInsert(lineChange) || !lineChange.charChanges) {
                        result.decorations.push(createDecoration(lineChange.originalStartLineNumber, 1, lineChange.originalEndLineNumber, Number.MAX_VALUE, DECORATIONS.charDeleteWholeLine));
                    }
                    var color = this._removeColor.toString();
                    result.overviewZones.push(new overviewZoneManager_1.OverviewRulerZone(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber, editorCommon.OverviewRulerLane.Full, 0, color, color, color));
                    if (lineChange.charChanges) {
                        for (var j = 0, lengthJ = lineChange.charChanges.length; j < lengthJ; j++) {
                            var charChange = lineChange.charChanges[j];
                            if (isChangeOrDelete(charChange)) {
                                if (ignoreTrimWhitespace) {
                                    for (var lineNumber = charChange.originalStartLineNumber; lineNumber <= charChange.originalEndLineNumber; lineNumber++) {
                                        var startColumn = void 0;
                                        var endColumn = void 0;
                                        if (lineNumber === charChange.originalStartLineNumber) {
                                            startColumn = charChange.originalStartColumn;
                                        }
                                        else {
                                            startColumn = originalModel.getLineFirstNonWhitespaceColumn(lineNumber);
                                        }
                                        if (lineNumber === charChange.originalEndLineNumber) {
                                            endColumn = charChange.originalEndColumn;
                                        }
                                        else {
                                            endColumn = originalModel.getLineLastNonWhitespaceColumn(lineNumber);
                                        }
                                        result.decorations.push(createDecoration(lineNumber, startColumn, lineNumber, endColumn, DECORATIONS.charDelete));
                                    }
                                }
                                else {
                                    result.decorations.push(createDecoration(charChange.originalStartLineNumber, charChange.originalStartColumn, charChange.originalEndLineNumber, charChange.originalEndColumn, DECORATIONS.charDelete));
                                }
                            }
                        }
                    }
                }
            }
            return result;
        };
        DiffEdtorWidgetSideBySide.prototype._getModifiedEditorDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor) {
            var result = {
                decorations: [],
                overviewZones: []
            };
            var modifiedModel = modifiedEditor.getModel();
            for (var i = 0, length_6 = lineChanges.length; i < length_6; i++) {
                var lineChange = lineChanges[i];
                if (isChangeOrInsert(lineChange)) {
                    result.decorations.push({
                        range: new range_1.Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, Number.MAX_VALUE),
                        options: (renderIndicators ? DECORATIONS.lineInsertWithSign : DECORATIONS.lineInsert)
                    });
                    if (!isChangeOrDelete(lineChange) || !lineChange.charChanges) {
                        result.decorations.push(createDecoration(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, Number.MAX_VALUE, DECORATIONS.charInsertWholeLine));
                    }
                    var color = this._insertColor.toString();
                    result.overviewZones.push(new overviewZoneManager_1.OverviewRulerZone(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber, editorCommon.OverviewRulerLane.Full, 0, color, color, color));
                    if (lineChange.charChanges) {
                        for (var j = 0, lengthJ = lineChange.charChanges.length; j < lengthJ; j++) {
                            var charChange = lineChange.charChanges[j];
                            if (isChangeOrInsert(charChange)) {
                                if (ignoreTrimWhitespace) {
                                    for (var lineNumber = charChange.modifiedStartLineNumber; lineNumber <= charChange.modifiedEndLineNumber; lineNumber++) {
                                        var startColumn = void 0;
                                        var endColumn = void 0;
                                        if (lineNumber === charChange.modifiedStartLineNumber) {
                                            startColumn = charChange.modifiedStartColumn;
                                        }
                                        else {
                                            startColumn = modifiedModel.getLineFirstNonWhitespaceColumn(lineNumber);
                                        }
                                        if (lineNumber === charChange.modifiedEndLineNumber) {
                                            endColumn = charChange.modifiedEndColumn;
                                        }
                                        else {
                                            endColumn = modifiedModel.getLineLastNonWhitespaceColumn(lineNumber);
                                        }
                                        result.decorations.push(createDecoration(lineNumber, startColumn, lineNumber, endColumn, DECORATIONS.charInsert));
                                    }
                                }
                                else {
                                    result.decorations.push(createDecoration(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn, DECORATIONS.charInsert));
                                }
                            }
                        }
                    }
                }
            }
            return result;
        };
        DiffEdtorWidgetSideBySide.MINIMUM_EDITOR_WIDTH = 100;
        return DiffEdtorWidgetSideBySide;
    }(DiffEditorWidgetStyle));
    var SideBySideViewZonesComputer = (function (_super) {
        __extends(SideBySideViewZonesComputer, _super);
        function SideBySideViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ) {
            return _super.call(this, lineChanges, originalForeignVZ, modifiedForeignVZ) || this;
        }
        SideBySideViewZonesComputer.prototype._produceOriginalFromDiff = function (lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
            if (lineChangeModifiedLength > lineChangeOriginalLength) {
                return {
                    afterLineNumber: Math.max(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber),
                    heightInLines: (lineChangeModifiedLength - lineChangeOriginalLength),
                    domNode: null
                };
            }
            return null;
        };
        SideBySideViewZonesComputer.prototype._produceModifiedFromDiff = function (lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
            if (lineChangeOriginalLength > lineChangeModifiedLength) {
                return {
                    afterLineNumber: Math.max(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber),
                    heightInLines: (lineChangeOriginalLength - lineChangeModifiedLength),
                    domNode: null
                };
            }
            return null;
        };
        return SideBySideViewZonesComputer;
    }(ViewZonesComputer));
    var DiffEdtorWidgetInline = (function (_super) {
        __extends(DiffEdtorWidgetInline, _super);
        function DiffEdtorWidgetInline(dataSource, enableSplitViewResizing) {
            var _this = _super.call(this, dataSource) || this;
            _this.decorationsLeft = dataSource.getOriginalEditor().getLayoutInfo().decorationsLeft;
            _this._register(dataSource.getOriginalEditor().onDidLayoutChange(function (layoutInfo) {
                if (_this.decorationsLeft !== layoutInfo.decorationsLeft) {
                    _this.decorationsLeft = layoutInfo.decorationsLeft;
                    dataSource.relayoutEditors();
                }
            }));
            return _this;
        }
        DiffEdtorWidgetInline.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        DiffEdtorWidgetInline.prototype.setEnableSplitViewResizing = function (enableSplitViewResizing) {
            // Nothing to do..
        };
        DiffEdtorWidgetInline.prototype._getViewZones = function (lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor, renderIndicators) {
            var computer = new InlineViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor, renderIndicators);
            return computer.getViewZones();
        };
        DiffEdtorWidgetInline.prototype._getOriginalEditorDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor) {
            var result = {
                decorations: [],
                overviewZones: []
            };
            for (var i = 0, length_7 = lineChanges.length; i < length_7; i++) {
                var lineChange = lineChanges[i];
                // Add overview zones in the overview ruler
                if (isChangeOrDelete(lineChange)) {
                    result.decorations.push({
                        range: new range_1.Range(lineChange.originalStartLineNumber, 1, lineChange.originalEndLineNumber, Number.MAX_VALUE),
                        options: DECORATIONS.lineDeleteMargin
                    });
                    var color = this._removeColor.toString();
                    result.overviewZones.push(new overviewZoneManager_1.OverviewRulerZone(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber, editorCommon.OverviewRulerLane.Full, 0, color, color, color));
                }
            }
            return result;
        };
        DiffEdtorWidgetInline.prototype._getModifiedEditorDecorations = function (lineChanges, ignoreTrimWhitespace, renderIndicators, originalEditor, modifiedEditor) {
            var result = {
                decorations: [],
                overviewZones: []
            };
            var modifiedModel = modifiedEditor.getModel();
            for (var i = 0, length_8 = lineChanges.length; i < length_8; i++) {
                var lineChange = lineChanges[i];
                // Add decorations & overview zones
                if (isChangeOrInsert(lineChange)) {
                    result.decorations.push({
                        range: new range_1.Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, Number.MAX_VALUE),
                        options: (renderIndicators ? DECORATIONS.lineInsertWithSign : DECORATIONS.lineInsert)
                    });
                    var color = this._insertColor.toString();
                    result.overviewZones.push(new overviewZoneManager_1.OverviewRulerZone(lineChange.modifiedStartLineNumber, lineChange.modifiedEndLineNumber, editorCommon.OverviewRulerLane.Full, 0, color, color, color));
                    if (lineChange.charChanges) {
                        for (var j = 0, lengthJ = lineChange.charChanges.length; j < lengthJ; j++) {
                            var charChange = lineChange.charChanges[j];
                            if (isChangeOrInsert(charChange)) {
                                if (ignoreTrimWhitespace) {
                                    for (var lineNumber = charChange.modifiedStartLineNumber; lineNumber <= charChange.modifiedEndLineNumber; lineNumber++) {
                                        var startColumn = void 0;
                                        var endColumn = void 0;
                                        if (lineNumber === charChange.modifiedStartLineNumber) {
                                            startColumn = charChange.modifiedStartColumn;
                                        }
                                        else {
                                            startColumn = modifiedModel.getLineFirstNonWhitespaceColumn(lineNumber);
                                        }
                                        if (lineNumber === charChange.modifiedEndLineNumber) {
                                            endColumn = charChange.modifiedEndColumn;
                                        }
                                        else {
                                            endColumn = modifiedModel.getLineLastNonWhitespaceColumn(lineNumber);
                                        }
                                        result.decorations.push(createDecoration(lineNumber, startColumn, lineNumber, endColumn, DECORATIONS.charInsert));
                                    }
                                }
                                else {
                                    result.decorations.push(createDecoration(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn, DECORATIONS.charInsert));
                                }
                            }
                        }
                    }
                    else {
                        result.decorations.push(createDecoration(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedEndLineNumber, Number.MAX_VALUE, DECORATIONS.charInsertWholeLine));
                    }
                }
            }
            return result;
        };
        DiffEdtorWidgetInline.prototype.layout = function () {
            // An editor should not be smaller than 5px
            return Math.max(5, this.decorationsLeft);
        };
        return DiffEdtorWidgetInline;
    }(DiffEditorWidgetStyle));
    var InlineViewZonesComputer = (function (_super) {
        __extends(InlineViewZonesComputer, _super);
        function InlineViewZonesComputer(lineChanges, originalForeignVZ, modifiedForeignVZ, originalEditor, modifiedEditor, renderIndicators) {
            var _this = _super.call(this, lineChanges, originalForeignVZ, modifiedForeignVZ) || this;
            _this.originalModel = originalEditor.getModel();
            _this.modifiedEditorConfiguration = modifiedEditor.getConfiguration();
            _this.modifiedEditorTabSize = modifiedEditor.getModel().getOptions().tabSize;
            _this.renderIndicators = renderIndicators;
            return _this;
        }
        InlineViewZonesComputer.prototype._produceOriginalFromDiff = function (lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
            var marginDomNode = document.createElement('div');
            marginDomNode.className = 'inline-added-margin-view-zone';
            configuration_1.Configuration.applyFontInfoSlow(marginDomNode, this.modifiedEditorConfiguration.fontInfo);
            return {
                afterLineNumber: Math.max(lineChange.originalStartLineNumber, lineChange.originalEndLineNumber),
                heightInLines: lineChangeModifiedLength,
                domNode: document.createElement('div'),
                marginDomNode: marginDomNode
            };
        };
        InlineViewZonesComputer.prototype._produceModifiedFromDiff = function (lineChange, lineChangeOriginalLength, lineChangeModifiedLength) {
            var decorations = [];
            if (lineChange.charChanges) {
                for (var j = 0, lengthJ = lineChange.charChanges.length; j < lengthJ; j++) {
                    var charChange = lineChange.charChanges[j];
                    if (isChangeOrDelete(charChange)) {
                        decorations.push(new viewModel_1.InlineDecoration(new range_1.Range(charChange.originalStartLineNumber, charChange.originalStartColumn, charChange.originalEndLineNumber, charChange.originalEndColumn), 'char-delete', false));
                    }
                }
            }
            var sb = stringBuilder_1.createStringBuilder(10000);
            var marginHTML = [];
            var lineDecorationsWidth = this.modifiedEditorConfiguration.layoutInfo.decorationsWidth;
            var lineHeight = this.modifiedEditorConfiguration.lineHeight;
            for (var lineNumber = lineChange.originalStartLineNumber; lineNumber <= lineChange.originalEndLineNumber; lineNumber++) {
                this.renderOriginalLine(lineNumber - lineChange.originalStartLineNumber, this.originalModel, this.modifiedEditorConfiguration, this.modifiedEditorTabSize, lineNumber, decorations, sb);
                if (this.renderIndicators) {
                    var index = lineNumber - lineChange.originalStartLineNumber;
                    marginHTML = marginHTML.concat([
                        "<div class=\"delete-sign\" style=\"position:absolute;top:" + index * lineHeight + "px;width:" + lineDecorationsWidth + "px;height:" + lineHeight + "px;right:0;\"></div>"
                    ]);
                }
            }
            var domNode = document.createElement('div');
            domNode.className = 'view-lines line-delete';
            domNode.innerHTML = sb.build();
            configuration_1.Configuration.applyFontInfoSlow(domNode, this.modifiedEditorConfiguration.fontInfo);
            var marginDomNode = document.createElement('div');
            marginDomNode.className = 'inline-deleted-margin-view-zone';
            marginDomNode.innerHTML = marginHTML.join('');
            configuration_1.Configuration.applyFontInfoSlow(marginDomNode, this.modifiedEditorConfiguration.fontInfo);
            return {
                shouldNotShrink: true,
                afterLineNumber: (lineChange.modifiedEndLineNumber === 0 ? lineChange.modifiedStartLineNumber : lineChange.modifiedStartLineNumber - 1),
                heightInLines: lineChangeOriginalLength,
                domNode: domNode,
                marginDomNode: marginDomNode
            };
        };
        InlineViewZonesComputer.prototype.renderOriginalLine = function (count, originalModel, config, tabSize, lineNumber, decorations, sb) {
            var lineContent = originalModel.getLineContent(lineNumber);
            var actualDecorations = lineDecorations_1.LineDecoration.filter(decorations, lineNumber, 1, lineContent.length + 1);
            var defaultMetadata = ((0 /* None */ << 11 /* FONT_STYLE_OFFSET */)
                | (1 /* DefaultForeground */ << 14 /* FOREGROUND_OFFSET */)
                | (2 /* DefaultBackground */ << 23 /* BACKGROUND_OFFSET */)) >>> 0;
            sb.appendASCIIString('<div class="view-line');
            if (decorations.length === 0) {
                // No char changes
                sb.appendASCIIString(' char-delete');
            }
            sb.appendASCIIString('" style="top:');
            sb.appendASCIIString(String(count * config.lineHeight));
            sb.appendASCIIString('px;width:1000000px;">');
            viewLineRenderer_1.renderViewLine(new viewLineRenderer_1.RenderLineInput((config.fontInfo.isMonospace && !config.viewInfo.disableMonospaceOptimizations), lineContent, originalModel.mightContainRTL(), 0, [new viewLineToken_1.ViewLineToken(lineContent.length, defaultMetadata)], actualDecorations, tabSize, config.fontInfo.spaceWidth, config.viewInfo.stopRenderingLineAfter, config.viewInfo.renderWhitespace, config.viewInfo.renderControlCharacters, config.viewInfo.fontLigatures), sb);
            sb.appendASCIIString('</div>');
        };
        return InlineViewZonesComputer;
    }(ViewZonesComputer));
    function isChangeOrInsert(lineChange) {
        return lineChange.modifiedEndLineNumber > 0;
    }
    function isChangeOrDelete(lineChange) {
        return lineChange.originalEndLineNumber > 0;
    }
    function createFakeLinesDiv() {
        var r = document.createElement('div');
        r.className = 'diagonal-fill';
        return r;
    }
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var added = theme.getColor(colorRegistry_1.diffInserted);
        if (added) {
            collector.addRule(".monaco-editor .line-insert, .monaco-editor .char-insert { background-color: " + added + "; }");
            collector.addRule(".monaco-diff-editor .line-insert, .monaco-diff-editor .char-insert { background-color: " + added + "; }");
            collector.addRule(".monaco-editor .inline-added-margin-view-zone { background-color: " + added + "; }");
        }
        var removed = theme.getColor(colorRegistry_1.diffRemoved);
        if (removed) {
            collector.addRule(".monaco-editor .line-delete, .monaco-editor .char-delete { background-color: " + removed + "; }");
            collector.addRule(".monaco-diff-editor .line-delete, .monaco-diff-editor .char-delete { background-color: " + removed + "; }");
            collector.addRule(".monaco-editor .inline-deleted-margin-view-zone { background-color: " + removed + "; }");
        }
        var addedOutline = theme.getColor(colorRegistry_1.diffInsertedOutline);
        if (addedOutline) {
            collector.addRule(".monaco-editor .line-insert, .monaco-editor .char-insert { border: 1px dashed " + addedOutline + "; }");
        }
        var removedOutline = theme.getColor(colorRegistry_1.diffRemovedOutline);
        if (removedOutline) {
            collector.addRule(".monaco-editor .line-delete, .monaco-editor .char-delete { border: 1px dashed " + removedOutline + "; }");
        }
        var shadow = theme.getColor(colorRegistry_1.scrollbarShadow);
        if (shadow) {
            collector.addRule(".monaco-diff-editor.side-by-side .editor.modified { box-shadow: -6px 0 5px -5px " + shadow + "; }");
        }
    });
});
//# sourceMappingURL=diffEditorWidget.js.map