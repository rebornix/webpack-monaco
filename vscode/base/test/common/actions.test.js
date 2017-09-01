define(["require", "exports", "assert", "vs/base/common/actions"], function (require, exports, assert, actions_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Actions', function () {
        test('isAction', function () {
            assert(actions_1.isAction(new actions_1.Action('id', 'label', 'style', true, function () { return null; })));
            assert(actions_1.isAction({
                id: 'id',
                label: 'label',
                class: 'style',
                checked: true,
                enabled: true,
                run: function () { return null; }
            }));
            assert(!actions_1.isAction({
                //		id: 'id',
                label: 'label',
                class: 'style',
                checked: true,
                enabled: true,
                run: function () { return null; }
            }));
            assert(!actions_1.isAction({
                id: 1234,
                label: 'label',
                class: 'style',
                checked: true,
                enabled: true,
                run: function () { return null; }
            }));
            assert(!actions_1.isAction({
                id: 'id',
                label: 'label',
                class: 'style',
                checked: 1,
                enabled: 1,
                run: function () { return null; }
            }));
            assert(!actions_1.isAction(null));
            assert(!actions_1.isAction({
                id: 'id',
                label: 'label',
                //		class: 'style',
                checked: true,
                enabled: true,
            }));
            assert(!actions_1.isAction({
                id: 'id',
                label: 42,
                class: 'style',
                checked: true,
                enabled: true,
            }));
            assert(!actions_1.isAction({
                id: 'id',
                label: 'label',
                class: 'style',
                checked: 'checked',
                enabled: true,
            }));
            assert(!actions_1.isAction({
                id: 'id',
                label: 'label',
                class: 'style',
                checked: true,
                enabled: true,
                run: true
            }));
        });
    });
});
//# sourceMappingURL=actions.test.js.map