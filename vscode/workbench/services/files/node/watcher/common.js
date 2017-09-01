/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/uri", "vs/platform/files/common/files", "vs/base/common/platform"], function (require, exports, uri_1, files_1, platform_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function toFileChangesEvent(changes) {
        // map to file changes event that talks about URIs
        return new files_1.FileChangesEvent(changes.map(function (c) {
            return {
                type: c.type,
                resource: uri_1.default.file(c.path)
            };
        }));
    }
    exports.toFileChangesEvent = toFileChangesEvent;
    /**
     * Given events that occurred, applies some rules to normalize the events
     */
    function normalize(changes) {
        // Build deltas
        var normalizer = new EventNormalizer();
        for (var i = 0; i < changes.length; i++) {
            var event_1 = changes[i];
            normalizer.processEvent(event_1);
        }
        return normalizer.normalize();
    }
    exports.normalize = normalize;
    var EventNormalizer = (function () {
        function EventNormalizer() {
            this.normalized = [];
            this.mapPathToChange = Object.create(null);
        }
        EventNormalizer.prototype.processEvent = function (event) {
            // Event path already exists
            var existingEvent = this.mapPathToChange[event.path];
            if (existingEvent) {
                var currentChangeType = existingEvent.type;
                var newChangeType = event.type;
                // ignore CREATE followed by DELETE in one go
                if (currentChangeType === files_1.FileChangeType.ADDED && newChangeType === files_1.FileChangeType.DELETED) {
                    delete this.mapPathToChange[event.path];
                    this.normalized.splice(this.normalized.indexOf(existingEvent), 1);
                }
                else if (currentChangeType === files_1.FileChangeType.DELETED && newChangeType === files_1.FileChangeType.ADDED) {
                    existingEvent.type = files_1.FileChangeType.UPDATED;
                }
                else if (currentChangeType === files_1.FileChangeType.ADDED && newChangeType === files_1.FileChangeType.UPDATED) {
                }
                else {
                    existingEvent.type = newChangeType;
                }
            }
            else {
                this.normalized.push(event);
                this.mapPathToChange[event.path] = event;
            }
        };
        EventNormalizer.prototype.normalize = function () {
            var addedChangeEvents = [];
            var deletedPaths = [];
            // This algorithm will remove all DELETE events up to the root folder
            // that got deleted if any. This ensures that we are not producing
            // DELETE events for each file inside a folder that gets deleted.
            //
            // 1.) split ADD/CHANGE and DELETED events
            // 2.) sort short deleted paths to the top
            // 3.) for each DELETE, check if there is a deleted parent and ignore the event in that case
            return this.normalized.filter(function (e) {
                if (e.type !== 2) {
                    addedChangeEvents.push(e);
                    return false; // remove ADD / CHANGE
                }
                return true; // keep DELETE
            }).sort(function (e1, e2) {
                return e1.path.length - e2.path.length; // shortest path first
            }).filter(function (e) {
                if (deletedPaths.some(function (d) { return files_1.isParent(e.path, d, !platform_1.isLinux /* ignorecase */); })) {
                    return false; // DELETE is ignored if parent is deleted already
                }
                // otherwise mark as deleted
                deletedPaths.push(e.path);
                return true;
            }).concat(addedChangeEvents);
        };
        return EventNormalizer;
    }());
});
//# sourceMappingURL=common.js.map