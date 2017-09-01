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
define(["require", "exports", "vs/base/common/uri", "vs/base/common/paths", "vs/base/common/map", "vs/base/common/platform", "vs/platform/files/common/files", "vs/platform/workspace/common/workspace", "vs/workbench/common/editor"], function (require, exports, uri_1, paths, map_1, platform_1, files_1, workspace_1, editor_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var StatType;
    (function (StatType) {
        StatType[StatType["FILE"] = 0] = "FILE";
        StatType[StatType["FOLDER"] = 1] = "FOLDER";
        StatType[StatType["ANY"] = 2] = "ANY";
    })(StatType = exports.StatType || (exports.StatType = {}));
    var Model = (function () {
        function Model(contextService) {
            var _this = this;
            this.contextService = contextService;
            var setRoots = function () { return _this._roots = _this.contextService.getWorkspace().roots.map(function (uri) { return new FileStat(uri, undefined); }); };
            this.contextService.onDidChangeWorkspaceRoots(function () { return setRoots(); });
            setRoots();
        }
        Object.defineProperty(Model.prototype, "roots", {
            get: function () {
                return this._roots;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns an array of child stat from this stat that matches with the provided path.
         * Starts matching from the first root.
         * Will return empty array in case the FileStat does not exist.
         */
        Model.prototype.findAll = function (resource) {
            return this.roots.map(function (root) { return root.find(resource); }).filter(function (stat) { return !!stat; });
        };
        /**
         * Returns a FileStat that matches the passed resource.
         * In case multiple FileStat are matching the resource (same folder opened multiple times) returns the FileStat that has the closest root.
         * Will return null in case the FileStat does not exist.
         */
        Model.prototype.findClosest = function (resource) {
            var rootUri = this.contextService.getRoot(resource);
            if (rootUri) {
                var root = this.roots.filter(function (r) { return r.resource.toString() === rootUri.toString(); }).pop();
                if (root) {
                    return root.find(resource);
                }
            }
            return null;
        };
        Model = __decorate([
            __param(0, workspace_1.IWorkspaceContextService)
        ], Model);
        return Model;
    }());
    exports.Model = Model;
    var FileStat = (function () {
        function FileStat(resource, root, isDirectory, hasChildren, name, mtime, etag) {
            if (name === void 0) { name = paths.basename(resource.fsPath); }
            this.root = root;
            this.resource = resource;
            this.name = name;
            this.isDirectory = !!isDirectory;
            this.hasChildren = isDirectory && hasChildren;
            this.etag = etag;
            this.mtime = mtime;
            // Prepare child stat array
            if (this.isDirectory) {
                this.children = [];
            }
            if (!this.root) {
                this.root = this;
            }
            this.isDirectoryResolved = false;
        }
        FileStat.prototype.getId = function () {
            return this.resource.toString();
        };
        Object.defineProperty(FileStat.prototype, "isRoot", {
            get: function () {
                return this.resource.toString() === this.root.resource.toString();
            },
            enumerable: true,
            configurable: true
        });
        FileStat.create = function (raw, root, resolveTo) {
            var stat = new FileStat(raw.resource, root, raw.isDirectory, raw.hasChildren, raw.name, raw.mtime, raw.etag);
            // Recursively add children if present
            if (stat.isDirectory) {
                // isDirectoryResolved is a very important indicator in the stat model that tells if the folder was fully resolved
                // the folder is fully resolved if either it has a list of children or the client requested this by using the resolveTo
                // array of resource path to resolve.
                stat.isDirectoryResolved = !!raw.children || (!!resolveTo && resolveTo.some(function (r) {
                    return paths.isEqualOrParent(r.fsPath, stat.resource.fsPath, !platform_1.isLinux /* ignorecase */);
                }));
                // Recurse into children
                if (raw.children) {
                    for (var i = 0, len = raw.children.length; i < len; i++) {
                        var child = FileStat.create(raw.children[i], root, resolveTo);
                        child.parent = stat;
                        stat.children.push(child);
                        stat.hasChildren = stat.children.length > 0;
                    }
                }
            }
            return stat;
        };
        /**
         * Merges the stat which was resolved from the disk with the local stat by copying over properties
         * and children. The merge will only consider resolved stat elements to avoid overwriting data which
         * exists locally.
         */
        FileStat.mergeLocalWithDisk = function (disk, local) {
            if (disk.resource.toString() !== local.resource.toString()) {
                return; // Merging only supported for stats with the same resource
            }
            // Stop merging when a folder is not resolved to avoid loosing local data
            var mergingDirectories = disk.isDirectory || local.isDirectory;
            if (mergingDirectories && local.isDirectoryResolved && !disk.isDirectoryResolved) {
                return;
            }
            // Properties
            local.resource = disk.resource;
            local.name = disk.name;
            local.isDirectory = disk.isDirectory;
            local.hasChildren = disk.isDirectory && disk.hasChildren;
            local.mtime = disk.mtime;
            local.isDirectoryResolved = disk.isDirectoryResolved;
            // Merge Children if resolved
            if (mergingDirectories && disk.isDirectoryResolved) {
                // Map resource => stat
                var oldLocalChildren_1 = new map_1.ResourceMap();
                if (local.children) {
                    local.children.forEach(function (localChild) {
                        oldLocalChildren_1.set(localChild.resource, localChild);
                    });
                }
                // Clear current children
                local.children = [];
                // Merge received children
                disk.children.forEach(function (diskChild) {
                    var formerLocalChild = oldLocalChildren_1.get(diskChild.resource);
                    // Existing child: merge
                    if (formerLocalChild) {
                        FileStat.mergeLocalWithDisk(diskChild, formerLocalChild);
                        formerLocalChild.parent = local;
                        local.children.push(formerLocalChild);
                    }
                    else {
                        diskChild.parent = local;
                        local.children.push(diskChild);
                    }
                });
            }
        };
        /**
         * Adds a child element to this folder.
         */
        FileStat.prototype.addChild = function (child) {
            // Inherit some parent properties to child
            child.parent = this;
            child.updateResource(false);
            this.children.push(child);
            this.hasChildren = this.children.length > 0;
        };
        /**
         * Returns true if this stat is a directory that contains a child with the given name.
         *
         * @param ignoreCase if true, will check for the name ignoring case.
         * @param type the type of stat to check for.
         */
        FileStat.prototype.hasChild = function (name, ignoreCase, type) {
            if (type === void 0) { type = StatType.ANY; }
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                if ((type === StatType.FILE && child.isDirectory) || (type === StatType.FOLDER && !child.isDirectory)) {
                    continue;
                }
                // Check for Identity
                if (child.name === name) {
                    return true;
                }
                // Also consider comparing without case
                if (ignoreCase && child.name.toLowerCase() === name.toLowerCase()) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Removes a child element from this folder.
         */
        FileStat.prototype.removeChild = function (child) {
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].resource.toString() === child.resource.toString()) {
                    this.children.splice(i, 1);
                    break;
                }
            }
            this.hasChildren = this.children.length > 0;
        };
        /**
         * Moves this element under a new parent element.
         */
        FileStat.prototype.move = function (newParent, fnBetweenStates, fnDone) {
            var _this = this;
            if (!fnBetweenStates) {
                fnBetweenStates = function (cb) { cb(); };
            }
            this.parent.removeChild(this);
            fnBetweenStates(function () {
                newParent.removeChild(_this); // make sure to remove any previous version of the file if any
                newParent.addChild(_this);
                _this.updateResource(true);
                if (fnDone) {
                    fnDone();
                }
            });
        };
        FileStat.prototype.updateResource = function (recursive) {
            this.resource = uri_1.default.file(paths.join(this.parent.resource.fsPath, this.name));
            if (recursive) {
                if (this.isDirectory && this.hasChildren && this.children) {
                    this.children.forEach(function (child) {
                        child.updateResource(true);
                    });
                }
            }
        };
        /**
         * Tells this stat that it was renamed. This requires changes to all children of this stat (if any)
         * so that the path property can be updated properly.
         */
        FileStat.prototype.rename = function (renamedStat) {
            // Merge a subset of Properties that can change on rename
            this.name = renamedStat.name;
            this.mtime = renamedStat.mtime;
            // Update Paths including children
            this.updateResource(true);
        };
        /**
         * Returns a child stat from this stat that matches with the provided path.
         * Will return "null" in case the child does not exist.
         */
        FileStat.prototype.find = function (resource) {
            // Return if path found
            if (paths.isEqual(resource.fsPath, this.resource.fsPath, !platform_1.isLinux /* ignorecase */)) {
                return this;
            }
            // Return if not having any children
            if (!this.hasChildren) {
                return null;
            }
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                if (paths.isEqual(resource.fsPath, child.resource.fsPath, !platform_1.isLinux /* ignorecase */)) {
                    return child;
                }
                if (child.isDirectory && files_1.isParent(resource.fsPath, child.resource.fsPath, !platform_1.isLinux /* ignorecase */)) {
                    return child.find(resource);
                }
            }
            return null; //Unable to find
        };
        return FileStat;
    }());
    exports.FileStat = FileStat;
    /* A helper that can be used to show a placeholder when creating a new stat */
    var NewStatPlaceholder = (function (_super) {
        __extends(NewStatPlaceholder, _super);
        function NewStatPlaceholder(isDirectory, root) {
            var _this = _super.call(this, uri_1.default.file(''), root) || this;
            _this.id = NewStatPlaceholder.ID++;
            _this.isDirectoryResolved = isDirectory;
            _this.directoryPlaceholder = isDirectory;
            return _this;
        }
        NewStatPlaceholder.prototype.destroy = function () {
            this.parent.removeChild(this);
            this.isDirectoryResolved = void 0;
            this.name = void 0;
            this.isDirectory = void 0;
            this.hasChildren = void 0;
            this.mtime = void 0;
        };
        NewStatPlaceholder.prototype.getId = function () {
            return "new-stat-placeholder:" + this.id + ":" + this.parent.resource.toString();
        };
        NewStatPlaceholder.prototype.isDirectoryPlaceholder = function () {
            return this.directoryPlaceholder;
        };
        NewStatPlaceholder.prototype.addChild = function (child) {
            throw new Error('Can\'t perform operations in NewStatPlaceholder.');
        };
        NewStatPlaceholder.prototype.hasChild = function (name, ignoreCase) {
            return false;
        };
        NewStatPlaceholder.prototype.removeChild = function (child) {
            throw new Error('Can\'t perform operations in NewStatPlaceholder.');
        };
        NewStatPlaceholder.prototype.move = function (newParent) {
            throw new Error('Can\'t perform operations in NewStatPlaceholder.');
        };
        NewStatPlaceholder.prototype.rename = function (renamedStat) {
            throw new Error('Can\'t perform operations in NewStatPlaceholder.');
        };
        NewStatPlaceholder.prototype.find = function (resource) {
            return null;
        };
        NewStatPlaceholder.addNewStatPlaceholder = function (parent, isDirectory) {
            var child = new NewStatPlaceholder(isDirectory, parent.root);
            // Inherit some parent properties to child
            child.parent = parent;
            parent.children.push(child);
            parent.hasChildren = parent.children.length > 0;
            return child;
        };
        NewStatPlaceholder.ID = 0;
        return NewStatPlaceholder;
    }(FileStat));
    exports.NewStatPlaceholder = NewStatPlaceholder;
    var OpenEditor = (function () {
        function OpenEditor(editor, group) {
            this.editor = editor;
            this.group = group;
            // noop
        }
        Object.defineProperty(OpenEditor.prototype, "editorInput", {
            get: function () {
                return this.editor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OpenEditor.prototype, "editorGroup", {
            get: function () {
                return this.group;
            },
            enumerable: true,
            configurable: true
        });
        OpenEditor.prototype.getId = function () {
            return "openeditor:" + this.group.id + ":" + this.group.indexOf(this.editor) + ":" + this.editor.getName() + ":" + this.editor.getDescription();
        };
        OpenEditor.prototype.isPreview = function () {
            return this.group.isPreview(this.editor);
        };
        OpenEditor.prototype.isUntitled = function () {
            return !!editor_1.toResource(this.editor, { supportSideBySide: true, filter: 'untitled' });
        };
        OpenEditor.prototype.isDirty = function () {
            return this.editor.isDirty();
        };
        OpenEditor.prototype.getResource = function () {
            return editor_1.toResource(this.editor, { supportSideBySide: true, filter: ['file', 'untitled'] });
        };
        return OpenEditor;
    }());
    exports.OpenEditor = OpenEditor;
});
//# sourceMappingURL=explorerModel.js.map