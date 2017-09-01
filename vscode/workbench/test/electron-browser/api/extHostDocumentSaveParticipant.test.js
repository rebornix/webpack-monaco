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
define(["require", "exports", "assert", "vs/base/common/uri", "vs/base/common/winjs.base", "vs/workbench/api/node/extHostDocuments", "vs/workbench/api/node/extHostDocumentsAndEditors", "vs/workbench/api/node/extHostTypes", "vs/workbench/api/node/extHostDocumentSaveParticipant", "./testThreadService", "vs/workbench/services/textfile/common/textfiles", "vs/workbench/test/electron-browser/api/mock"], function (require, exports, assert, uri_1, winjs_base_1, extHostDocuments_1, extHostDocumentsAndEditors_1, extHostTypes_1, extHostDocumentSaveParticipant_1, testThreadService_1, textfiles_1, mock_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ExtHostDocumentSaveParticipant', function () {
        var resource = uri_1.default.parse('foo:bar');
        var workspace = new (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return class_1;
        }(mock_1.mock()));
        var documents;
        setup(function () {
            var documentsAndEditors = new extHostDocumentsAndEditors_1.ExtHostDocumentsAndEditors(testThreadService_1.OneGetThreadService(null));
            documentsAndEditors.$acceptDocumentsAndEditorsDelta({
                addedDocuments: [{
                        isDirty: false,
                        modeId: 'foo',
                        url: resource,
                        versionId: 1,
                        lines: ['foo'],
                        EOL: '\n',
                    }]
            });
            documents = new extHostDocuments_1.ExtHostDocuments(testThreadService_1.OneGetThreadService(null), documentsAndEditors);
        });
        test('no listeners, no problem', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace);
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function () { return assert.ok(true); });
        });
        test('event delivery', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace);
            var event;
            var sub = participant.onWillSaveTextDocumentEvent(function (e) {
                event = e;
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function () {
                sub.dispose();
                assert.ok(event);
                assert.equal(event.reason, extHostTypes_1.TextDocumentSaveReason.Manual);
                assert.equal(typeof event.waitUntil, 'function');
            });
        });
        test('event delivery, immutable', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace);
            var event;
            var sub = participant.onWillSaveTextDocumentEvent(function (e) {
                event = e;
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function () {
                sub.dispose();
                assert.ok(event);
                assert.throws(function () { return event.document = null; });
            });
        });
        test('event delivery, bad listener', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace);
            var sub = participant.onWillSaveTextDocumentEvent(function (e) {
                throw new Error('💀');
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function (values) {
                sub.dispose();
                var first = values[0];
                assert.equal(first, false);
            });
        });
        test('event delivery, bad listener doesn\'t prevent more events', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace);
            var sub1 = participant.onWillSaveTextDocumentEvent(function (e) {
                throw new Error('💀');
            });
            var event;
            var sub2 = participant.onWillSaveTextDocumentEvent(function (e) {
                event = e;
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function () {
                sub1.dispose();
                sub2.dispose();
                assert.ok(event);
            });
        });
        test('event delivery, in subscriber order', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace);
            var counter = 0;
            var sub1 = participant.onWillSaveTextDocumentEvent(function (event) {
                assert.equal(counter++, 0);
            });
            var sub2 = participant.onWillSaveTextDocumentEvent(function (event) {
                assert.equal(counter++, 1);
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function () {
                sub1.dispose();
                sub2.dispose();
            });
        });
        test('event delivery, ignore bad listeners', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace, { timeout: 5, errors: 1 });
            var callCount = 0;
            var sub = participant.onWillSaveTextDocumentEvent(function (event) {
                callCount += 1;
                throw new Error('boom');
            });
            return winjs_base_1.TPromise.join([
                participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT),
                participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT),
                participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT),
                participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT)
            ]).then(function (values) {
                sub.dispose();
                assert.equal(callCount, 2);
            });
        });
        test('event delivery, overall timeout', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace, { timeout: 20, errors: 5 });
            var callCount = 0;
            var sub1 = participant.onWillSaveTextDocumentEvent(function (event) {
                callCount += 1;
                event.waitUntil(winjs_base_1.TPromise.timeout(17));
            });
            var sub2 = participant.onWillSaveTextDocumentEvent(function (event) {
                callCount += 1;
                event.waitUntil(winjs_base_1.TPromise.timeout(17));
            });
            var sub3 = participant.onWillSaveTextDocumentEvent(function (event) {
                callCount += 1;
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function (values) {
                sub1.dispose();
                sub2.dispose();
                sub3.dispose();
                assert.equal(callCount, 2);
                assert.equal(values.length, 2);
            });
        });
        test('event delivery, waitUntil', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace);
            var sub = participant.onWillSaveTextDocumentEvent(function (event) {
                event.waitUntil(winjs_base_1.TPromise.timeout(10));
                event.waitUntil(winjs_base_1.TPromise.timeout(10));
                event.waitUntil(winjs_base_1.TPromise.timeout(10));
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function () {
                sub.dispose();
            });
        });
        test('event delivery, waitUntil must be called sync', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace);
            var sub = participant.onWillSaveTextDocumentEvent(function (event) {
                event.waitUntil(new winjs_base_1.TPromise(function (resolve, reject) {
                    setTimeout(function () {
                        try {
                            assert.throws(function () { return event.waitUntil(winjs_base_1.TPromise.timeout(10)); });
                            resolve(void 0);
                        }
                        catch (e) {
                            reject(e);
                        }
                    }, 10);
                }));
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function () {
                sub.dispose();
            });
        });
        test('event delivery, waitUntil will timeout', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace, { timeout: 5, errors: 3 });
            var sub = participant.onWillSaveTextDocumentEvent(function (event) {
                event.waitUntil(winjs_base_1.TPromise.timeout(15));
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function (values) {
                sub.dispose();
                var first = values[0];
                assert.equal(first, false);
            });
        });
        test('event delivery, waitUntil failure handling', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, workspace);
            var sub1 = participant.onWillSaveTextDocumentEvent(function (e) {
                e.waitUntil(winjs_base_1.TPromise.wrapError(new Error('dddd')));
            });
            var event;
            var sub2 = participant.onWillSaveTextDocumentEvent(function (e) {
                event = e;
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function () {
                assert.ok(event);
                sub1.dispose();
                sub2.dispose();
            });
        });
        test('event delivery, pushEdits sync', function () {
            var edits;
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, new (function (_super) {
                __extends(class_2, _super);
                function class_2() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_2.prototype.$applyWorkspaceEdit = function (_edits) {
                    edits = _edits;
                    return winjs_base_1.TPromise.as(true);
                };
                return class_2;
            }(mock_1.mock())));
            var sub = participant.onWillSaveTextDocumentEvent(function (e) {
                e.waitUntil(winjs_base_1.TPromise.as([extHostTypes_1.TextEdit.insert(new extHostTypes_1.Position(0, 0), 'bar')]));
                e.waitUntil(winjs_base_1.TPromise.as([extHostTypes_1.TextEdit.setEndOfLine(extHostTypes_1.EndOfLine.CRLF)]));
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function () {
                sub.dispose();
                assert.equal(edits.length, 2);
            });
        });
        test('event delivery, concurrent change', function () {
            var edits;
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, new (function (_super) {
                __extends(class_3, _super);
                function class_3() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_3.prototype.$applyWorkspaceEdit = function (_edits) {
                    edits = _edits;
                    return winjs_base_1.TPromise.as(true);
                };
                return class_3;
            }(mock_1.mock())));
            var sub = participant.onWillSaveTextDocumentEvent(function (e) {
                // concurrent change from somewhere
                documents.$acceptModelChanged(resource.toString(), {
                    changes: [{
                            range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 },
                            rangeLength: undefined,
                            text: 'bar'
                        }],
                    eol: undefined,
                    versionId: 2
                }, true);
                e.waitUntil(winjs_base_1.TPromise.as([extHostTypes_1.TextEdit.insert(new extHostTypes_1.Position(0, 0), 'bar')]));
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function (values) {
                sub.dispose();
                assert.equal(edits, undefined);
                assert.equal(values[0], false);
            });
        });
        test('event delivery, two listeners -> two document states', function () {
            var participant = new extHostDocumentSaveParticipant_1.ExtHostDocumentSaveParticipant(documents, new (function (_super) {
                __extends(class_4, _super);
                function class_4() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_4.prototype.$applyWorkspaceEdit = function (_edits) {
                    for (var _i = 0, _edits_1 = _edits; _i < _edits_1.length; _i++) {
                        var _a = _edits_1[_i], resource_1 = _a.resource, newText = _a.newText, range = _a.range;
                        documents.$acceptModelChanged(resource_1.toString(), {
                            changes: [{
                                    range: range,
                                    rangeLength: undefined,
                                    text: newText
                                }],
                            eol: undefined,
                            versionId: documents.getDocumentData(resource_1).version + 1
                        }, true);
                    }
                    return winjs_base_1.TPromise.as(true);
                };
                return class_4;
            }(mock_1.mock())));
            var document = documents.getDocumentData(resource).document;
            var sub1 = participant.onWillSaveTextDocumentEvent(function (e) {
                // the document state we started with
                assert.equal(document.version, 1);
                assert.equal(document.getText(), 'foo');
                e.waitUntil(winjs_base_1.TPromise.as([extHostTypes_1.TextEdit.insert(new extHostTypes_1.Position(0, 0), 'bar')]));
            });
            var sub2 = participant.onWillSaveTextDocumentEvent(function (e) {
                // the document state AFTER the first listener kicked in
                assert.equal(document.version, 2);
                assert.equal(document.getText(), 'barfoo');
                e.waitUntil(winjs_base_1.TPromise.as([extHostTypes_1.TextEdit.insert(new extHostTypes_1.Position(0, 0), 'bar')]));
            });
            return participant.$participateInSave(resource, textfiles_1.SaveReason.EXPLICIT).then(function (values) {
                sub1.dispose();
                sub2.dispose();
                // the document state AFTER eventing is done
                assert.equal(document.version, 3);
                assert.equal(document.getText(), 'barbarfoo');
            });
        });
    });
});
//# sourceMappingURL=extHostDocumentSaveParticipant.test.js.map