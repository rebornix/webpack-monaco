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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/objects", "vs/base/common/arrays", "vs/base/common/strings", "vs/base/common/types", "vs/base/common/errors", "vs/platform/registry/common/platform", "vs/base/common/actions", "vs/base/parts/quickopen/common/quickOpen", "vs/base/parts/quickopen/browser/quickOpenModel", "vs/workbench/common/editor", "vs/platform/quickOpen/common/quickOpen", "vs/platform/instantiation/common/descriptors"], function (require, exports, nls, winjs_base_1, objects, arrays, strings, types, errors, platform_1, actions_1, quickOpen_1, quickOpenModel_1, editor_1, quickOpen_2, descriptors_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var QuickOpenHandler = (function () {
        function QuickOpenHandler() {
        }
        /**
         * A quick open handler returns results for a given input string. The resolved promise
         * returns an instance of quick open model. It is up to the handler to keep and reuse an
         * instance of the same model across multiple calls. This helps in situations where the user is
         * narrowing down a search and the model is just filtering some items out.
         *
         * As such, returning the same model instance across multiple searches will yield best
         * results in terms of performance when many items are shown.
         */
        QuickOpenHandler.prototype.getResults = function (searchValue) {
            return winjs_base_1.TPromise.as(null);
        };
        /**
         * The ARIA label to apply when this quick open handler is active in quick open.
         */
        QuickOpenHandler.prototype.getAriaLabel = function () {
            return null;
        };
        /**
         * Extra CSS class name to add to the quick open widget to do custom styling of entries.
         */
        QuickOpenHandler.prototype.getClass = function () {
            return null;
        };
        /**
         * Indicates if the handler can run in the current environment. Return a string if the handler cannot run but has
         * a good message to show in this case.
         */
        QuickOpenHandler.prototype.canRun = function () {
            return true;
        };
        /**
         * Hints to the outside that this quick open handler typically returns results fast.
         */
        QuickOpenHandler.prototype.hasShortResponseTime = function () {
            return false;
        };
        /**
         * Indicates if the handler wishes the quick open widget to automatically select the first result entry or an entry
         * based on a specific prefix match.
         */
        QuickOpenHandler.prototype.getAutoFocus = function (searchValue, context) {
            return {};
        };
        /**
         * Indicates to the handler that the quick open widget has been opened.
         */
        QuickOpenHandler.prototype.onOpen = function () {
            return;
        };
        /**
         * Indicates to the handler that the quick open widget has been closed. Allows to free up any resources as needed.
         * The parameter canceled indicates if the quick open widget was closed with an entry being run or not.
         */
        QuickOpenHandler.prototype.onClose = function (canceled) {
            return;
        };
        /**
         * Allows to return a label that will be placed to the side of the results from this handler or null if none.
         */
        QuickOpenHandler.prototype.getGroupLabel = function () {
            return null;
        };
        /**
         * Allows to return a label that will be used when there are no results found
         */
        QuickOpenHandler.prototype.getEmptyLabel = function (searchString) {
            if (searchString.length > 0) {
                return nls.localize('noResultsMatching', "No results matching");
            }
            return nls.localize('noResultsFound2', "No results found");
        };
        return QuickOpenHandler;
    }());
    exports.QuickOpenHandler = QuickOpenHandler;
    /**
     * A lightweight descriptor of a quick open handler.
     */
    var QuickOpenHandlerDescriptor = (function (_super) {
        __extends(QuickOpenHandlerDescriptor, _super);
        function QuickOpenHandlerDescriptor(moduleId, ctorName, prefix, contextKey, param, instantProgress) {
            if (instantProgress === void 0) { instantProgress = false; }
            var _this = _super.call(this, moduleId, ctorName) || this;
            _this.id = moduleId + ctorName;
            _this.prefix = prefix;
            _this.contextKey = contextKey;
            _this.instantProgress = instantProgress;
            if (types.isString(param)) {
                _this.description = param;
            }
            else {
                _this.helpEntries = param;
            }
            return _this;
        }
        QuickOpenHandlerDescriptor.prototype.getId = function () {
            return this.id;
        };
        return QuickOpenHandlerDescriptor;
    }(descriptors_1.AsyncDescriptor));
    exports.QuickOpenHandlerDescriptor = QuickOpenHandlerDescriptor;
    exports.Extensions = {
        Quickopen: 'workbench.contributions.quickopen'
    };
    var QuickOpenRegistry = (function () {
        function QuickOpenRegistry() {
            this.handlers = [];
        }
        QuickOpenRegistry.prototype.registerQuickOpenHandler = function (descriptor) {
            this.handlers.push(descriptor);
            // sort the handlers by decreasing prefix length, such that longer
            // prefixes take priority: 'ext' vs 'ext install' - the latter should win
            this.handlers.sort(function (h1, h2) { return h2.prefix.length - h1.prefix.length; });
        };
        QuickOpenRegistry.prototype.registerDefaultQuickOpenHandler = function (descriptor) {
            this.defaultHandler = descriptor;
        };
        QuickOpenRegistry.prototype.getQuickOpenHandlers = function () {
            return this.handlers.slice(0);
        };
        QuickOpenRegistry.prototype.getQuickOpenHandler = function (text) {
            return text ? arrays.first(this.handlers, function (h) { return strings.startsWith(text, h.prefix); }, null) : null;
        };
        QuickOpenRegistry.prototype.getDefaultQuickOpenHandler = function () {
            return this.defaultHandler;
        };
        return QuickOpenRegistry;
    }());
    platform_1.Registry.add(exports.Extensions.Quickopen, new QuickOpenRegistry());
    /**
     * A subclass of quick open entry that will open an editor with input and options when running.
     */
    var EditorQuickOpenEntry = (function (_super) {
        __extends(EditorQuickOpenEntry, _super);
        function EditorQuickOpenEntry(_editorService) {
            var _this = _super.call(this) || this;
            _this._editorService = _editorService;
            return _this;
        }
        Object.defineProperty(EditorQuickOpenEntry.prototype, "editorService", {
            get: function () {
                return this._editorService;
            },
            enumerable: true,
            configurable: true
        });
        EditorQuickOpenEntry.prototype.getInput = function () {
            return null;
        };
        EditorQuickOpenEntry.prototype.getOptions = function () {
            return null;
        };
        EditorQuickOpenEntry.prototype.run = function (mode, context) {
            var hideWidget = (mode === quickOpen_1.Mode.OPEN);
            if (mode === quickOpen_1.Mode.OPEN || mode === quickOpen_1.Mode.OPEN_IN_BACKGROUND) {
                var sideBySide = context.keymods.indexOf(2048 /* CtrlCmd */) >= 0;
                var openInBackgroundOptions = void 0;
                if (mode === quickOpen_1.Mode.OPEN_IN_BACKGROUND) {
                    openInBackgroundOptions = { pinned: true, preserveFocus: true };
                }
                var input = this.getInput();
                if (input instanceof editor_1.EditorInput) {
                    var opts = this.getOptions();
                    if (opts) {
                        opts = objects.mixin(opts, openInBackgroundOptions, true);
                    }
                    else if (openInBackgroundOptions) {
                        opts = editor_1.EditorOptions.create(openInBackgroundOptions);
                    }
                    this.editorService.openEditor(input, opts, sideBySide).done(null, errors.onUnexpectedError);
                }
                else {
                    var resourceInput = input;
                    if (openInBackgroundOptions) {
                        resourceInput.options = objects.assign(resourceInput.options || Object.create(null), openInBackgroundOptions);
                    }
                    this.editorService.openEditor(resourceInput, sideBySide).done(null, errors.onUnexpectedError);
                }
            }
            return hideWidget;
        };
        return EditorQuickOpenEntry;
    }(quickOpenModel_1.QuickOpenEntry));
    exports.EditorQuickOpenEntry = EditorQuickOpenEntry;
    /**
     * A subclass of quick open entry group that provides access to editor input and options.
     */
    var EditorQuickOpenEntryGroup = (function (_super) {
        __extends(EditorQuickOpenEntryGroup, _super);
        function EditorQuickOpenEntryGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorQuickOpenEntryGroup.prototype.getInput = function () {
            return null;
        };
        EditorQuickOpenEntryGroup.prototype.getOptions = function () {
            return null;
        };
        return EditorQuickOpenEntryGroup;
    }(quickOpenModel_1.QuickOpenEntryGroup));
    exports.EditorQuickOpenEntryGroup = EditorQuickOpenEntryGroup;
    var CommandEntry = (function (_super) {
        __extends(CommandEntry, _super);
        function CommandEntry(quickOpenService, prefix, command, highlights) {
            var _this = _super.call(this, highlights) || this;
            _this.quickOpenService = quickOpenService;
            _this.prefix = prefix;
            _this.command = command;
            _this.command = command;
            return _this;
        }
        CommandEntry.prototype.getIcon = function () {
            return this.command.icon || null;
        };
        CommandEntry.prototype.getLabel = function () {
            return this.command.aliases[0];
        };
        CommandEntry.prototype.getAriaLabel = function () {
            return nls.localize('entryAriaLabel', "{0}, command", this.getLabel());
        };
        CommandEntry.prototype.run = function (mode, context) {
            if (mode === quickOpen_1.Mode.PREVIEW) {
                return false;
            }
            this.quickOpenService.show(this.prefix + " " + this.command.aliases[0] + " ");
            return false;
        };
        return CommandEntry;
    }(quickOpenModel_1.QuickOpenEntry));
    var QuickOpenAction = (function (_super) {
        __extends(QuickOpenAction, _super);
        function QuickOpenAction(id, label, prefix, quickOpenService) {
            var _this = _super.call(this, id, label) || this;
            _this.quickOpenService = quickOpenService;
            _this.prefix = prefix;
            _this.enabled = !!_this.quickOpenService;
            return _this;
        }
        QuickOpenAction.prototype.run = function (context) {
            // Show with prefix
            this.quickOpenService.show(this.prefix);
            return winjs_base_1.TPromise.as(null);
        };
        QuickOpenAction = __decorate([
            __param(3, quickOpen_2.IQuickOpenService)
        ], QuickOpenAction);
        return QuickOpenAction;
    }(actions_1.Action));
    exports.QuickOpenAction = QuickOpenAction;
});
//# sourceMappingURL=quickopen.js.map