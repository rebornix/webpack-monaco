define(["require", "exports", "vs/base/common/types"], function (require, exports, Types) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShellConfiguration;
    (function (ShellConfiguration) {
        function is(value) {
            var candidate = value;
            return candidate && Types.isString(candidate.executable) && (candidate.args === void 0 || Types.isStringArray(candidate.args));
        }
        ShellConfiguration.is = is;
    })(ShellConfiguration = exports.ShellConfiguration || (exports.ShellConfiguration = {}));
    var RevealKind;
    (function (RevealKind) {
        /**
         * Always brings the terminal to front if the task is executed.
         */
        RevealKind[RevealKind["Always"] = 1] = "Always";
        /**
         * Only brings the terminal to front if a problem is detected executing the task
         * (e.g. the task couldn't be started because).
         */
        RevealKind[RevealKind["Silent"] = 2] = "Silent";
        /**
         * The terminal never comes to front when the task is executed.
         */
        RevealKind[RevealKind["Never"] = 3] = "Never";
    })(RevealKind = exports.RevealKind || (exports.RevealKind = {}));
    (function (RevealKind) {
        function fromString(value) {
            switch (value.toLowerCase()) {
                case 'always':
                    return RevealKind.Always;
                case 'silent':
                    return RevealKind.Silent;
                case 'never':
                    return RevealKind.Never;
                default:
                    return RevealKind.Always;
            }
        }
        RevealKind.fromString = fromString;
    })(RevealKind = exports.RevealKind || (exports.RevealKind = {}));
    var PanelKind;
    (function (PanelKind) {
        /**
         * Shares a panel with other tasks. This is the default.
         */
        PanelKind[PanelKind["Shared"] = 1] = "Shared";
        /**
         * Uses a dedicated panel for this tasks. The panel is not
         * shared with other tasks.
         */
        PanelKind[PanelKind["Dedicated"] = 2] = "Dedicated";
        /**
         * Creates a new panel whenever this task is executed.
         */
        PanelKind[PanelKind["New"] = 3] = "New";
    })(PanelKind = exports.PanelKind || (exports.PanelKind = {}));
    (function (PanelKind) {
        function fromString(value) {
            switch (value.toLowerCase()) {
                case 'shared':
                    return PanelKind.Shared;
                case 'dedicated':
                    return PanelKind.Dedicated;
                case 'new':
                    return PanelKind.New;
                default:
                    return PanelKind.Shared;
            }
        }
        PanelKind.fromString = fromString;
    })(PanelKind = exports.PanelKind || (exports.PanelKind = {}));
    var RuntimeType;
    (function (RuntimeType) {
        RuntimeType[RuntimeType["Shell"] = 1] = "Shell";
        RuntimeType[RuntimeType["Process"] = 2] = "Process";
    })(RuntimeType = exports.RuntimeType || (exports.RuntimeType = {}));
    (function (RuntimeType) {
        function fromString(value) {
            switch (value.toLowerCase()) {
                case 'shell':
                    return RuntimeType.Shell;
                case 'process':
                    return RuntimeType.Process;
                default:
                    return RuntimeType.Process;
            }
        }
        RuntimeType.fromString = fromString;
    })(RuntimeType = exports.RuntimeType || (exports.RuntimeType = {}));
    var TaskGroup;
    (function (TaskGroup) {
        TaskGroup.Clean = 'clean';
        TaskGroup.Build = 'build';
        TaskGroup.Rebuild = 'rebuild';
        TaskGroup.Test = 'test';
        function is(value) {
            return value === TaskGroup.Clean || value === TaskGroup.Build || value === TaskGroup.Rebuild || value === TaskGroup.Test;
        }
        TaskGroup.is = is;
    })(TaskGroup = exports.TaskGroup || (exports.TaskGroup = {}));
    var TaskSourceKind;
    (function (TaskSourceKind) {
        TaskSourceKind.Workspace = 'workspace';
        TaskSourceKind.Extension = 'extension';
        TaskSourceKind.Composite = 'composite';
    })(TaskSourceKind = exports.TaskSourceKind || (exports.TaskSourceKind = {}));
    var CustomTask;
    (function (CustomTask) {
        function is(value) {
            var candidate = value;
            return candidate && candidate.type === 'custom';
        }
        CustomTask.is = is;
    })(CustomTask = exports.CustomTask || (exports.CustomTask = {}));
    var ConfiguringTask;
    (function (ConfiguringTask) {
        function is(value) {
            var candidate = value;
            return candidate && candidate.configures && Types.isString(candidate.configures.type) && value.command === void 0;
        }
        ConfiguringTask.is = is;
    })(ConfiguringTask = exports.ConfiguringTask || (exports.ConfiguringTask = {}));
    var ContributedTask;
    (function (ContributedTask) {
        function is(value) {
            var candidate = value;
            return candidate && candidate.defines && Types.isString(candidate.defines.type) && candidate.command !== void 0;
        }
        ContributedTask.is = is;
    })(ContributedTask = exports.ContributedTask || (exports.ContributedTask = {}));
    var CompositeTask;
    (function (CompositeTask) {
        function is(value) {
            var candidate = value;
            return candidate && candidate._source && candidate._source.kind === TaskSourceKind.Composite;
        }
        CompositeTask.is = is;
    })(CompositeTask = exports.CompositeTask || (exports.CompositeTask = {}));
    var Task;
    (function (Task) {
        function getKey(task) {
            if (CustomTask.is(task) || CompositeTask.is(task)) {
                return task.identifier;
            }
            else {
                return task.defines._key;
            }
        }
        Task.getKey = getKey;
        function getTelemetryKind(task) {
            if (ContributedTask.is(task)) {
                return 'extension';
            }
            else if (CustomTask.is(task)) {
                if (task._source.customizes) {
                    return 'workspace>extension';
                }
                else {
                    return 'workspace';
                }
            }
            else if (CompositeTask.is(task)) {
                return 'composite';
            }
            else {
                return 'unknown';
            }
        }
        Task.getTelemetryKind = getTelemetryKind;
    })(Task = exports.Task || (exports.Task = {}));
    var ExecutionEngine;
    (function (ExecutionEngine) {
        ExecutionEngine[ExecutionEngine["Process"] = 1] = "Process";
        ExecutionEngine[ExecutionEngine["Terminal"] = 2] = "Terminal";
    })(ExecutionEngine = exports.ExecutionEngine || (exports.ExecutionEngine = {}));
    (function (ExecutionEngine) {
        ExecutionEngine._default = ExecutionEngine.Terminal;
    })(ExecutionEngine = exports.ExecutionEngine || (exports.ExecutionEngine = {}));
    var JsonSchemaVersion;
    (function (JsonSchemaVersion) {
        JsonSchemaVersion[JsonSchemaVersion["V0_1_0"] = 1] = "V0_1_0";
        JsonSchemaVersion[JsonSchemaVersion["V2_0_0"] = 2] = "V2_0_0";
    })(JsonSchemaVersion = exports.JsonSchemaVersion || (exports.JsonSchemaVersion = {}));
});
//# sourceMappingURL=tasks.js.map