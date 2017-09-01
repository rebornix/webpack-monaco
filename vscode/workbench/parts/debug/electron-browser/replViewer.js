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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/strings", "vs/base/browser/dom", "vs/base/common/severity", "vs/workbench/parts/debug/common/debugModel", "vs/workbench/parts/debug/electron-browser/debugViewer", "vs/workbench/parts/debug/browser/debugActions", "vs/workbench/parts/debug/electron-browser/electronDebugActions", "vs/platform/instantiation/common/instantiation", "vs/workbench/services/editor/common/editorService", "vs/workbench/parts/debug/browser/linkDetector"], function (require, exports, nls, winjs_base_1, strings_1, dom, severity_1, debugModel_1, debugViewer_1, debugActions_1, electronDebugActions_1, instantiation_1, editorService_1, linkDetector_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var $ = dom.$;
    var ReplExpressionsDataSource = (function () {
        function ReplExpressionsDataSource() {
        }
        ReplExpressionsDataSource.prototype.getId = function (tree, element) {
            return element.getId();
        };
        ReplExpressionsDataSource.prototype.hasChildren = function (tree, element) {
            return element instanceof debugModel_1.Model || element.hasChildren;
        };
        ReplExpressionsDataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof debugModel_1.Model) {
                return winjs_base_1.TPromise.as(element.getReplElements());
            }
            if (element instanceof debugModel_1.OutputNameValueElement) {
                return winjs_base_1.TPromise.as(element.getChildren());
            }
            if (element instanceof debugModel_1.OutputElement) {
                return winjs_base_1.TPromise.as(null);
            }
            return element.getChildren();
        };
        ReplExpressionsDataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.TPromise.as(null);
        };
        return ReplExpressionsDataSource;
    }());
    exports.ReplExpressionsDataSource = ReplExpressionsDataSource;
    var ReplExpressionsRenderer = (function () {
        function ReplExpressionsRenderer(editorService, instantiationService) {
            this.editorService = editorService;
            this.instantiationService = instantiationService;
            this.linkDetector = this.instantiationService.createInstance(linkDetector_1.LinkDetector);
        }
        ReplExpressionsRenderer.prototype.getHeight = function (tree, element) {
            if (element instanceof debugModel_1.Variable && (element.hasChildren || (element.name !== null))) {
                return ReplExpressionsRenderer.LINE_HEIGHT_PX;
            }
            if (element instanceof debugModel_1.Expression && element.hasChildren) {
                return 2 * ReplExpressionsRenderer.LINE_HEIGHT_PX;
            }
            return this.getHeightForString(element.value) + (element instanceof debugModel_1.Expression ? this.getHeightForString(element.name) : 0);
        };
        ReplExpressionsRenderer.prototype.getHeightForString = function (s) {
            var _this = this;
            if (!s || !s.length || !this.width || this.width <= 0 || !this.characterWidth || this.characterWidth <= 0) {
                return ReplExpressionsRenderer.LINE_HEIGHT_PX;
            }
            // Last new line should be ignored since the repl elements are by design split by rows
            if (strings_1.endsWith(s, '\n')) {
                s = s.substr(0, s.length - 1);
            }
            var lines = strings_1.removeAnsiEscapeCodes(s).split('\n');
            var numLines = lines.reduce(function (lineCount, line) {
                var lineLength = 0;
                for (var i = 0; i < line.length; i++) {
                    lineLength += strings_1.isFullWidthCharacter(line.charCodeAt(i)) ? 2 : 1;
                }
                return lineCount + Math.floor(lineLength * _this.characterWidth / _this.width);
            }, lines.length);
            return ReplExpressionsRenderer.LINE_HEIGHT_PX * numLines;
        };
        ReplExpressionsRenderer.prototype.setWidth = function (fullWidth, characterWidth) {
            this.width = fullWidth;
            this.characterWidth = characterWidth;
        };
        ReplExpressionsRenderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof debugModel_1.Variable && element.name) {
                return ReplExpressionsRenderer.VARIABLE_TEMPLATE_ID;
            }
            if (element instanceof debugModel_1.Expression) {
                return ReplExpressionsRenderer.EXPRESSION_TEMPLATE_ID;
            }
            if (element instanceof debugModel_1.OutputElement || (element instanceof debugModel_1.Variable && !element.name)) {
                // Variable with no name is a top level variable which should be rendered like an output element #17404
                return ReplExpressionsRenderer.VALUE_OUTPUT_TEMPLATE_ID;
            }
            if (element instanceof debugModel_1.OutputNameValueElement) {
                return ReplExpressionsRenderer.NAME_VALUE_OUTPUT_TEMPLATE_ID;
            }
            return null;
        };
        ReplExpressionsRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            if (templateId === ReplExpressionsRenderer.VARIABLE_TEMPLATE_ID) {
                var data = Object.create(null);
                data.expression = dom.append(container, $('.expression'));
                data.name = dom.append(data.expression, $('span.name'));
                data.value = dom.append(data.expression, $('span.value'));
                return data;
            }
            if (templateId === ReplExpressionsRenderer.EXPRESSION_TEMPLATE_ID) {
                var data = Object.create(null);
                dom.addClass(container, 'input-output-pair');
                data.input = dom.append(container, $('.input.expression'));
                data.output = dom.append(container, $('.output.expression'));
                data.value = dom.append(data.output, $('span.value'));
                data.annotation = dom.append(data.output, $('span'));
                return data;
            }
            if (templateId === ReplExpressionsRenderer.VALUE_OUTPUT_TEMPLATE_ID) {
                var data = Object.create(null);
                dom.addClass(container, 'output');
                var expression = dom.append(container, $('.output.expression'));
                data.container = container;
                data.value = dom.append(expression, $('span.value'));
                return data;
            }
            if (templateId === ReplExpressionsRenderer.NAME_VALUE_OUTPUT_TEMPLATE_ID) {
                var data = Object.create(null);
                dom.addClass(container, 'output');
                data.container = container;
                data.expression = dom.append(container, $('.output.expression'));
                data.name = dom.append(data.expression, $('span.name'));
                data.value = dom.append(data.expression, $('span.value'));
                data.annotation = dom.append(data.expression, $('span'));
                return data;
            }
        };
        ReplExpressionsRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (templateId === ReplExpressionsRenderer.VARIABLE_TEMPLATE_ID) {
                debugViewer_1.renderVariable(tree, element, templateData, false);
            }
            else if (templateId === ReplExpressionsRenderer.EXPRESSION_TEMPLATE_ID) {
                this.renderExpression(tree, element, templateData);
            }
            else if (templateId === ReplExpressionsRenderer.VALUE_OUTPUT_TEMPLATE_ID) {
                this.renderOutputValue(element, templateData);
            }
            else if (templateId === ReplExpressionsRenderer.NAME_VALUE_OUTPUT_TEMPLATE_ID) {
                this.renderOutputNameValue(tree, element, templateData);
            }
        };
        ReplExpressionsRenderer.prototype.renderExpression = function (tree, expression, templateData) {
            templateData.input.textContent = expression.name;
            debugViewer_1.renderExpressionValue(expression, templateData.value, {
                preserveWhitespace: !expression.hasChildren,
                showHover: false
            });
            if (expression.hasChildren) {
                templateData.annotation.className = 'annotation octicon octicon-info';
                templateData.annotation.title = nls.localize('stateCapture', "Object state is captured from first evaluation");
            }
        };
        ReplExpressionsRenderer.prototype.renderOutputValue = function (output, templateData) {
            // value
            dom.clearNode(templateData.value);
            templateData.value.className = '';
            var result = this.handleANSIOutput(output.value);
            if (typeof result === 'string') {
                debugViewer_1.renderExpressionValue(result, templateData.value, {
                    preserveWhitespace: true,
                    showHover: false
                });
            }
            else {
                templateData.value.appendChild(result);
            }
            dom.addClass(templateData.value, (output.severity === severity_1.default.Warning) ? 'warn' : (output.severity === severity_1.default.Error) ? 'error' : 'info');
        };
        ReplExpressionsRenderer.prototype.renderOutputNameValue = function (tree, output, templateData) {
            // key
            if (output.name) {
                templateData.name.textContent = output.name + ":";
            }
            else {
                templateData.name.textContent = '';
            }
            // value
            debugViewer_1.renderExpressionValue(output.value, templateData.value, {
                preserveWhitespace: true,
                showHover: false
            });
            // annotation if any
            if (output.annotation) {
                templateData.annotation.className = 'annotation octicon octicon-info';
                templateData.annotation.title = output.annotation;
            }
            else {
                templateData.annotation.className = '';
                templateData.annotation.title = '';
            }
        };
        ReplExpressionsRenderer.prototype.handleANSIOutput = function (text) {
            var tokensContainer;
            var currentToken;
            var buffer = '';
            for (var i = 0, len = text.length; i < len; i++) {
                // start of ANSI escape sequence (see http://ascii-table.com/ansi-escape-sequences.php)
                if (text.charCodeAt(i) === 27) {
                    var index = i;
                    var chr = (++index < len ? text.charAt(index) : null);
                    if (chr && chr === '[') {
                        var code = null;
                        chr = (++index < len ? text.charAt(index) : null);
                        if (chr && chr >= '0' && chr <= '9') {
                            code = chr;
                            chr = (++index < len ? text.charAt(index) : null);
                        }
                        if (chr && chr >= '0' && chr <= '9') {
                            code += chr;
                            chr = (++index < len ? text.charAt(index) : null);
                        }
                        if (code === null) {
                            code = '0';
                        }
                        if (chr === 'm') {
                            // only respect text-foreground ranges and ignore the values for "black" & "white" because those
                            // only make sense in combination with text-background ranges which we currently not support
                            var parsedMode = parseInt(code, 10);
                            var token = document.createElement('span');
                            if ((parsedMode >= 30 && parsedMode <= 37) || (parsedMode >= 90 && parsedMode <= 97)) {
                                token.className = 'code' + parsedMode;
                            }
                            else if (parsedMode === 1) {
                                token.className = 'code-bold';
                            }
                            // we need a tokens container now
                            if (!tokensContainer) {
                                tokensContainer = document.createElement('span');
                            }
                            // flush text buffer if we have any
                            if (buffer) {
                                this.insert(this.linkDetector.handleLinks(buffer), currentToken || tokensContainer);
                                buffer = '';
                            }
                            currentToken = token;
                            tokensContainer.appendChild(token);
                            i = index;
                        }
                    }
                }
                else {
                    buffer += text[i];
                }
            }
            // flush remaining text buffer if we have any
            if (buffer) {
                var res = this.linkDetector.handleLinks(buffer);
                if (typeof res !== 'string' || currentToken) {
                    if (!tokensContainer) {
                        tokensContainer = document.createElement('span');
                    }
                    this.insert(res, currentToken || tokensContainer);
                }
            }
            return tokensContainer || buffer;
        };
        ReplExpressionsRenderer.prototype.insert = function (arg, target) {
            if (typeof arg === 'string') {
                target.textContent = arg;
            }
            else {
                target.appendChild(arg);
            }
        };
        ReplExpressionsRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            // noop
        };
        ReplExpressionsRenderer.VARIABLE_TEMPLATE_ID = 'variable';
        ReplExpressionsRenderer.EXPRESSION_TEMPLATE_ID = 'inputOutputPair';
        ReplExpressionsRenderer.VALUE_OUTPUT_TEMPLATE_ID = 'outputValue';
        ReplExpressionsRenderer.NAME_VALUE_OUTPUT_TEMPLATE_ID = 'outputNameValue';
        ReplExpressionsRenderer.LINE_HEIGHT_PX = 18;
        ReplExpressionsRenderer = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, instantiation_1.IInstantiationService)
        ], ReplExpressionsRenderer);
        return ReplExpressionsRenderer;
    }());
    exports.ReplExpressionsRenderer = ReplExpressionsRenderer;
    var ReplExpressionsAccessibilityProvider = (function () {
        function ReplExpressionsAccessibilityProvider() {
        }
        ReplExpressionsAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof debugModel_1.Variable) {
                return nls.localize('replVariableAriaLabel', "Variable {0} has value {1}, read eval print loop, debug", element.name, element.value);
            }
            if (element instanceof debugModel_1.Expression) {
                return nls.localize('replExpressionAriaLabel', "Expression {0} has value {1}, read eval print loop, debug", element.name, element.value);
            }
            if (element instanceof debugModel_1.OutputElement) {
                return nls.localize('replValueOutputAriaLabel', "{0}, read eval print loop, debug", element.value);
            }
            if (element instanceof debugModel_1.OutputNameValueElement) {
                return nls.localize('replKeyValueOutputAriaLabel', "Output variable {0} has value {1}, read eval print loop, debug", element.name, element.value);
            }
            return null;
        };
        return ReplExpressionsAccessibilityProvider;
    }());
    exports.ReplExpressionsAccessibilityProvider = ReplExpressionsAccessibilityProvider;
    var ReplExpressionsActionProvider = (function () {
        function ReplExpressionsActionProvider(instantiationService) {
            this.instantiationService = instantiationService;
            // noop
        }
        ReplExpressionsActionProvider.prototype.hasActions = function (tree, element) {
            return false;
        };
        ReplExpressionsActionProvider.prototype.getActions = function (tree, element) {
            return winjs_base_1.TPromise.as([]);
        };
        ReplExpressionsActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return true;
        };
        ReplExpressionsActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var actions = [];
            actions.push(new electronDebugActions_1.CopyAction(electronDebugActions_1.CopyAction.ID, electronDebugActions_1.CopyAction.LABEL));
            actions.push(new electronDebugActions_1.CopyAllAction(electronDebugActions_1.CopyAllAction.ID, electronDebugActions_1.CopyAllAction.LABEL, tree));
            actions.push(this.instantiationService.createInstance(debugActions_1.ClearReplAction, debugActions_1.ClearReplAction.ID, debugActions_1.ClearReplAction.LABEL));
            return winjs_base_1.TPromise.as(actions);
        };
        ReplExpressionsActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        return ReplExpressionsActionProvider;
    }());
    exports.ReplExpressionsActionProvider = ReplExpressionsActionProvider;
    var ReplExpressionsController = (function (_super) {
        __extends(ReplExpressionsController, _super);
        function ReplExpressionsController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.lastSelectedString = null;
            return _this;
        }
        ReplExpressionsController.prototype.onLeftClick = function (tree, element, eventish, origin) {
            if (origin === void 0) { origin = 'mouse'; }
            var mouseEvent = eventish;
            // input and output are one element in the tree => we only expand if the user clicked on the output.
            if ((element.reference > 0 || (element instanceof debugModel_1.OutputNameValueElement && element.hasChildren)) && mouseEvent.target.className.indexOf('input expression') === -1) {
                _super.prototype.onLeftClick.call(this, tree, element, eventish, origin);
                tree.clearFocus();
                tree.deselect(element);
            }
            var selection = window.getSelection();
            if (selection.type !== 'Range' || this.lastSelectedString === selection.toString()) {
                // only focus the input if the user is not currently selecting.
                this.toFocusOnClick.focus();
            }
            this.lastSelectedString = selection.toString();
            return true;
        };
        return ReplExpressionsController;
    }(debugViewer_1.BaseDebugController));
    exports.ReplExpressionsController = ReplExpressionsController;
});
//# sourceMappingURL=replViewer.js.map