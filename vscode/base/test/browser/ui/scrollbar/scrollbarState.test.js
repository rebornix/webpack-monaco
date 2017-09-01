define(["require", "exports", "assert", "vs/base/browser/ui/scrollbar/scrollbarState"], function (require, exports, assert, scrollbarState_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ScrollbarState', function () {
        test('inflates slider size', function () {
            var actual = new scrollbarState_1.ScrollbarState(0, 14, 0);
            actual.setVisibleSize(339);
            actual.setScrollSize(42423);
            actual.setScrollPosition(32787);
            assert.equal(actual.getArrowSize(), 0);
            assert.equal(actual.getScrollPosition(), 32787);
            assert.equal(actual.getRectangleLargeSize(), 339);
            assert.equal(actual.getRectangleSmallSize(), 14);
            assert.equal(actual.isNeeded(), true);
            assert.equal(actual.getSliderSize(), 20);
            assert.equal(actual.getSliderPosition(), 249);
            assert.equal(actual.getSliderCenter(), 259);
            assert.equal(actual.getDesiredScrollPositionFromOffset(259), 32849);
            actual.setScrollPosition(32849);
            assert.equal(actual.getArrowSize(), 0);
            assert.equal(actual.getScrollPosition(), 32849);
            assert.equal(actual.getRectangleLargeSize(), 339);
            assert.equal(actual.getRectangleSmallSize(), 14);
            assert.equal(actual.isNeeded(), true);
            assert.equal(actual.getSliderSize(), 20);
            assert.equal(actual.getSliderPosition(), 249);
            assert.equal(actual.getSliderCenter(), 259);
        });
        test('inflates slider size with arrows', function () {
            var actual = new scrollbarState_1.ScrollbarState(12, 14, 0);
            actual.setVisibleSize(339);
            actual.setScrollSize(42423);
            actual.setScrollPosition(32787);
            assert.equal(actual.getArrowSize(), 12);
            assert.equal(actual.getScrollPosition(), 32787);
            assert.equal(actual.getRectangleLargeSize(), 339);
            assert.equal(actual.getRectangleSmallSize(), 14);
            assert.equal(actual.isNeeded(), true);
            assert.equal(actual.getSliderSize(), 20);
            assert.equal(actual.getSliderPosition(), 230);
            assert.equal(actual.getSliderCenter(), 240);
            assert.equal(actual.getDesiredScrollPositionFromOffset(240 + 12), 32811);
            actual.setScrollPosition(32811);
            assert.equal(actual.getArrowSize(), 12);
            assert.equal(actual.getScrollPosition(), 32811);
            assert.equal(actual.getRectangleLargeSize(), 339);
            assert.equal(actual.getRectangleSmallSize(), 14);
            assert.equal(actual.isNeeded(), true);
            assert.equal(actual.getSliderSize(), 20);
            assert.equal(actual.getSliderPosition(), 230);
            assert.equal(actual.getSliderCenter(), 240);
        });
    });
});
//# sourceMappingURL=scrollbarState.test.js.map