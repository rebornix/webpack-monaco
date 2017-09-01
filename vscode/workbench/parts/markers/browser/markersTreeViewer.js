var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/browser/dom", "vs/base/common/network", "vs/base/common/severity", "vs/platform/workspace/common/workspace", "vs/base/browser/ui/countBadge/countBadge", "vs/workbench/browser/labels", "vs/base/browser/ui/highlightedlabel/highlightedLabel", "vs/workbench/parts/markers/common/markersModel", "vs/workbench/parts/markers/common/messages", "vs/platform/instantiation/common/instantiation", "vs/platform/theme/common/styler", "vs/platform/theme/common/themeService"], function (require, exports, winjs_base_1, dom, network, severity_1, workspace_1, countBadge_1, labels_1, highlightedLabel_1, markersModel_1, messages_1, instantiation_1, styler_1, themeService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var DataSource = (function () {
        function DataSource() {
        }
        DataSource.prototype.getId = function (tree, element) {
            if (element instanceof markersModel_1.MarkersModel) {
                return 'root';
            }
            if (element instanceof markersModel_1.Resource) {
                return element.uri.toString();
            }
            if (element instanceof markersModel_1.Marker) {
                return element.id;
            }
            return '';
        };
        DataSource.prototype.hasChildren = function (tree, element) {
            return element instanceof markersModel_1.MarkersModel || element instanceof markersModel_1.Resource;
        };
        DataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof markersModel_1.MarkersModel) {
                return winjs_base_1.TPromise.as(element.filteredResources);
            }
            if (element instanceof markersModel_1.Resource) {
                return winjs_base_1.TPromise.as(element.markers);
            }
            return null;
        };
        DataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.TPromise.as(null);
        };
        return DataSource;
    }());
    exports.DataSource = DataSource;
    var Renderer = (function () {
        function Renderer(actionRunner, actionProvider, contextService, instantiationService, themeService) {
            this.actionRunner = actionRunner;
            this.actionProvider = actionProvider;
            this.contextService = contextService;
            this.instantiationService = instantiationService;
            this.themeService = themeService;
        }
        Renderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        Renderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof markersModel_1.Resource) {
                if (element.uri.scheme === network.Schemas.file || element.uri.scheme === network.Schemas.untitled) {
                    return Renderer.FILE_RESOURCE_TEMPLATE_ID;
                }
                else {
                    return Renderer.RESOURCE_TEMPLATE_ID;
                }
            }
            if (element instanceof markersModel_1.Marker) {
                return Renderer.MARKER_TEMPLATE_ID;
            }
            return '';
        };
        Renderer.prototype.renderTemplate = function (tree, templateId, container) {
            dom.addClass(container, 'markers-panel-tree-entry');
            switch (templateId) {
                case Renderer.FILE_RESOURCE_TEMPLATE_ID:
                    return this.renderFileResourceTemplate(container);
                case Renderer.RESOURCE_TEMPLATE_ID:
                    return this.renderResourceTemplate(container);
                case Renderer.MARKER_TEMPLATE_ID:
                    return this.renderMarkerTemplate(container);
            }
        };
        Renderer.prototype.renderFileResourceTemplate = function (container) {
            var data = Object.create(null);
            var resourceLabelContainer = dom.append(container, dom.$('.resource-label-container'));
            data.fileLabel = this.instantiationService.createInstance(labels_1.FileLabel, resourceLabelContainer, { supportHighlights: true });
            var badgeWrapper = dom.append(container, dom.$('.count-badge-wrapper'));
            data.count = new countBadge_1.CountBadge(badgeWrapper);
            data.styler = styler_1.attachBadgeStyler(data.count, this.themeService);
            return data;
        };
        Renderer.prototype.renderResourceTemplate = function (container) {
            var data = Object.create(null);
            var resourceLabelContainer = dom.append(container, dom.$('.resource-label-container'));
            data.resourceLabel = this.instantiationService.createInstance(labels_1.ResourceLabel, resourceLabelContainer, { supportHighlights: true });
            var badgeWrapper = dom.append(container, dom.$('.count-badge-wrapper'));
            data.count = new countBadge_1.CountBadge(badgeWrapper);
            data.styler = styler_1.attachBadgeStyler(data.count, this.themeService);
            return data;
        };
        Renderer.prototype.renderMarkerTemplate = function (container) {
            var data = Object.create(null);
            data.icon = dom.append(container, dom.$('.marker-icon'));
            data.source = new highlightedLabel_1.HighlightedLabel(dom.append(container, dom.$('')));
            data.description = new highlightedLabel_1.HighlightedLabel(dom.append(container, dom.$('.marker-description')));
            data.lnCol = dom.append(container, dom.$('span.marker-line'));
            return data;
        };
        Renderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            switch (templateId) {
                case Renderer.FILE_RESOURCE_TEMPLATE_ID:
                case Renderer.RESOURCE_TEMPLATE_ID:
                    return this.renderResourceElement(tree, element, templateData);
                case Renderer.MARKER_TEMPLATE_ID:
                    return this.renderMarkerElement(tree, element, templateData);
            }
        };
        Renderer.prototype.renderResourceElement = function (tree, element, templateData) {
            if (templateData.fileLabel) {
                templateData.fileLabel.setFile(element.uri, { matches: element.matches });
            }
            else if (templateData.resourceLabel) {
                templateData.resourceLabel.setLabel({ name: element.name, description: element.uri.toString(), resource: element.uri }, { matches: element.matches });
            }
            templateData.count.setCount(element.markers.length);
        };
        Renderer.prototype.renderMarkerElement = function (tree, element, templateData) {
            var marker = element.marker;
            templateData.icon.className = 'icon ' + Renderer.iconClassNameFor(marker);
            templateData.description.set(marker.message, element.labelMatches);
            templateData.description.element.title = marker.message;
            dom.toggleClass(templateData.source.element, 'marker-source', !!marker.source);
            templateData.source.set(marker.source, element.sourceMatches);
            templateData.lnCol.textContent = messages_1.default.MARKERS_PANEL_AT_LINE_COL_NUMBER(marker.startLineNumber, marker.startColumn);
        };
        Renderer.iconClassNameFor = function (element) {
            switch (element.severity) {
                case severity_1.default.Ignore:
                    return 'info';
                case severity_1.default.Info:
                    return 'info';
                case severity_1.default.Warning:
                    return 'warning';
                case severity_1.default.Error:
                    return 'error';
            }
            return '';
        };
        Renderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            if (templateId === Renderer.FILE_RESOURCE_TEMPLATE_ID) {
                templateData.fileLabel.dispose();
                templateData.styler.dispose();
            }
            if (templateId === Renderer.RESOURCE_TEMPLATE_ID) {
                templateData.resourceLabel.dispose();
                templateData.styler.dispose();
            }
        };
        Renderer.RESOURCE_TEMPLATE_ID = 'resource-template';
        Renderer.FILE_RESOURCE_TEMPLATE_ID = 'file-resource-template';
        Renderer.MARKER_TEMPLATE_ID = 'marker-template';
        Renderer = __decorate([
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, themeService_1.IThemeService)
        ], Renderer);
        return Renderer;
    }());
    exports.Renderer = Renderer;
    var MarkersTreeAccessibilityProvider = (function () {
        function MarkersTreeAccessibilityProvider() {
        }
        MarkersTreeAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof markersModel_1.Resource) {
                return messages_1.default.MARKERS_TREE_ARIA_LABEL_RESOURCE(element.name, element.markers.length);
            }
            if (element instanceof markersModel_1.Marker) {
                return messages_1.default.MARKERS_TREE_ARIA_LABEL_MARKER(element.marker);
            }
            return null;
        };
        return MarkersTreeAccessibilityProvider;
    }());
    exports.MarkersTreeAccessibilityProvider = MarkersTreeAccessibilityProvider;
    var Sorter = (function () {
        function Sorter() {
        }
        Sorter.prototype.compare = function (tree, element, otherElement) {
            return markersModel_1.MarkersModel.compare(element, otherElement);
        };
        return Sorter;
    }());
    exports.Sorter = Sorter;
});
//# sourceMappingURL=markersTreeViewer.js.map