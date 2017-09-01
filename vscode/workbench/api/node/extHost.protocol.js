define(["require", "exports", "vs/workbench/services/thread/common/threadService"], function (require, exports, threadService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TextEditorRevealType;
    (function (TextEditorRevealType) {
        TextEditorRevealType[TextEditorRevealType["Default"] = 0] = "Default";
        TextEditorRevealType[TextEditorRevealType["InCenter"] = 1] = "InCenter";
        TextEditorRevealType[TextEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
        TextEditorRevealType[TextEditorRevealType["AtTop"] = 3] = "AtTop";
    })(TextEditorRevealType = exports.TextEditorRevealType || (exports.TextEditorRevealType = {}));
    var ObjectIdentifier;
    (function (ObjectIdentifier) {
        ObjectIdentifier.name = '$ident';
        function mixin(obj, id) {
            Object.defineProperty(obj, ObjectIdentifier.name, { value: id, enumerable: true });
            return obj;
        }
        ObjectIdentifier.mixin = mixin;
        function of(obj) {
            return obj[ObjectIdentifier.name];
        }
        ObjectIdentifier.of = of;
    })(ObjectIdentifier = exports.ObjectIdentifier || (exports.ObjectIdentifier = {}));
    // --- proxy identifiers
    exports.MainContext = {
        MainThreadCommands: threadService_1.createMainContextProxyIdentifier('MainThreadCommands'),
        MainThreadConfiguration: threadService_1.createMainContextProxyIdentifier('MainThreadConfiguration'),
        MainThreadDebugService: threadService_1.createMainContextProxyIdentifier('MainThreadDebugService'),
        MainThreadDiagnostics: threadService_1.createMainContextProxyIdentifier('MainThreadDiagnostics'),
        MainThreadDialogs: threadService_1.createMainContextProxyIdentifier('MainThreadDiaglogs'),
        MainThreadDocuments: threadService_1.createMainContextProxyIdentifier('MainThreadDocuments'),
        MainThreadDocumentContentProviders: threadService_1.createMainContextProxyIdentifier('MainThreadDocumentContentProviders'),
        MainThreadEditors: threadService_1.createMainContextProxyIdentifier('MainThreadEditors'),
        MainThreadErrors: threadService_1.createMainContextProxyIdentifier('MainThreadErrors'),
        MainThreadTreeViews: threadService_1.createMainContextProxyIdentifier('MainThreadTreeViews'),
        MainThreadLanguageFeatures: threadService_1.createMainContextProxyIdentifier('MainThreadLanguageFeatures'),
        MainThreadLanguages: threadService_1.createMainContextProxyIdentifier('MainThreadLanguages'),
        MainThreadMessageService: threadService_1.createMainContextProxyIdentifier('MainThreadMessageService'),
        MainThreadOutputService: threadService_1.createMainContextProxyIdentifier('MainThreadOutputService'),
        MainThreadProgress: threadService_1.createMainContextProxyIdentifier('MainThreadProgress'),
        MainThreadQuickOpen: threadService_1.createMainContextProxyIdentifier('MainThreadQuickOpen'),
        MainThreadStatusBar: threadService_1.createMainContextProxyIdentifier('MainThreadStatusBar'),
        MainThreadStorage: threadService_1.createMainContextProxyIdentifier('MainThreadStorage'),
        MainThreadTelemetry: threadService_1.createMainContextProxyIdentifier('MainThreadTelemetry'),
        MainThreadTerminalService: threadService_1.createMainContextProxyIdentifier('MainThreadTerminalService'),
        MainThreadWorkspace: threadService_1.createMainContextProxyIdentifier('MainThreadWorkspace'),
        MainThreadExtensionService: threadService_1.createMainContextProxyIdentifier('MainThreadExtensionService'),
        MainThreadSCM: threadService_1.createMainContextProxyIdentifier('MainThreadSCM'),
        MainThreadTask: threadService_1.createMainContextProxyIdentifier('MainThreadTask'),
        MainThreadCredentials: threadService_1.createMainContextProxyIdentifier('MainThreadCredentials'),
        MainThreadWindow: threadService_1.createMainContextProxyIdentifier('MainThreadWindow'),
    };
    exports.ExtHostContext = {
        ExtHostCommands: threadService_1.createExtHostContextProxyIdentifier('ExtHostCommands'),
        ExtHostConfiguration: threadService_1.createExtHostContextProxyIdentifier('ExtHostConfiguration'),
        ExtHostDiagnostics: threadService_1.createExtHostContextProxyIdentifier('ExtHostDiagnostics'),
        ExtHostDebugService: threadService_1.createExtHostContextProxyIdentifier('ExtHostDebugService'),
        ExtHostDocumentsAndEditors: threadService_1.createExtHostContextProxyIdentifier('ExtHostDocumentsAndEditors'),
        ExtHostDocuments: threadService_1.createExtHostContextProxyIdentifier('ExtHostDocuments'),
        ExtHostDocumentContentProviders: threadService_1.createExtHostContextProxyIdentifier('ExtHostDocumentContentProviders'),
        ExtHostDocumentSaveParticipant: threadService_1.createExtHostContextProxyIdentifier('ExtHostDocumentSaveParticipant'),
        ExtHostEditors: threadService_1.createExtHostContextProxyIdentifier('ExtHostEditors'),
        ExtHostTreeViews: threadService_1.createExtHostContextProxyIdentifier('ExtHostTreeViews'),
        ExtHostFileSystemEventService: threadService_1.createExtHostContextProxyIdentifier('ExtHostFileSystemEventService'),
        ExtHostHeapService: threadService_1.createExtHostContextProxyIdentifier('ExtHostHeapMonitor'),
        ExtHostLanguageFeatures: threadService_1.createExtHostContextProxyIdentifier('ExtHostLanguageFeatures'),
        ExtHostQuickOpen: threadService_1.createExtHostContextProxyIdentifier('ExtHostQuickOpen'),
        ExtHostExtensionService: threadService_1.createExtHostContextProxyIdentifier('ExtHostExtensionService'),
        ExtHostTerminalService: threadService_1.createExtHostContextProxyIdentifier('ExtHostTerminalService'),
        ExtHostSCM: threadService_1.createExtHostContextProxyIdentifier('ExtHostSCM'),
        ExtHostTask: threadService_1.createExtHostContextProxyIdentifier('ExtHostTask'),
        ExtHostWorkspace: threadService_1.createExtHostContextProxyIdentifier('ExtHostWorkspace'),
        ExtHostCredentials: threadService_1.createExtHostContextProxyIdentifier('ExtHostCredentials'),
        ExtHostWindow: threadService_1.createExtHostContextProxyIdentifier('ExtHostWindow'),
    };
});
//# sourceMappingURL=extHost.protocol.js.map