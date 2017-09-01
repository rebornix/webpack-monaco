import { IMarker } from 'vs/platform/markers/common/markers';
export default class Messages {
    static MARKERS_PANEL_VIEW_CATEGORY: string;
    static MARKERS_PANEL_TOGGLE_LABEL: string;
    static PROBLEMS_PANEL_CONFIGURATION_TITLE: string;
    static PROBLEMS_PANEL_CONFIGURATION_AUTO_REVEAL: string;
    static MARKERS_PANEL_TITLE_PROBLEMS: string;
    static MARKERS_PANEL_ARIA_LABEL_PROBLEMS_TREE: string;
    static MARKERS_PANEL_NO_PROBLEMS_BUILT: string;
    static MARKERS_PANEL_NO_PROBLEMS_FILTERS: string;
    static MARKERS_PANEL_ACTION_TOOLTIP_FILTER: string;
    static MARKERS_PANEL_FILTER_PLACEHOLDER: string;
    static MARKERS_PANEL_FILTER_ERRORS: string;
    static MARKERS_PANEL_FILTER_WARNINGS: string;
    static MARKERS_PANEL_FILTER_INFOS: string;
    static MARKERS_PANEL_SINGLE_ERROR_LABEL: string;
    static MARKERS_PANEL_MULTIPLE_ERRORS_LABEL: (noOfErrors: number) => string;
    static MARKERS_PANEL_SINGLE_WARNING_LABEL: string;
    static MARKERS_PANEL_MULTIPLE_WARNINGS_LABEL: (noOfWarnings: number) => string;
    static MARKERS_PANEL_SINGLE_INFO_LABEL: string;
    static MARKERS_PANEL_MULTIPLE_INFOS_LABEL: (noOfInfos: number) => string;
    static MARKERS_PANEL_SINGLE_UNKNOWN_LABEL: string;
    static MARKERS_PANEL_MULTIPLE_UNKNOWNS_LABEL: (noOfUnknowns: number) => string;
    static MARKERS_PANEL_AT_LINE_COL_NUMBER: (ln: number, col: number) => string;
    static MARKERS_TREE_ARIA_LABEL_RESOURCE: (fileName: any, noOfProblems: any) => string;
    static MARKERS_TREE_ARIA_LABEL_MARKER: (marker: IMarker) => string;
    static SHOW_ERRORS_WARNINGS_ACTION_LABEL: string;
}
