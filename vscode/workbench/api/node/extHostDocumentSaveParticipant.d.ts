import Event from 'vs/base/common/event';
import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { MainThreadWorkspaceShape, ExtHostDocumentSaveParticipantShape } from 'vs/workbench/api/node/extHost.protocol';
import { ExtHostDocuments } from 'vs/workbench/api/node/extHostDocuments';
import { SaveReason } from 'vs/workbench/services/textfile/common/textfiles';
import * as vscode from 'vscode';
export declare class ExtHostDocumentSaveParticipant implements ExtHostDocumentSaveParticipantShape {
    private _documents;
    private _workspace;
    private _callbacks;
    private _badListeners;
    private _thresholds;
    constructor(documents: ExtHostDocuments, workspace: MainThreadWorkspaceShape, thresholds?: {
        timeout: number;
        errors: number;
    });
    dispose(): void;
    readonly onWillSaveTextDocumentEvent: Event<vscode.TextDocumentWillSaveEvent>;
    $participateInSave(resource: URI, reason: SaveReason): TPromise<boolean[]>;
    private _deliverEventAsyncAndBlameBadListeners(listener, thisArg, stubEvent);
    private _deliverEventAsync(listener, thisArg, stubEvent);
}
