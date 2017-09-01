define(["require", "exports", "assert", "vs/base/common/objects"], function (require, exports, assert, objects) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var check = function (one, other, msg) {
        assert(objects.equals(one, other), msg);
        assert(objects.equals(other, one), '[reverse] ' + msg);
    };
    var checkNot = function (one, other, msg) {
        assert(!objects.equals(one, other), msg);
        assert(!objects.equals(other, one), '[reverse] ' + msg);
    };
    suite('Objects', function () {
        test('equals', function () {
            check(null, null, 'null');
            check(undefined, undefined, 'undefined');
            check(1234, 1234, 'numbers');
            check('', '', 'empty strings');
            check('1234', '1234', 'strings');
            check([], [], 'empty arrays');
            // check(['', 123], ['', 123], 'arrays');
            check([[1, 2, 3], [4, 5, 6]], [[1, 2, 3], [4, 5, 6]], 'nested arrays');
            check({}, {}, 'empty objects');
            check({ a: 1, b: '123' }, { a: 1, b: '123' }, 'objects');
            check({ a: 1, b: '123' }, { b: '123', a: 1 }, 'objects (key order)');
            check({ a: { b: 1, c: 2 }, b: 3 }, { a: { b: 1, c: 2 }, b: 3 }, 'nested objects');
            checkNot(null, undefined, 'null != undefined');
            checkNot(null, '', 'null != empty string');
            checkNot(null, [], 'null != empty array');
            checkNot(null, {}, 'null != empty object');
            checkNot(null, 0, 'null != zero');
            checkNot(undefined, '', 'undefined != empty string');
            checkNot(undefined, [], 'undefined != empty array');
            checkNot(undefined, {}, 'undefined != empty object');
            checkNot(undefined, 0, 'undefined != zero');
            checkNot('', [], 'empty string != empty array');
            checkNot('', {}, 'empty string != empty object');
            checkNot('', 0, 'empty string != zero');
            checkNot([], {}, 'empty array != empty object');
            checkNot([], 0, 'empty array != zero');
            checkNot(0, [], 'zero != empty array');
            checkNot('1234', 1234, 'string !== number');
            checkNot([[1, 2, 3], [4, 5, 6]], [[1, 2, 3], [4, 5, 6000]], 'arrays');
            checkNot({ a: { b: 1, c: 2 }, b: 3 }, { b: 3, a: { b: 9, c: 2 } }, 'objects');
        });
        test('mixin - array', function () {
            var foo = {};
            objects.mixin(foo, { bar: [1, 2, 3] });
            assert(foo.bar);
            assert(Array.isArray(foo.bar));
            assert.equal(foo.bar.length, 3);
            assert.equal(foo.bar[0], 1);
            assert.equal(foo.bar[1], 2);
            assert.equal(foo.bar[2], 3);
        });
        test('mixin - no overwrite', function () {
            var foo = {
                bar: '123'
            };
            var bar = {
                bar: '456'
            };
            objects.mixin(foo, bar, false);
            assert.equal(foo.bar, '123');
        });
        test('cloneAndChange', function () {
            var o1 = { something: 'hello' };
            var o = {
                o1: o1,
                o2: o1
            };
            assert.deepEqual(objects.cloneAndChange(o, function () { }), o);
        });
        test('safeStringify', function () {
            var obj1 = {
                friend: null
            };
            var obj2 = {
                friend: null
            };
            obj1.friend = obj2;
            obj2.friend = obj1;
            var arr = [1];
            arr.push(arr);
            var circular = {
                a: 42,
                b: null,
                c: [
                    obj1, obj2
                ],
                d: null
            };
            arr.push(circular);
            circular.b = circular;
            circular.d = arr;
            var result = objects.safeStringify(circular);
            assert.deepEqual(JSON.parse(result), {
                a: 42,
                b: '[Circular]',
                c: [
                    {
                        friend: {
                            friend: '[Circular]'
                        }
                    },
                    '[Circular]'
                ],
                d: [1, '[Circular]', '[Circular]']
            });
        });
        test('derive', function () {
            var someValue = 2;
            function Base() {
                //example
            }
            Base.favoriteColor = 'blue';
            Base.prototype.test = function () { return 42; };
            function Child() {
                //example
            }
            Child.prototype.test2 = function () { return 43; };
            Object.defineProperty(Child.prototype, 'getter', {
                get: function () { return someValue; },
                enumerable: true,
                configurable: true
            });
            objects.derive(Base, Child);
            var base = new Base();
            var child = new Child();
            assert(base instanceof Base);
            assert(child instanceof Child);
            assert.strictEqual(base.test, child.test);
            assert.strictEqual(base.test(), 42);
            assert.strictEqual(child.test2(), 43);
            assert.strictEqual(Child.favoriteColor, 'blue');
            someValue = 4;
            assert.strictEqual(child.getter, 4);
        });
        test('distinct', function () {
            var base = {
                one: 'one',
                two: 2,
                three: {
                    3: true
                },
                four: false
            };
            var diff = objects.distinct(base, base);
            assert.deepEqual(diff, {});
            var obj = {};
            diff = objects.distinct(base, obj);
            assert.deepEqual(diff, {});
            obj = {
                one: 'one',
                two: 2
            };
            diff = objects.distinct(base, obj);
            assert.deepEqual(diff, {});
            obj = {
                three: {
                    3: true
                },
                four: false
            };
            diff = objects.distinct(base, obj);
            assert.deepEqual(diff, {});
            obj = {
                one: 'two',
                two: 2,
                three: {
                    3: true
                },
                four: true
            };
            diff = objects.distinct(base, obj);
            assert.deepEqual(diff, {
                one: 'two',
                four: true
            });
            obj = {
                one: null,
                two: 2,
                three: {
                    3: true
                },
                four: void 0
            };
            diff = objects.distinct(base, obj);
            assert.deepEqual(diff, {
                one: null,
                four: void 0
            });
            obj = {
                one: 'two',
                two: 3,
                three: { 3: false },
                four: true
            };
            diff = objects.distinct(base, obj);
            assert.deepEqual(diff, obj);
        });
    });
});
//# sourceMappingURL=objects.test.js.map