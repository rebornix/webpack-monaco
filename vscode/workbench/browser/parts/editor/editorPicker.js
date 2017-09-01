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
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/labels", "vs/base/common/errors", "vs/base/common/strings", "vs/base/parts/quickopen/common/quickOpen", "vs/base/parts/quickopen/browser/quickOpenModel", "vs/base/common/scorer", "vs/editor/common/services/modeService", "vs/workbench/browser/labels", "vs/editor/common/services/modelService", "vs/workbench/browser/quickopen", "vs/platform/editor/common/editor", "vs/workbench/services/group/common/groupService", "vs/workbench/services/editor/common/editorService", "vs/platform/instantiation/common/instantiation", "vs/platform/workspace/common/workspace", "vs/workbench/common/editor", "vs/css!./media/editorpicker"], function (require, exports, winjs_base_1, nls, labels, errors, strings, quickOpen_1, quickOpenModel_1, scorer, modeService_1, labels_1, modelService_1, quickopen_1, editor_1, groupService_1, editorService_1, instantiation_1, workspace_1, editor_2) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditorPickerEntry = (function (_super) {
        __extends(EditorPickerEntry, _super);
        function EditorPickerEntry(editor, _group, editorService, modeService, modelService, editorGroupService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this._group = _group;
            _this.editorService = editorService;
            _this.modeService = modeService;
            _this.modelService = modelService;
            _this.stacks = editorGroupService.getStacksModel();
            return _this;
        }
        EditorPickerEntry.prototype.getLabelOptions = function () {
            return {
                extraClasses: labels_1.getIconClasses(this.modelService, this.modeService, this.getResource()),
                italic: this._group.isPreview(this.editor)
            };
        };
        EditorPickerEntry.prototype.getLabel = function () {
            return this.editor.getName();
        };
        EditorPickerEntry.prototype.getIcon = function () {
            return this.editor.isDirty() ? 'dirty' : '';
        };
        Object.defineProperty(EditorPickerEntry.prototype, "group", {
            get: function () {
                return this._group;
            },
            enumerable: true,
            configurable: true
        });
        EditorPickerEntry.prototype.getResource = function () {
            return editor_2.toResource(this.editor, { supportSideBySide: true });
        };
        EditorPickerEntry.prototype.getAriaLabel = function () {
            return nls.localize('entryAriaLabel', "{0}, editor group picker", this.getLabel());
        };
        EditorPickerEntry.prototype.getDescription = function () {
            return this.editor.getDescription();
        };
        EditorPickerEntry.prototype.run = function (mode, context) {
            if (mode === quickOpen_1.Mode.OPEN) {
                return this.runOpen(context);
            }
            return _super.prototype.run.call(this, mode, context);
        };
        EditorPickerEntry.prototype.runOpen = function (context) {
            this.editorService.openEditor(this.editor, null, this.stacks.positionOfGroup(this.group)).done(null, errors.onUnexpectedError);
            return true;
        };
        EditorPickerEntry = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, modeService_1.IModeService),
            __param(4, modelService_1.IModelService),
            __param(5, groupService_1.IEditorGroupService)
        ], EditorPickerEntry);
        return EditorPickerEntry;
    }(quickOpenModel_1.QuickOpenEntryGroup));
    exports.EditorPickerEntry = EditorPickerEntry;
    var BaseEditorPicker = (function (_super) {
        __extends(BaseEditorPicker, _super);
        function BaseEditorPicker(instantiationService, contextService, editorService, editorGroupService) {
            var _this = _super.call(this) || this;
            _this.instantiationService = instantiationService;
            _this.contextService = contextService;
            _this.editorService = editorService;
            _this.editorGroupService = editorGroupService;
            _this.scorerCache = Object.create(null);
            return _this;
        }
        BaseEditorPicker.prototype.getResults = function (searchValue) {
            var _this = this;
            searchValue = searchValue.trim();
            var normalizedSearchValueLowercase = strings.stripWildcards(searchValue).toLowerCase();
            var editorEntries = this.getEditorEntries();
            if (!editorEntries.length) {
                return winjs_base_1.TPromise.as(null);
            }
            var stacks = this.editorGroupService.getStacksModel();
            var entries = editorEntries.filter(function (e) {
                if (!searchValue) {
                    return true;
                }
                var resource = e.getResource();
                var targetToMatch = resource ? labels.getPathLabel(e.getResource(), _this.contextService) : e.getLabel();
                if (!scorer.matches(targetToMatch, normalizedSearchValueLowercase)) {
                    return false;
                }
                var _a = quickOpenModel_1.QuickOpenEntry.highlight(e, searchValue, true /* fuzzy highlight */), labelHighlights = _a.labelHighlights, descriptionHighlights = _a.descriptionHighlights;
                e.setHighlights(labelHighlights, descriptionHighlights);
                return true;
            });
            // Sorting
            if (searchValue) {
                entries.sort(function (e1, e2) {
                    if (e1.group !== e2.group) {
                        return stacks.positionOfGroup(e1.group) - stacks.positionOfGroup(e2.group);
                    }
                    return quickOpenModel_1.QuickOpenEntry.compareByScore(e1, e2, searchValue, normalizedSearchValueLowercase, _this.scorerCache);
                });
            }
            // Grouping (for more than one group)
            if (stacks.groups.length > 1) {
                var lastGroup_1;
                entries.forEach(function (e) {
                    if (!lastGroup_1 || lastGroup_1 !== e.group) {
                        e.setGroupLabel(nls.localize('groupLabel', "Group: {0}", e.group.label));
                        e.setShowBorder(!!lastGroup_1);
                        lastGroup_1 = e.group;
                    }
                });
            }
            return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel(entries));
        };
        BaseEditorPicker.prototype.onClose = function (canceled) {
            this.scorerCache = Object.create(null);
        };
        BaseEditorPicker = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, groupService_1.IEditorGroupService)
        ], BaseEditorPicker);
        return BaseEditorPicker;
    }(quickopen_1.QuickOpenHandler));
    exports.BaseEditorPicker = BaseEditorPicker;
    var EditorGroupPicker = (function (_super) {
        __extends(EditorGroupPicker, _super);
        function EditorGroupPicker() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorGroupPicker.prototype.getEditorEntries = function () {
            var _this = this;
            var stacks = this.editorGroupService.getStacksModel();
            var group = stacks.groupAt(this.getPosition());
            if (!group) {
                return [];
            }
            return group.getEditors(true).map(function (editor, index) { return _this.instantiationService.createInstance(EditorPickerEntry, editor, group); });
        };
        EditorGroupPicker.prototype.getEmptyLabel = function (searchString) {
            if (searchString) {
                return nls.localize('noResultsFoundInGroup', "No matching opened editor found in group");
            }
            return nls.localize('noOpenedEditors', "List of opened editors is currently empty in group");
        };
        EditorGroupPicker.prototype.getAutoFocus = function (searchValue, context) {
            if (searchValue || !context.quickNavigateConfiguration) {
                return {
                    autoFocusFirstEntry: true
                };
            }
            var stacks = this.editorGroupService.getStacksModel();
            var group = stacks.groupAt(this.getPosition());
            if (!group) {
                return _super.prototype.getAutoFocus.call(this, searchValue, context);
            }
            var isShiftNavigate = (context.quickNavigateConfiguration && context.quickNavigateConfiguration.keybindings.some(function (k) {
                var _a = k.getParts(), firstPart = _a[0], chordPart = _a[1];
                if (chordPart) {
                    return false;
                }
                return firstPart.shiftKey;
            }));
            if (isShiftNavigate) {
                return {
                    autoFocusLastEntry: true
                };
            }
            return {
                autoFocusFirstEntry: group.count === 1,
                autoFocusSecondEntry: group.count > 1
            };
        };
        return EditorGroupPicker;
    }(BaseEditorPicker));
    exports.EditorGroupPicker = EditorGroupPicker;
    var GroupOnePicker = (function (_super) {
        __extends(GroupOnePicker, _super);
        function GroupOnePicker() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GroupOnePicker.prototype.getPosition = function () {
            return editor_1.Position.ONE;
        };
        return GroupOnePicker;
    }(EditorGroupPicker));
    exports.GroupOnePicker = GroupOnePicker;
    var GroupTwoPicker = (function (_super) {
        __extends(GroupTwoPicker, _super);
        function GroupTwoPicker() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GroupTwoPicker.prototype.getPosition = function () {
            return editor_1.Position.TWO;
        };
        return GroupTwoPicker;
    }(EditorGroupPicker));
    exports.GroupTwoPicker = GroupTwoPicker;
    var GroupThreePicker = (function (_super) {
        __extends(GroupThreePicker, _super);
        function GroupThreePicker() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GroupThreePicker.prototype.getPosition = function () {
            return editor_1.Position.THREE;
        };
        return GroupThreePicker;
    }(EditorGroupPicker));
    exports.GroupThreePicker = GroupThreePicker;
    var AllEditorsPicker = (function (_super) {
        __extends(AllEditorsPicker, _super);
        function AllEditorsPicker() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AllEditorsPicker.prototype.getEditorEntries = function () {
            var _this = this;
            var entries = [];
            var stacks = this.editorGroupService.getStacksModel();
            stacks.groups.forEach(function (group, position) {
                group.getEditors().forEach(function (editor, index) {
                    entries.push(_this.instantiationService.createInstance(EditorPickerEntry, editor, group));
                });
            });
            return entries;
        };
        AllEditorsPicker.prototype.getEmptyLabel = function (searchString) {
            if (searchString) {
                return nls.localize('noResultsFound', "No matching opened editor found");
            }
            return nls.localize('noOpenedEditorsAllGroups', "List of opened editors is currently empty");
        };
        AllEditorsPicker.prototype.getAutoFocus = function (searchValue, context) {
            if (searchValue) {
                return {
                    autoFocusFirstEntry: true
                };
            }
            return _super.prototype.getAutoFocus.call(this, searchValue, context);
        };
        return AllEditorsPicker;
    }(BaseEditorPicker));
    exports.AllEditorsPicker = AllEditorsPicker;
});
//# sourceMappingURL=editorPicker.js.map