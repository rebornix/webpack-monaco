define(["require", "exports", "vs/nls", "vs/base/common/severity"], function (require, exports, nls, severity_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Messages = (function () {
        function Messages() {
        }
        Messages.MARKERS_PANEL_VIEW_CATEGORY = nls.localize('viewCategory', "View");
        Messages.MARKERS_PANEL_TOGGLE_LABEL = nls.localize('problems.view.show.label', "Show Problems");
        Messages.PROBLEMS_PANEL_CONFIGURATION_TITLE = nls.localize('problems.panel.configuration.title', "Problems View");
        Messages.PROBLEMS_PANEL_CONFIGURATION_AUTO_REVEAL = nls.localize('problems.panel.configuration.autoreveal', "Controls if Problems view should automatically reveal files when opening them");
        Messages.MARKERS_PANEL_TITLE_PROBLEMS = nls.localize('markers.panel.title.problems', "Problems");
        Messages.MARKERS_PANEL_ARIA_LABEL_PROBLEMS_TREE = nls.localize('markers.panel.aria.label.problems.tree', "Problems grouped by files");
        Messages.MARKERS_PANEL_NO_PROBLEMS_BUILT = nls.localize('markers.panel.no.problems.build', "No problems have been detected in the workspace so far.");
        Messages.MARKERS_PANEL_NO_PROBLEMS_FILTERS = nls.localize('markers.panel.no.problems.filters', "No results found with provided filter criteria");
        Messages.MARKERS_PANEL_ACTION_TOOLTIP_FILTER = nls.localize('markers.panel.action.filter', "Filter Problems");
        Messages.MARKERS_PANEL_FILTER_PLACEHOLDER = nls.localize('markers.panel.filter.placeholder', "Filter by type or text");
        Messages.MARKERS_PANEL_FILTER_ERRORS = nls.localize('markers.panel.filter.errors', "errors");
        Messages.MARKERS_PANEL_FILTER_WARNINGS = nls.localize('markers.panel.filter.warnings', "warnings");
        Messages.MARKERS_PANEL_FILTER_INFOS = nls.localize('markers.panel.filter.infos', "infos");
        Messages.MARKERS_PANEL_SINGLE_ERROR_LABEL = nls.localize('markers.panel.single.error.label', "1 Error");
        Messages.MARKERS_PANEL_MULTIPLE_ERRORS_LABEL = function (noOfErrors) { return nls.localize('markers.panel.multiple.errors.label', "{0} Errors", '' + noOfErrors); };
        Messages.MARKERS_PANEL_SINGLE_WARNING_LABEL = nls.localize('markers.panel.single.warning.label', "1 Warning");
        Messages.MARKERS_PANEL_MULTIPLE_WARNINGS_LABEL = function (noOfWarnings) { return nls.localize('markers.panel.multiple.warnings.label', "{0} Warnings", '' + noOfWarnings); };
        Messages.MARKERS_PANEL_SINGLE_INFO_LABEL = nls.localize('markers.panel.single.info.label', "1 Info");
        Messages.MARKERS_PANEL_MULTIPLE_INFOS_LABEL = function (noOfInfos) { return nls.localize('markers.panel.multiple.infos.label', "{0} Infos", '' + noOfInfos); };
        Messages.MARKERS_PANEL_SINGLE_UNKNOWN_LABEL = nls.localize('markers.panel.single.unknown.label', "1 Unknown");
        Messages.MARKERS_PANEL_MULTIPLE_UNKNOWNS_LABEL = function (noOfUnknowns) { return nls.localize('markers.panel.multiple.unknowns.label', "{0} Unknowns", '' + noOfUnknowns); };
        Messages.MARKERS_PANEL_AT_LINE_COL_NUMBER = function (ln, col) { return nls.localize('markers.panel.at.ln.col.number', "({0}, {1})", '' + ln, '' + col); };
        Messages.MARKERS_TREE_ARIA_LABEL_RESOURCE = function (fileName, noOfProblems) { return nls.localize('problems.tree.aria.label.resource', "{0} with {1} problems", fileName, noOfProblems); };
        Messages.MARKERS_TREE_ARIA_LABEL_MARKER = function (marker) {
            switch (marker.severity) {
                case severity_1.default.Error:
                    return marker.source ? nls.localize('problems.tree.aria.label.error.marker', "Error generated by {0}: {1} at line {2} and character {3}", marker.source, marker.message, marker.startLineNumber, marker.startColumn)
                        : nls.localize('problems.tree.aria.label.error.marker.nosource', "Error: {0} at line {1} and character {2}", marker.message, marker.startLineNumber, marker.startColumn);
                case severity_1.default.Warning:
                    return marker.source ? nls.localize('problems.tree.aria.label.warning.marker', "Warning generated by {0}: {1} at line {2} and character {3}", marker.source, marker.message, marker.startLineNumber, marker.startColumn)
                        : nls.localize('problems.tree.aria.label.warning.marker.nosource', "Warning: {0} at line {1} and character {2}", marker.message, marker.startLineNumber, marker.startColumn);
                case severity_1.default.Info:
                    return marker.source ? nls.localize('problems.tree.aria.label.info.marker', "Info generated by {0}: {1} at line {2} and character {3}", marker.source, marker.message, marker.startLineNumber, marker.startColumn)
                        : nls.localize('problems.tree.aria.label.info.marker.nosource', "Info: {0} at line {1} and character {2}", marker.message, marker.startLineNumber, marker.startColumn);
                default:
                    return marker.source ? nls.localize('problems.tree.aria.label.marker', "Problem generated by {0}: {1} at line {2} and character {3}", marker.source, marker.message, marker.startLineNumber, marker.startColumn)
                        : nls.localize('problems.tree.aria.label.marker.nosource', "Problem: {0} at line {1} and character {2}", marker.message, marker.startLineNumber, marker.startColumn);
            }
        };
        Messages.SHOW_ERRORS_WARNINGS_ACTION_LABEL = nls.localize('errors.warnings.show.label', "Show Errors and Warnings");
        return Messages;
    }());
    exports.default = Messages;
});
//# sourceMappingURL=messages.js.map