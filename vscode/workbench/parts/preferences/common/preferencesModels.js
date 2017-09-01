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
define(["require", "exports", "vs/nls", "vs/base/common/strings", "vs/base/common/objects", "vs/base/common/arrays", "vs/platform/registry/common/platform", "vs/base/common/json", "vs/workbench/common/editor", "vs/platform/configuration/common/configurationRegistry", "vs/platform/keybinding/common/keybinding", "vs/base/common/filters", "vs/editor/common/services/resolverService", "vs/workbench/services/textfile/common/textfiles", "vs/base/common/winjs.base", "vs/base/common/async", "vs/platform/files/common/files"], function (require, exports, nls, strings, objects_1, arrays_1, platform_1, json_1, editor_1, configurationRegistry_1, keybinding_1, filters_1, resolverService_1, textfiles_1, winjs_base_1, async_1, files_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SettingMatches = (function () {
        function SettingMatches(searchString, setting, valuesMatcher) {
            this.valuesMatcher = valuesMatcher;
            this.descriptionMatchingWords = new Map();
            this.keyMatchingWords = new Map();
            this.valueMatchingWords = new Map();
            this.matches = arrays_1.distinct(this._findMatchesInSetting(searchString, setting), function (match) { return match.startLineNumber + "_" + match.startColumn + "_" + match.endLineNumber + "_" + match.endColumn + "_"; });
        }
        SettingMatches.prototype._findMatchesInSetting = function (searchString, setting) {
            var result = this._doFindMatchesInSetting(searchString, setting);
            if (setting.overrides && setting.overrides.length) {
                for (var _i = 0, _a = setting.overrides; _i < _a.length; _i++) {
                    var subSetting = _a[_i];
                    var subSettingMatches = new SettingMatches(searchString, subSetting, this.valuesMatcher);
                    var words = searchString.split(' ');
                    var descriptionRanges = this.getRangesForWords(words, this.descriptionMatchingWords, [subSettingMatches.descriptionMatchingWords, subSettingMatches.keyMatchingWords, subSettingMatches.valueMatchingWords]);
                    var keyRanges = this.getRangesForWords(words, this.keyMatchingWords, [subSettingMatches.descriptionMatchingWords, subSettingMatches.keyMatchingWords, subSettingMatches.valueMatchingWords]);
                    var subSettingKeyRanges = this.getRangesForWords(words, subSettingMatches.keyMatchingWords, [this.descriptionMatchingWords, this.keyMatchingWords, subSettingMatches.valueMatchingWords]);
                    var subSettinValueRanges = this.getRangesForWords(words, subSettingMatches.valueMatchingWords, [this.descriptionMatchingWords, this.keyMatchingWords, subSettingMatches.keyMatchingWords]);
                    result.push.apply(result, descriptionRanges.concat(keyRanges, subSettingKeyRanges, subSettinValueRanges));
                    result.push.apply(result, subSettingMatches.matches);
                }
            }
            return result;
        };
        SettingMatches.prototype._doFindMatchesInSetting = function (searchString, setting) {
            var _this = this;
            var registry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
            var schema = registry[setting.key];
            var words = searchString.split(' ');
            var settingKeyAsWords = setting.key.split('.').join(' ');
            var _loop_1 = function (word) {
                var _loop_2 = function (lineIndex) {
                    var descriptionMatches = filters_1.matchesWords(word, setting.description[lineIndex], true);
                    if (descriptionMatches) {
                        this_1.descriptionMatchingWords.set(word, descriptionMatches.map(function (match) { return _this.toDescriptionRange(setting, match, lineIndex); }));
                    }
                };
                for (var lineIndex = 0; lineIndex < setting.description.length; lineIndex++) {
                    _loop_2(lineIndex);
                }
                var keyMatches_1 = filters_1.or(filters_1.matchesWords, filters_1.matchesCamelCase)(word, settingKeyAsWords);
                if (keyMatches_1) {
                    this_1.keyMatchingWords.set(word, keyMatches_1.map(function (match) { return _this.toKeyRange(setting, match); }));
                }
                var valueMatches = typeof setting.value === 'string' ? filters_1.matchesContiguousSubString(word, setting.value) : null;
                if (valueMatches) {
                    this_1.valueMatchingWords.set(word, valueMatches.map(function (match) { return _this.toValueRange(setting, match); }));
                }
                else if (schema && schema.enum && schema.enum.some(function (enumValue) { return typeof enumValue === 'string' && !!filters_1.matchesContiguousSubString(word, enumValue); })) {
                    this_1.valueMatchingWords.set(word, []);
                }
            };
            var this_1 = this;
            for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
                var word = words_1[_i];
                _loop_1(word);
            }
            var descriptionRanges = [];
            var _loop_3 = function (lineIndex) {
                var matches = filters_1.or(filters_1.matchesContiguousSubString)(searchString, setting.description[lineIndex] || '') || [];
                descriptionRanges.push.apply(descriptionRanges, matches.map(function (match) { return _this.toDescriptionRange(setting, match, lineIndex); }));
            };
            for (var lineIndex = 0; lineIndex < setting.description.length; lineIndex++) {
                _loop_3(lineIndex);
            }
            if (descriptionRanges.length === 0) {
                descriptionRanges.push.apply(descriptionRanges, this.getRangesForWords(words, this.descriptionMatchingWords, [this.keyMatchingWords, this.valueMatchingWords]));
            }
            var keyMatches = filters_1.or(filters_1.matchesPrefix, filters_1.matchesContiguousSubString)(searchString, setting.key);
            var keyRanges = keyMatches ? keyMatches.map(function (match) { return _this.toKeyRange(setting, match); }) : this.getRangesForWords(words, this.keyMatchingWords, [this.descriptionMatchingWords, this.valueMatchingWords]);
            var valueRanges = [];
            if (setting.value && typeof setting.value === 'string') {
                var valueMatches = filters_1.or(filters_1.matchesPrefix, filters_1.matchesContiguousSubString)(searchString, setting.value);
                valueRanges = valueMatches ? valueMatches.map(function (match) { return _this.toValueRange(setting, match); }) : this.getRangesForWords(words, this.valueMatchingWords, [this.keyMatchingWords, this.descriptionMatchingWords]);
            }
            else {
                valueRanges = this.valuesMatcher(searchString, setting);
            }
            return descriptionRanges.concat(keyRanges, valueRanges);
        };
        SettingMatches.prototype.getRangesForWords = function (words, from, others) {
            var result = [];
            var _loop_4 = function (word) {
                var ranges = from.get(word);
                if (ranges) {
                    result.push.apply(result, ranges);
                }
                else if (others.every(function (o) { return !o.has(word); })) {
                    return { value: [] };
                }
            };
            for (var _i = 0, words_2 = words; _i < words_2.length; _i++) {
                var word = words_2[_i];
                var state_1 = _loop_4(word);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return result;
        };
        SettingMatches.prototype.toKeyRange = function (setting, match) {
            return {
                startLineNumber: setting.keyRange.startLineNumber,
                startColumn: setting.keyRange.startColumn + match.start,
                endLineNumber: setting.keyRange.startLineNumber,
                endColumn: setting.keyRange.startColumn + match.end
            };
        };
        SettingMatches.prototype.toDescriptionRange = function (setting, match, lineIndex) {
            return {
                startLineNumber: setting.descriptionRanges[lineIndex].startLineNumber,
                startColumn: setting.descriptionRanges[lineIndex].startColumn + match.start,
                endLineNumber: setting.descriptionRanges[lineIndex].endLineNumber,
                endColumn: setting.descriptionRanges[lineIndex].startColumn + match.end
            };
        };
        SettingMatches.prototype.toValueRange = function (setting, match) {
            return {
                startLineNumber: setting.valueRange.startLineNumber,
                startColumn: setting.valueRange.startColumn + match.start + 1,
                endLineNumber: setting.valueRange.startLineNumber,
                endColumn: setting.valueRange.startColumn + match.end + 1
            };
        };
        return SettingMatches;
    }());
    var AbstractSettingsModel = (function (_super) {
        __extends(AbstractSettingsModel, _super);
        function AbstractSettingsModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(AbstractSettingsModel.prototype, "groupsTerms", {
            get: function () {
                return this.settingsGroups.map(function (group) { return '@' + group.id; });
            },
            enumerable: true,
            configurable: true
        });
        AbstractSettingsModel.prototype.doFilterSettings = function (filter, allGroups) {
            var _this = this;
            if (!filter) {
                return {
                    filteredGroups: allGroups,
                    allGroups: allGroups,
                    matches: []
                };
            }
            var group = this.filterByGroupTerm(filter);
            if (group) {
                return {
                    filteredGroups: [group],
                    allGroups: allGroups,
                    matches: []
                };
            }
            var matches = [];
            var filteredGroups = [];
            var regex = strings.createRegExp(filter, false, { global: true });
            for (var _i = 0, allGroups_1 = allGroups; _i < allGroups_1.length; _i++) {
                var group_1 = allGroups_1[_i];
                var groupMatched = regex.test(group_1.title);
                var sections = [];
                for (var _a = 0, _b = group_1.sections; _a < _b.length; _a++) {
                    var section = _b[_a];
                    var settings = [];
                    for (var _c = 0, _d = section.settings; _c < _d.length; _c++) {
                        var setting = _d[_c];
                        var settingMatches = new SettingMatches(filter, setting, function (filter, setting) { return _this.findValueMatches(filter, setting); }).matches;
                        if (groupMatched || settingMatches.length > 0) {
                            settings.push(setting);
                        }
                        matches.push.apply(matches, settingMatches);
                    }
                    if (settings.length) {
                        sections.push({
                            title: section.title,
                            settings: settings,
                            titleRange: section.titleRange
                        });
                    }
                }
                if (sections.length) {
                    filteredGroups.push({
                        id: group_1.id,
                        title: group_1.title,
                        titleRange: group_1.titleRange,
                        sections: sections,
                        range: group_1.range
                    });
                }
            }
            return { filteredGroups: filteredGroups, matches: matches, allGroups: allGroups };
        };
        AbstractSettingsModel.prototype.filterByGroupTerm = function (filter) {
            if (this.groupsTerms.indexOf(filter) !== -1) {
                var id_1 = filter.substring(1);
                return this.settingsGroups.filter(function (group) { return group.id === id_1; })[0];
            }
            return null;
        };
        AbstractSettingsModel.prototype.getPreference = function (key) {
            for (var _i = 0, _a = this.settingsGroups; _i < _a.length; _i++) {
                var group = _a[_i];
                for (var _b = 0, _c = group.sections; _b < _c.length; _b++) {
                    var section = _c[_b];
                    for (var _d = 0, _e = section.settings; _d < _e.length; _d++) {
                        var setting = _e[_d];
                        if (key === setting.key) {
                            return setting;
                        }
                    }
                }
            }
            return null;
        };
        return AbstractSettingsModel;
    }(editor_1.EditorModel));
    exports.AbstractSettingsModel = AbstractSettingsModel;
    var SettingsEditorModel = (function (_super) {
        __extends(SettingsEditorModel, _super);
        function SettingsEditorModel(reference, _configurationTarget, textFileService) {
            var _this = _super.call(this) || this;
            _this._configurationTarget = _configurationTarget;
            _this.textFileService = textFileService;
            _this.settingsModel = reference.object.textEditorModel;
            _this._register(_this.onDispose(function () { return reference.dispose(); }));
            _this._register(_this.settingsModel.onDidChangeContent(function () {
                _this._settingsGroups = null;
            }));
            _this.queue = new async_1.Queue();
            return _this;
        }
        Object.defineProperty(SettingsEditorModel.prototype, "uri", {
            get: function () {
                return this.settingsModel.uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsEditorModel.prototype, "configurationTarget", {
            get: function () {
                return this._configurationTarget;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsEditorModel.prototype, "settingsGroups", {
            get: function () {
                if (!this._settingsGroups) {
                    this.parse();
                }
                return this._settingsGroups;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsEditorModel.prototype, "content", {
            get: function () {
                return this.settingsModel.getValue();
            },
            enumerable: true,
            configurable: true
        });
        SettingsEditorModel.prototype.filterSettings = function (filter) {
            return this.doFilterSettings(filter, this.settingsGroups);
        };
        SettingsEditorModel.prototype.save = function () {
            var _this = this;
            return this.queue.queue(function () { return _this.doSave(); });
        };
        SettingsEditorModel.prototype.doSave = function () {
            return this.textFileService.save(this.uri);
        };
        SettingsEditorModel.prototype.findValueMatches = function (filter, setting) {
            return this.settingsModel.findMatches(filter, setting.valueRange, false, false, null, false).map(function (match) { return match.range; });
        };
        SettingsEditorModel.prototype.parse = function () {
            var model = this.settingsModel;
            var settings = [];
            var overrideSetting = null;
            var currentProperty = null;
            var currentParent = [];
            var previousParents = [];
            var range = {
                startLineNumber: 0,
                startColumn: 0,
                endLineNumber: 0,
                endColumn: 0
            };
            function onValue(value, offset, length) {
                if (Array.isArray(currentParent)) {
                    currentParent.push(value);
                }
                else if (currentProperty) {
                    currentParent[currentProperty] = value;
                }
                if (previousParents.length === 1 || (previousParents.length === 2 && overrideSetting !== null)) {
                    // settings value started
                    var setting = previousParents.length === 1 ? settings[settings.length - 1] : overrideSetting.overrides[overrideSetting.overrides.length - 1];
                    if (setting) {
                        var valueStartPosition = model.getPositionAt(offset);
                        var valueEndPosition = model.getPositionAt(offset + length);
                        setting.value = value;
                        setting.valueRange = {
                            startLineNumber: valueStartPosition.lineNumber,
                            startColumn: valueStartPosition.column,
                            endLineNumber: valueEndPosition.lineNumber,
                            endColumn: valueEndPosition.column
                        };
                        setting.range = objects_1.assign(setting.range, {
                            endLineNumber: valueEndPosition.lineNumber,
                            endColumn: valueEndPosition.column
                        });
                    }
                }
            }
            var visitor = {
                onObjectBegin: function (offset, length) {
                    if (previousParents.length === 0) {
                        // Settings started
                        var position = model.getPositionAt(offset);
                        range.startLineNumber = position.lineNumber;
                        range.startColumn = position.column;
                    }
                    var object = {};
                    onValue(object, offset, length);
                    currentParent = object;
                    currentProperty = null;
                    previousParents.push(currentParent);
                },
                onObjectProperty: function (name, offset, length) {
                    currentProperty = name;
                    if (previousParents.length === 1 || (previousParents.length === 2 && overrideSetting !== null)) {
                        // setting started
                        var settingStartPosition = model.getPositionAt(offset);
                        var setting = {
                            description: [],
                            key: name,
                            keyRange: {
                                startLineNumber: settingStartPosition.lineNumber,
                                startColumn: settingStartPosition.column + 1,
                                endLineNumber: settingStartPosition.lineNumber,
                                endColumn: settingStartPosition.column + length
                            },
                            range: {
                                startLineNumber: settingStartPosition.lineNumber,
                                startColumn: settingStartPosition.column,
                                endLineNumber: 0,
                                endColumn: 0
                            },
                            value: null,
                            valueRange: null,
                            descriptionRanges: null,
                            overrides: [],
                            overrideOf: overrideSetting
                        };
                        if (previousParents.length === 1) {
                            settings.push(setting);
                            if (configurationRegistry_1.OVERRIDE_PROPERTY_PATTERN.test(name)) {
                                overrideSetting = setting;
                            }
                        }
                        else {
                            overrideSetting.overrides.push(setting);
                        }
                    }
                },
                onObjectEnd: function (offset, length) {
                    currentParent = previousParents.pop();
                    if (previousParents.length === 1 || (previousParents.length === 2 && overrideSetting !== null)) {
                        // setting ended
                        var setting = previousParents.length === 1 ? settings[settings.length - 1] : overrideSetting.overrides[overrideSetting.overrides.length - 1];
                        if (setting) {
                            var valueEndPosition = model.getPositionAt(offset + length);
                            setting.valueRange = objects_1.assign(setting.valueRange, {
                                endLineNumber: valueEndPosition.lineNumber,
                                endColumn: valueEndPosition.column
                            });
                            setting.range = objects_1.assign(setting.range, {
                                endLineNumber: valueEndPosition.lineNumber,
                                endColumn: valueEndPosition.column
                            });
                        }
                        if (previousParents.length === 1) {
                            overrideSetting = null;
                        }
                    }
                    if (previousParents.length === 0) {
                        // settings ended
                        var position = model.getPositionAt(offset);
                        range.endLineNumber = position.lineNumber;
                        range.endColumn = position.column;
                    }
                },
                onArrayBegin: function (offset, length) {
                    var array = [];
                    onValue(array, offset, length);
                    previousParents.push(currentParent);
                    currentParent = array;
                    currentProperty = null;
                },
                onArrayEnd: function (offset, length) {
                    currentParent = previousParents.pop();
                    if (previousParents.length === 1 || (previousParents.length === 2 && overrideSetting !== null)) {
                        // setting value ended
                        var setting = previousParents.length === 1 ? settings[settings.length - 1] : overrideSetting.overrides[overrideSetting.overrides.length - 1];
                        if (setting) {
                            var valueEndPosition = model.getPositionAt(offset + length);
                            setting.valueRange = objects_1.assign(setting.valueRange, {
                                endLineNumber: valueEndPosition.lineNumber,
                                endColumn: valueEndPosition.column
                            });
                            setting.range = objects_1.assign(setting.range, {
                                endLineNumber: valueEndPosition.lineNumber,
                                endColumn: valueEndPosition.column
                            });
                        }
                    }
                },
                onLiteralValue: onValue,
                onError: function (error) {
                    var setting = settings[settings.length - 1];
                    if (setting && (!setting.range || !setting.keyRange || !setting.valueRange)) {
                        settings.pop();
                    }
                }
            };
            if (!model.isDisposed()) {
                json_1.visit(model.getValue(), visitor);
            }
            this._settingsGroups = settings.length > 0 ? [{
                    sections: [
                        {
                            settings: settings
                        }
                    ],
                    title: null,
                    titleRange: null,
                    range: range
                }] : [];
        };
        SettingsEditorModel = __decorate([
            __param(2, textfiles_1.ITextFileService)
        ], SettingsEditorModel);
        return SettingsEditorModel;
    }(AbstractSettingsModel));
    exports.SettingsEditorModel = SettingsEditorModel;
    var WorkspaceConfigModel = (function (_super) {
        __extends(WorkspaceConfigModel, _super);
        function WorkspaceConfigModel(reference, workspaceConfigModelReference, _configurationTarget, onDispose, fileService, textModelResolverService, textFileService) {
            var _this = _super.call(this, reference, _configurationTarget, textFileService) || this;
            _this.fileService = fileService;
            _this.textModelResolverService = textModelResolverService;
            _this._register(workspaceConfigModelReference);
            _this.workspaceConfigModel = workspaceConfigModelReference.object.textEditorModel;
            // Only listen to state changes. Content changes without saving are not synced.
            _this._register(_this.textFileService.models.get(_this.workspaceConfigModel.uri).onDidStateChange(function (statChange) { return _this._onWorkspaceConfigFileStateChanged(statChange); }));
            _this.onDispose(function () { return _super.prototype.dispose.call(_this); });
            return _this;
        }
        WorkspaceConfigModel.prototype.doSave = function () {
            var _this = this;
            if (this.textFileService.isDirty(this.workspaceConfigModel.uri)) {
                // Throw an error?
                return winjs_base_1.TPromise.as(null);
            }
            var content = this.createWorkspaceConfigContentFromSettingsModel();
            if (content !== this.workspaceConfigModel.getValue()) {
                return this.fileService.updateContent(this.workspaceConfigModel.uri, content)
                    .then(function (stat) { return _this.workspaceConfigEtag = stat.etag; });
            }
            return winjs_base_1.TPromise.as(null);
        };
        WorkspaceConfigModel.prototype.createWorkspaceConfigContentFromSettingsModel = function () {
            var workspaceConfigContent = this.workspaceConfigModel.getValue();
            var _a = WorkspaceConfigModel.parseWorkspaceConfigContent(workspaceConfigContent), settingsPropertyEndsAt = _a.settingsPropertyEndsAt, nodeAfterSettingStartsAt = _a.nodeAfterSettingStartsAt;
            var workspaceConfigEndsAt = workspaceConfigContent.lastIndexOf('}');
            // Settings property exist in Workspace Configuration and has Ending Brace
            if (settingsPropertyEndsAt !== -1 && workspaceConfigEndsAt > settingsPropertyEndsAt) {
                // Place settings at the end
                var from = workspaceConfigContent.indexOf(':', settingsPropertyEndsAt) + 1;
                var to = workspaceConfigEndsAt;
                var settingsContent = this.settingsModel.getValue();
                // There is a node after settings property
                // Place settings before that node
                if (nodeAfterSettingStartsAt !== -1) {
                    settingsContent += ',';
                    to = nodeAfterSettingStartsAt;
                }
                return workspaceConfigContent.substring(0, from) + settingsContent + workspaceConfigContent.substring(to);
            }
            // Settings property does not exist. Place it at the end
            return workspaceConfigContent.substring(0, workspaceConfigEndsAt) + (",\n\"settings\": " + this.settingsModel.getValue() + "\n") + workspaceConfigContent.substring(workspaceConfigEndsAt);
        };
        WorkspaceConfigModel.prototype._onWorkspaceConfigFileStateChanged = function (stateChange) {
            var hasToUpdate = false;
            switch (stateChange) {
                case textfiles_1.StateChange.SAVED:
                    hasToUpdate = this.workspaceConfigEtag !== this.textFileService.models.get(this.workspaceConfigModel.uri).getETag();
                    break;
            }
            if (hasToUpdate) {
                this.onWorkspaceConfigFileContentChanged();
            }
        };
        WorkspaceConfigModel.prototype.onWorkspaceConfigFileContentChanged = function () {
            this.workspaceConfigEtag = this.textFileService.models.get(this.workspaceConfigModel.uri).getETag();
            var settingsValue = WorkspaceConfigModel.getSettingsContentFromConfigContent(this.workspaceConfigModel.getValue());
            if (settingsValue) {
                this.settingsModel.setValue(settingsValue);
            }
        };
        WorkspaceConfigModel.prototype.dispose = function () {
            // Not disposable by default
        };
        WorkspaceConfigModel.getSettingsContentFromConfigContent = function (workspaceConfigContent) {
            var _a = WorkspaceConfigModel.parseWorkspaceConfigContent(workspaceConfigContent), settingsPropertyEndsAt = _a.settingsPropertyEndsAt, nodeAfterSettingStartsAt = _a.nodeAfterSettingStartsAt;
            var workspaceConfigEndsAt = workspaceConfigContent.lastIndexOf('}');
            if (settingsPropertyEndsAt !== -1) {
                var from = workspaceConfigContent.indexOf(':', settingsPropertyEndsAt) + 1;
                var to = nodeAfterSettingStartsAt !== -1 ? nodeAfterSettingStartsAt : workspaceConfigEndsAt;
                return workspaceConfigContent.substring(from, to);
            }
            return null;
        };
        WorkspaceConfigModel.parseWorkspaceConfigContent = function (content) {
            var settingsPropertyEndsAt = -1;
            var nodeAfterSettingStartsAt = -1;
            var rootProperties = [];
            var ancestors = [];
            var currentProperty = '';
            json_1.visit(content, {
                onObjectProperty: function (name, offset, length) {
                    currentProperty = name;
                    if (ancestors.length === 1) {
                        rootProperties.push(name);
                        if (rootProperties[rootProperties.length - 1] === 'settings') {
                            settingsPropertyEndsAt = offset + length;
                        }
                        if (rootProperties[rootProperties.length - 2] === 'settings') {
                            nodeAfterSettingStartsAt = offset;
                        }
                    }
                },
                onObjectBegin: function (offset, length) {
                    ancestors.push(currentProperty);
                },
                onObjectEnd: function (offset, length) {
                    ancestors.pop();
                }
            }, { allowTrailingComma: true });
            return { settingsPropertyEndsAt: settingsPropertyEndsAt, nodeAfterSettingStartsAt: nodeAfterSettingStartsAt };
        };
        WorkspaceConfigModel = __decorate([
            __param(4, files_1.IFileService),
            __param(5, resolverService_1.ITextModelService),
            __param(6, textfiles_1.ITextFileService)
        ], WorkspaceConfigModel);
        return WorkspaceConfigModel;
    }(SettingsEditorModel));
    exports.WorkspaceConfigModel = WorkspaceConfigModel;
    var DefaultSettingsEditorModel = (function (_super) {
        __extends(DefaultSettingsEditorModel, _super);
        function DefaultSettingsEditorModel(_uri, _mostCommonlyUsedSettingsKeys, configurationScope) {
            var _this = _super.call(this) || this;
            _this._uri = _uri;
            _this._mostCommonlyUsedSettingsKeys = _mostCommonlyUsedSettingsKeys;
            _this.configurationScope = configurationScope;
            return _this;
        }
        Object.defineProperty(DefaultSettingsEditorModel.prototype, "uri", {
            get: function () {
                return this._uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultSettingsEditorModel.prototype, "content", {
            get: function () {
                if (!this._content) {
                    this.parse();
                }
                return this._content;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultSettingsEditorModel.prototype, "settingsGroups", {
            get: function () {
                if (!this._allSettingsGroups) {
                    this.parse();
                }
                return this._allSettingsGroups;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultSettingsEditorModel.prototype, "mostCommonlyUsedSettings", {
            get: function () {
                return this.settingsGroups[0];
            },
            enumerable: true,
            configurable: true
        });
        DefaultSettingsEditorModel.prototype.filterSettings = function (filter) {
            return this.doFilterSettings(filter, this.settingsGroups);
        };
        DefaultSettingsEditorModel.prototype.getPreference = function (key) {
            for (var _i = 0, _a = this.settingsGroups; _i < _a.length; _i++) {
                var group = _a[_i];
                for (var _b = 0, _c = group.sections; _b < _c.length; _b++) {
                    var section = _c[_b];
                    for (var _d = 0, _e = section.settings; _d < _e.length; _d++) {
                        var setting = _e[_d];
                        if (setting.key === key) {
                            return setting;
                        }
                    }
                }
            }
            return null;
        };
        DefaultSettingsEditorModel.prototype.parse = function () {
            var _this = this;
            var configurations = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurations().slice();
            var settingsGroups = this.removeEmptySettingsGroups(configurations.sort(this.compareConfigurationNodes).reduce(function (result, config, index, array) { return _this.parseConfig(config, result, array); }, []));
            var mostCommonlyUsed = this.getMostCommonlyUsedSettings(settingsGroups);
            this._allSettingsGroups = [mostCommonlyUsed].concat(settingsGroups);
            this._content = this.toContent(mostCommonlyUsed, settingsGroups);
        };
        DefaultSettingsEditorModel.prototype.getMostCommonlyUsedSettings = function (allSettingsGroups) {
            var map = new Map();
            for (var _i = 0, allSettingsGroups_1 = allSettingsGroups; _i < allSettingsGroups_1.length; _i++) {
                var group = allSettingsGroups_1[_i];
                for (var _a = 0, _b = group.sections; _a < _b.length; _a++) {
                    var section = _b[_a];
                    for (var _c = 0, _d = section.settings; _c < _d.length; _c++) {
                        var setting = _d[_c];
                        map.set(setting.key, setting);
                    }
                }
            }
            var settings = this._mostCommonlyUsedSettingsKeys.map(function (key) {
                var setting = map.get(key);
                if (setting) {
                    return {
                        description: setting.description,
                        key: setting.key,
                        value: setting.value,
                        range: null,
                        valueRange: null,
                        overrides: []
                    };
                }
                return null;
            }).filter(function (setting) { return !!setting; });
            return {
                id: 'mostCommonlyUsed',
                range: null,
                title: nls.localize('commonlyUsed', "Commonly Used"),
                titleRange: null,
                sections: [
                    {
                        settings: settings
                    }
                ]
            };
        };
        DefaultSettingsEditorModel.prototype.parseConfig = function (config, result, configurations, settingsGroup) {
            var _this = this;
            var title = config.title;
            if (!title) {
                var configWithTitleAndSameId = configurations.filter(function (c) { return c.id === config.id && c.title; })[0];
                if (configWithTitleAndSameId) {
                    title = configWithTitleAndSameId.title;
                }
            }
            if (title) {
                if (!settingsGroup) {
                    settingsGroup = result.filter(function (g) { return g.title === title; })[0];
                    if (!settingsGroup) {
                        settingsGroup = { sections: [{ settings: [] }], id: config.id, title: title, titleRange: null, range: null };
                        result.push(settingsGroup);
                    }
                }
                else {
                    settingsGroup.sections[settingsGroup.sections.length - 1].title = title;
                }
            }
            if (config.properties) {
                if (!settingsGroup) {
                    settingsGroup = { sections: [{ settings: [] }], id: config.id, title: config.id, titleRange: null, range: null };
                    result.push(settingsGroup);
                }
                var configurationSettings = this.parseSettings(config.properties);
                if (configurationSettings.length) {
                    (_a = settingsGroup.sections[settingsGroup.sections.length - 1].settings).push.apply(_a, configurationSettings);
                }
            }
            if (config.allOf) {
                config.allOf.forEach(function (c) { return _this.parseConfig(c, result, configurations, settingsGroup); });
            }
            return result;
            var _a;
        };
        DefaultSettingsEditorModel.prototype.removeEmptySettingsGroups = function (settingsGroups) {
            var result = [];
            for (var _i = 0, settingsGroups_1 = settingsGroups; _i < settingsGroups_1.length; _i++) {
                var settingsGroup = settingsGroups_1[_i];
                settingsGroup.sections = settingsGroup.sections.filter(function (section) { return section.settings.length > 0; });
                if (settingsGroup.sections.length) {
                    result.push(settingsGroup);
                }
            }
            return result;
        };
        DefaultSettingsEditorModel.prototype.parseSettings = function (settingsObject) {
            var result = [];
            for (var key in settingsObject) {
                var prop = settingsObject[key];
                if (!prop.deprecationMessage && this.matchesScope(prop)) {
                    var value = prop.default;
                    var description = (prop.description || '').split('\n');
                    var overrides = configurationRegistry_1.OVERRIDE_PROPERTY_PATTERN.test(key) ? this.parseOverrideSettings(prop.default) : [];
                    result.push({ key: key, value: value, description: description, range: null, keyRange: null, valueRange: null, descriptionRanges: [], overrides: overrides });
                }
            }
            return result;
        };
        DefaultSettingsEditorModel.prototype.parseOverrideSettings = function (overrideSettings) {
            return Object.keys(overrideSettings).map(function (key) { return ({ key: key, value: overrideSettings[key], description: [], range: null, keyRange: null, valueRange: null, descriptionRanges: [], overrides: [] }); });
        };
        DefaultSettingsEditorModel.prototype.matchesScope = function (property) {
            if (this.configurationScope === configurationRegistry_1.ConfigurationScope.WINDOW) {
                return true;
            }
            return property.scope === this.configurationScope;
        };
        DefaultSettingsEditorModel.prototype.compareConfigurationNodes = function (c1, c2) {
            if (typeof c1.order !== 'number') {
                return 1;
            }
            if (typeof c2.order !== 'number') {
                return -1;
            }
            if (c1.order === c2.order) {
                var title1 = c1.title || '';
                var title2 = c2.title || '';
                return title1.localeCompare(title2);
            }
            return c1.order - c2.order;
        };
        DefaultSettingsEditorModel.prototype.toContent = function (mostCommonlyUsed, settingsGroups) {
            this._contentByLines = [];
            this._contentByLines.push('[');
            this.pushGroups([mostCommonlyUsed]);
            this._contentByLines.push(',');
            this.pushGroups(settingsGroups);
            this._contentByLines.push(']');
            return this._contentByLines.join('\n');
        };
        DefaultSettingsEditorModel.prototype.pushGroups = function (settingsGroups) {
            var lastSetting = null;
            this._contentByLines.push('{');
            this._contentByLines.push('');
            for (var _i = 0, settingsGroups_2 = settingsGroups; _i < settingsGroups_2.length; _i++) {
                var group = settingsGroups_2[_i];
                lastSetting = this.pushGroup(group);
            }
            if (lastSetting) {
                var content = this._contentByLines[lastSetting.range.endLineNumber - 2];
                this._contentByLines[lastSetting.range.endLineNumber - 2] = content.substring(0, content.length - 1);
            }
            this._contentByLines.push('}');
        };
        DefaultSettingsEditorModel.prototype.pushGroup = function (group) {
            var indent = '  ';
            var lastSetting = null;
            this._contentByLines.push('');
            var groupStart = this._contentByLines.length + 1;
            for (var _i = 0, _a = group.sections; _i < _a.length; _i++) {
                var section = _a[_i];
                if (section.title) {
                    var sectionTitleStart = this._contentByLines.length + 1;
                    this.addDescription([section.title], indent, this._contentByLines);
                    section.titleRange = { startLineNumber: sectionTitleStart, startColumn: 1, endLineNumber: this._contentByLines.length, endColumn: this._contentByLines[this._contentByLines.length - 1].length };
                }
                if (section.settings.length) {
                    for (var _b = 0, _c = section.settings; _b < _c.length; _b++) {
                        var setting = _c[_b];
                        this.pushSetting(setting, indent);
                        lastSetting = setting;
                    }
                }
                else {
                    this._contentByLines.push('// ' + nls.localize('noSettings', "No Settings"));
                    this._contentByLines.push('');
                }
            }
            group.range = { startLineNumber: groupStart, startColumn: 1, endLineNumber: this._contentByLines.length, endColumn: this._contentByLines[this._contentByLines.length - 1].length };
            return lastSetting;
        };
        DefaultSettingsEditorModel.prototype.pushSetting = function (setting, indent) {
            var settingStart = this._contentByLines.length + 1;
            setting.descriptionRanges = [];
            var descriptionPreValue = indent + '// ';
            for (var _i = 0, _a = setting.description; _i < _a.length; _i++) {
                var line = _a[_i];
                this._contentByLines.push(descriptionPreValue + line);
                setting.descriptionRanges.push({ startLineNumber: this._contentByLines.length, startColumn: this._contentByLines[this._contentByLines.length - 1].indexOf(line) + 1, endLineNumber: this._contentByLines.length, endColumn: this._contentByLines[this._contentByLines.length - 1].length });
            }
            var preValueConent = indent;
            var keyString = JSON.stringify(setting.key);
            preValueConent += keyString;
            setting.keyRange = { startLineNumber: this._contentByLines.length + 1, startColumn: preValueConent.indexOf(setting.key) + 1, endLineNumber: this._contentByLines.length + 1, endColumn: setting.key.length };
            preValueConent += ': ';
            var valueStart = this._contentByLines.length + 1;
            this.pushValue(setting, preValueConent, indent);
            setting.valueRange = { startLineNumber: valueStart, startColumn: preValueConent.length + 1, endLineNumber: this._contentByLines.length, endColumn: this._contentByLines[this._contentByLines.length - 1].length + 1 };
            this._contentByLines[this._contentByLines.length - 1] += ',';
            this._contentByLines.push('');
            setting.range = { startLineNumber: settingStart, startColumn: 1, endLineNumber: this._contentByLines.length, endColumn: this._contentByLines[this._contentByLines.length - 1].length };
        };
        DefaultSettingsEditorModel.prototype.pushValue = function (setting, preValueConent, indent) {
            var valueString = JSON.stringify(setting.value, null, indent);
            if (valueString && (typeof setting.value === 'object')) {
                if (setting.overrides.length) {
                    this._contentByLines.push(preValueConent + ' {');
                    for (var _i = 0, _a = setting.overrides; _i < _a.length; _i++) {
                        var subSetting = _a[_i];
                        this.pushSetting(subSetting, indent + indent);
                        this._contentByLines.pop();
                    }
                    var lastSetting = setting.overrides[setting.overrides.length - 1];
                    var content = this._contentByLines[lastSetting.range.endLineNumber - 2];
                    this._contentByLines[lastSetting.range.endLineNumber - 2] = content.substring(0, content.length - 1);
                    this._contentByLines.push(indent + '}');
                }
                else {
                    var mulitLineValue = valueString.split('\n');
                    this._contentByLines.push(preValueConent + mulitLineValue[0]);
                    for (var i = 1; i < mulitLineValue.length; i++) {
                        this._contentByLines.push(indent + mulitLineValue[i]);
                    }
                }
            }
            else {
                this._contentByLines.push(preValueConent + valueString);
            }
        };
        DefaultSettingsEditorModel.prototype.addDescription = function (description, indent, result) {
            for (var _i = 0, description_1 = description; _i < description_1.length; _i++) {
                var line = description_1[_i];
                result.push(indent + '// ' + line);
            }
        };
        DefaultSettingsEditorModel.prototype.findValueMatches = function (filter, setting) {
            return [];
        };
        DefaultSettingsEditorModel.prototype.dispose = function () {
            // Not disposable
        };
        return DefaultSettingsEditorModel;
    }(AbstractSettingsModel));
    exports.DefaultSettingsEditorModel = DefaultSettingsEditorModel;
    function defaultKeybindingsContents(keybindingService) {
        var defaultsHeader = '// ' + nls.localize('defaultKeybindingsHeader', "Overwrite key bindings by placing them into your key bindings file.");
        return defaultsHeader + '\n' + keybindingService.getDefaultKeybindingsContent();
    }
    exports.defaultKeybindingsContents = defaultKeybindingsContents;
    var DefaultKeybindingsEditorModel = (function () {
        function DefaultKeybindingsEditorModel(_uri, keybindingService) {
            this._uri = _uri;
            this.keybindingService = keybindingService;
        }
        Object.defineProperty(DefaultKeybindingsEditorModel.prototype, "uri", {
            get: function () {
                return this._uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DefaultKeybindingsEditorModel.prototype, "content", {
            get: function () {
                if (!this._content) {
                    this._content = defaultKeybindingsContents(this.keybindingService);
                }
                return this._content;
            },
            enumerable: true,
            configurable: true
        });
        DefaultKeybindingsEditorModel.prototype.getPreference = function () {
            return null;
        };
        DefaultKeybindingsEditorModel.prototype.dispose = function () {
            // Not disposable
        };
        DefaultKeybindingsEditorModel = __decorate([
            __param(1, keybinding_1.IKeybindingService)
        ], DefaultKeybindingsEditorModel);
        return DefaultKeybindingsEditorModel;
    }());
    exports.DefaultKeybindingsEditorModel = DefaultKeybindingsEditorModel;
});
//# sourceMappingURL=preferencesModels.js.map