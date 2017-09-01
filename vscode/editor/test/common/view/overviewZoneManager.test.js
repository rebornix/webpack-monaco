define(["require", "exports", "assert", "vs/editor/common/editorCommon", "vs/editor/common/view/overviewZoneManager", "vs/platform/theme/common/themeService"], function (require, exports, assert, editorCommon_1, overviewZoneManager_1, themeService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Editor View - OverviewZoneManager', function () {
        test('pixel ratio 1, dom height 600', function () {
            var LINE_COUNT = 50;
            var LINE_HEIGHT = 20;
            var manager = new overviewZoneManager_1.OverviewZoneManager(function (lineNumber) { return LINE_HEIGHT * lineNumber; });
            manager.setMinimumHeight(6);
            manager.setMaximumHeight(6);
            manager.setThemeType(themeService_1.LIGHT);
            manager.setDOMWidth(30);
            manager.setDOMHeight(600);
            manager.setOuterHeight(LINE_COUNT * LINE_HEIGHT);
            manager.setLineHeight(LINE_HEIGHT);
            manager.setPixelRatio(1);
            manager.setZones([
                new overviewZoneManager_1.OverviewRulerZone(1, 1, editorCommon_1.OverviewRulerLane.Full, 10, '1', '1', '1'),
                new overviewZoneManager_1.OverviewRulerZone(10, 10, editorCommon_1.OverviewRulerLane.Full, 0, '2', '2', '2'),
                new overviewZoneManager_1.OverviewRulerZone(30, 31, editorCommon_1.OverviewRulerLane.Full, 0, '3', '3', '3'),
                new overviewZoneManager_1.OverviewRulerZone(50, 50, editorCommon_1.OverviewRulerLane.Full, 0, '4', '4', '4'),
            ]);
            // one line = 12, but cap is at 6
            assert.deepEqual(manager.resolveColorZones(), [
                new overviewZoneManager_1.ColorZone(12, 22, 1, editorCommon_1.OverviewRulerLane.Full),
                new overviewZoneManager_1.ColorZone(123, 129, 2, editorCommon_1.OverviewRulerLane.Full),
                new overviewZoneManager_1.ColorZone(363, 369, 3, editorCommon_1.OverviewRulerLane.Full),
                new overviewZoneManager_1.ColorZone(375, 381, 3, editorCommon_1.OverviewRulerLane.Full),
                new overviewZoneManager_1.ColorZone(594, 600, 4, editorCommon_1.OverviewRulerLane.Full),
            ]);
        });
        test('pixel ratio 1, dom height 300', function () {
            var LINE_COUNT = 50;
            var LINE_HEIGHT = 20;
            var manager = new overviewZoneManager_1.OverviewZoneManager(function (lineNumber) { return LINE_HEIGHT * lineNumber; });
            manager.setMinimumHeight(6);
            manager.setMaximumHeight(6);
            manager.setThemeType(themeService_1.LIGHT);
            manager.setDOMWidth(30);
            manager.setDOMHeight(300);
            manager.setOuterHeight(LINE_COUNT * LINE_HEIGHT);
            manager.setLineHeight(LINE_HEIGHT);
            manager.setPixelRatio(1);
            manager.setZones([
                new overviewZoneManager_1.OverviewRulerZone(1, 1, editorCommon_1.OverviewRulerLane.Full, 10, '1', '1', '1'),
                new overviewZoneManager_1.OverviewRulerZone(10, 10, editorCommon_1.OverviewRulerLane.Full, 0, '2', '2', '2'),
                new overviewZoneManager_1.OverviewRulerZone(30, 31, editorCommon_1.OverviewRulerLane.Full, 0, '3', '3', '3'),
                new overviewZoneManager_1.OverviewRulerZone(50, 50, editorCommon_1.OverviewRulerLane.Full, 0, '4', '4', '4'),
            ]);
            // one line = 6, cap is at 6
            assert.deepEqual(manager.resolveColorZones(), [
                new overviewZoneManager_1.ColorZone(6, 16, 1, editorCommon_1.OverviewRulerLane.Full),
                new overviewZoneManager_1.ColorZone(60, 66, 2, editorCommon_1.OverviewRulerLane.Full),
                new overviewZoneManager_1.ColorZone(180, 192, 3, editorCommon_1.OverviewRulerLane.Full),
                new overviewZoneManager_1.ColorZone(294, 300, 4, editorCommon_1.OverviewRulerLane.Full),
            ]);
        });
        test('pixel ratio 2, dom height 300', function () {
            var LINE_COUNT = 50;
            var LINE_HEIGHT = 20;
            var manager = new overviewZoneManager_1.OverviewZoneManager(function (lineNumber) { return LINE_HEIGHT * lineNumber; });
            manager.setMinimumHeight(6);
            manager.setMaximumHeight(6);
            manager.setThemeType(themeService_1.LIGHT);
            manager.setDOMWidth(30);
            manager.setDOMHeight(300);
            manager.setOuterHeight(LINE_COUNT * LINE_HEIGHT);
            manager.setLineHeight(LINE_HEIGHT);
            manager.setPixelRatio(2);
            manager.setZones([
                new overviewZoneManager_1.OverviewRulerZone(1, 1, editorCommon_1.OverviewRulerLane.Full, 10, '1', '1', '1'),
                new overviewZoneManager_1.OverviewRulerZone(10, 10, editorCommon_1.OverviewRulerLane.Full, 0, '2', '2', '2'),
                new overviewZoneManager_1.OverviewRulerZone(30, 31, editorCommon_1.OverviewRulerLane.Full, 0, '3', '3', '3'),
                new overviewZoneManager_1.OverviewRulerZone(50, 50, editorCommon_1.OverviewRulerLane.Full, 0, '4', '4', '4'),
            ]);
            // one line = 6, cap is at 12
            assert.deepEqual(manager.resolveColorZones(), [
                new overviewZoneManager_1.ColorZone(12, 32, 1, editorCommon_1.OverviewRulerLane.Full),
                new overviewZoneManager_1.ColorZone(120, 132, 2, editorCommon_1.OverviewRulerLane.Full),
                new overviewZoneManager_1.ColorZone(360, 384, 3, editorCommon_1.OverviewRulerLane.Full),
                new overviewZoneManager_1.ColorZone(588, 600, 4, editorCommon_1.OverviewRulerLane.Full),
            ]);
        });
    });
});
//# sourceMappingURL=overviewZoneManager.test.js.map