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
define(["require", "exports", "vs/nls", "vs/base/common/errors", "vs/base/common/labels", "vs/base/common/event", "vs/base/common/lifecycle", "vs/base/common/network", "vs/base/common/strings", "vs/base/common/winjs.base", "vs/base/common/color", "vs/base/browser/builder", "vs/base/browser/dom", "vs/base/browser/ui/sash/sash", "vs/base/browser/ui/countBadge/countBadge", "vs/base/browser/ui/iconLabel/iconLabel", "vs/base/parts/tree/browser/treeDefaults", "vs/base/parts/tree/browser/treeImpl", "vs/platform/instantiation/common/instantiation", "vs/platform/instantiation/common/serviceCollection", "vs/platform/workspace/common/workspace", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/model/model", "vs/editor/browser/widget/embeddedCodeEditorWidget", "vs/editor/contrib/zoneWidget/browser/peekViewWidget", "./referencesModel", "vs/editor/common/services/resolverService", "vs/platform/theme/common/colorRegistry", "vs/platform/theme/common/themeService", "vs/platform/theme/common/styler", "vs/platform/environment/common/environment", "vs/editor/common/model/textModelWithDecorations", "vs/base/common/uri", "vs/css!./referencesWidget"], function (require, exports, nls, errors_1, labels_1, event_1, lifecycle_1, network_1, strings, winjs_base_1, color_1, builder_1, dom, sash_1, countBadge_1, iconLabel_1, treeDefaults_1, treeImpl_1, instantiation_1, serviceCollection_1, workspace_1, range_1, editorCommon, model_1, embeddedCodeEditorWidget_1, peekViewWidget_1, referencesModel_1, resolverService_1, colorRegistry_1, themeService_1, styler_1, environment_1, textModelWithDecorations_1, uri_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var DecorationsManager = (function () {
        function DecorationsManager(_editor, _model) {
            var _this = this;
            this._editor = _editor;
            this._model = _model;
            this._decorations = new Map();
            this._decorationIgnoreSet = new Set();
            this._callOnDispose = [];
            this._callOnModelChange = [];
            this._callOnDispose.push(this._editor.onDidChangeModel(function () { return _this._onModelChanged(); }));
            this._onModelChanged();
        }
        DecorationsManager.prototype.dispose = function () {
            this._callOnModelChange = lifecycle_1.dispose(this._callOnModelChange);
            this._callOnDispose = lifecycle_1.dispose(this._callOnDispose);
            this.removeDecorations();
        };
        DecorationsManager.prototype._onModelChanged = function () {
            this._callOnModelChange = lifecycle_1.dispose(this._callOnModelChange);
            var model = this._editor.getModel();
            if (model) {
                for (var _i = 0, _a = this._model.groups; _i < _a.length; _i++) {
                    var ref = _a[_i];
                    if (ref.uri.toString() === model.uri.toString()) {
                        this._addDecorations(ref);
                        return;
                    }
                }
            }
        };
        DecorationsManager.prototype._addDecorations = function (reference) {
            var _this = this;
            this._callOnModelChange.push(this._editor.getModel().onDidChangeDecorations(function (event) { return _this._onDecorationChanged(event); }));
            this._editor.changeDecorations(function (accessor) {
                var newDecorations = [];
                var newDecorationsActualIndex = [];
                for (var i = 0, len = reference.children.length; i < len; i++) {
                    var oneReference = reference.children[i];
                    if (_this._decorationIgnoreSet.has(oneReference.id)) {
                        continue;
                    }
                    newDecorations.push({
                        range: oneReference.range,
                        options: DecorationsManager.DecorationOptions
                    });
                    newDecorationsActualIndex.push(i);
                }
                var decorations = accessor.deltaDecorations([], newDecorations);
                for (var i = 0; i < decorations.length; i++) {
                    _this._decorations.set(decorations[i], reference.children[newDecorationsActualIndex[i]]);
                }
            });
        };
        DecorationsManager.prototype._onDecorationChanged = function (event) {
            var _this = this;
            var changedDecorations = event.changedDecorations, toRemove = [];
            for (var i = 0, len = changedDecorations.length; i < len; i++) {
                var reference = this._decorations.get(changedDecorations[i]);
                if (!reference) {
                    continue;
                }
                var newRange = this._editor.getModel().getDecorationRange(changedDecorations[i]);
                var ignore = false;
                if (range_1.Range.equalsRange(newRange, reference.range)) {
                    continue;
                }
                else if (range_1.Range.spansMultipleLines(newRange)) {
                    ignore = true;
                }
                else {
                    var lineLength = reference.range.endColumn - reference.range.startColumn;
                    var newLineLength = newRange.endColumn - newRange.startColumn;
                    if (lineLength !== newLineLength) {
                        ignore = true;
                    }
                }
                if (ignore) {
                    this._decorationIgnoreSet.add(reference.id);
                    toRemove.push(changedDecorations[i]);
                }
                else {
                    reference.range = newRange;
                }
            }
            this._editor.changeDecorations(function (accessor) {
                for (var i = 0, len = toRemove.length; i < len; i++) {
                    _this._decorations.delete(toRemove[i]);
                }
                accessor.deltaDecorations(toRemove, []);
            });
        };
        DecorationsManager.prototype.removeDecorations = function () {
            var _this = this;
            this._editor.changeDecorations(function (accessor) {
                _this._decorations.forEach(function (value, key) {
                    accessor.removeDecoration(key);
                });
                _this._decorations.clear();
            });
        };
        DecorationsManager.DecorationOptions = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'reference-decoration'
        });
        return DecorationsManager;
    }());
    var DataSource = (function () {
        function DataSource(_textModelResolverService) {
            this._textModelResolverService = _textModelResolverService;
            //
        }
        DataSource.prototype.getId = function (tree, element) {
            if (element instanceof referencesModel_1.ReferencesModel) {
                return 'root';
            }
            else if (element instanceof referencesModel_1.FileReferences) {
                return element.id;
            }
            else if (element instanceof referencesModel_1.OneReference) {
                return element.id;
            }
            return undefined;
        };
        DataSource.prototype.hasChildren = function (tree, element) {
            if (element instanceof referencesModel_1.ReferencesModel) {
                return true;
            }
            if (element instanceof referencesModel_1.FileReferences && !element.failure) {
                return true;
            }
            return false;
        };
        DataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof referencesModel_1.ReferencesModel) {
                return winjs_base_1.TPromise.as(element.groups);
            }
            else if (element instanceof referencesModel_1.FileReferences) {
                return element.resolve(this._textModelResolverService).then(function (val) {
                    if (element.failure) {
                        // refresh the element on failure so that
                        // we can update its rendering
                        return tree.refresh(element).then(function () { return val.children; });
                    }
                    return val.children;
                });
            }
            else {
                return winjs_base_1.TPromise.as([]);
            }
        };
        DataSource.prototype.getParent = function (tree, element) {
            var result = null;
            if (element instanceof referencesModel_1.FileReferences) {
                result = element.parent;
            }
            else if (element instanceof referencesModel_1.OneReference) {
                result = element.parent;
            }
            return winjs_base_1.TPromise.as(result);
        };
        DataSource = __decorate([
            __param(0, resolverService_1.ITextModelService)
        ], DataSource);
        return DataSource;
    }());
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Controller.prototype.onTap = function (tree, element, event) {
            if (element instanceof referencesModel_1.FileReferences) {
                event.preventDefault();
                event.stopPropagation();
                return this._expandCollapse(tree, element);
            }
            var result = _super.prototype.onTap.call(this, tree, element, event);
            tree.emit(Controller.Events.FOCUSED, element);
            return result;
        };
        Controller.prototype.onMouseDown = function (tree, element, event) {
            if (event.leftButton) {
                if (element instanceof referencesModel_1.FileReferences) {
                    event.preventDefault();
                    event.stopPropagation();
                    return this._expandCollapse(tree, element);
                }
                var result = _super.prototype.onClick.call(this, tree, element, event);
                if (event.ctrlKey || event.metaKey) {
                    tree.emit(Controller.Events.OPEN_TO_SIDE, element);
                }
                else if (event.detail === 2) {
                    tree.emit(Controller.Events.SELECTED, element);
                }
                else {
                    tree.emit(Controller.Events.FOCUSED, element);
                }
                return result;
            }
            return false;
        };
        Controller.prototype.onClick = function (tree, element, event) {
            if (event.leftButton) {
                return false; // Already handled by onMouseDown
            }
            return _super.prototype.onClick.call(this, tree, element, event);
        };
        Controller.prototype._expandCollapse = function (tree, element) {
            if (tree.isExpanded(element)) {
                tree.collapse(element).done(null, errors_1.onUnexpectedError);
            }
            else {
                tree.expand(element).done(null, errors_1.onUnexpectedError);
            }
            return true;
        };
        Controller.prototype.onEscape = function (tree, event) {
            return false;
        };
        Controller.prototype.onEnter = function (tree, event) {
            var element = tree.getFocus();
            if (element instanceof referencesModel_1.FileReferences) {
                return this._expandCollapse(tree, element);
            }
            var result = _super.prototype.onEnter.call(this, tree, event);
            if (event.ctrlKey || event.metaKey) {
                tree.emit(Controller.Events.OPEN_TO_SIDE, element);
            }
            else {
                tree.emit(Controller.Events.SELECTED, element);
            }
            return result;
        };
        Controller.prototype.onUp = function (tree, event) {
            _super.prototype.onUp.call(this, tree, event);
            this._fakeFocus(tree, event);
            return true;
        };
        Controller.prototype.onPageUp = function (tree, event) {
            _super.prototype.onPageUp.call(this, tree, event);
            this._fakeFocus(tree, event);
            return true;
        };
        Controller.prototype.onLeft = function (tree, event) {
            _super.prototype.onLeft.call(this, tree, event);
            this._fakeFocus(tree, event);
            return true;
        };
        Controller.prototype.onDown = function (tree, event) {
            _super.prototype.onDown.call(this, tree, event);
            this._fakeFocus(tree, event);
            return true;
        };
        Controller.prototype.onPageDown = function (tree, event) {
            _super.prototype.onPageDown.call(this, tree, event);
            this._fakeFocus(tree, event);
            return true;
        };
        Controller.prototype.onRight = function (tree, event) {
            _super.prototype.onRight.call(this, tree, event);
            this._fakeFocus(tree, event);
            return true;
        };
        Controller.prototype._fakeFocus = function (tree, event) {
            // focus next item
            var focus = tree.getFocus();
            tree.setSelection([focus]);
            // send out event
            tree.emit(Controller.Events.FOCUSED, focus);
        };
        Controller.Events = {
            FOCUSED: 'events/custom/focused',
            SELECTED: 'events/custom/selected',
            OPEN_TO_SIDE: 'events/custom/opentoside'
        };
        return Controller;
    }(treeDefaults_1.DefaultController));
    var FileReferencesTemplate = (function () {
        function FileReferencesTemplate(container, _contextService, _environmentService, themeService) {
            this._contextService = _contextService;
            this._environmentService = _environmentService;
            var parent = document.createElement('div');
            dom.addClass(parent, 'reference-file');
            container.appendChild(parent);
            this.file = new iconLabel_1.FileLabel(parent, uri_1.default.parse('no:file'), this._contextService, this._environmentService);
            this.badge = new countBadge_1.CountBadge(parent);
            var styler = styler_1.attachBadgeStyler(this.badge, themeService);
            this.dispose = function () { return styler.dispose(); };
        }
        FileReferencesTemplate.prototype.set = function (element) {
            this.file.setFile(element.uri, this._contextService, this._environmentService);
            var len = element.children.length;
            this.badge.setCount(len);
            if (element.failure) {
                this.badge.setTitleFormat(nls.localize('referencesFailre', "Failed to resolve file."));
            }
            else if (len > 1) {
                this.badge.setTitleFormat(nls.localize('referencesCount', "{0} references", len));
            }
            else {
                this.badge.setTitleFormat(nls.localize('referenceCount', "{0} reference", len));
            }
        };
        FileReferencesTemplate = __decorate([
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, instantiation_1.optional(environment_1.IEnvironmentService)),
            __param(3, themeService_1.IThemeService)
        ], FileReferencesTemplate);
        return FileReferencesTemplate;
    }());
    var OneReferenceTemplate = (function () {
        function OneReferenceTemplate(container) {
            var parent = document.createElement('div');
            this.before = document.createElement('span');
            this.inside = document.createElement('span');
            this.after = document.createElement('span');
            dom.addClass(this.inside, 'referenceMatch');
            dom.addClass(parent, 'reference');
            parent.appendChild(this.before);
            parent.appendChild(this.inside);
            parent.appendChild(this.after);
            container.appendChild(parent);
        }
        OneReferenceTemplate.prototype.set = function (element) {
            var _a = element.parent.preview.preview(element.range), before = _a.before, inside = _a.inside, after = _a.after;
            this.before.innerHTML = strings.escape(before);
            this.inside.innerHTML = strings.escape(inside);
            this.after.innerHTML = strings.escape(after);
        };
        return OneReferenceTemplate;
    }());
    var Renderer = (function () {
        function Renderer(_contextService, _themeService, _environmentService) {
            this._contextService = _contextService;
            this._themeService = _themeService;
            this._environmentService = _environmentService;
            //
        }
        Renderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        Renderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof referencesModel_1.FileReferences) {
                return Renderer._ids.FileReferences;
            }
            else if (element instanceof referencesModel_1.OneReference) {
                return Renderer._ids.OneReference;
            }
            throw element;
        };
        Renderer.prototype.renderTemplate = function (tree, templateId, container) {
            if (templateId === Renderer._ids.FileReferences) {
                return new FileReferencesTemplate(container, this._contextService, this._environmentService, this._themeService);
            }
            else if (templateId === Renderer._ids.OneReference) {
                return new OneReferenceTemplate(container);
            }
            throw templateId;
        };
        Renderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (element instanceof referencesModel_1.FileReferences) {
                templateData.set(element);
            }
            else if (element instanceof referencesModel_1.OneReference) {
                templateData.set(element);
            }
            else {
                throw templateId;
            }
        };
        Renderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            if (templateData instanceof FileReferencesTemplate) {
                templateData.dispose();
            }
        };
        Renderer._ids = {
            FileReferences: 'FileReferences',
            OneReference: 'OneReference'
        };
        Renderer = __decorate([
            __param(0, workspace_1.IWorkspaceContextService),
            __param(1, themeService_1.IThemeService),
            __param(2, instantiation_1.optional(environment_1.IEnvironmentService))
        ], Renderer);
        return Renderer;
    }());
    var AriaProvider = (function () {
        function AriaProvider() {
        }
        AriaProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof referencesModel_1.FileReferences) {
                return element.getAriaMessage();
            }
            else if (element instanceof referencesModel_1.OneReference) {
                return element.getAriaMessage();
            }
            else {
                return undefined;
            }
        };
        return AriaProvider;
    }());
    var VSash = (function () {
        function VSash(container, ratio) {
            var _this = this;
            this._disposables = [];
            this._onDidChangePercentages = new event_1.Emitter();
            this._ratio = ratio;
            this._sash = new sash_1.Sash(container, {
                getVerticalSashLeft: function () { return _this._width * _this._ratio; },
                getVerticalSashHeight: function () { return _this._height; }
            });
            // compute the current widget clientX postion since
            // the sash works with clientX when dragging
            var clientX;
            this._disposables.push(this._sash.addListener('start', function (e) {
                clientX = e.startX - (_this._width * _this.ratio);
            }));
            this._disposables.push(this._sash.addListener('change', function (e) {
                // compute the new position of the sash and from that
                // compute the new ratio that we are using
                var newLeft = e.currentX - clientX;
                if (newLeft > 20 && newLeft + 20 < _this._width) {
                    _this._ratio = newLeft / _this._width;
                    _this._sash.layout();
                    _this._onDidChangePercentages.fire(_this);
                }
            }));
        }
        VSash.prototype.dispose = function () {
            this._sash.dispose();
            this._onDidChangePercentages.dispose();
            lifecycle_1.dispose(this._disposables);
        };
        Object.defineProperty(VSash.prototype, "onDidChangePercentages", {
            get: function () {
                return this._onDidChangePercentages.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VSash.prototype, "width", {
            set: function (value) {
                this._width = value;
                this._sash.layout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VSash.prototype, "height", {
            set: function (value) {
                this._height = value;
                this._sash.layout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VSash.prototype, "percentages", {
            get: function () {
                var left = 100 * this._ratio;
                var right = 100 - left;
                return [left + "%", right + "%"];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VSash.prototype, "ratio", {
            get: function () {
                return this._ratio;
            },
            enumerable: true,
            configurable: true
        });
        return VSash;
    }());
    /**
     * ZoneWidget that is shown inside the editor
     */
    var ReferenceWidget = (function (_super) {
        __extends(ReferenceWidget, _super);
        function ReferenceWidget(editor, layoutData, _textModelResolverService, _contextService, _themeService, _instantiationService, _environmentService) {
            var _this = _super.call(this, editor, { showFrame: false, showArrow: true, isResizeable: true, isAccessible: true }) || this;
            _this.layoutData = layoutData;
            _this._textModelResolverService = _textModelResolverService;
            _this._contextService = _contextService;
            _this._themeService = _themeService;
            _this._instantiationService = _instantiationService;
            _this._environmentService = _environmentService;
            _this._disposeOnNewModel = [];
            _this._callOnDispose = [];
            _this._onDidSelectReference = new event_1.Emitter();
            _this._applyTheme(_themeService.getTheme());
            _this._callOnDispose.push(_themeService.onThemeChange(_this._applyTheme.bind(_this)));
            _this._instantiationService = _this._instantiationService.createChild(new serviceCollection_1.ServiceCollection([peekViewWidget_1.IPeekViewService, _this]));
            _this.create();
            return _this;
        }
        ReferenceWidget.prototype._applyTheme = function (theme) {
            var borderColor = theme.getColor(exports.peekViewBorder) || color_1.Color.transparent;
            this.style({
                arrowColor: borderColor,
                frameColor: borderColor,
                headerBackgroundColor: theme.getColor(exports.peekViewTitleBackground) || color_1.Color.transparent,
                primaryHeadingColor: theme.getColor(exports.peekViewTitleForeground),
                secondaryHeadingColor: theme.getColor(exports.peekViewTitleInfoForeground)
            });
        };
        ReferenceWidget.prototype.dispose = function () {
            this.setModel(null);
            this._callOnDispose = lifecycle_1.dispose(this._callOnDispose);
            lifecycle_1.dispose(this._preview, this._previewNotAvailableMessage, this._tree, this._sash, this._previewModelReference);
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(ReferenceWidget.prototype, "onDidSelectReference", {
            get: function () {
                return this._onDidSelectReference.event;
            },
            enumerable: true,
            configurable: true
        });
        ReferenceWidget.prototype.show = function (where) {
            this.editor.revealRangeInCenterIfOutsideViewport(where);
            _super.prototype.show.call(this, where, this.layoutData.heightInLines || 18);
        };
        ReferenceWidget.prototype.focus = function () {
            this._tree.DOMFocus();
        };
        ReferenceWidget.prototype._onTitleClick = function (e) {
            if (this._preview && this._preview.getModel()) {
                this._onDidSelectReference.fire({
                    element: this._getFocusedReference(),
                    kind: e.ctrlKey || e.metaKey ? 'side' : 'open',
                    source: 'title'
                });
            }
        };
        ReferenceWidget.prototype._fillBody = function (containerElement) {
            var _this = this;
            var container = builder_1.$(containerElement);
            this.setCssClass('reference-zone-widget');
            // message pane
            container.div({ 'class': 'messages' }, function (div) {
                _this._messageContainer = div.hide();
            });
            // editor
            container.div({ 'class': 'preview inline' }, function (div) {
                var options = {
                    scrollBeyondLastLine: false,
                    scrollbar: {
                        verticalScrollbarSize: 14,
                        horizontal: 'auto',
                        useShadows: true,
                        verticalHasArrows: false,
                        horizontalHasArrows: false
                    },
                    overviewRulerLanes: 2,
                    fixedOverflowWidgets: true,
                    minimap: {
                        enabled: false
                    }
                };
                _this._preview = _this._instantiationService.createInstance(embeddedCodeEditorWidget_1.EmbeddedCodeEditorWidget, div.getHTMLElement(), options, _this.editor);
                _this._previewContainer = div.hide();
                _this._previewNotAvailableMessage = model_1.Model.createFromString(nls.localize('missingPreviewMessage', "no preview available"));
            });
            // sash
            this._sash = new VSash(containerElement, this.layoutData.ratio || .8);
            this._sash.onDidChangePercentages(function () {
                var _a = _this._sash.percentages, left = _a[0], right = _a[1];
                _this._previewContainer.style({ width: left });
                _this._treeContainer.style({ width: right });
                _this._preview.layout();
                _this._tree.layout();
                _this.layoutData.ratio = _this._sash.ratio;
            });
            // tree
            container.div({ 'class': 'ref-tree inline' }, function (div) {
                var config = {
                    dataSource: _this._instantiationService.createInstance(DataSource),
                    renderer: _this._instantiationService.createInstance(Renderer),
                    controller: new Controller(),
                    accessibilityProvider: new AriaProvider()
                };
                var options = {
                    allowHorizontalScroll: false,
                    twistiePixels: 20,
                    ariaLabel: nls.localize('treeAriaLabel', "References")
                };
                _this._tree = new treeImpl_1.Tree(div.getHTMLElement(), config, options);
                _this._callOnDispose.push(styler_1.attachListStyler(_this._tree, _this._themeService));
                _this._treeContainer = div.hide();
            });
        };
        ReferenceWidget.prototype._doLayoutBody = function (heightInPixel, widthInPixel) {
            _super.prototype._doLayoutBody.call(this, heightInPixel, widthInPixel);
            var height = heightInPixel + 'px';
            this._sash.height = heightInPixel;
            this._sash.width = widthInPixel;
            // set height/width
            var _a = this._sash.percentages, left = _a[0], right = _a[1];
            this._previewContainer.style({ height: height, width: left });
            this._treeContainer.style({ height: height, width: right });
            // forward
            this._tree.layout(heightInPixel);
            this._preview.layout();
            // store layout data
            this.layoutData = {
                heightInLines: this._viewZone.heightInLines,
                ratio: this._sash.ratio
            };
        };
        ReferenceWidget.prototype._onWidth = function (widthInPixel) {
            this._sash.width = widthInPixel;
            this._preview.layout();
        };
        ReferenceWidget.prototype.setSelection = function (selection) {
            return this._revealReference(selection);
        };
        ReferenceWidget.prototype.setModel = function (newModel) {
            // clean up
            this._disposeOnNewModel = lifecycle_1.dispose(this._disposeOnNewModel);
            this._model = newModel;
            if (this._model) {
                return this._onNewModel();
            }
            return undefined;
        };
        ReferenceWidget.prototype._onNewModel = function () {
            var _this = this;
            if (this._model.empty) {
                this.setTitle('');
                this._messageContainer.innerHtml(nls.localize('noResults', "No results")).show();
                return winjs_base_1.TPromise.as(void 0);
            }
            this._messageContainer.hide();
            this._decorationsManager = new DecorationsManager(this._preview, this._model);
            this._disposeOnNewModel.push(this._decorationsManager);
            // listen on model changes
            this._disposeOnNewModel.push(this._model.onDidChangeReferenceRange(function (reference) { return _this._tree.refresh(reference); }));
            // listen on selection and focus
            this._disposeOnNewModel.push(this._tree.addListener(Controller.Events.FOCUSED, function (element) {
                if (element instanceof referencesModel_1.OneReference) {
                    _this._revealReference(element);
                    _this._onDidSelectReference.fire({ element: element, kind: 'show', source: 'tree' });
                }
            }));
            this._disposeOnNewModel.push(this._tree.addListener(Controller.Events.SELECTED, function (element) {
                if (element instanceof referencesModel_1.OneReference) {
                    _this._onDidSelectReference.fire({ element: element, kind: 'goto', source: 'tree' });
                }
            }));
            this._disposeOnNewModel.push(this._tree.addListener(Controller.Events.OPEN_TO_SIDE, function (element) {
                if (element instanceof referencesModel_1.OneReference) {
                    _this._onDidSelectReference.fire({ element: element, kind: 'side', source: 'tree' });
                }
            }));
            // listen on editor
            this._disposeOnNewModel.push(this._preview.onMouseDown(function (e) {
                if (e.event.detail === 2) {
                    _this._onDidSelectReference.fire({
                        element: _this._getFocusedReference(),
                        kind: (e.event.ctrlKey || e.event.metaKey) ? 'side' : 'open',
                        source: 'editor'
                    });
                }
            }));
            // make sure things are rendered
            dom.addClass(this.container, 'results-loaded');
            this._treeContainer.show();
            this._previewContainer.show();
            this._preview.layout();
            this._tree.layout();
            this.focus();
            // pick input and a reference to begin with
            var input = this._model.groups.length === 1 ? this._model.groups[0] : this._model;
            return this._tree.setInput(input);
        };
        ReferenceWidget.prototype._getFocusedReference = function () {
            var element = this._tree.getFocus();
            if (element instanceof referencesModel_1.OneReference) {
                return element;
            }
            else if (element instanceof referencesModel_1.FileReferences) {
                if (element.children.length > 0) {
                    return element.children[0];
                }
            }
            return undefined;
        };
        ReferenceWidget.prototype._revealReference = function (reference) {
            var _this = this;
            // Update widget header
            if (reference.uri.scheme !== network_1.Schemas.inMemory) {
                this.setTitle(reference.name, labels_1.getPathLabel(reference.directory, this._contextService, this._environmentService));
            }
            else {
                this.setTitle(nls.localize('peekView.alternateTitle', "References"));
            }
            var promise = this._textModelResolverService.createModelReference(reference.uri);
            return winjs_base_1.TPromise.join([promise, this._tree.reveal(reference)]).then(function (values) {
                var ref = values[0];
                if (!_this._model) {
                    ref.dispose();
                    // disposed
                    return;
                }
                lifecycle_1.dispose(_this._previewModelReference);
                // show in editor
                var model = ref.object;
                if (model) {
                    _this._previewModelReference = ref;
                    _this._preview.setModel(model.textEditorModel);
                    var sel = range_1.Range.lift(reference.range).collapseToStart();
                    _this._preview.setSelection(sel);
                    _this._preview.revealRangeInCenter(sel);
                }
                else {
                    _this._preview.setModel(_this._previewNotAvailableMessage);
                    ref.dispose();
                }
                // show in tree
                _this._tree.setSelection([reference]);
                _this._tree.setFocus(reference);
            }, errors_1.onUnexpectedError);
        };
        return ReferenceWidget;
    }(peekViewWidget_1.PeekViewWidget));
    exports.ReferenceWidget = ReferenceWidget;
    // theming
    exports.peekViewTitleBackground = colorRegistry_1.registerColor('peekViewTitle.background', { dark: '#1E1E1E', light: '#FFFFFF', hc: '#0C141F' }, nls.localize('peekViewTitleBackground', 'Background color of the peek view title area.'));
    exports.peekViewTitleForeground = colorRegistry_1.registerColor('peekViewTitleLabel.foreground', { dark: '#FFFFFF', light: '#333333', hc: '#FFFFFF' }, nls.localize('peekViewTitleForeground', 'Color of the peek view title.'));
    exports.peekViewTitleInfoForeground = colorRegistry_1.registerColor('peekViewTitleDescription.foreground', { dark: '#ccccccb3', light: '#6c6c6cb3', hc: '#FFFFFF99' }, nls.localize('peekViewTitleInfoForeground', 'Color of the peek view title info.'));
    exports.peekViewBorder = colorRegistry_1.registerColor('peekView.border', { dark: '#007acc', light: '#007acc', hc: colorRegistry_1.contrastBorder }, nls.localize('peekViewBorder', 'Color of the peek view borders and arrow.'));
    exports.peekViewResultsBackground = colorRegistry_1.registerColor('peekViewResult.background', { dark: '#252526', light: '#F3F3F3', hc: color_1.Color.black }, nls.localize('peekViewResultsBackground', 'Background color of the peek view result list.'));
    exports.peekViewResultsMatchForeground = colorRegistry_1.registerColor('peekViewResult.lineForeground', { dark: '#bbbbbb', light: '#646465', hc: color_1.Color.white }, nls.localize('peekViewResultsMatchForeground', 'Foreground color for line nodes in the peek view result list.'));
    exports.peekViewResultsFileForeground = colorRegistry_1.registerColor('peekViewResult.fileForeground', { dark: color_1.Color.white, light: '#1E1E1E', hc: color_1.Color.white }, nls.localize('peekViewResultsFileForeground', 'Foreground color for file nodes in the peek view result list.'));
    exports.peekViewResultsSelectionBackground = colorRegistry_1.registerColor('peekViewResult.selectionBackground', { dark: '#3399ff33', light: '#3399ff33', hc: null }, nls.localize('peekViewResultsSelectionBackground', 'Background color of the selected entry in the peek view result list.'));
    exports.peekViewResultsSelectionForeground = colorRegistry_1.registerColor('peekViewResult.selectionForeground', { dark: color_1.Color.white, light: '#6C6C6C', hc: color_1.Color.white }, nls.localize('peekViewResultsSelectionForeground', 'Foreground color of the selected entry in the peek view result list.'));
    exports.peekViewEditorBackground = colorRegistry_1.registerColor('peekViewEditor.background', { dark: '#001F33', light: '#F2F8FC', hc: color_1.Color.black }, nls.localize('peekViewEditorBackground', 'Background color of the peek view editor.'));
    exports.peekViewEditorGutterBackground = colorRegistry_1.registerColor('peekViewEditorGutter.background', { dark: exports.peekViewEditorBackground, light: exports.peekViewEditorBackground, hc: exports.peekViewEditorBackground }, nls.localize('peekViewEditorGutterBackground', 'Background color of the gutter in the peek view editor.'));
    exports.peekViewResultsMatchHighlight = colorRegistry_1.registerColor('peekViewResult.matchHighlightBackground', { dark: '#ea5c004d', light: '#ea5c004d', hc: null }, nls.localize('peekViewResultsMatchHighlight', 'Match highlight color in the peek view result list.'));
    exports.peekViewEditorMatchHighlight = colorRegistry_1.registerColor('peekViewEditor.matchHighlightBackground', { dark: '#ff8f0099', light: '#f5d802de', hc: null }, nls.localize('peekViewEditorMatchHighlight', 'Match highlight color in the peek view editor.'));
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var findMatchHighlightColor = theme.getColor(exports.peekViewResultsMatchHighlight);
        if (findMatchHighlightColor) {
            collector.addRule(".monaco-editor .reference-zone-widget .ref-tree .referenceMatch { background-color: " + findMatchHighlightColor + "; }");
        }
        var referenceHighlightColor = theme.getColor(exports.peekViewEditorMatchHighlight);
        if (referenceHighlightColor) {
            collector.addRule(".monaco-editor .reference-zone-widget .preview .reference-decoration { background-color: " + referenceHighlightColor + "; }");
        }
        var hcOutline = theme.getColor(colorRegistry_1.activeContrastBorder);
        if (hcOutline) {
            collector.addRule(".monaco-editor .reference-zone-widget .ref-tree .referenceMatch { border: 1px dotted " + hcOutline + "; box-sizing: border-box; }");
            collector.addRule(".monaco-editor .reference-zone-widget .preview .reference-decoration { border: 2px solid " + hcOutline + "; box-sizing: border-box; }");
        }
        var resultsBackground = theme.getColor(exports.peekViewResultsBackground);
        if (resultsBackground) {
            collector.addRule(".monaco-editor .reference-zone-widget .ref-tree { background-color: " + resultsBackground + "; }");
        }
        var resultsMatchForeground = theme.getColor(exports.peekViewResultsMatchForeground);
        if (resultsMatchForeground) {
            collector.addRule(".monaco-editor .reference-zone-widget .ref-tree { color: " + resultsMatchForeground + "; }");
        }
        var resultsFileForeground = theme.getColor(exports.peekViewResultsFileForeground);
        if (resultsFileForeground) {
            collector.addRule(".monaco-editor .reference-zone-widget .ref-tree .reference-file { color: " + resultsFileForeground + "; }");
        }
        var resultsSelectedBackground = theme.getColor(exports.peekViewResultsSelectionBackground);
        if (resultsSelectedBackground) {
            collector.addRule(".monaco-editor .reference-zone-widget .ref-tree .monaco-tree.focused .monaco-tree-rows > .monaco-tree-row.selected:not(.highlighted) { background-color: " + resultsSelectedBackground + "; }");
        }
        var resultsSelectedForeground = theme.getColor(exports.peekViewResultsSelectionForeground);
        if (resultsSelectedForeground) {
            collector.addRule(".monaco-editor .reference-zone-widget .ref-tree .monaco-tree.focused .monaco-tree-rows > .monaco-tree-row.selected:not(.highlighted) { color: " + resultsSelectedForeground + " !important; }");
        }
        var editorBackground = theme.getColor(exports.peekViewEditorBackground);
        if (editorBackground) {
            collector.addRule(".monaco-editor .reference-zone-widget .preview .monaco-editor .monaco-editor-background," +
                ".monaco-editor .reference-zone-widget .preview .monaco-editor .inputarea.ime-input {" +
                ("\tbackground-color: " + editorBackground + ";") +
                "}");
        }
        var editorGutterBackground = theme.getColor(exports.peekViewEditorGutterBackground);
        if (editorGutterBackground) {
            collector.addRule(".monaco-editor .reference-zone-widget .preview .monaco-editor .margin {" +
                ("\tbackground-color: " + editorGutterBackground + ";") +
                "}");
        }
    });
});
//# sourceMappingURL=referencesWidget.js.map