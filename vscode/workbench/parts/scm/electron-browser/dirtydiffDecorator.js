/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "vs/base/common/async", "vs/base/common/lifecycle", "vs/base/common/winjs.base", "vs/editor/common/editorCommon", "vs/editor/browser/codeEditor", "vs/platform/instantiation/common/instantiation", "vs/platform/message/common/message", "vs/platform/workspace/common/workspace", "vs/editor/common/services/resolverService", "vs/workbench/services/editor/common/editorService", "vs/editor/common/services/modelService", "vs/editor/common/services/editorWorkerService", "vs/workbench/services/group/common/groupService", "vs/workbench/services/scm/common/scm", "vs/editor/common/model/textModelWithDecorations", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/nls", "vs/base/common/color", "vs/css!./media/dirtydiffDecorator"], function (require, exports, async_1, lifecycle_1, winjs_base_1, common, widget, instantiation_1, message_1, workspace_1, resolverService_1, editorService_1, modelService_1, editorWorkerService_1, groupService_1, scm_1, textModelWithDecorations_1, themeService_1, colorRegistry_1, nls_1, color_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.editorGutterModifiedBackground = colorRegistry_1.registerColor('editorGutter.modifiedBackground', {
        dark: color_1.Color.fromHex('#00bcf2').transparent(0.6),
        light: color_1.Color.fromHex('#007acc').transparent(0.6),
        hc: color_1.Color.fromHex('#007acc').transparent(0.6)
    }, nls_1.localize('editorGutterModifiedBackground', "Editor gutter background color for lines that are modified."));
    exports.editorGutterAddedBackground = colorRegistry_1.registerColor('editorGutter.addedBackground', {
        dark: color_1.Color.fromHex('#7fba00').transparent(0.6),
        light: color_1.Color.fromHex('#2d883e').transparent(0.6),
        hc: color_1.Color.fromHex('#2d883e').transparent(0.6)
    }, nls_1.localize('editorGutterAddedBackground', "Editor gutter background color for lines that are added."));
    exports.editorGutterDeletedBackground = colorRegistry_1.registerColor('editorGutter.deletedBackground', {
        dark: color_1.Color.fromHex('#b9131a').transparent(0.76),
        light: color_1.Color.fromHex('#b9131a').transparent(0.76),
        hc: color_1.Color.fromHex('#b9131a').transparent(0.76)
    }, nls_1.localize('editorGutterDeletedBackground', "Editor gutter background color for lines that are deleted."));
    var DirtyDiffModelDecorator = (function () {
        function DirtyDiffModelDecorator(model, uri, scmService, modelService, editorWorkerService, editorService, contextService, textModelResolverService) {
            var _this = this;
            this.model = model;
            this.uri = uri;
            this.scmService = scmService;
            this.modelService = modelService;
            this.editorWorkerService = editorWorkerService;
            this.editorService = editorService;
            this.contextService = contextService;
            this.textModelResolverService = textModelResolverService;
            this.decorations = [];
            this.diffDelayer = new async_1.ThrottledDelayer(200);
            this.toDispose = [];
            this.triggerDiff();
            this.toDispose.push(model.onDidChangeContent(function () { return _this.triggerDiff(); }));
            this.toDispose.push(scmService.onDidChangeRepository(function () { return _this.triggerDiff(); }));
        }
        DirtyDiffModelDecorator.prototype.triggerDiff = function () {
            var _this = this;
            if (!this.diffDelayer) {
                return winjs_base_1.TPromise.as(null);
            }
            return this.diffDelayer
                .trigger(function () { return _this.diff(); })
                .then(function (diff) {
                if (!_this.model || _this.model.isDisposed() || !_this.baselineModel || _this.baselineModel.isDisposed()) {
                    return undefined; // disposed
                }
                if (_this.baselineModel.getValueLength() === 0) {
                    diff = [];
                }
                return _this.decorations = _this.model.deltaDecorations(_this.decorations, DirtyDiffModelDecorator.changesToDecorations(diff || []));
            });
        };
        DirtyDiffModelDecorator.prototype.diff = function () {
            var _this = this;
            return this.getOriginalURIPromise().then(function (originalURI) {
                if (!_this.model || _this.model.isDisposed() || !originalURI) {
                    return winjs_base_1.TPromise.as([]); // disposed
                }
                if (!_this.editorWorkerService.canComputeDirtyDiff(originalURI, _this.model.uri)) {
                    return winjs_base_1.TPromise.as([]); // Files too large
                }
                return _this.editorWorkerService.computeDirtyDiff(originalURI, _this.model.uri, true);
            });
        };
        DirtyDiffModelDecorator.prototype.getOriginalURIPromise = function () {
            var _this = this;
            if (this._originalURIPromise) {
                return this._originalURIPromise;
            }
            this._originalURIPromise = this.getOriginalResource()
                .then(function (originalUri) {
                if (!originalUri) {
                    return null;
                }
                return _this.textModelResolverService.createModelReference(originalUri)
                    .then(function (ref) {
                    _this.baselineModel = ref.object.textEditorModel;
                    _this.toDispose.push(ref);
                    _this.toDispose.push(ref.object.textEditorModel.onDidChangeContent(function () { return _this.triggerDiff(); }));
                    return originalUri;
                });
            });
            return async_1.always(this._originalURIPromise, function () {
                _this._originalURIPromise = null;
            });
        };
        DirtyDiffModelDecorator.prototype.getOriginalResource = function () {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var _i, _a, repository, result;
                return __generator(this, function (_b) {
                    for (_i = 0, _a = this.scmService.repositories; _i < _a.length; _i++) {
                        repository = _a[_i];
                        result = repository.provider.getOriginalResource(this.uri);
                        if (result) {
                            return [2 /*return*/, result];
                        }
                    }
                    return [2 /*return*/, null];
                });
            });
        };
        DirtyDiffModelDecorator.changesToDecorations = function (diff) {
            return diff.map(function (change) {
                var startLineNumber = change.modifiedStartLineNumber;
                var endLineNumber = change.modifiedEndLineNumber || startLineNumber;
                // Added
                if (change.originalEndLineNumber === 0) {
                    return {
                        range: {
                            startLineNumber: startLineNumber, startColumn: 1,
                            endLineNumber: endLineNumber, endColumn: 1
                        },
                        options: DirtyDiffModelDecorator.ADDED_DECORATION_OPTIONS
                    };
                }
                // Removed
                if (change.modifiedEndLineNumber === 0) {
                    return {
                        range: {
                            startLineNumber: startLineNumber, startColumn: 1,
                            endLineNumber: startLineNumber, endColumn: 1
                        },
                        options: DirtyDiffModelDecorator.DELETED_DECORATION_OPTIONS
                    };
                }
                // Modified
                return {
                    range: {
                        startLineNumber: startLineNumber, startColumn: 1,
                        endLineNumber: endLineNumber, endColumn: 1
                    },
                    options: DirtyDiffModelDecorator.MODIFIED_DECORATION_OPTIONS
                };
            });
        };
        DirtyDiffModelDecorator.prototype.dispose = function () {
            this.toDispose = lifecycle_1.dispose(this.toDispose);
            if (this.model && !this.model.isDisposed()) {
                this.model.deltaDecorations(this.decorations, []);
            }
            this.model = null;
            this.baselineModel = null;
            this.decorations = null;
            if (this.diffDelayer) {
                this.diffDelayer.cancel();
                this.diffDelayer = null;
            }
        };
        DirtyDiffModelDecorator.MODIFIED_DECORATION_OPTIONS = textModelWithDecorations_1.ModelDecorationOptions.register({
            linesDecorationsClassName: 'dirty-diff-modified-glyph',
            isWholeLine: true,
            overviewRuler: {
                color: themeService_1.themeColorFromId(exports.editorGutterModifiedBackground),
                darkColor: themeService_1.themeColorFromId(exports.editorGutterModifiedBackground),
                position: common.OverviewRulerLane.Left
            }
        });
        DirtyDiffModelDecorator.ADDED_DECORATION_OPTIONS = textModelWithDecorations_1.ModelDecorationOptions.register({
            linesDecorationsClassName: 'dirty-diff-added-glyph',
            isWholeLine: true,
            overviewRuler: {
                color: themeService_1.themeColorFromId(exports.editorGutterAddedBackground),
                darkColor: themeService_1.themeColorFromId(exports.editorGutterAddedBackground),
                position: common.OverviewRulerLane.Left
            }
        });
        DirtyDiffModelDecorator.DELETED_DECORATION_OPTIONS = textModelWithDecorations_1.ModelDecorationOptions.register({
            linesDecorationsClassName: 'dirty-diff-deleted-glyph',
            isWholeLine: true,
            overviewRuler: {
                color: themeService_1.themeColorFromId(exports.editorGutterDeletedBackground),
                darkColor: themeService_1.themeColorFromId(exports.editorGutterDeletedBackground),
                position: common.OverviewRulerLane.Left
            }
        });
        DirtyDiffModelDecorator = __decorate([
            __param(2, scm_1.ISCMService),
            __param(3, modelService_1.IModelService),
            __param(4, editorWorkerService_1.IEditorWorkerService),
            __param(5, editorService_1.IWorkbenchEditorService),
            __param(6, workspace_1.IWorkspaceContextService),
            __param(7, resolverService_1.ITextModelService)
        ], DirtyDiffModelDecorator);
        return DirtyDiffModelDecorator;
    }());
    var DirtyDiffDecorator = (function () {
        function DirtyDiffDecorator(messageService, editorService, editorGroupService, contextService, instantiationService) {
            var _this = this;
            this.messageService = messageService;
            this.editorService = editorService;
            this.contextService = contextService;
            this.instantiationService = instantiationService;
            this.models = [];
            this.decorators = Object.create(null);
            this.toDispose = [];
            this.toDispose.push(editorGroupService.onEditorsChanged(function () { return _this.onEditorsChanged(); }));
        }
        DirtyDiffDecorator.prototype.getId = function () {
            return 'git.DirtyDiffModelDecorator';
        };
        DirtyDiffDecorator.prototype.onEditorsChanged = function () {
            // HACK: This is the best current way of figuring out whether to draw these decorations
            // or not. Needs context from the editor, to know whether it is a diff editor, in place editor
            // etc.
            var _this = this;
            var models = this.editorService.getVisibleEditors()
                .map(function (e) { return e.getControl(); })
                .filter(function (c) { return c instanceof widget.CodeEditor; })
                .map(function (e) { return e.getModel(); })
                .filter(function (m, i, a) { return !!m && !!m.uri && a.indexOf(m, i + 1) === -1; })
                .map(function (m) { return ({ model: m, uri: m.uri }); });
            var newModels = models.filter(function (p) { return _this.models.every(function (m) { return p.model !== m; }); });
            var oldModels = this.models.filter(function (m) { return models.every(function (p) { return p.model !== m; }); });
            newModels.forEach(function (_a) {
                var model = _a.model, uri = _a.uri;
                return _this.onModelVisible(model, uri);
            });
            oldModels.forEach(function (m) { return _this.onModelInvisible(m); });
            this.models = models.map(function (p) { return p.model; });
        };
        DirtyDiffDecorator.prototype.onModelVisible = function (model, uri) {
            this.decorators[model.id] = this.instantiationService.createInstance(DirtyDiffModelDecorator, model, uri);
        };
        DirtyDiffDecorator.prototype.onModelInvisible = function (model) {
            this.decorators[model.id].dispose();
            delete this.decorators[model.id];
        };
        DirtyDiffDecorator.prototype.dispose = function () {
            var _this = this;
            this.toDispose = lifecycle_1.dispose(this.toDispose);
            this.models.forEach(function (m) { return _this.decorators[m.id].dispose(); });
            this.models = null;
            this.decorators = null;
        };
        DirtyDiffDecorator = __decorate([
            __param(0, message_1.IMessageService),
            __param(1, editorService_1.IWorkbenchEditorService),
            __param(2, groupService_1.IEditorGroupService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, instantiation_1.IInstantiationService)
        ], DirtyDiffDecorator);
        return DirtyDiffDecorator;
    }());
    exports.DirtyDiffDecorator = DirtyDiffDecorator;
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var editorGutterModifiedBackgroundColor = theme.getColor(exports.editorGutterModifiedBackground);
        if (editorGutterModifiedBackgroundColor) {
            collector.addRule(".monaco-editor .dirty-diff-modified-glyph { border-left: 3px solid " + editorGutterModifiedBackgroundColor + "; }");
        }
        var editorGutterAddedBackgroundColor = theme.getColor(exports.editorGutterAddedBackground);
        if (editorGutterAddedBackgroundColor) {
            collector.addRule(".monaco-editor .dirty-diff-added-glyph { border-left: 3px solid " + editorGutterAddedBackgroundColor + "; }");
        }
        var editorGutteDeletedBackgroundColor = theme.getColor(exports.editorGutterDeletedBackground);
        if (editorGutteDeletedBackgroundColor) {
            collector.addRule("\n\t\t\t.monaco-editor .dirty-diff-deleted-glyph:after {\n\t\t\t\tborder-top: 4px solid transparent;\n\t\t\t\tborder-bottom: 4px solid transparent;\n\t\t\t\tborder-left: 4px solid " + editorGutteDeletedBackgroundColor + ";\n\t\t\t}\n\t\t");
        }
    });
});
//# sourceMappingURL=dirtydiffDecorator.js.map