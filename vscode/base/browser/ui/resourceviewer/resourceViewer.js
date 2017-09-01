/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/base/common/mime", "vs/base/common/paths", "vs/base/browser/builder", "vs/base/browser/dom", "vs/base/common/map", "vs/css!./resourceviewer"], function (require, exports, nls, mimes, paths, builder_1, DOM, map_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // Known media mimes that we can handle
    var mapExtToMediaMimes = {
        '.bmp': 'image/bmp',
        '.gif': 'image/gif',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpg',
        '.jpe': 'image/jpg',
        '.png': 'image/png',
        '.tiff': 'image/tiff',
        '.tif': 'image/tiff',
        '.ico': 'image/x-icon',
        '.tga': 'image/x-tga',
        '.psd': 'image/vnd.adobe.photoshop',
        '.mid': 'audio/midi',
        '.midi': 'audio/midi',
        '.mp4a': 'audio/mp4',
        '.mpga': 'audio/mpeg',
        '.mp2': 'audio/mpeg',
        '.mp2a': 'audio/mpeg',
        '.mp3': 'audio/mpeg',
        '.m2a': 'audio/mpeg',
        '.m3a': 'audio/mpeg',
        '.oga': 'audio/ogg',
        '.ogg': 'audio/ogg',
        '.spx': 'audio/ogg',
        '.aac': 'audio/x-aac',
        '.wav': 'audio/x-wav',
        '.wma': 'audio/x-ms-wma',
        '.mp4': 'video/mp4',
        '.mp4v': 'video/mp4',
        '.mpg4': 'video/mp4',
        '.mpeg': 'video/mpeg',
        '.mpg': 'video/mpeg',
        '.mpe': 'video/mpeg',
        '.m1v': 'video/mpeg',
        '.m2v': 'video/mpeg',
        '.ogv': 'video/ogg',
        '.qt': 'video/quicktime',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm',
        '.mkv': 'video/x-matroska',
        '.mk3d': 'video/x-matroska',
        '.mks': 'video/x-matroska',
        '.wmv': 'video/x-ms-wmv',
        '.flv': 'video/x-flv',
        '.avi': 'video/x-msvideo',
        '.movie': 'video/x-sgi-movie'
    };
    // Chrome is caching images very aggressively and so we use the ETag information to find out if
    // we need to bypass the cache or not. We could always bypass the cache everytime we show the image
    // however that has very bad impact on memory consumption because each time the image gets shown,
    // memory grows (see also https://github.com/electron/electron/issues/6275)
    var IMAGE_RESOURCE_ETAG_CACHE = new map_1.BoundedMap(100);
    function imageSrc(descriptor) {
        var src = descriptor.resource.toString();
        var cached = IMAGE_RESOURCE_ETAG_CACHE.get(src);
        if (!cached) {
            cached = { etag: descriptor.etag, src: src };
            IMAGE_RESOURCE_ETAG_CACHE.set(src, cached);
        }
        if (cached.etag !== descriptor.etag) {
            cached.etag = descriptor.etag;
            cached.src = src + "?" + Date.now(); // bypass cache with this trick
        }
        return cached.src;
    }
    /**
     * Helper to actually render the given resource into the provided container. Will adjust scrollbar (if provided) automatically based on loading
     * progress of the binary resource.
     */
    var ResourceViewer = (function () {
        function ResourceViewer() {
        }
        ResourceViewer.show = function (descriptor, container, scrollbar, openExternal, metadataClb) {
            // Ensure CSS class
            builder_1.$(container).setClass('monaco-resource-viewer');
            // Lookup media mime if any
            var mime;
            var ext = paths.extname(descriptor.resource.toString());
            if (ext) {
                mime = mapExtToMediaMimes[ext.toLowerCase()];
            }
            if (!mime) {
                mime = mimes.MIME_BINARY;
            }
            // Show Image inline
            if (mime.indexOf('image/') >= 0) {
                if (descriptor.size <= ResourceViewer.MAX_IMAGE_SIZE) {
                    builder_1.$(container)
                        .empty()
                        .addClass('image')
                        .img({ src: imageSrc(descriptor) })
                        .on(DOM.EventType.LOAD, function (e, img) {
                        var imgElement = img.getHTMLElement();
                        if (imgElement.naturalWidth > imgElement.width || imgElement.naturalHeight > imgElement.height) {
                            builder_1.$(container).addClass('oversized');
                            img.on(DOM.EventType.CLICK, function (e, img) {
                                builder_1.$(container).toggleClass('full-size');
                                scrollbar.scanDomNode();
                            });
                        }
                        if (metadataClb) {
                            metadataClb(nls.localize('imgMeta', "{0}x{1} {2}", imgElement.naturalWidth, imgElement.naturalHeight, ResourceViewer.formatSize(descriptor.size)));
                        }
                        scrollbar.scanDomNode();
                    });
                }
                else {
                    builder_1.$(container)
                        .empty()
                        .p({
                        text: nls.localize('largeImageError', "The image is too large to display in the editor. ")
                    })
                        .append(builder_1.$('a', {
                        role: 'button',
                        class: 'open-external',
                        text: nls.localize('resourceOpenExternalButton', "Open image using external program?")
                    }).on(DOM.EventType.CLICK, function (e) {
                        openExternal(descriptor.resource);
                    }));
                }
            }
            else {
                builder_1.$(container)
                    .empty()
                    .span({
                    text: nls.localize('nativeBinaryError', "The file will not be displayed in the editor because it is either binary, very large or uses an unsupported text encoding.")
                });
                if (metadataClb) {
                    metadataClb(ResourceViewer.formatSize(descriptor.size));
                }
                scrollbar.scanDomNode();
            }
        };
        ResourceViewer.formatSize = function (size) {
            if (size < ResourceViewer.KB) {
                return nls.localize('sizeB', "{0}B", size);
            }
            if (size < ResourceViewer.MB) {
                return nls.localize('sizeKB', "{0}KB", (size / ResourceViewer.KB).toFixed(2));
            }
            if (size < ResourceViewer.GB) {
                return nls.localize('sizeMB', "{0}MB", (size / ResourceViewer.MB).toFixed(2));
            }
            if (size < ResourceViewer.TB) {
                return nls.localize('sizeGB', "{0}GB", (size / ResourceViewer.GB).toFixed(2));
            }
            return nls.localize('sizeTB', "{0}TB", (size / ResourceViewer.TB).toFixed(2));
        };
        ResourceViewer.KB = 1024;
        ResourceViewer.MB = ResourceViewer.KB * ResourceViewer.KB;
        ResourceViewer.GB = ResourceViewer.MB * ResourceViewer.KB;
        ResourceViewer.TB = ResourceViewer.GB * ResourceViewer.KB;
        ResourceViewer.MAX_IMAGE_SIZE = ResourceViewer.MB; // showing images inline is memory intense, so we have a limit
        return ResourceViewer;
    }());
    exports.ResourceViewer = ResourceViewer;
});
//# sourceMappingURL=resourceViewer.js.map