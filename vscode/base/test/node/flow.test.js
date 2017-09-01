/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/base/node/flow"], function (require, exports, assert, flow) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var loop = flow.loop;
    var sequence = flow.sequence;
    var parallel = flow.parallel;
    suite('Flow', function () {
        function assertCounterEquals(counter, expected) {
            assert.ok(counter === expected, 'Expected ' + expected + ' assertions, but got ' + counter);
        }
        function syncThrowsError(callback) {
            callback(new Error('foo'), null);
        }
        function syncSequenceGetThrowsError(value, callback) {
            sequence(function onError(error) {
                callback(error, null);
            }, function getFirst() {
                syncThrowsError(this);
            }, function handleFirst(first) {
                //Foo
            });
        }
        function syncGet(value, callback) {
            callback(null, value);
        }
        function syncGetError(value, callback) {
            callback(new Error(''), null);
        }
        function asyncGet(value, callback) {
            process.nextTick(function () {
                callback(null, value);
            });
        }
        function asyncGetError(value, callback) {
            process.nextTick(function () {
                callback(new Error(''), null);
            });
        }
        test('loopSync', function (done) {
            var elements = ['1', '2', '3'];
            loop(elements, function (element, callback, index, total) {
                assert.ok(index === 0 || index === 1 || index === 2);
                assert.deepEqual(3, total);
                callback(null, element);
            }, function (error, result) {
                assert.equal(error, null);
                assert.deepEqual(result, elements);
                done();
            });
        });
        test('loopByFunctionSync', function (done) {
            var elements = function (callback) {
                callback(null, ['1', '2', '3']);
            };
            loop(elements, function (element, callback) {
                callback(null, element);
            }, function (error, result) {
                assert.equal(error, null);
                assert.deepEqual(result, ['1', '2', '3']);
                done();
            });
        });
        test('loopByFunctionAsync', function (done) {
            var elements = function (callback) {
                process.nextTick(function () {
                    callback(null, ['1', '2', '3']);
                });
            };
            loop(elements, function (element, callback) {
                callback(null, element);
            }, function (error, result) {
                assert.equal(error, null);
                assert.deepEqual(result, ['1', '2', '3']);
                done();
            });
        });
        test('loopSyncErrorByThrow', function (done) {
            var elements = ['1', '2', '3'];
            loop(elements, function (element, callback) {
                if (element === '2') {
                    throw new Error('foo');
                }
                else {
                    callback(null, element);
                }
            }, function (error, result) {
                assert.ok(error);
                assert.ok(!result);
                done();
            });
        });
        test('loopSyncErrorByCallback', function (done) {
            var elements = ['1', '2', '3'];
            loop(elements, function (element, callback) {
                if (element === '2') {
                    callback(new Error('foo'), null);
                }
                else {
                    callback(null, element);
                }
            }, function (error, result) {
                assert.ok(error);
                assert.ok(!result);
                done();
            });
        });
        test('loopAsync', function (done) {
            var elements = ['1', '2', '3'];
            loop(elements, function (element, callback) {
                process.nextTick(function () {
                    callback(null, element);
                });
            }, function (error, result) {
                assert.equal(error, null);
                assert.deepEqual(result, elements);
                done();
            });
        });
        test('loopAsyncErrorByCallback', function (done) {
            var elements = ['1', '2', '3'];
            loop(elements, function (element, callback) {
                process.nextTick(function () {
                    if (element === '2') {
                        callback(new Error('foo'), null);
                    }
                    else {
                        callback(null, element);
                    }
                });
            }, function (error, result) {
                assert.ok(error);
                assert.ok(!result);
                done();
            });
        });
        test('sequenceSync', function (done) {
            var assertionCount = 0;
            var errorCount = 0;
            sequence(function onError(error) {
                errorCount++;
            }, function getFirst() {
                syncGet('1', this);
            }, function handleFirst(first) {
                assert.deepEqual('1', first);
                assertionCount++;
                syncGet('2', this);
            }, function handleSecond(second) {
                assert.deepEqual('2', second);
                assertionCount++;
                syncGet(null, this);
            }, function handleThird(third) {
                assert.ok(!third);
                assertionCount++;
                assertCounterEquals(assertionCount, 3);
                assertCounterEquals(errorCount, 0);
                done();
            });
        });
        test('sequenceAsync', function (done) {
            var assertionCount = 0;
            var errorCount = 0;
            sequence(function onError(error) {
                errorCount++;
            }, function getFirst() {
                asyncGet('1', this);
            }, function handleFirst(first) {
                assert.deepEqual('1', first);
                assertionCount++;
                asyncGet('2', this);
            }, function handleSecond(second) {
                assert.deepEqual('2', second);
                assertionCount++;
                asyncGet(null, this);
            }, function handleThird(third) {
                assert.ok(!third);
                assertionCount++;
                assertCounterEquals(assertionCount, 3);
                assertCounterEquals(errorCount, 0);
                done();
            });
        });
        test('sequenceSyncErrorByThrow', function (done) {
            var assertionCount = 0;
            var errorCount = 0;
            sequence(function onError(error) {
                errorCount++;
                assertCounterEquals(assertionCount, 1);
                assertCounterEquals(errorCount, 1);
                done();
            }, function getFirst() {
                syncGet('1', this);
            }, function handleFirst(first) {
                assert.deepEqual('1', first);
                assertionCount++;
                syncGet('2', this);
            }, function handleSecond(second) {
                if (true) {
                    throw new Error('');
                }
                // assertionCount++;
                // syncGet(null, this);
            }, function handleThird(third) {
                throw new Error('We should not be here');
            });
        });
        test('sequenceSyncErrorByCallback', function (done) {
            var assertionCount = 0;
            var errorCount = 0;
            sequence(function onError(error) {
                errorCount++;
                assertCounterEquals(assertionCount, 1);
                assertCounterEquals(errorCount, 1);
                done();
            }, function getFirst() {
                syncGet('1', this);
            }, function handleFirst(first) {
                assert.deepEqual('1', first);
                assertionCount++;
                syncGetError('2', this);
            }, function handleSecond(second) {
                throw new Error('We should not be here');
            });
        });
        test('sequenceAsyncErrorByThrow', function (done) {
            var assertionCount = 0;
            var errorCount = 0;
            sequence(function onError(error) {
                errorCount++;
                assertCounterEquals(assertionCount, 1);
                assertCounterEquals(errorCount, 1);
                done();
            }, function getFirst() {
                asyncGet('1', this);
            }, function handleFirst(first) {
                assert.deepEqual('1', first);
                assertionCount++;
                asyncGet('2', this);
            }, function handleSecond(second) {
                if (true) {
                    throw new Error('');
                }
                // assertionCount++;
                // asyncGet(null, this);
            }, function handleThird(third) {
                throw new Error('We should not be here');
            });
        });
        test('sequenceAsyncErrorByCallback', function (done) {
            var assertionCount = 0;
            var errorCount = 0;
            sequence(function onError(error) {
                errorCount++;
                assertCounterEquals(assertionCount, 1);
                assertCounterEquals(errorCount, 1);
                done();
            }, function getFirst() {
                asyncGet('1', this);
            }, function handleFirst(first) {
                assert.deepEqual('1', first);
                assertionCount++;
                asyncGetError('2', this);
            }, function handleSecond(second) {
                throw new Error('We should not be here');
            });
        });
        test('syncChainedSequenceError', function (done) {
            sequence(function onError(error) {
                done();
            }, function getFirst() {
                syncSequenceGetThrowsError('1', this);
            });
        });
        test('tolerateBooleanResults', function (done) {
            var assertionCount = 0;
            var errorCount = 0;
            sequence(function onError(error) {
                errorCount++;
            }, function getFirst() {
                this(true);
            }, function getSecond(result) {
                assert.equal(result, true);
                this(false);
            }, function last(result) {
                assert.equal(result, false);
                assertionCount++;
                assertCounterEquals(assertionCount, 1);
                assertCounterEquals(errorCount, 0);
                done();
            });
        });
        test('loopTolerateBooleanResults', function (done) {
            var elements = ['1', '2', '3'];
            loop(elements, function (element, callback) {
                process.nextTick(function () {
                    callback(true);
                });
            }, function (error, result) {
                assert.equal(error, null);
                assert.deepEqual(result, [true, true, true]);
                done();
            });
        });
        test('parallel', function (done) {
            var elements = [1, 2, 3, 4, 5];
            var sum = 0;
            parallel(elements, function (element, callback) {
                sum += element;
                callback(null, element * element);
            }, function (errors, result) {
                assert.ok(!errors);
                assert.deepEqual(sum, 15);
                assert.deepEqual(result, [1, 4, 9, 16, 25]);
                done();
            });
        });
        test('parallel - setTimeout', function (done) {
            var elements = [1, 2, 3, 4, 5];
            var timeouts = [10, 30, 5, 0, 4];
            var sum = 0;
            parallel(elements, function (element, callback) {
                setTimeout(function () {
                    sum += element;
                    callback(null, element * element);
                }, timeouts.pop());
            }, function (errors, result) {
                assert.ok(!errors);
                assert.deepEqual(sum, 15);
                assert.deepEqual(result, [1, 4, 9, 16, 25]);
                done();
            });
        });
        test('parallel - with error', function (done) {
            var elements = [1, 2, 3, 4, 5];
            var timeouts = [10, 30, 5, 0, 4];
            var sum = 0;
            parallel(elements, function (element, callback) {
                setTimeout(function () {
                    if (element === 4) {
                        callback(new Error('error!'), null);
                    }
                    else {
                        sum += element;
                        callback(null, element * element);
                    }
                }, timeouts.pop());
            }, function (errors, result) {
                assert.ok(errors);
                assert.deepEqual(errors, [null, null, null, new Error('error!'), null]);
                assert.deepEqual(sum, 11);
                assert.deepEqual(result, [1, 4, 9, null, 25]);
                done();
            });
        });
    });
});
//# sourceMappingURL=flow.test.js.map