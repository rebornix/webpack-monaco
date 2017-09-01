import URI from 'vs/base/common/uri';
import * as vscode from 'vscode';
import { MainThreadDiagnosticsShape, ExtHostDiagnosticsShape, IMainContext } from './extHost.protocol';
export declare class DiagnosticCollection implements vscode.DiagnosticCollection {
    private static readonly _maxDiagnosticsPerFile;
    private readonly _name;
    private _proxy;
    private _isDisposed;
    private _data;
    constructor(name: string, proxy: MainThreadDiagnosticsShape);
    dispose(): void;
    readonly name: string;
    set(uri: vscode.Uri, diagnostics: vscode.Diagnostic[]): void;
    set(entries: [vscode.Uri, vscode.Diagnostic[]][]): void;
    delete(uri: vscode.Uri): void;
    clear(): void;
    forEach(callback: (uri: URI, diagnostics: vscode.Diagnostic[], collection: DiagnosticCollection) => any, thisArg?: any): void;
    get(uri: URI): vscode.Diagnostic[];
    has(uri: URI): boolean;
    private _checkDisposed();
    private static _toMarkerData(diagnostic);
    private static _convertDiagnosticsSeverity(severity);
    private static _compareIndexedTuplesByUri(a, b);
}
export declare class ExtHostDiagnostics implements ExtHostDiagnosticsShape {
    private static _idPool;
    private _proxy;
    private _collections;
    constructor(mainContext: IMainContext);
    createDiagnosticCollection(name: string): vscode.DiagnosticCollection;
    forEach(callback: (collection: DiagnosticCollection) => any): void;
}
