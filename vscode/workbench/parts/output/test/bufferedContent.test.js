/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/workbench/parts/output/browser/outputServices"], function (require, exports, assert, outputServices_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Workbench - Output Buffered Content', function () {
        test('Buffered Content - Simple', function () {
            var bufferedContent = new outputServices_1.BufferedContent();
            bufferedContent.append('first');
            bufferedContent.append('second');
            bufferedContent.append('third');
            var delta = bufferedContent.getDelta();
            assert.equal(bufferedContent.getDelta().value, 'firstsecondthird');
            bufferedContent.clear();
            assert.equal(bufferedContent.getDelta().value, '');
            assert.equal(bufferedContent.getDelta(delta).value, '');
        });
        test('Buffered Content - Appending Output', function () {
            var bufferedContent = new outputServices_1.BufferedContent();
            bufferedContent.append('first');
            var firstDelta = bufferedContent.getDelta();
            bufferedContent.append('second');
            bufferedContent.append('third');
            var secondDelta = bufferedContent.getDelta(firstDelta);
            assert.equal(secondDelta.append, true);
            assert.equal(secondDelta.value, 'secondthird');
            bufferedContent.append('fourth');
            bufferedContent.append('fifth');
            assert.equal(bufferedContent.getDelta(firstDelta).value, 'secondthirdfourthfifth');
            assert.equal(bufferedContent.getDelta(secondDelta).value, 'fourthfifth');
        });
        test('Buffered Content - Lots of Output', function () {
            this.timeout(10000);
            var bufferedContent = new outputServices_1.BufferedContent();
            bufferedContent.append('first line');
            var firstDelta = bufferedContent.getDelta();
            var longString = '';
            for (var i = 0; i < 5000; i++) {
                bufferedContent.append(i.toString());
                longString += i.toString();
            }
            var secondDelta = bufferedContent.getDelta(firstDelta);
            assert.equal(secondDelta.append, true);
            assert.equal(secondDelta.value.substr(secondDelta.value.length - 4), '4999');
            longString = longString + longString + longString + longString;
            bufferedContent.append(longString);
            bufferedContent.append(longString);
            var thirdDelta = bufferedContent.getDelta(firstDelta);
            assert.equal(!!thirdDelta.append, true);
            assert.equal(thirdDelta.value.substr(thirdDelta.value.length - 4), '4999');
            bufferedContent.clear();
            assert.equal(bufferedContent.getDelta().value, '');
        });
    });
});
//# sourceMappingURL=bufferedContent.test.js.map