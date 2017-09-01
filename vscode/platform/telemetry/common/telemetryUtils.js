define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/mime", "vs/base/common/paths", "vs/platform/configuration/common/configuration", "vs/platform/keybinding/common/keybinding", "vs/platform/lifecycle/common/lifecycle"], function (require, exports, winjs_base_1, mime_1, paths, configuration_1, keybinding_1, lifecycle_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NullTelemetryService = {
        _serviceBrand: undefined,
        publicLog: function (eventName, data) {
            return winjs_base_1.TPromise.as(null);
        },
        isOptedIn: true,
        getTelemetryInfo: function () {
            return winjs_base_1.TPromise.as({
                instanceId: 'someValue.instanceId',
                sessionId: 'someValue.sessionId',
                machineId: 'someValue.machineId'
            });
        }
    };
    function combinedAppender() {
        var appenders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            appenders[_i] = arguments[_i];
        }
        return { log: function (e, d) { return appenders.forEach(function (a) { return a.log(e, d); }); } };
    }
    exports.combinedAppender = combinedAppender;
    exports.NullAppender = { log: function () { return null; } };
    // --- util
    function anonymize(input) {
        if (!input) {
            return input;
        }
        var r = '';
        for (var i = 0; i < input.length; i++) {
            var ch = input[i];
            if (ch >= '0' && ch <= '9') {
                r += '0';
                continue;
            }
            if (ch >= 'a' && ch <= 'z') {
                r += 'a';
                continue;
            }
            if (ch >= 'A' && ch <= 'Z') {
                r += 'A';
                continue;
            }
            r += ch;
        }
        return r;
    }
    exports.anonymize = anonymize;
    function telemetryURIDescriptor(uri) {
        var fsPath = uri && uri.fsPath;
        return fsPath ? { mimeType: mime_1.guessMimeTypes(fsPath).join(', '), ext: paths.extname(fsPath), path: anonymize(fsPath) } : {};
    }
    exports.telemetryURIDescriptor = telemetryURIDescriptor;
    /**
     * Only add settings that cannot contain any personal/private information of users (PII).
     */
    var configurationValueWhitelist = [
        'editor.tabCompletion',
        'editor.fontFamily',
        'editor.fontWeight',
        'editor.fontSize',
        'editor.lineHeight',
        'editor.letterSpacing',
        'editor.lineNumbers',
        'editor.rulers',
        'editor.wordSeparators',
        'editor.tabSize',
        'editor.insertSpaces',
        'editor.detectIndentation',
        'editor.roundedSelection',
        'editor.scrollBeyondLastLine',
        'editor.minimap.enabled',
        'editor.minimap.renderCharacters',
        'editor.minimap.maxColumn',
        'editor.find.seedSearchStringFromSelection',
        'editor.find.autoFindInSelection',
        'editor.wordWrap',
        'editor.wordWrapColumn',
        'editor.wrappingIndent',
        'editor.mouseWheelScrollSensitivity',
        'editor.multiCursorModifier',
        'editor.quickSuggestions',
        'editor.quickSuggestionsDelay',
        'editor.parameterHints',
        'editor.autoClosingBrackets',
        'editor.autoIndent',
        'editor.formatOnType',
        'editor.formatOnPaste',
        'editor.suggestOnTriggerCharacters',
        'editor.acceptSuggestionOnEnter',
        'editor.acceptSuggestionOnCommitCharacter',
        'editor.snippetSuggestions',
        'editor.emptySelectionClipboard',
        'editor.wordBasedSuggestions',
        'editor.suggestFontSize',
        'editor.suggestLineHeight',
        'editor.selectionHighlight',
        'editor.occurrencesHighlight',
        'editor.overviewRulerLanes',
        'editor.overviewRulerBorder',
        'editor.cursorBlinking',
        'editor.cursorStyle',
        'editor.mouseWheelZoom',
        'editor.fontLigatures',
        'editor.hideCursorInOverviewRuler',
        'editor.renderWhitespace',
        'editor.renderControlCharacters',
        'editor.renderIndentGuides',
        'editor.renderLineHighlight',
        'editor.codeLens',
        'editor.folding',
        'editor.showFoldingControls',
        'editor.matchBrackets',
        'editor.glyphMargin',
        'editor.useTabStops',
        'editor.trimAutoWhitespace',
        'editor.stablePeek',
        'editor.dragAndDrop',
        'editor.formatOnSave',
        'editor.colorDecorators',
        'window.zoomLevel',
        'files.autoSave',
        'files.hotExit',
        'files.associations',
        'workbench.statusBar.visible',
        'files.trimTrailingWhitespace',
        'git.confirmSync',
        'workbench.sideBar.location',
        'window.openFilesInNewWindow',
        'javascript.validate.enable',
        'window.reopenFolders',
        'window.restoreWindows',
        'extensions.autoUpdate',
        'files.eol',
        'explorer.openEditors.visible',
        'workbench.editor.enablePreview',
        'files.autoSaveDelay',
        'workbench.editor.showTabs',
        'files.encoding',
        'files.autoGuessEncoding',
        'git.enabled',
        'http.proxyStrictSSL',
        'terminal.integrated.fontFamily',
        'workbench.editor.enablePreviewFromQuickOpen',
        'workbench.editor.swipeToNavigate',
        'php.builtInCompletions.enable',
        'php.validate.enable',
        'php.validate.run',
        'workbench.welcome.enabled',
        'workbench.startupEditor',
    ];
    function configurationTelemetry(telemetryService, configurationService) {
        return configurationService.onDidUpdateConfiguration(function (event) {
            if (event.source !== configuration_1.ConfigurationSource.Default) {
                telemetryService.publicLog('updateConfiguration', {
                    configurationSource: configuration_1.ConfigurationSource[event.source],
                    configurationKeys: flattenKeys(event.sourceConfig)
                });
                telemetryService.publicLog('updateConfigurationValues', {
                    configurationSource: configuration_1.ConfigurationSource[event.source],
                    configurationValues: flattenValues(event.sourceConfig, configurationValueWhitelist)
                });
            }
        });
    }
    exports.configurationTelemetry = configurationTelemetry;
    function lifecycleTelemetry(telemetryService, lifecycleService) {
        return lifecycleService.onShutdown(function (event) {
            telemetryService.publicLog('shutdown', { reason: lifecycle_1.ShutdownReason[event] });
        });
    }
    exports.lifecycleTelemetry = lifecycleTelemetry;
    function keybindingsTelemetry(telemetryService, keybindingService) {
        return keybindingService.onDidUpdateKeybindings(function (event) {
            if (event.source === keybinding_1.KeybindingSource.User && event.keybindings) {
                telemetryService.publicLog('updateKeybindings', {
                    bindings: event.keybindings.map(function (binding) { return ({
                        key: binding.key,
                        command: binding.command,
                        when: binding.when,
                        args: binding.args ? true : undefined
                    }); })
                });
            }
        });
    }
    exports.keybindingsTelemetry = keybindingsTelemetry;
    function flattenKeys(value) {
        if (!value) {
            return [];
        }
        var result = [];
        flatKeys(result, '', value);
        return result;
    }
    function flatKeys(result, prefix, value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.keys(value)
                .forEach(function (key) { return flatKeys(result, prefix ? prefix + "." + key : key, value[key]); });
        }
        else {
            result.push(prefix);
        }
    }
    function flattenValues(value, keys) {
        if (!value) {
            return [];
        }
        return keys.reduce(function (array, key) {
            var v = key.split('.')
                .reduce(function (tmp, k) { return tmp && typeof tmp === 'object' ? tmp[k] : undefined; }, value);
            if (typeof v !== 'undefined') {
                array.push((_a = {}, _a[key] = v, _a));
            }
            return array;
            var _a;
        }, []);
    }
});
//# sourceMappingURL=telemetryUtils.js.map