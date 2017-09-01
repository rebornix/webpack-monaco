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
define(["require", "exports", "vs/base/common/event", "vs/editor/common/modes/languageSelector", "vs/base/common/platform", "vs/base/common/errors", "vs/platform/node/product", "vs/platform/node/package", "vs/workbench/api/node/extHostFileSystemEventService", "vs/workbench/api/node/extHostDocumentsAndEditors", "vs/workbench/api/node/extHostDocuments", "vs/workbench/api/node/extHostDocumentContentProviders", "vs/workbench/api/node/extHostDocumentSaveParticipant", "vs/workbench/api/node/extHostConfiguration", "vs/workbench/api/node/extHostDiagnostics", "vs/workbench/api/node/extHostTreeViews", "vs/workbench/api/node/extHostWorkspace", "vs/workbench/api/node/extHostQuickOpen", "vs/workbench/api/node/extHostProgress", "vs/workbench/api/node/extHostSCM", "vs/workbench/api/node/extHostHeapService", "vs/workbench/api/node/extHostStatusBar", "vs/workbench/api/node/extHostCommands", "vs/workbench/api/node/extHostOutputService", "vs/workbench/api/node/extHostTerminalService", "vs/workbench/api/node/extHostMessageService", "vs/workbench/api/node/extHostTextEditors", "vs/workbench/api/node/extHostLanguages", "vs/workbench/api/node/extHostLanguageFeatures", "vs/workbench/api/node/extHostApiCommands", "vs/workbench/api/node/extHostTask", "vs/workbench/api/node/extHostDebugService", "vs/workbench/api/node/extHostCredentials", "vs/workbench/api/node/extHostWindow", "vs/workbench/api/node/extHostTypes", "vs/base/common/uri", "vs/base/common/severity", "vs/editor/common/editorCommon", "vs/base/common/winjs.base", "vs/base/common/cancellation", "vs/base/common/paths", "./extHost.protocol", "vs/editor/common/modes/languageConfiguration", "vs/editor/common/config/editorOptions", "vs/workbench/api/node/extHostDialogs", "vs/base/common/htmlContent"], function (require, exports, event_1, languageSelector_1, Platform, errors, product_1, package_1, extHostFileSystemEventService_1, extHostDocumentsAndEditors_1, extHostDocuments_1, extHostDocumentContentProviders_1, extHostDocumentSaveParticipant_1, extHostConfiguration_1, extHostDiagnostics_1, extHostTreeViews_1, extHostWorkspace_1, extHostQuickOpen_1, extHostProgress_1, extHostSCM_1, extHostHeapService_1, extHostStatusBar_1, extHostCommands_1, extHostOutputService_1, extHostTerminalService_1, extHostMessageService_1, extHostTextEditors_1, extHostLanguages_1, extHostLanguageFeatures_1, extHostApiCommands_1, extHostTask_1, extHostDebugService_1, extHostCredentials_1, extHostWindow_1, extHostTypes, uri_1, severity_1, EditorCommon, winjs_base_1, cancellation_1, paths, extHost_protocol_1, languageConfiguration, editorOptions_1, extHostDialogs_1, htmlContent_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function proposedApiFunction(extension, fn) {
        if (extension.enableProposedApi) {
            return fn;
        }
        else {
            return (function () {
                throw new Error("[" + extension.id + "]: Proposed API is only available when running out of dev or with the following command line switch: --enable-proposed-api " + extension.id);
            });
        }
    }
    /**
     * This method instantiates and returns the extension API surface
     */
    function createApiFactory(initData, threadService, extensionService) {
        var mainThreadTelemetry = threadService.get(extHost_protocol_1.MainContext.MainThreadTelemetry);
        // Addressable instances
        var extHostHeapService = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostHeapService, new extHostHeapService_1.ExtHostHeapService());
        var extHostDocumentsAndEditors = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostDocumentsAndEditors, new extHostDocumentsAndEditors_1.ExtHostDocumentsAndEditors(threadService, extensionService));
        var extHostDocuments = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostDocuments, new extHostDocuments_1.ExtHostDocuments(threadService, extHostDocumentsAndEditors));
        var extHostDocumentContentProviders = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostDocumentContentProviders, new extHostDocumentContentProviders_1.ExtHostDocumentContentProvider(threadService, extHostDocumentsAndEditors));
        var extHostDocumentSaveParticipant = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostDocumentSaveParticipant, new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(extHostDocuments, threadService.get(extHost_protocol_1.MainContext.MainThreadWorkspace)));
        var extHostEditors = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostEditors, new extHostTextEditors_1.ExtHostEditors(threadService, extHostDocumentsAndEditors));
        var extHostCommands = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostCommands, new extHostCommands_1.ExtHostCommands(threadService, extHostHeapService));
        var extHostTreeViews = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostTreeViews, new extHostTreeViews_1.ExtHostTreeViews(threadService.get(extHost_protocol_1.MainContext.MainThreadTreeViews), extHostCommands));
        var extHostWorkspace = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostWorkspace, new extHostWorkspace_1.ExtHostWorkspace(threadService, initData.workspace));
        var extHostDebugService = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostDebugService, new extHostDebugService_1.ExtHostDebugService(threadService, extHostWorkspace));
        var extHostConfiguration = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostConfiguration, new extHostConfiguration_1.ExtHostConfiguration(threadService.get(extHost_protocol_1.MainContext.MainThreadConfiguration), extHostWorkspace, initData.configuration));
        var extHostDiagnostics = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostDiagnostics, new extHostDiagnostics_1.ExtHostDiagnostics(threadService));
        var languageFeatures = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostLanguageFeatures, new extHostLanguageFeatures_1.ExtHostLanguageFeatures(threadService, extHostDocuments, extHostCommands, extHostHeapService, extHostDiagnostics));
        var extHostFileSystemEvent = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostFileSystemEventService, new extHostFileSystemEventService_1.ExtHostFileSystemEventService());
        var extHostQuickOpen = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostQuickOpen, new extHostQuickOpen_1.ExtHostQuickOpen(threadService));
        var extHostTerminalService = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostTerminalService, new extHostTerminalService_1.ExtHostTerminalService(threadService));
        var extHostSCM = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostSCM, new extHostSCM_1.ExtHostSCM(threadService, extHostCommands));
        var extHostTask = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostTask, new extHostTask_1.ExtHostTask(threadService));
        var extHostCredentials = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostCredentials, new extHostCredentials_1.ExtHostCredentials(threadService));
        var extHostWindow = threadService.set(extHost_protocol_1.ExtHostContext.ExtHostWindow, new extHostWindow_1.ExtHostWindow(threadService));
        threadService.set(extHost_protocol_1.ExtHostContext.ExtHostExtensionService, extensionService);
        // Check that no named customers are missing
        var expected = Object.keys(extHost_protocol_1.ExtHostContext).map(function (key) { return extHost_protocol_1.ExtHostContext[key]; });
        threadService.assertRegistered(expected);
        // Other instances
        var extHostMessageService = new extHostMessageService_1.ExtHostMessageService(threadService);
        var extHostDialogs = new extHostDialogs_1.ExtHostDialogs(threadService);
        var extHostStatusBar = new extHostStatusBar_1.ExtHostStatusBar(threadService);
        var extHostProgress = new extHostProgress_1.ExtHostProgress(threadService.get(extHost_protocol_1.MainContext.MainThreadProgress));
        var extHostOutputService = new extHostOutputService_1.ExtHostOutputService(threadService);
        var extHostLanguages = new extHostLanguages_1.ExtHostLanguages(threadService);
        // Register API-ish commands
        extHostApiCommands_1.ExtHostApiCommands.register(extHostCommands);
        return function (extension) {
            var _this = this;
            if (extension.enableProposedApi && !extension.isBuiltin) {
                if (!initData.environment.enableProposedApiForAll &&
                    initData.environment.enableProposedApiFor.indexOf(extension.id) < 0) {
                    extension.enableProposedApi = false;
                    console.error("Extension '" + extension.id + " cannot use PROPOSED API (must started out of dev or enabled via --enable-proposed-api)");
                }
                else {
                    // proposed api is available when developing or when an extension was explicitly
                    // spelled out via a command line argument
                    console.warn("Extension '" + extension.id + "' uses PROPOSED API which is subject to change and removal without notice.");
                }
            }
            var apiUsage = new (function () {
                function class_1() {
                    this._seen = new Set();
                }
                class_1.prototype.publicLog = function (apiName) {
                    if (this._seen.has(apiName)) {
                        return undefined;
                    }
                    this._seen.add(apiName);
                    return mainThreadTelemetry.$publicLog('apiUsage', {
                        name: apiName,
                        extension: extension.id
                    });
                };
                return class_1;
            }());
            // namespace: commands
            var commands = {
                registerCommand: function (id, command, thisArgs) {
                    return extHostCommands.registerCommand(id, command, thisArgs);
                },
                registerTextEditorCommand: function (id, callback, thisArg) {
                    return extHostCommands.registerCommand(id, function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var activeTextEditor = extHostEditors.getActiveTextEditor();
                        if (!activeTextEditor) {
                            console.warn('Cannot execute ' + id + ' because there is no active text editor.');
                            return undefined;
                        }
                        return activeTextEditor.edit(function (edit) {
                            args.unshift(activeTextEditor, edit);
                            callback.apply(thisArg, args);
                        }).then(function (result) {
                            if (!result) {
                                console.warn('Edits from command ' + id + ' were not applied.');
                            }
                        }, function (err) {
                            console.warn('An error occurred while running command ' + id, err);
                        });
                    });
                },
                registerDiffInformationCommand: proposedApiFunction(extension, function (id, callback, thisArg) {
                    return extHostCommands.registerCommand(id, function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return __awaiter(_this, void 0, void 0, function () {
                            var activeTextEditor, diff;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        activeTextEditor = extHostEditors.getActiveTextEditor();
                                        if (!activeTextEditor) {
                                            console.warn('Cannot execute ' + id + ' because there is no active text editor.');
                                            return [2 /*return*/, undefined];
                                        }
                                        return [4 /*yield*/, extHostEditors.getDiffInformation(activeTextEditor.id)];
                                    case 1:
                                        diff = _a.sent();
                                        callback.apply(thisArg, [diff].concat(args));
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                }),
                executeCommand: function (id) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    return extHostCommands.executeCommand.apply(extHostCommands, [id].concat(args));
                },
                getCommands: function (filterInternal) {
                    if (filterInternal === void 0) { filterInternal = false; }
                    return extHostCommands.getCommands(filterInternal);
                }
            };
            // namespace: env
            var env = Object.freeze({
                get machineId() { return initData.telemetryInfo.machineId; },
                get sessionId() { return initData.telemetryInfo.sessionId; },
                get language() { return Platform.language; },
                get appName() { return product_1.default.nameLong; }
            });
            // namespace: extensions
            var extensions = {
                getExtension: function (extensionId) {
                    var desc = extensionService.getExtensionDescription(extensionId);
                    if (desc) {
                        return new Extension(extensionService, desc);
                    }
                    return undefined;
                },
                get all() {
                    return extensionService.getAllExtensionDescriptions().map(function (desc) { return new Extension(extensionService, desc); });
                }
            };
            // namespace: languages
            var languages = {
                createDiagnosticCollection: function (name) {
                    return extHostDiagnostics.createDiagnosticCollection(name);
                },
                getLanguages: function () {
                    return extHostLanguages.getLanguages();
                },
                match: function (selector, document) {
                    return languageSelector_1.score(selector, document.uri, document.languageId);
                },
                registerCodeActionsProvider: function (selector, provider) {
                    return languageFeatures.registerCodeActionProvider(selector, provider);
                },
                registerCodeLensProvider: function (selector, provider) {
                    return languageFeatures.registerCodeLensProvider(selector, provider);
                },
                registerDefinitionProvider: function (selector, provider) {
                    return languageFeatures.registerDefinitionProvider(selector, provider);
                },
                registerImplementationProvider: function (selector, provider) {
                    return languageFeatures.registerImplementationProvider(selector, provider);
                },
                registerTypeDefinitionProvider: function (selector, provider) {
                    return languageFeatures.registerTypeDefinitionProvider(selector, provider);
                },
                registerHoverProvider: function (selector, provider) {
                    return languageFeatures.registerHoverProvider(selector, provider, extension.id);
                },
                registerDocumentHighlightProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentHighlightProvider(selector, provider);
                },
                registerReferenceProvider: function (selector, provider) {
                    return languageFeatures.registerReferenceProvider(selector, provider);
                },
                registerRenameProvider: function (selector, provider) {
                    return languageFeatures.registerRenameProvider(selector, provider);
                },
                registerDocumentSymbolProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentSymbolProvider(selector, provider);
                },
                registerWorkspaceSymbolProvider: function (provider) {
                    return languageFeatures.registerWorkspaceSymbolProvider(provider);
                },
                registerDocumentFormattingEditProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentFormattingEditProvider(selector, provider);
                },
                registerDocumentRangeFormattingEditProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentRangeFormattingEditProvider(selector, provider);
                },
                registerOnTypeFormattingEditProvider: function (selector, provider, firstTriggerCharacter) {
                    var moreTriggerCharacters = [];
                    for (var _i = 3; _i < arguments.length; _i++) {
                        moreTriggerCharacters[_i - 3] = arguments[_i];
                    }
                    return languageFeatures.registerOnTypeFormattingEditProvider(selector, provider, [firstTriggerCharacter].concat(moreTriggerCharacters));
                },
                registerSignatureHelpProvider: function (selector, provider) {
                    var triggerCharacters = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        triggerCharacters[_i - 2] = arguments[_i];
                    }
                    return languageFeatures.registerSignatureHelpProvider(selector, provider, triggerCharacters);
                },
                registerCompletionItemProvider: function (selector, provider) {
                    var triggerCharacters = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        triggerCharacters[_i - 2] = arguments[_i];
                    }
                    return languageFeatures.registerCompletionItemProvider(selector, provider, triggerCharacters);
                },
                registerDocumentLinkProvider: function (selector, provider) {
                    return languageFeatures.registerDocumentLinkProvider(selector, provider);
                },
                setLanguageConfiguration: function (language, configuration) {
                    return languageFeatures.setLanguageConfiguration(language, configuration);
                },
                // proposed API
                registerColorProvider: proposedApiFunction(extension, function (selector, provider) {
                    return languageFeatures.registerColorProvider(selector, provider);
                })
            };
            // namespace: window
            var window = {
                get activeTextEditor() {
                    return extHostEditors.getActiveTextEditor();
                },
                get visibleTextEditors() {
                    return extHostEditors.getVisibleTextEditors();
                },
                showTextDocument: function (documentOrUri, columnOrOptions, preserveFocus) {
                    var documentPromise;
                    if (uri_1.default.isUri(documentOrUri)) {
                        documentPromise = winjs_base_1.TPromise.wrap(workspace.openTextDocument(documentOrUri));
                    }
                    else {
                        documentPromise = winjs_base_1.TPromise.wrap(documentOrUri);
                    }
                    return documentPromise.then(function (document) {
                        return extHostEditors.showTextDocument(document, columnOrOptions, preserveFocus);
                    });
                },
                createTextEditorDecorationType: function (options) {
                    return extHostEditors.createTextEditorDecorationType(options);
                },
                onDidChangeActiveTextEditor: function (listener, thisArg, disposables) {
                    return extHostEditors.onDidChangeActiveTextEditor(listener, thisArg, disposables);
                },
                onDidChangeVisibleTextEditors: function (listener, thisArg, disposables) {
                    return extHostEditors.onDidChangeVisibleTextEditors(listener, thisArg, disposables);
                },
                onDidChangeTextEditorSelection: function (listener, thisArgs, disposables) {
                    return extHostEditors.onDidChangeTextEditorSelection(listener, thisArgs, disposables);
                },
                onDidChangeTextEditorOptions: function (listener, thisArgs, disposables) {
                    return extHostEditors.onDidChangeTextEditorOptions(listener, thisArgs, disposables);
                },
                onDidChangeTextEditorViewColumn: function (listener, thisArg, disposables) {
                    return extHostEditors.onDidChangeTextEditorViewColumn(listener, thisArg, disposables);
                },
                onDidCloseTerminal: function (listener, thisArg, disposables) {
                    return extHostTerminalService.onDidCloseTerminal(listener, thisArg, disposables);
                },
                get state() {
                    return extHostWindow.state;
                },
                onDidChangeWindowState: proposedApiFunction(extension, function (listener, thisArg, disposables) {
                    return extHostWindow.onDidChangeWindowState(listener, thisArg, disposables);
                }),
                showInformationMessage: function (message, first) {
                    var rest = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        rest[_i - 2] = arguments[_i];
                    }
                    return extHostMessageService.showMessage(extension, severity_1.default.Info, message, first, rest);
                },
                showWarningMessage: function (message, first) {
                    var rest = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        rest[_i - 2] = arguments[_i];
                    }
                    return extHostMessageService.showMessage(extension, severity_1.default.Warning, message, first, rest);
                },
                showErrorMessage: function (message, first) {
                    var rest = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        rest[_i - 2] = arguments[_i];
                    }
                    return extHostMessageService.showMessage(extension, severity_1.default.Error, message, first, rest);
                },
                showQuickPick: function (items, options, token) {
                    return extHostQuickOpen.showQuickPick(items, options, token);
                },
                showInputBox: function (options, token) {
                    return extHostQuickOpen.showInput(options, token);
                },
                createStatusBarItem: function (position, priority) {
                    return extHostStatusBar.createStatusBarEntry(extension.id, position, priority);
                },
                setStatusBarMessage: function (text, timeoutOrThenable) {
                    return extHostStatusBar.setStatusBarMessage(text, timeoutOrThenable);
                },
                withScmProgress: function (task) {
                    console.warn("[Deprecation Warning] function 'withScmProgress' is deprecated and should no longer be used. Use 'withProgress' instead.");
                    return extHostProgress.withProgress(extension, { location: extHostTypes.ProgressLocation.SourceControl }, function (progress, token) { return task({ report: function (n) { } }); });
                },
                withProgress: function (options, task) {
                    return extHostProgress.withProgress(extension, options, task);
                },
                createOutputChannel: function (name) {
                    return extHostOutputService.createOutputChannel(name);
                },
                createTerminal: function (nameOrOptions, shellPath, shellArgs) {
                    if (typeof nameOrOptions === 'object') {
                        return extHostTerminalService.createTerminalFromOptions(nameOrOptions);
                    }
                    return extHostTerminalService.createTerminal(nameOrOptions, shellPath, shellArgs);
                },
                registerTreeDataProvider: function (viewId, treeDataProvider) {
                    return extHostTreeViews.registerTreeDataProvider(viewId, treeDataProvider);
                },
                // proposed API
                sampleFunction: proposedApiFunction(extension, function () {
                    return extHostMessageService.showMessage(extension, severity_1.default.Info, 'Hello Proposed Api!', {}, []);
                }),
                showOpenDialog: proposedApiFunction(extension, function (options) {
                    return extHostDialogs.showOpenDialog(options);
                })
            };
            // namespace: workspace
            var workspace = {
                get rootPath() {
                    apiUsage.publicLog('workspace#rootPath');
                    return extHostWorkspace.getPath();
                },
                set rootPath(value) {
                    throw errors.readonly();
                },
                getWorkspaceFolder: function (resource) {
                    return extHostWorkspace.getWorkspaceFolder(resource);
                },
                get workspaceFolders() {
                    apiUsage.publicLog('workspace#workspaceFolders');
                    return extHostWorkspace.getWorkspaceFolders();
                },
                onDidChangeWorkspaceFolders: function (listener, thisArgs, disposables) {
                    apiUsage.publicLog('workspace#onDidChangeWorkspaceFolders');
                    return extHostWorkspace.onDidChangeWorkspace(listener, thisArgs, disposables);
                },
                asRelativePath: function (pathOrUri, includeWorkspace) {
                    return extHostWorkspace.getRelativePath(pathOrUri, includeWorkspace);
                },
                findFiles: function (include, exclude, maxResults, token) {
                    return extHostWorkspace.findFiles(include, exclude, maxResults, token);
                },
                saveAll: function (includeUntitled) {
                    return extHostWorkspace.saveAll(includeUntitled);
                },
                applyEdit: function (edit) {
                    return extHostWorkspace.appyEdit(edit);
                },
                createFileSystemWatcher: function (pattern, ignoreCreate, ignoreChange, ignoreDelete) {
                    return extHostFileSystemEvent.createFileSystemWatcher(pattern, ignoreCreate, ignoreChange, ignoreDelete);
                },
                get textDocuments() {
                    return extHostDocuments.getAllDocumentData().map(function (data) { return data.document; });
                },
                set textDocuments(value) {
                    throw errors.readonly();
                },
                openTextDocument: function (uriOrFileNameOrOptions) {
                    var uriPromise;
                    var options = uriOrFileNameOrOptions;
                    if (!options || typeof options.language === 'string') {
                        uriPromise = extHostDocuments.createDocumentData(options);
                    }
                    else if (typeof uriOrFileNameOrOptions === 'string') {
                        uriPromise = winjs_base_1.TPromise.as(uri_1.default.file(uriOrFileNameOrOptions));
                    }
                    else if (uriOrFileNameOrOptions instanceof uri_1.default) {
                        uriPromise = winjs_base_1.TPromise.as(uriOrFileNameOrOptions);
                    }
                    else {
                        throw new Error('illegal argument - uriOrFileNameOrOptions');
                    }
                    return uriPromise.then(function (uri) {
                        return extHostDocuments.ensureDocumentData(uri).then(function () {
                            var data = extHostDocuments.getDocumentData(uri);
                            return data && data.document;
                        });
                    });
                },
                onDidOpenTextDocument: function (listener, thisArgs, disposables) {
                    return extHostDocuments.onDidAddDocument(listener, thisArgs, disposables);
                },
                onDidCloseTextDocument: function (listener, thisArgs, disposables) {
                    return extHostDocuments.onDidRemoveDocument(listener, thisArgs, disposables);
                },
                onDidChangeTextDocument: function (listener, thisArgs, disposables) {
                    return extHostDocuments.onDidChangeDocument(listener, thisArgs, disposables);
                },
                onDidSaveTextDocument: function (listener, thisArgs, disposables) {
                    return extHostDocuments.onDidSaveDocument(listener, thisArgs, disposables);
                },
                onWillSaveTextDocument: function (listener, thisArgs, disposables) {
                    return extHostDocumentSaveParticipant.onWillSaveTextDocumentEvent(listener, thisArgs, disposables);
                },
                onDidChangeConfiguration: function (listener, thisArgs, disposables) {
                    return extHostConfiguration.onDidChangeConfiguration(listener, thisArgs, disposables);
                },
                getConfiguration: function (section, resource) {
                    return extHostConfiguration.getConfiguration(section, resource);
                },
                registerTextDocumentContentProvider: function (scheme, provider) {
                    return extHostDocumentContentProviders.registerTextDocumentContentProvider(scheme, provider);
                },
                registerTaskProvider: function (type, provider) {
                    return extHostTask.registerTaskProvider(extension, provider);
                },
                registerFileSystemProvider: proposedApiFunction(extension, function (authority, provider) {
                    return extHostWorkspace.registerFileSystemProvider(authority, provider);
                })
            };
            // namespace: scm
            var scm = {
                get inputBox() {
                    return extHostSCM.getLastInputBox(extension);
                },
                createSourceControl: function (id, label) {
                    mainThreadTelemetry.$publicLog('registerSCMProvider', {
                        extensionId: extension.id,
                        providerId: id,
                        providerLabel: label
                    });
                    return extHostSCM.createSourceControl(extension, id, label);
                }
            };
            // namespace: debug
            var debug = {
                get activeDebugSession() {
                    return extHostDebugService.activeDebugSession;
                },
                startDebugging: function (folder, nameOrConfig) {
                    return extHostDebugService.startDebugging(folder, nameOrConfig);
                },
                onDidStartDebugSession: function (listener, thisArg, disposables) {
                    return extHostDebugService.onDidStartDebugSession(listener, thisArg, disposables);
                },
                onDidTerminateDebugSession: function (listener, thisArg, disposables) {
                    return extHostDebugService.onDidTerminateDebugSession(listener, thisArg, disposables);
                },
                onDidChangeActiveDebugSession: function (listener, thisArg, disposables) {
                    return extHostDebugService.onDidChangeActiveDebugSession(listener, thisArg, disposables);
                },
                onDidReceiveDebugSessionCustomEvent: function (listener, thisArg, disposables) {
                    return extHostDebugService.onDidReceiveDebugSessionCustomEvent(listener, thisArg, disposables);
                },
                registerDebugConfigurationProvider: proposedApiFunction(extension, function (debugType, provider) {
                    return extHostDebugService.registerDebugConfigurationProvider(debugType, provider);
                }),
            };
            // namespace: credentials
            var credentials = {
                readSecret: function (service, account) {
                    return extHostCredentials.readSecret(service, account);
                },
                writeSecret: function (service, account, secret) {
                    return extHostCredentials.writeSecret(service, account, secret);
                },
                deleteSecret: function (service, account) {
                    return extHostCredentials.deleteSecret(service, account);
                }
            };
            var api = {
                version: package_1.default.version,
                // namespaces
                commands: commands,
                env: env,
                extensions: extensions,
                languages: languages,
                window: window,
                workspace: workspace,
                scm: scm,
                debug: debug,
                // types
                CancellationTokenSource: cancellation_1.CancellationTokenSource,
                CodeLens: extHostTypes.CodeLens,
                Color: extHostTypes.Color,
                ColorRange: extHostTypes.ColorRange,
                EndOfLine: extHostTypes.EndOfLine,
                CompletionItem: extHostTypes.CompletionItem,
                CompletionItemKind: extHostTypes.CompletionItemKind,
                CompletionList: extHostTypes.CompletionList,
                Diagnostic: extHostTypes.Diagnostic,
                DiagnosticSeverity: extHostTypes.DiagnosticSeverity,
                Disposable: extHostTypes.Disposable,
                DocumentHighlight: extHostTypes.DocumentHighlight,
                DocumentHighlightKind: extHostTypes.DocumentHighlightKind,
                DocumentLink: extHostTypes.DocumentLink,
                EventEmitter: event_1.Emitter,
                Hover: extHostTypes.Hover,
                IndentAction: languageConfiguration.IndentAction,
                Location: extHostTypes.Location,
                MarkdownString: htmlContent_1.MarkdownString,
                OverviewRulerLane: EditorCommon.OverviewRulerLane,
                ParameterInformation: extHostTypes.ParameterInformation,
                Position: extHostTypes.Position,
                Range: extHostTypes.Range,
                Selection: extHostTypes.Selection,
                SignatureHelp: extHostTypes.SignatureHelp,
                SignatureInformation: extHostTypes.SignatureInformation,
                SnippetString: extHostTypes.SnippetString,
                StatusBarAlignment: extHostTypes.StatusBarAlignment,
                SymbolInformation: extHostTypes.SymbolInformation,
                SymbolKind: extHostTypes.SymbolKind,
                TextDocumentSaveReason: extHostTypes.TextDocumentSaveReason,
                TextEdit: extHostTypes.TextEdit,
                TextEditorCursorStyle: editorOptions_1.TextEditorCursorStyle,
                TextEditorLineNumbersStyle: extHostTypes.TextEditorLineNumbersStyle,
                TextEditorRevealType: extHostTypes.TextEditorRevealType,
                TextEditorSelectionChangeKind: extHostTypes.TextEditorSelectionChangeKind,
                DecorationRangeBehavior: extHostTypes.DecorationRangeBehavior,
                Uri: uri_1.default,
                ViewColumn: extHostTypes.ViewColumn,
                WorkspaceEdit: extHostTypes.WorkspaceEdit,
                ProgressLocation: extHostTypes.ProgressLocation,
                TreeItemCollapsibleState: extHostTypes.TreeItemCollapsibleState,
                TreeItem: extHostTypes.TreeItem,
                ThemeColor: extHostTypes.ThemeColor,
                // functions
                TaskRevealKind: extHostTypes.TaskRevealKind,
                TaskPanelKind: extHostTypes.TaskPanelKind,
                TaskGroup: extHostTypes.TaskGroup,
                ProcessExecution: extHostTypes.ProcessExecution,
                ShellExecution: extHostTypes.ShellExecution,
                Task: extHostTypes.Task,
                ConfigurationTarget: extHostTypes.ConfigurationTarget
            };
            if (extension.enableProposedApi && extension.isBuiltin) {
                api['credentials'] = credentials;
            }
            return api;
        };
    }
    exports.createApiFactory = createApiFactory;
    var Extension = (function () {
        function Extension(extensionService, description) {
            this._extensionService = extensionService;
            this.id = description.id;
            this.extensionPath = paths.normalize(description.extensionFolderPath, true);
            this.packageJSON = description;
        }
        Object.defineProperty(Extension.prototype, "isActive", {
            get: function () {
                return this._extensionService.isActivated(this.id);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Extension.prototype, "exports", {
            get: function () {
                return this._extensionService.getExtensionExports(this.id);
            },
            enumerable: true,
            configurable: true
        });
        Extension.prototype.activate = function () {
            var _this = this;
            return this._extensionService.activateById(this.id, false).then(function () { return _this.exports; });
        };
        return Extension;
    }());
    function initializeExtensionApi(extensionService, apiFactory) {
        return extensionService.getExtensionPathIndex().then(function (trie) { return defineAPI(apiFactory, trie); });
    }
    exports.initializeExtensionApi = initializeExtensionApi;
    function defineAPI(factory, extensionPaths) {
        // each extension is meant to get its own api implementation
        var extApiImpl = new Map();
        var defaultApiImpl;
        var node_module = require.__$__nodeRequire('module');
        var original = node_module._load;
        node_module._load = function load(request, parent, isMain) {
            if (request !== 'vscode') {
                return original.apply(this, arguments);
            }
            // get extension id from filename and api for extension
            var ext = extensionPaths.findSubstr(parent.filename);
            if (ext) {
                var apiImpl = extApiImpl.get(ext.id);
                if (!apiImpl) {
                    apiImpl = factory(ext);
                    extApiImpl.set(ext.id, apiImpl);
                }
                return apiImpl;
            }
            // fall back to a default implementation
            if (!defaultApiImpl) {
                defaultApiImpl = factory(nullExtensionDescription);
            }
            return defaultApiImpl;
        };
    }
    var nullExtensionDescription = {
        id: 'nullExtensionDescription',
        name: 'Null Extension Description',
        publisher: 'vscode',
        activationEvents: undefined,
        contributes: undefined,
        enableProposedApi: false,
        engines: undefined,
        extensionDependencies: undefined,
        extensionFolderPath: undefined,
        isBuiltin: false,
        main: undefined,
        version: undefined
    };
});
//# sourceMappingURL=extHost.api.impl.js.map