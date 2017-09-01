define(["require", "exports", "vs/base/common/keyCodes", "vs/base/common/platform", "vs/platform/commands/common/commands", "vs/platform/registry/common/platform"], function (require, exports, keyCodes_1, platform_1, commands_1, platform_2) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var KeybindingsRegistryImpl = (function () {
        function KeybindingsRegistryImpl() {
            this.WEIGHT = {
                editorCore: function (importance) {
                    if (importance === void 0) { importance = 0; }
                    return 0 + importance;
                },
                editorContrib: function (importance) {
                    if (importance === void 0) { importance = 0; }
                    return 100 + importance;
                },
                workbenchContrib: function (importance) {
                    if (importance === void 0) { importance = 0; }
                    return 200 + importance;
                },
                builtinExtension: function (importance) {
                    if (importance === void 0) { importance = 0; }
                    return 300 + importance;
                },
                externalExtension: function (importance) {
                    if (importance === void 0) { importance = 0; }
                    return 400 + importance;
                }
            };
            this._keybindings = [];
        }
        /**
         * Take current platform into account and reduce to primary & secondary.
         */
        KeybindingsRegistryImpl.bindToCurrentPlatform = function (kb) {
            if (platform_1.OS === 1 /* Windows */) {
                if (kb && kb.win) {
                    return kb.win;
                }
            }
            else if (platform_1.OS === 2 /* Macintosh */) {
                if (kb && kb.mac) {
                    return kb.mac;
                }
            }
            else {
                if (kb && kb.linux) {
                    return kb.linux;
                }
            }
            return kb;
        };
        /**
         * Take current platform into account and reduce to primary & secondary.
         */
        KeybindingsRegistryImpl.bindToCurrentPlatform2 = function (kb) {
            if (platform_1.OS === 1 /* Windows */) {
                if (kb && kb.win) {
                    return kb.win;
                }
            }
            else if (platform_1.OS === 2 /* Macintosh */) {
                if (kb && kb.mac) {
                    return kb.mac;
                }
            }
            else {
                if (kb && kb.linux) {
                    return kb.linux;
                }
            }
            return kb;
        };
        KeybindingsRegistryImpl.prototype.registerKeybindingRule = function (rule) {
            var _this = this;
            var actualKb = KeybindingsRegistryImpl.bindToCurrentPlatform(rule);
            if (actualKb && actualKb.primary) {
                this.registerDefaultKeybinding(keyCodes_1.createKeybinding(actualKb.primary, platform_1.OS), rule.id, rule.weight, 0, rule.when);
            }
            if (actualKb && Array.isArray(actualKb.secondary)) {
                actualKb.secondary.forEach(function (k, i) { return _this.registerDefaultKeybinding(keyCodes_1.createKeybinding(k, platform_1.OS), rule.id, rule.weight, -i - 1, rule.when); });
            }
        };
        KeybindingsRegistryImpl.prototype.registerKeybindingRule2 = function (rule) {
            var actualKb = KeybindingsRegistryImpl.bindToCurrentPlatform2(rule);
            if (actualKb && actualKb.primary) {
                this.registerDefaultKeybinding(actualKb.primary, rule.id, rule.weight, 0, rule.when);
            }
        };
        KeybindingsRegistryImpl.prototype.registerCommandAndKeybindingRule = function (desc) {
            this.registerKeybindingRule(desc);
            commands_1.CommandsRegistry.registerCommand(desc.id, desc);
        };
        KeybindingsRegistryImpl._mightProduceChar = function (keyCode) {
            if (keyCode >= 21 /* KEY_0 */ && keyCode <= 30 /* KEY_9 */) {
                return true;
            }
            if (keyCode >= 31 /* KEY_A */ && keyCode <= 56 /* KEY_Z */) {
                return true;
            }
            return (keyCode === 80 /* US_SEMICOLON */
                || keyCode === 81 /* US_EQUAL */
                || keyCode === 82 /* US_COMMA */
                || keyCode === 83 /* US_MINUS */
                || keyCode === 84 /* US_DOT */
                || keyCode === 85 /* US_SLASH */
                || keyCode === 86 /* US_BACKTICK */
                || keyCode === 110 /* ABNT_C1 */
                || keyCode === 111 /* ABNT_C2 */
                || keyCode === 87 /* US_OPEN_SQUARE_BRACKET */
                || keyCode === 88 /* US_BACKSLASH */
                || keyCode === 89 /* US_CLOSE_SQUARE_BRACKET */
                || keyCode === 90 /* US_QUOTE */
                || keyCode === 91 /* OEM_8 */
                || keyCode === 92 /* OEM_102 */);
        };
        KeybindingsRegistryImpl.prototype._assertNoCtrlAlt = function (keybinding, commandId) {
            if (keybinding.ctrlKey && keybinding.altKey && !keybinding.metaKey) {
                if (KeybindingsRegistryImpl._mightProduceChar(keybinding.keyCode)) {
                    console.warn('Ctrl+Alt+ keybindings should not be used by default under Windows. Offender: ', keybinding, ' for ', commandId);
                }
            }
        };
        KeybindingsRegistryImpl.prototype.registerDefaultKeybinding = function (keybinding, commandId, weight1, weight2, when) {
            if (platform_1.OS === 1 /* Windows */) {
                if (keybinding.type === 2 /* Chord */) {
                    this._assertNoCtrlAlt(keybinding.firstPart, commandId);
                }
                else {
                    this._assertNoCtrlAlt(keybinding, commandId);
                }
            }
            this._keybindings.push({
                keybinding: keybinding,
                command: commandId,
                commandArgs: null,
                when: when,
                weight1: weight1,
                weight2: weight2
            });
        };
        KeybindingsRegistryImpl.prototype.getDefaultKeybindings = function () {
            var result = this._keybindings.slice(0);
            result.sort(sorter);
            return result;
        };
        return KeybindingsRegistryImpl;
    }());
    exports.KeybindingsRegistry = new KeybindingsRegistryImpl();
    // Define extension point ids
    exports.Extensions = {
        EditorModes: 'platform.keybindingsRegistry'
    };
    platform_2.Registry.add(exports.Extensions.EditorModes, exports.KeybindingsRegistry);
    function sorter(a, b) {
        if (a.weight1 !== b.weight1) {
            return a.weight1 - b.weight1;
        }
        if (a.command < b.command) {
            return -1;
        }
        if (a.command > b.command) {
            return 1;
        }
        return a.weight2 - b.weight2;
    }
});
//# sourceMappingURL=keybindingsRegistry.js.map