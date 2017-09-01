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
define(["require", "exports", "vs/base/common/uri", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/base/common/event", "vs/base/browser/dom", "vs/platform/theme/common/colorRegistry", "vs/platform/theme/common/themeService", "./webviewFindWidget", "vs/platform/contextview/browser/contextView"], function (require, exports, uri_1, winjs_base_1, lifecycle_1, event_1, dom_1, colorRegistry_1, themeService_1, webviewFindWidget_1, contextView_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var StopFindInPageActions = (function () {
        function StopFindInPageActions() {
        }
        StopFindInPageActions.clearSelection = 'clearSelection';
        StopFindInPageActions.keepSelection = 'keepSelection';
        StopFindInPageActions.activateSelection = 'activateSelection';
        return StopFindInPageActions;
    }());
    exports.StopFindInPageActions = StopFindInPageActions;
    var Webview = (function () {
        function Webview(parent, _styleElement, _contextViewService, _contextKey, _findInputContextKey, _options) {
            if (_options === void 0) { _options = {}; }
            var _this = this;
            this.parent = parent;
            this._styleElement = _styleElement;
            this._contextViewService = _contextViewService;
            this._contextKey = _contextKey;
            this._findInputContextKey = _findInputContextKey;
            this._options = _options;
            this._disposables = [];
            this._onDidClickLink = new event_1.Emitter();
            this._onDidScroll = new event_1.Emitter();
            this._onFoundInPageResults = new event_1.Emitter();
            this._findStarted = false;
            this._webview = document.createElement('webview');
            this._webview.setAttribute('partition', this._options.allowSvgs ? 'webview' : "webview" + Webview.index++);
            // disable auxclick events (see https://developers.google.com/web/updates/2016/10/auxclick)
            this._webview.setAttribute('disableblinkfeatures', 'Auxclick');
            this._webview.setAttribute('disableguestresize', '');
            this._webview.setAttribute('webpreferences', 'contextIsolation=yes');
            this._webview.style.flex = '0 1';
            this._webview.style.width = '0';
            this._webview.style.height = '0';
            this._webview.style.outline = '0';
            this._webview.preload = require.toUrl('./webview-pre.js');
            this._webview.src = require.toUrl('./webview.html');
            this._ready = new winjs_base_1.TPromise(function (resolve) {
                var subscription = dom_1.addDisposableListener(_this._webview, 'ipc-message', function (event) {
                    if (event.channel === 'webview-ready') {
                        // console.info('[PID Webview] ' event.args[0]);
                        dom_1.addClass(_this._webview, 'ready'); // can be found by debug command
                        subscription.dispose();
                        resolve(_this);
                    }
                });
            });
            if (!this._options.allowSvgs) {
                var loaded_1 = false;
                var subscription = dom_1.addDisposableListener(this._webview, 'did-start-loading', function () {
                    if (loaded_1) {
                        return;
                    }
                    loaded_1 = true;
                    var contents = _this._webview.getWebContents();
                    if (!contents) {
                        return;
                    }
                    contents.session.webRequest.onBeforeRequest(function (details, callback) {
                        if (details.url.indexOf('.svg') > 0) {
                            var uri = uri_1.default.parse(details.url);
                            if (uri && !uri.scheme.match(/file/i) && uri.path.endsWith('.svg') && !_this.isAllowedSvg(uri)) {
                                _this.onDidBlockSvg();
                                return callback({ cancel: true });
                            }
                        }
                        return callback({});
                    });
                    contents.session.webRequest.onHeadersReceived(function (details, callback) {
                        var contentType = (details.responseHeaders['content-type'] || details.responseHeaders['Content-Type']);
                        if (contentType && Array.isArray(contentType) && contentType.some(function (x) { return x.toLowerCase().indexOf('image/svg') >= 0; })) {
                            var uri = uri_1.default.parse(details.url);
                            if (uri && !_this.isAllowedSvg(uri)) {
                                _this.onDidBlockSvg();
                                return callback({ cancel: true });
                            }
                        }
                        return callback({ cancel: false, responseHeaders: details.responseHeaders });
                    });
                });
                this._disposables.push(subscription);
            }
            this._disposables.push(dom_1.addDisposableListener(this._webview, 'console-message', function (e) {
                console.log("[Embedded Page] " + e.message);
            }), dom_1.addDisposableListener(this._webview, 'dom-ready', function () {
                _this.layout();
            }), dom_1.addDisposableListener(this._webview, 'crashed', function () {
                console.error('embedded page crashed');
            }), dom_1.addDisposableListener(this._webview, 'ipc-message', function (event) {
                if (event.channel === 'did-click-link') {
                    var uri = event.args[0];
                    _this._onDidClickLink.fire(uri_1.default.parse(uri));
                    return;
                }
                if (event.channel === 'did-set-content') {
                    _this._webview.style.flex = '';
                    _this._webview.style.width = '100%';
                    _this._webview.style.height = '100%';
                    _this.layout();
                    return;
                }
                if (event.channel === 'did-scroll') {
                    if (event.args && typeof event.args[0] === 'number') {
                        _this._onDidScroll.fire({ scrollYPercentage: event.args[0] });
                    }
                    return;
                }
            }), dom_1.addDisposableListener(this._webview, 'focus', function () {
                if (_this._contextKey) {
                    _this._contextKey.set(true);
                }
            }), dom_1.addDisposableListener(this._webview, 'blur', function () {
                if (_this._contextKey) {
                    _this._contextKey.reset();
                }
            }), dom_1.addDisposableListener(this._webview, 'found-in-page', function (event) {
                _this._onFoundInPageResults.fire(event.result);
            }));
            this._webviewFindWidget = new webviewFindWidget_1.WebviewFindWidget(this._contextViewService, this);
            this._disposables.push(this._webviewFindWidget);
            if (parent) {
                parent.appendChild(this._webviewFindWidget.getDomNode());
                parent.appendChild(this._webview);
            }
        }
        Webview.prototype.notifyFindWidgetFocusChanged = function (isFocused) {
            this._contextKey.set(isFocused || document.activeElement === this._webview);
        };
        Webview.prototype.notifyFindWidgetInputFocusChanged = function (isFocused) {
            this._findInputContextKey.set(isFocused);
        };
        Webview.prototype.dispose = function () {
            this._onDidClickLink.dispose();
            this._disposables = lifecycle_1.dispose(this._disposables);
            if (this._webview.parentElement) {
                this._webview.parentElement.removeChild(this._webview);
                var findWidgetDomNode = this._webviewFindWidget.getDomNode();
                findWidgetDomNode.parentElement.removeChild(findWidgetDomNode);
            }
        };
        Object.defineProperty(Webview.prototype, "onDidClickLink", {
            get: function () {
                return this._onDidClickLink.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Webview.prototype, "onDidScroll", {
            get: function () {
                return this._onDidScroll.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Webview.prototype, "onFindResults", {
            get: function () {
                return this._onFoundInPageResults.event;
            },
            enumerable: true,
            configurable: true
        });
        Webview.prototype._send = function (channel) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this._ready
                .then(function () {
                return (_a = _this._webview).send.apply(_a, [channel].concat(args));
                var _a;
            })
                .done(void 0, console.error);
        };
        Object.defineProperty(Webview.prototype, "initialScrollProgress", {
            set: function (value) {
                this._send('initial-scroll-position', value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Webview.prototype, "options", {
            set: function (value) {
                this._options = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Webview.prototype, "contents", {
            set: function (value) {
                this._send('content', {
                    contents: value,
                    options: this._options
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Webview.prototype, "baseUrl", {
            set: function (value) {
                this._send('baseUrl', value);
            },
            enumerable: true,
            configurable: true
        });
        Webview.prototype.focus = function () {
            this._webview.focus();
            this._send('focus');
        };
        Webview.prototype.sendMessage = function (data) {
            this._send('message', data);
        };
        Webview.prototype.onDidBlockSvg = function () {
            this.sendMessage({
                name: 'vscode-did-block-svg'
            });
        };
        Webview.prototype.style = function (theme) {
            var _a = window.getComputedStyle(this._styleElement), fontFamily = _a.fontFamily, fontWeight = _a.fontWeight, fontSize = _a.fontSize; // TODO@theme avoid styleElement
            var value = "\n\t\t:root {\n\t\t\t--background-color: " + theme.getColor(colorRegistry_1.editorBackground) + ";\n\t\t\t--color: " + theme.getColor(colorRegistry_1.editorForeground) + ";\n\t\t\t--font-family: " + fontFamily + ";\n\t\t\t--font-weight: " + fontWeight + ";\n\t\t\t--font-size: " + fontSize + ";\n\t\t}\n\t\tbody {\n\t\t\tbackground-color: var(--background-color);\n\t\t\tcolor: var(--color);\n\t\t\tfont-family: var(--font-family);\n\t\t\tfont-weight: var(--font-weight);\n\t\t\tfont-size: var(--font-size);\n\t\t\tmargin: 0;\n\t\t\tpadding: 0 20px;\n\t\t}\n\n\t\timg {\n\t\t\tmax-width: 100%;\n\t\t\tmax-height: 100%;\n\t\t}\n\t\ta:focus,\n\t\tinput:focus,\n\t\tselect:focus,\n\t\ttextarea:focus {\n\t\t\toutline: 1px solid -webkit-focus-ring-color;\n\t\t\toutline-offset: -1px;\n\t\t}\n\t\t::-webkit-scrollbar {\n\t\t\twidth: 10px;\n\t\t\theight: 10px;\n\t\t}";
            var activeTheme;
            if (theme.type === themeService_1.LIGHT) {
                value += "\n\t\t\t::-webkit-scrollbar-thumb {\n\t\t\t\tbackground-color: rgba(100, 100, 100, 0.4);\n\t\t\t}\n\t\t\t::-webkit-scrollbar-thumb:hover {\n\t\t\t\tbackground-color: rgba(100, 100, 100, 0.7);\n\t\t\t}\n\t\t\t::-webkit-scrollbar-thumb:active {\n\t\t\t\tbackground-color: rgba(0, 0, 0, 0.6);\n\t\t\t}";
                activeTheme = 'vscode-light';
            }
            else if (theme.type === themeService_1.DARK) {
                value += "\n\t\t\t::-webkit-scrollbar-thumb {\n\t\t\t\tbackground-color: rgba(121, 121, 121, 0.4);\n\t\t\t}\n\t\t\t::-webkit-scrollbar-thumb:hover {\n\t\t\t\tbackground-color: rgba(100, 100, 100, 0.7);\n\t\t\t}\n\t\t\t::-webkit-scrollbar-thumb:active {\n\t\t\t\tbackground-color: rgba(85, 85, 85, 0.8);\n\t\t\t}";
                activeTheme = 'vscode-dark';
            }
            else {
                value += "\n\t\t\t::-webkit-scrollbar-thumb {\n\t\t\t\tbackground-color: rgba(111, 195, 223, 0.3);\n\t\t\t}\n\t\t\t::-webkit-scrollbar-thumb:hover {\n\t\t\t\tbackground-color: rgba(111, 195, 223, 0.8);\n\t\t\t}\n\t\t\t::-webkit-scrollbar-thumb:active {\n\t\t\t\tbackground-color: rgba(111, 195, 223, 0.8);\n\t\t\t}";
                activeTheme = 'vscode-high-contrast';
            }
            this._send('styles', value, activeTheme);
            this._webviewFindWidget.updateTheme(theme);
        };
        Webview.prototype.layout = function () {
            var _this = this;
            var contents = this._webview.getWebContents();
            if (!contents || contents.isDestroyed()) {
                return;
            }
            var window = contents.getOwnerBrowserWindow();
            if (!window || !window.webContents || window.webContents.isDestroyed()) {
                return;
            }
            window.webContents.getZoomFactor(function (factor) {
                if (contents.isDestroyed()) {
                    return;
                }
                contents.setZoomFactor(factor);
                var width = _this.parent.clientWidth;
                var height = _this.parent.clientHeight;
                contents.setSize({
                    normal: {
                        width: Math.floor(width * factor),
                        height: Math.floor(height * factor)
                    }
                });
            });
        };
        Webview.prototype.isAllowedSvg = function (uri) {
            if (this._options.allowSvgs) {
                return true;
            }
            if (this._options.svgWhiteList) {
                return this._options.svgWhiteList.indexOf(uri.authority.toLowerCase()) >= 0;
            }
            return false;
        };
        Webview.prototype.startFind = function (value, options) {
            if (!value) {
                return;
            }
            // ensure options is defined without modifying the original
            options = options || {};
            // FindNext must be false for a first request
            var findOptions = {
                forward: options.forward,
                findNext: false,
                matchCase: options.matchCase,
                medialCapitalAsWordStart: options.medialCapitalAsWordStart
            };
            this._findStarted = true;
            this._webview.findInPage(value, findOptions);
            return;
        };
        /**
         * Webviews expose a stateful find API.
         * Successive calls to find will move forward or backward through onFindResults
         * depending on the supplied options.
         *
         * @param {string} value The string to search for. Empty strings are ignored.
         * @param {WebviewElementFindInPageOptions} [options]
         *
         * @memberOf Webview
         */
        Webview.prototype.find = function (value, options) {
            // Searching with an empty value will throw an exception
            if (!value) {
                return;
            }
            if (!this._findStarted) {
                this.startFind(value, options);
                return;
            }
            this._webview.findInPage(value, options);
        };
        Webview.prototype.stopFind = function (keepSelection) {
            this._findStarted = false;
            this._webview.stopFindInPage(keepSelection ? StopFindInPageActions.keepSelection : StopFindInPageActions.clearSelection);
        };
        Webview.prototype.showFind = function () {
            this._webviewFindWidget.reveal();
        };
        Webview.prototype.hideFind = function () {
            this._webviewFindWidget.hide();
        };
        Webview.prototype.showNextFindTerm = function () {
            this._webviewFindWidget.showNextFindTerm();
        };
        Webview.prototype.showPreviousFindTerm = function () {
            this._webviewFindWidget.showPreviousFindTerm();
        };
        Webview.index = 0;
        Webview = __decorate([
            __param(2, contextView_1.IContextViewService)
        ], Webview);
        return Webview;
    }());
    exports.default = Webview;
});
//# sourceMappingURL=webview.js.map