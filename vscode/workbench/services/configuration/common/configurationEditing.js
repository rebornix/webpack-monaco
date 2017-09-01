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
define(["require", "exports", "vs/platform/instantiation/common/instantiation"], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IConfigurationEditingService = instantiation_1.createDecorator('configurationEditingService');
    var ConfigurationEditingErrorCode;
    (function (ConfigurationEditingErrorCode) {
        /**
         * Error when trying to write a configuration key that is not registered.
         */
        ConfigurationEditingErrorCode[ConfigurationEditingErrorCode["ERROR_UNKNOWN_KEY"] = 0] = "ERROR_UNKNOWN_KEY";
        /**
         * Error when trying to write an invalid folder configuration key to folder settings.
         */
        ConfigurationEditingErrorCode[ConfigurationEditingErrorCode["ERROR_INVALID_FOLDER_CONFIGURATION"] = 1] = "ERROR_INVALID_FOLDER_CONFIGURATION";
        /**
         * Error when trying to write to user target but not supported for provided key.
         */
        ConfigurationEditingErrorCode[ConfigurationEditingErrorCode["ERROR_INVALID_USER_TARGET"] = 2] = "ERROR_INVALID_USER_TARGET";
        /**
         * Error when trying to write a configuration key to folder target
         */
        ConfigurationEditingErrorCode[ConfigurationEditingErrorCode["ERROR_INVALID_FOLDER_TARGET"] = 3] = "ERROR_INVALID_FOLDER_TARGET";
        /**
         * Error when trying to write to the workspace configuration without having a workspace opened.
         */
        ConfigurationEditingErrorCode[ConfigurationEditingErrorCode["ERROR_NO_WORKSPACE_OPENED"] = 4] = "ERROR_NO_WORKSPACE_OPENED";
        /**
         * Error when trying to write and save to the configuration file while it is dirty in the editor.
         */
        ConfigurationEditingErrorCode[ConfigurationEditingErrorCode["ERROR_CONFIGURATION_FILE_DIRTY"] = 5] = "ERROR_CONFIGURATION_FILE_DIRTY";
        /**
         * Error when trying to write to a configuration file that contains JSON errors.
         */
        ConfigurationEditingErrorCode[ConfigurationEditingErrorCode["ERROR_INVALID_CONFIGURATION"] = 6] = "ERROR_INVALID_CONFIGURATION";
    })(ConfigurationEditingErrorCode = exports.ConfigurationEditingErrorCode || (exports.ConfigurationEditingErrorCode = {}));
    var ConfigurationEditingError = (function (_super) {
        __extends(ConfigurationEditingError, _super);
        function ConfigurationEditingError(message, code) {
            var _this = _super.call(this, message) || this;
            _this.code = code;
            return _this;
        }
        return ConfigurationEditingError;
    }(Error));
    exports.ConfigurationEditingError = ConfigurationEditingError;
    var ConfigurationTarget;
    (function (ConfigurationTarget) {
        /**
         * Targets the user configuration file for writing.
         */
        ConfigurationTarget[ConfigurationTarget["USER"] = 0] = "USER";
        /**
         * Targets the workspace configuration file for writing. This only works if a workspace is opened.
         */
        ConfigurationTarget[ConfigurationTarget["WORKSPACE"] = 1] = "WORKSPACE";
        /**
         * Targets the folder configuration file for writing. This only works if a workspace is opened.
         */
        ConfigurationTarget[ConfigurationTarget["FOLDER"] = 2] = "FOLDER";
    })(ConfigurationTarget = exports.ConfigurationTarget || (exports.ConfigurationTarget = {}));
});
//# sourceMappingURL=configurationEditing.js.map