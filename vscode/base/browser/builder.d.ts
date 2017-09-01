import 'vs/css!./builder';
import { IDisposable } from 'vs/base/common/lifecycle';
/**
 * Welcome to the monaco builder. The recommended way to use it is:
 *
 * import Builder = require('vs/base/browser/builder');
 * let $ = Builder.$;
 * $(....).fn(...);
 *
 * See below for examples how to invoke the $():
 *
 * 	$()							- creates an offdom builder
 * 	$(builder)					- wraps the given builder
 * 	$(builder[])				- wraps the given builders into a multibuilder
 * 	$('div')					- creates a div
 * 	$('.big')					- creates a div with class `big`
 * 	$('#head')					- creates a div with id `head`
 * 	$('ul#head')				- creates an unordered list with id `head`
 * 	$('<a href="back"></a>')	- constructs a builder from the given HTML
 * 	$('a', { href: 'back'})		- constructs a builder, similarly to the Builder#element() call
 */
export interface QuickBuilder {
    (): Builder;
    (builders: Builder[]): Builder;
    (element: HTMLElement): Builder;
    (element: HTMLElement[]): Builder;
    (window: Window): Builder;
    (htmlOrQuerySyntax: string): Builder;
    (name: string, args?: any, fn?: (builder: Builder) => any): Builder;
    (one: string, two: string, three: string): Builder;
    (builder: Builder): Builder;
}
/**
 * Create a new builder from the element that is uniquely identified by the given identifier. If the
 *  second parameter "offdom" is set to true, the created elements will only be added to the provided
 *  element when the build() method is called.
 */
export declare function withElementById(id: string, offdom?: boolean): Builder;
export declare const Build: {
    withElementById: (id: string, offdom?: boolean) => Builder;
};
export declare class Position {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
export declare class Box {
    top: number;
    right: number;
    bottom: number;
    left: number;
    constructor(top: number, right: number, bottom: number, left: number);
}
export declare class Dimension {
    width: number;
    height: number;
    constructor(width: number, height: number);
    substract(box: Box): Dimension;
}
export interface IRange {
    start: number;
    end: number;
}
/**
 *  Wraps around the provided element to manipulate it and add more child elements.
 */
export declare class Builder implements IDisposable {
    private currentElement;
    private offdom;
    private container;
    private createdElements;
    private toUnbind;
    private captureToUnbind;
    constructor(element?: HTMLElement, offdom?: boolean);
    /**
     *  Returns a new builder that lets the current HTML Element of this builder be the container
     *  for future additions on the builder.
     */
    asContainer(): Builder;
    /**
     *  Clones the builder providing the same properties as this one.
     */
    clone(): Builder;
    /**
     *  Creates a new Builder that performs all operations on the current element of the builder and
     *  the builder or element being passed in.
     */
    and(element: HTMLElement): MultiBuilder;
    and(builder: Builder): MultiBuilder;
    /**
     *  Inserts all created elements of this builder as children to the given container. If the
     *  container is not provided, the element that was passed into the Builder at construction
     *  time is being used. The caller can provide the index of insertion, or omit it to append
     *  at the end.
     *  This method is a no-op unless the builder was created with the offdom option to be true.
     */
    build(container?: Builder, index?: number): Builder;
    build(container?: HTMLElement, index?: number): Builder;
    /**
     *  Similar to #build, but does not require that the builder is off DOM, and instead
     *  attached the current element. If the current element has a parent, it will be
     *  detached from that parent.
     */
    appendTo(container?: Builder, index?: number): Builder;
    appendTo(container?: HTMLElement, index?: number): Builder;
    /**
     *  Performs the exact reverse operation of #append.
     *  Doing `a.append(b)` is the same as doing `b.appendTo(a)`, with the difference
     *  of the return value being the builder which called the operation (`a` in the
     *  first case; `b` in the second case).
     */
    append(child: HTMLElement, index?: number): Builder;
    append(child: Builder, index?: number): Builder;
    /**
     *  Removes the current element of this builder from its parent node.
     */
    offDOM(): Builder;
    /**
     *  Returns the HTML Element the builder is currently active on.
     */
    getHTMLElement(): HTMLElement;
    /**
     *  Returns the HTML Element the builder is building in.
     */
    getContainer(): HTMLElement;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    div(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    p(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    ul(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    ol(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    li(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    span(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    img(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    a(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    header(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    section(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of this kind as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    footer(attributes?: any, fn?: (builder: Builder) => void): Builder;
    /**
     *  Creates a new element of given tag name as child of the current element or parent.
     *  Accepts an object literal as first parameter that can be used to describe the
     *  attributes of the element.
     *  Accepts a function as second parameter that can be used to create child elements
     *  of the element. The function will be called with a new builder created with the
     *  provided element.
     */
    element(name: string, attributes?: any, fn?: (builder: Builder) => void): Builder;
    private doElement(name, attributesOrFn?, fn?);
    /**
     *  Calls focus() on the current HTML element;
     */
    domFocus(): Builder;
    /**
     *  Returns true if the current element of this builder is the active element.
     */
    hasFocus(): boolean;
    /**
     *  Calls select() on the current HTML element;
     */
    domSelect(range?: IRange): Builder;
    /**
     *  Calls blur() on the current HTML element;
     */
    domBlur(): Builder;
    /**
     *  Calls click() on the current HTML element;
     */
    domClick(): Builder;
    /**
     *  Registers listener on event types on the current element.
     */
    on(type: string, fn: (e: Event, builder: Builder, unbind: IDisposable) => void, listenerToUnbindContainer?: IDisposable[], useCapture?: boolean): Builder;
    on(typeArray: string[], fn: (e: Event, builder: Builder, unbind: IDisposable) => void, listenerToUnbindContainer?: IDisposable[], useCapture?: boolean): Builder;
    /**
     *  Removes all listeners from all elements created by the builder for the given event type.
     */
    off(type: string, useCapture?: boolean): Builder;
    off(typeArray: string[], useCapture?: boolean): Builder;
    /**
     *  Registers listener on event types on the current element and removes
     *  them after first invocation.
     */
    once(type: string, fn: (e: Event, builder: Builder, unbind: IDisposable) => void, listenerToUnbindContainer?: IDisposable[], useCapture?: boolean): Builder;
    once(typesArray: string[], fn: (e: Event, builder: Builder, unbind: IDisposable) => void, listenerToUnbindContainer?: IDisposable[], useCapture?: boolean): Builder;
    /**
     *  Registers listener on event types on the current element and causes
     *  the event to prevent default execution (e.preventDefault()). If the
     *  parameter "cancelBubble" is set to true, it will also prevent bubbling
     *  of the event.
     */
    preventDefault(type: string, cancelBubble: boolean, listenerToUnbindContainer?: IDisposable[], useCapture?: boolean): Builder;
    preventDefault(typesArray: string[], cancelBubble: boolean, listenerToUnbindContainer?: IDisposable[], useCapture?: boolean): Builder;
    /**
     * 	This method has different characteristics based on the parameter provided:
     *  a) a single string passed in as argument will return the attribute value using the
     *  string as key from the current element of the builder.
     *  b) two strings passed in will set the value of an attribute identified by the first
     *  parameter to match the second parameter
     *  c) an object literal passed in will apply the properties of the literal as attributes
     *  to the current element of the builder.
     */
    attr(name: string): string;
    attr(name: string, value: string): Builder;
    attr(name: string, value: boolean): Builder;
    attr(name: string, value: number): Builder;
    attr(attributes: any): Builder;
    private doSetAttr(prop, value);
    /**
     * Removes an attribute by the given name.
     */
    removeAttribute(prop: string): void;
    /**
     *  Sets the id attribute to the value provided for the current HTML element of the builder.
     */
    id(id: string): Builder;
    /**
     *  Sets the src attribute to the value provided for the current HTML element of the builder.
     */
    src(src: string): Builder;
    /**
     *  Sets the href attribute to the value provided for the current HTML element of the builder.
     */
    href(href: string): Builder;
    /**
     *  Sets the title attribute to the value provided for the current HTML element of the builder.
     */
    title(title: string): Builder;
    /**
     *  Sets the name attribute to the value provided for the current HTML element of the builder.
     */
    name(name: string): Builder;
    /**
     *  Sets the type attribute to the value provided for the current HTML element of the builder.
     */
    type(type: string): Builder;
    /**
     *  Sets the value attribute to the value provided for the current HTML element of the builder.
     */
    value(value: string): Builder;
    /**
     *  Sets the alt attribute to the value provided for the current HTML element of the builder.
     */
    alt(alt: string): Builder;
    /**
     *  Sets the name draggable to the value provided for the current HTML element of the builder.
     */
    draggable(isDraggable: boolean): Builder;
    /**
     *  Sets the tabindex attribute to the value provided for the current HTML element of the builder.
     */
    tabindex(index: number): Builder;
    /**
     * 	This method has different characteristics based on the parameter provided:
     *  a) a single string passed in as argument will return the style value using the
     *  string as key from the current element of the builder.
     *  b) two strings passed in will set the style value identified by the first
     *  parameter to match the second parameter. The second parameter can be null
     *  to unset a style
     *  c) an object literal passed in will apply the properties of the literal as styles
     *  to the current element of the builder.
     */
    style(name: string): string;
    style(name: string, value: string): Builder;
    style(attributes: any): Builder;
    private doSetStyle(key, value);
    private cssKeyToJavaScriptProperty(key);
    /**
     *  Returns the computed CSS style for the current HTML element of the builder.
     */
    getComputedStyle(): CSSStyleDeclaration;
    /**
     *  Adds the variable list of arguments as class names to the current HTML element of the builder.
     */
    addClass(...classes: string[]): Builder;
    /**
     *  Sets the class name of the current HTML element of the builder to the provided className.
     *  If shouldAddClass is provided - for true class is added, for false class is removed.
     */
    setClass(className: string, shouldAddClass?: boolean): Builder;
    /**
     *  Returns whether the current HTML element of the builder has the provided class assigned.
     */
    hasClass(className: string): boolean;
    /**
     *  Removes the variable list of arguments as class names from the current HTML element of the builder.
     */
    removeClass(...classes: string[]): Builder;
    /**
     *  Sets the first class to the current HTML element of the builder if the second class is currently set
     *  and vice versa otherwise.
     */
    swapClass(classA: string, classB: string): Builder;
    /**
     *  Adds or removes the provided className for the current HTML element of the builder.
     */
    toggleClass(className: string): Builder;
    /**
     *  Sets the CSS property color.
     */
    color(color: string): Builder;
    /**
     *  Sets the CSS property background.
     */
    background(color: string): Builder;
    /**
     *  Sets the CSS property padding.
     */
    padding(padding: string): Builder;
    padding(top: number, right?: number, bottom?: number, left?: number): Builder;
    padding(top: string, right?: string, bottom?: string, left?: string): Builder;
    /**
     *  Sets the CSS property margin.
     */
    margin(margin: string): Builder;
    margin(top: number, right?: number, bottom?: number, left?: number): Builder;
    margin(top: string, right?: string, bottom?: string, left?: string): Builder;
    /**
     *  Sets the CSS property position.
     */
    position(position: string): Builder;
    position(top: number, right?: number, bottom?: number, left?: number, position?: string): Builder;
    position(top: string, right?: string, bottom?: string, left?: string, position?: string): Builder;
    /**
     *  Sets the CSS property size.
     */
    size(size: string): Builder;
    size(width: number, height?: number): Builder;
    size(width: string, height?: string): Builder;
    /**
     *  Sets the CSS property min-size.
     */
    minSize(size: string): Builder;
    minSize(width: number, height?: number): Builder;
    minSize(width: string, height?: string): Builder;
    /**
     *  Sets the CSS property max-size.
     */
    maxSize(size: string): Builder;
    maxSize(width: number, height?: number): Builder;
    maxSize(width: string, height?: string): Builder;
    /**
     *  Sets the CSS property float.
     */
    float(float: string): Builder;
    /**
     *  Sets the CSS property clear.
     */
    clear(clear: string): Builder;
    /**
     *  Sets the CSS property for fonts back to default.
     */
    normal(): Builder;
    /**
     *  Sets the CSS property font-style to italic.
     */
    italic(): Builder;
    /**
     *  Sets the CSS property font-weight to bold.
     */
    bold(): Builder;
    /**
     *  Sets the CSS property text-decoration to underline.
     */
    underline(): Builder;
    /**
     *  Sets the CSS property overflow.
     */
    overflow(overflow: string): Builder;
    /**
     *  Sets the CSS property display.
     */
    display(display: string): Builder;
    disable(): Builder;
    enable(): Builder;
    /**
     *  Shows the current element of the builder.
     */
    show(): Builder;
    /**
     *  Shows the current builder element after the provided delay. If the builder
     *  was set to hidden using the hide() method before this method executed, the
     *  function will return without showing the current element. This is useful to
     *  only show the element when a specific delay is reached (e.g. for a long running
     *  operation.
     */
    showDelayed(delay: number): Builder;
    /**
     *  Hides the current element of the builder.
     */
    hide(): Builder;
    /**
     *  Returns true if the current element of the builder is hidden.
     */
    isHidden(): boolean;
    /**
     *  Toggles visibility of the current element of the builder.
     */
    toggleVisibility(): Builder;
    private cancelVisibilityPromise();
    /**
     *  Sets the CSS property border.
     */
    border(border: string): Builder;
    border(width: number, style?: string, color?: string): Builder;
    /**
     *  Sets the CSS property border-top.
     */
    borderTop(border: string): Builder;
    borderTop(width: number, style: string, color: string): Builder;
    /**
     *  Sets the CSS property border-bottom.
     */
    borderBottom(border: string): Builder;
    borderBottom(width: number, style: string, color: string): Builder;
    /**
     *  Sets the CSS property border-left.
     */
    borderLeft(border: string): Builder;
    borderLeft(width: number, style: string, color: string): Builder;
    /**
     *  Sets the CSS property border-right.
     */
    borderRight(border: string): Builder;
    borderRight(width: number, style: string, color: string): Builder;
    /**
     *  Sets the CSS property text-align.
     */
    textAlign(textAlign: string): Builder;
    /**
     *  Sets the CSS property vertical-align.
     */
    verticalAlign(valign: string): Builder;
    private toPixel(obj);
    /**
     *  Sets the innerHTML attribute.
     */
    innerHtml(html: string, append?: boolean): Builder;
    /**
     *  Sets the textContent property of the element.
     *  All HTML special characters will be escaped.
     */
    text(text: string, append?: boolean): Builder;
    /**
     *  Sets the innerHTML attribute in escaped form.
     */
    safeInnerHtml(html: string, append?: boolean): Builder;
    /**
     *  Adds the provided object as property to the current element. Call getBinding()
     *  to retrieve it again.
     */
    bind(object: any): Builder;
    /**
     *  Removes the binding of the current element.
     */
    unbind(): Builder;
    /**
     *  Returns the object that was passed into the bind() call.
     */
    getBinding(): any;
    /**
     *  Allows to store arbritary data into the current element.
     */
    setProperty(key: string, value: any): Builder;
    /**
     *  Allows to get arbritary data from the current element.
     */
    getProperty(key: string, fallback?: any): any;
    /**
     *  Removes a property from the current element that is stored under the given key.
     */
    removeProperty(key: string): Builder;
    /**
     *  Returns a new builder with the parent element of the current element of the builder.
     */
    parent(offdom?: boolean): Builder;
    /**
     *  Returns a new builder with all child elements of the current element of the builder.
     */
    children(offdom?: boolean): MultiBuilder;
    /**
     * Returns a new builder with the child at the given index.
     */
    child(index?: number): Builder;
    /**
     *  Removes the current HTMLElement from the given builder from this builder if this builders
     *  current HTMLElement is the direct parent.
     */
    removeChild(builder: Builder): Builder;
    /**
     *  Returns a new builder with all elements matching the provided selector scoped to the
     *  current element of the builder. Use Build.withElementsBySelector() to run the selector
     *  over the entire DOM.
     *  The returned builder is an instance of array that can have 0 elements if the selector does not match any
     *  elements.
     */
    select(selector: string, offdom?: boolean): MultiBuilder;
    /**
     *  Returns true if the current element of the builder matches the given selector and false otherwise.
     */
    matches(selector: string): boolean;
    /**
     *  Returns true if the current element of the builder has no children.
     */
    isEmpty(): boolean;
    /**
     * Recurse through all descendant nodes and remove their data binding.
     */
    private unbindDescendants(current);
    /**
     *  Removes all HTML elements from the current element of the builder. Will also clean up any
     *  event listners registered and also clear any data binding and properties stored
     *  to any child element.
     */
    empty(): Builder;
    /**
     *  Removes all HTML elements from the current element of the builder.
     */
    clearChildren(): Builder;
    /**
     *  Removes the current HTML element and all its children from its parent and unbinds
     *  all listeners and properties set to the data slots.
     */
    destroy(): void;
    /**
     *  Removes the current HTML element and all its children from its parent and unbinds
     *  all listeners and properties set to the data slots.
     */
    dispose(): void;
    /**
     *  Gets the size (in pixels) of an element, including the margin.
     */
    getTotalSize(): Dimension;
    /**
     *  Gets the size (in pixels) of the inside of the element, excluding the border and padding.
     */
    getContentSize(): Dimension;
    /**
     *  Another variant of getting the inner dimensions of an element.
     */
    getClientArea(): Dimension;
}
/**
 *  The multi builder provides the same methods as the builder, but allows to call
 *  them on an array of builders.
 */
export declare class MultiBuilder extends Builder {
    length: number;
    private builders;
    constructor(multiBuilder: MultiBuilder);
    constructor(builder: Builder);
    constructor(builders: Builder[]);
    constructor(elements: HTMLElement[]);
    item(i: number): Builder;
    push(...items: Builder[]): void;
    pop(): Builder;
    concat(items: Builder[]): Builder[];
    shift(): Builder;
    unshift(item: Builder): number;
    slice(start: number, end?: number): Builder[];
    splice(start: number, deleteCount?: number): Builder[];
    clone(): MultiBuilder;
    and(element: HTMLElement): MultiBuilder;
    and(builder: Builder): MultiBuilder;
}
/**
 *  Allows to store arbritary data into element.
 */
export declare function setPropertyOnElement(element: HTMLElement, key: string, value: any): void;
/**
 *  Allows to get arbritary data from element.
 */
export declare function getPropertyFromElement(element: HTMLElement, key: string, fallback?: any): any;
/**
 *  Removes a property from an element.
 */
export declare function removePropertyFromElement(element: HTMLElement, key: string): void;
/**
 *  Adds the provided object as property to the given element. Call getBinding()
 *  to retrieve it again.
 */
export declare function bindElement(element: HTMLElement, object: any): void;
/**
 *  Removes the binding of the given element.
 */
export declare function unbindElement(element: HTMLElement): void;
/**
 *  Returns the object that was passed into the bind() call for the element.
 */
export declare function getBindingFromElement(element: HTMLElement): any;
export declare const Binding: {
    setPropertyOnElement: (element: HTMLElement, key: string, value: any) => void;
    getPropertyFromElement: (element: HTMLElement, key: string, fallback?: any) => any;
    removePropertyFromElement: (element: HTMLElement, key: string) => void;
    bindElement: (element: HTMLElement, object: any) => void;
    unbindElement: (element: HTMLElement) => void;
    getBindingFromElement: (element: HTMLElement) => any;
};
export declare const $: QuickBuilder;
