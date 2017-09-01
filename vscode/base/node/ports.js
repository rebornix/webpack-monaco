/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "net"], function (require, exports, net) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Given a start point and a max number of retries, will find a port that
     * is openable. Will return 0 in case no free port can be found.
     */
    function findFreePort(startPort, giveUpAfter, timeout, clb) {
        var done = false;
        var timeoutHandle = setTimeout(function () {
            if (!done) {
                done = true;
                return clb(0);
            }
        }, timeout);
        doFindFreePort(startPort, giveUpAfter, function (port) {
            if (!done) {
                done = true;
                clearTimeout(timeoutHandle);
                return clb(port);
            }
        });
    }
    exports.findFreePort = findFreePort;
    function doFindFreePort(startPort, giveUpAfter, clb) {
        if (giveUpAfter === 0) {
            return clb(0);
        }
        var client = new net.Socket();
        // If we can connect to the port it means the port is already taken so we continue searching
        client.once('connect', function () {
            dispose(client);
            return doFindFreePort(startPort + 1, giveUpAfter - 1, clb);
        });
        client.once('error', function (err) {
            dispose(client);
            // If we receive any non ECONNREFUSED error, it means the port is used but we cannot connect
            if (err.code !== 'ECONNREFUSED') {
                return doFindFreePort(startPort + 1, giveUpAfter - 1, clb);
            }
            // Otherwise it means the port is free to use!
            return clb(startPort);
        });
        client.connect(startPort, '127.0.0.1');
    }
    function dispose(socket) {
        try {
            socket.removeAllListeners('connect');
            socket.removeAllListeners('error');
            socket.end();
            socket.destroy();
            socket.unref();
        }
        catch (error) {
            console.error(error); // otherwise this error would get lost in the callback chain
        }
    }
});
//# sourceMappingURL=ports.js.map