export declare class Event {
    time: number;
    originalEvent: Event;
    source: any;
    constructor(originalEvent?: Event);
}
export declare class PropertyChangeEvent extends Event {
    key: string;
    oldValue: any;
    newValue: any;
    constructor(key?: string, oldValue?: any, newValue?: any, originalEvent?: Event);
}
export declare class ViewerEvent extends Event {
    element: any;
    constructor(element: any, originalEvent?: Event);
}
export interface ISelectionEvent {
    selection: any[];
    payload?: any;
    source: any;
}
export interface IFocusEvent {
    focus: any;
    payload?: any;
    source: any;
}
export interface IHighlightEvent {
    highlight: any;
    payload?: any;
    source: any;
}
export declare const EventType: {
    PROPERTY_CHANGED: string;
    SELECTION: string;
    FOCUS: string;
    BLUR: string;
    HIGHLIGHT: string;
    EXPAND: string;
    COLLAPSE: string;
    TOGGLE: string;
    BEFORE_RUN: string;
    RUN: string;
    EDIT: string;
    SAVE: string;
    CANCEL: string;
    CHANGE: string;
    DISPOSE: string;
};
