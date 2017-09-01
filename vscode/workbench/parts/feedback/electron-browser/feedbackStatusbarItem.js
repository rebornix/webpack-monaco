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
define(["require", "exports", "./feedback", "vs/platform/contextview/browser/contextView", "vs/platform/instantiation/common/instantiation", "vs/platform/node/product", "vs/workbench/common/theme", "vs/platform/theme/common/themeService", "vs/platform/workspace/common/workspace"], function (require, exports, feedback_1, contextView_1, instantiation_1, product_1, theme_1, themeService_1, workspace_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TwitterFeedbackService = (function () {
        function TwitterFeedbackService() {
        }
        TwitterFeedbackService.prototype.combineHashTagsAsString = function () {
            return TwitterFeedbackService.HASHTAGS.join(',');
        };
        TwitterFeedbackService.prototype.submitFeedback = function (feedback) {
            var queryString = "?" + (feedback.sentiment === 1 ? "hashtags=" + this.combineHashTagsAsString() + "&" : null) + "ref_src=twsrc%5Etfw&related=twitterapi%2Ctwitter&text=" + feedback.feedback + "&tw_p=tweetbutton&via=" + TwitterFeedbackService.VIA_NAME;
            var url = TwitterFeedbackService.TWITTER_URL + queryString;
            window.open(url);
        };
        TwitterFeedbackService.prototype.getCharacterLimit = function (sentiment) {
            var length = 0;
            if (sentiment === 1) {
                TwitterFeedbackService.HASHTAGS.forEach(function (element) {
                    length += element.length + 2;
                });
            }
            if (TwitterFeedbackService.VIA_NAME) {
                length += (" via @" + TwitterFeedbackService.VIA_NAME).length;
            }
            return 140 - length;
        };
        TwitterFeedbackService.TWITTER_URL = 'https://twitter.com/intent/tweet';
        TwitterFeedbackService.VIA_NAME = 'code';
        TwitterFeedbackService.HASHTAGS = ['HappyCoding'];
        return TwitterFeedbackService;
    }());
    var FeedbackStatusbarItem = (function (_super) {
        __extends(FeedbackStatusbarItem, _super);
        function FeedbackStatusbarItem(instantiationService, contextViewService, contextService, themeService) {
            var _this = _super.call(this, themeService) || this;
            _this.instantiationService = instantiationService;
            _this.contextViewService = contextViewService;
            _this.contextService = contextService;
            _this.registerListeners();
            return _this;
        }
        FeedbackStatusbarItem.prototype.registerListeners = function () {
            var _this = this;
            this.toUnbind.push(this.contextService.onDidChangeWorkspaceRoots(function () { return _this.updateStyles(); }));
        };
        FeedbackStatusbarItem.prototype.updateStyles = function () {
            _super.prototype.updateStyles.call(this);
            if (this.dropdown) {
                this.dropdown.label.style('background-color', this.getColor(this.contextService.hasWorkspace() ? theme_1.STATUS_BAR_FOREGROUND : theme_1.STATUS_BAR_NO_FOLDER_FOREGROUND));
            }
        };
        FeedbackStatusbarItem.prototype.render = function (element) {
            if (product_1.default.sendASmile) {
                this.dropdown = this.instantiationService.createInstance(feedback_1.FeedbackDropdown, element, {
                    contextViewProvider: this.contextViewService,
                    feedbackService: this.instantiationService.createInstance(TwitterFeedbackService)
                });
                this.updateStyles();
                return this.dropdown;
            }
            return null;
        };
        FeedbackStatusbarItem = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, contextView_1.IContextViewService),
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, themeService_1.IThemeService)
        ], FeedbackStatusbarItem);
        return FeedbackStatusbarItem;
    }(theme_1.Themable));
    exports.FeedbackStatusbarItem = FeedbackStatusbarItem;
});
//# sourceMappingURL=feedbackStatusbarItem.js.map