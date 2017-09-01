/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "winreg", "os", "vs/base/common/winjs.base", "vs/base/common/errors", "vs/base/common/uuid", "vs/base/node/id", "../node/commonProperties"], function (require, exports, winreg, os, winjs_base_1, errors, uuid, id_1, commonProperties_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SQM_KEY = '\\Software\\Microsoft\\SQMClient';
    function resolveWorkbenchCommonProperties(storageService, commit, version) {
        return commonProperties_1.resolveCommonProperties(commit, version).then(function (result) {
            result['common.version.shell'] = process.versions && process.versions['electron'];
            result['common.version.renderer'] = process.versions && process.versions['chrome'];
            result['common.osVersion'] = os.release();
            var lastSessionDate = storageService.get('telemetry.lastSessionDate');
            var firstSessionDate = storageService.get('telemetry.firstSessionDate') || new Date().toUTCString();
            storageService.store('telemetry.firstSessionDate', firstSessionDate);
            storageService.store('telemetry.lastSessionDate', new Date().toUTCString());
            result['common.firstSessionDate'] = firstSessionDate;
            result['common.lastSessionDate'] = lastSessionDate;
            result['common.isNewSession'] = !lastSessionDate ? '1' : '0';
            var promises = [];
            promises.push(getOrCreateInstanceId(storageService).then(function (value) { return result['common.instanceId'] = value; }));
            promises.push(getOrCreateMachineId(storageService).then(function (value) { return result['common.machineId'] = value; }));
            if (process.platform === 'win32') {
                promises.push(getSqmUserId(storageService).then(function (value) { return result['common.sqm.userid'] = value; }));
                promises.push(getSqmMachineId(storageService).then(function (value) { return result['common.sqm.machineid'] = value; }));
            }
            return winjs_base_1.TPromise.join(promises).then(function () { return result; });
        });
    }
    exports.resolveWorkbenchCommonProperties = resolveWorkbenchCommonProperties;
    function getOrCreateInstanceId(storageService) {
        var result = storageService.get('telemetry.instanceId') || uuid.generateUuid();
        storageService.store('telemetry.instanceId', result);
        return winjs_base_1.TPromise.as(result);
    }
    function getOrCreateMachineId(storageService) {
        var result = storageService.get(commonProperties_1.machineIdStorageKey);
        if (result) {
            return winjs_base_1.TPromise.as(result);
        }
        return id_1.getMachineId().then(function (result) {
            storageService.store(commonProperties_1.machineIdStorageKey, result);
            return result;
        });
    }
    exports.getOrCreateMachineId = getOrCreateMachineId;
    function getSqmUserId(storageService) {
        var sqmUserId = storageService.get('telemetry.sqm.userId');
        if (sqmUserId) {
            return winjs_base_1.TPromise.as(sqmUserId);
        }
        return getWinRegKeyData(SQM_KEY, 'UserId', winreg.HKCU).then(function (result) {
            if (result) {
                storageService.store('telemetry.sqm.userId', result);
                return result;
            }
            return undefined;
        });
    }
    function getSqmMachineId(storageService) {
        var sqmMachineId = storageService.get('telemetry.sqm.machineId');
        if (sqmMachineId) {
            return winjs_base_1.TPromise.as(sqmMachineId);
        }
        return getWinRegKeyData(SQM_KEY, 'MachineId', winreg.HKLM).then(function (result) {
            if (result) {
                storageService.store('telemetry.sqm.machineId', result);
                return result;
            }
            return undefined;
        });
    }
    function getWinRegKeyData(key, name, hive) {
        return new winjs_base_1.TPromise(function (resolve, reject) {
            if (process.platform === 'win32') {
                try {
                    var reg = new winreg({ hive: hive, key: key });
                    reg.get(name, function (e, result) {
                        if (e || !result) {
                            reject(null);
                        }
                        else {
                            resolve(result.value);
                        }
                    });
                }
                catch (err) {
                    errors.onUnexpectedError(err);
                    reject(err);
                }
            }
            else {
                resolve(null);
            }
        }).then(undefined, function (err) {
            // we only want success
            return undefined;
        });
    }
});
//# sourceMappingURL=workbenchCommonProperties.js.map