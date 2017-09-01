var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/json", "vs/base/node/pfs", "vs/editor/common/services/modeService", "vs/editor/common/modes/languageConfigurationRegistry", "vs/platform/jsonschemas/common/jsonContributionRegistry", "vs/platform/registry/common/platform", "vs/workbench/services/textMate/electron-browser/textMateService"], function (require, exports, nls, json_1, pfs_1, modeService_1, languageConfigurationRegistry_1, jsonContributionRegistry_1, platform_1, textMateService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var LanguageConfigurationFileHandler = (function () {
        function LanguageConfigurationFileHandler(textMateService, modeService) {
            var _this = this;
            this._modeService = modeService;
            this._done = [];
            // Listen for hints that a language configuration is needed/usefull and then load it once
            this._modeService.onDidCreateMode(function (mode) { return _this._loadConfigurationsForMode(mode.getLanguageIdentifier()); });
            textMateService.onDidEncounterLanguage(function (languageId) {
                _this._loadConfigurationsForMode(_this._modeService.getLanguageIdentifier(languageId));
            });
        }
        LanguageConfigurationFileHandler.prototype._loadConfigurationsForMode = function (languageIdentifier) {
            var _this = this;
            if (this._done[languageIdentifier.id]) {
                return;
            }
            this._done[languageIdentifier.id] = true;
            var configurationFiles = this._modeService.getConfigurationFiles(languageIdentifier.language);
            configurationFiles.forEach(function (configFilePath) { return _this._handleConfigFile(languageIdentifier, configFilePath); });
        };
        LanguageConfigurationFileHandler.prototype._handleConfigFile = function (languageIdentifier, configFilePath) {
            var _this = this;
            pfs_1.readFile(configFilePath).then(function (fileContents) {
                var errors = [];
                var configuration = json_1.parse(fileContents.toString(), errors);
                if (errors.length) {
                    console.error(nls.localize('parseErrors', "Errors parsing {0}: {1}", configFilePath, errors.join('\n')));
                }
                _this._handleConfig(languageIdentifier, configuration);
            }, function (err) {
                console.error(err);
            });
        };
        LanguageConfigurationFileHandler.prototype._handleConfig = function (languageIdentifier, configuration) {
            var richEditConfig = {};
            if (configuration.comments) {
                richEditConfig.comments = configuration.comments;
            }
            if (configuration.brackets) {
                richEditConfig.brackets = configuration.brackets;
            }
            if (configuration.autoClosingPairs) {
                richEditConfig.autoClosingPairs = this._mapCharacterPairs(configuration.autoClosingPairs);
            }
            if (configuration.surroundingPairs) {
                richEditConfig.surroundingPairs = this._mapCharacterPairs(configuration.surroundingPairs);
            }
            if (configuration.wordPattern) {
                try {
                    var wordPattern = this._parseRegex(configuration.wordPattern);
                    if (wordPattern) {
                        richEditConfig.wordPattern = wordPattern;
                    }
                }
                catch (error) {
                    // Malformed regexes are ignored
                }
            }
            if (configuration.indentationRules) {
                var indentationRules = this._mapIndentationRules(configuration.indentationRules);
                if (indentationRules) {
                    richEditConfig.indentationRules = indentationRules;
                }
            }
            languageConfigurationRegistry_1.LanguageConfigurationRegistry.register(languageIdentifier, richEditConfig);
        };
        LanguageConfigurationFileHandler.prototype._parseRegex = function (value) {
            if (typeof value === 'string') {
                return new RegExp(value, '');
            }
            else if (typeof value === 'object') {
                return new RegExp(value.pattern, value.flags);
            }
            return null;
        };
        LanguageConfigurationFileHandler.prototype._mapIndentationRules = function (indentationRules) {
            try {
                var increaseIndentPattern = this._parseRegex(indentationRules.increaseIndentPattern);
                var decreaseIndentPattern = this._parseRegex(indentationRules.decreaseIndentPattern);
                if (increaseIndentPattern && decreaseIndentPattern) {
                    var result = {
                        increaseIndentPattern: increaseIndentPattern,
                        decreaseIndentPattern: decreaseIndentPattern
                    };
                    if (indentationRules.indentNextLinePattern) {
                        result.indentNextLinePattern = this._parseRegex(indentationRules.indentNextLinePattern);
                    }
                    if (indentationRules.unIndentedLinePattern) {
                        result.unIndentedLinePattern = this._parseRegex(indentationRules.unIndentedLinePattern);
                    }
                    return result;
                }
            }
            catch (error) {
                // Malformed regexes are ignored
            }
            return null;
        };
        LanguageConfigurationFileHandler.prototype._mapCharacterPairs = function (pairs) {
            return pairs.map(function (pair) {
                if (Array.isArray(pair)) {
                    return { open: pair[0], close: pair[1] };
                }
                return pair;
            });
        };
        LanguageConfigurationFileHandler = __decorate([
            __param(0, textMateService_1.ITextMateService),
            __param(1, modeService_1.IModeService)
        ], LanguageConfigurationFileHandler);
        return LanguageConfigurationFileHandler;
    }());
    exports.LanguageConfigurationFileHandler = LanguageConfigurationFileHandler;
    var schemaId = 'vscode://schemas/language-configuration';
    var schema = {
        default: {
            comments: {
                blockComment: ['/*', '*/'],
                lineComment: '//'
            },
            brackets: [['(', ')'], ['[', ']'], ['{', '}']],
            autoClosingPairs: [['(', ')'], ['[', ']'], ['{', '}']],
            surroundingPairs: [['(', ')'], ['[', ']'], ['{', '}']]
        },
        definitions: {
            openBracket: {
                type: 'string',
                description: nls.localize('schema.openBracket', 'The opening bracket character or string sequence.')
            },
            closeBracket: {
                type: 'string',
                description: nls.localize('schema.closeBracket', 'The closing bracket character or string sequence.')
            },
            bracketPair: {
                type: 'array',
                items: [{
                        $ref: '#definitions/openBracket'
                    }, {
                        $ref: '#definitions/closeBracket'
                    }]
            }
        },
        properties: {
            comments: {
                default: {
                    blockComment: ['/*', '*/'],
                    lineComment: '//'
                },
                description: nls.localize('schema.comments', 'Defines the comment symbols'),
                type: 'object',
                properties: {
                    blockComment: {
                        type: 'array',
                        description: nls.localize('schema.blockComments', 'Defines how block comments are marked.'),
                        items: [{
                                type: 'string',
                                description: nls.localize('schema.blockComment.begin', 'The character sequence that starts a block comment.')
                            }, {
                                type: 'string',
                                description: nls.localize('schema.blockComment.end', 'The character sequence that ends a block comment.')
                            }]
                    },
                    lineComment: {
                        type: 'string',
                        description: nls.localize('schema.lineComment', 'The character sequence that starts a line comment.')
                    }
                }
            },
            brackets: {
                default: [['(', ')'], ['[', ']'], ['{', '}']],
                description: nls.localize('schema.brackets', 'Defines the bracket symbols that increase or decrease the indentation.'),
                type: 'array',
                items: {
                    $ref: '#definitions/bracketPair'
                }
            },
            autoClosingPairs: {
                default: [['(', ')'], ['[', ']'], ['{', '}']],
                description: nls.localize('schema.autoClosingPairs', 'Defines the bracket pairs. When a opening bracket is entered, the closing bracket is inserted automatically.'),
                type: 'array',
                items: {
                    oneOf: [{
                            $ref: '#definitions/bracketPair'
                        }, {
                            type: 'object',
                            properties: {
                                open: {
                                    $ref: '#definitions/openBracket'
                                },
                                close: {
                                    $ref: '#definitions/closeBracket'
                                },
                                notIn: {
                                    type: 'array',
                                    description: nls.localize('schema.autoClosingPairs.notIn', 'Defines a list of scopes where the auto pairs are disabled.'),
                                    items: {
                                        enum: ['string', 'comment']
                                    }
                                }
                            }
                        }]
                }
            },
            surroundingPairs: {
                default: [['(', ')'], ['[', ']'], ['{', '}']],
                description: nls.localize('schema.surroundingPairs', 'Defines the bracket pairs that can be used to surround a selected string.'),
                type: 'array',
                items: {
                    oneOf: [{
                            $ref: '#definitions/bracketPair'
                        }, {
                            type: 'object',
                            properties: {
                                open: {
                                    $ref: '#definitions/openBracket'
                                },
                                close: {
                                    $ref: '#definitions/closeBracket'
                                }
                            }
                        }]
                }
            },
            wordPattern: {
                default: '',
                description: nls.localize('schema.wordPattern', 'The word definition for the language.'),
                type: ['string', 'object'],
                properties: {
                    pattern: {
                        type: 'string',
                        description: nls.localize('schema.wordPattern.pattern', 'The RegExp pattern used to match words.'),
                        default: '',
                    },
                    flags: {
                        type: 'string',
                        description: nls.localize('schema.wordPattern.flags', 'The RegExp flags used to match words.'),
                        default: 'g',
                        pattern: '^([gimuy]+)$',
                        patternErrorMessage: nls.localize('schema.wordPattern.flags.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
                    }
                }
            },
            indentationRules: {
                default: {
                    increaseIndentPattern: '',
                    decreaseIndentPattern: ''
                },
                description: nls.localize('schema.indentationRules', 'The language\'s indentation settings.'),
                type: 'object',
                properties: {
                    increaseIndentPattern: {
                        type: ['string', 'object'],
                        description: nls.localize('schema.indentationRules.increaseIndentPattern', 'If a line matches this pattern, then all the lines after it should be indented once (until another rule matches).'),
                        properties: {
                            pattern: {
                                type: 'string',
                                description: nls.localize('schema.indentationRules.increaseIndentPattern.pattern', 'The RegExp pattern for increaseIndentPattern.'),
                                default: '',
                            },
                            flags: {
                                type: 'string',
                                description: nls.localize('schema.indentationRules.increaseIndentPattern.flags', 'The RegExp flags for increaseIndentPattern.'),
                                default: '',
                                pattern: '^([gimuy]+)$',
                                patternErrorMessage: nls.localize('schema.indentationRules.increaseIndentPattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
                            }
                        }
                    },
                    decreaseIndentPattern: {
                        type: ['string', 'object'],
                        description: nls.localize('schema.indentationRules.decreaseIndentPattern', 'If a line matches this pattern, then all the lines after it should be unindendented once (until another rule matches).'),
                        properties: {
                            pattern: {
                                type: 'string',
                                description: nls.localize('schema.indentationRules.decreaseIndentPattern.pattern', 'The RegExp pattern for decreaseIndentPattern.'),
                                default: '',
                            },
                            flags: {
                                type: 'string',
                                description: nls.localize('schema.indentationRules.decreaseIndentPattern.flags', 'The RegExp flags for decreaseIndentPattern.'),
                                default: '',
                                pattern: '^([gimuy]+)$',
                                patternErrorMessage: nls.localize('schema.indentationRules.decreaseIndentPattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
                            }
                        }
                    },
                    indentNextLinePattern: {
                        type: ['string', 'object'],
                        description: nls.localize('schema.indentationRules.indentNextLinePattern', 'If a line matches this pattern, then **only the next line** after it should be indented once.'),
                        properties: {
                            pattern: {
                                type: 'string',
                                description: nls.localize('schema.indentationRules.indentNextLinePattern.pattern', 'The RegExp pattern for indentNextLinePattern.'),
                                default: '',
                            },
                            flags: {
                                type: 'string',
                                description: nls.localize('schema.indentationRules.indentNextLinePattern.flags', 'The RegExp flags for indentNextLinePattern.'),
                                default: '',
                                pattern: '^([gimuy]+)$',
                                patternErrorMessage: nls.localize('schema.indentationRules.indentNextLinePattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
                            }
                        }
                    },
                    unIndentedLinePattern: {
                        type: ['string', 'object'],
                        description: nls.localize('schema.indentationRules.unIndentedLinePattern', 'If a line matches this pattern, then its indentation should not be changed and it should not be evaluated against the other rules.'),
                        properties: {
                            pattern: {
                                type: 'string',
                                description: nls.localize('schema.indentationRules.unIndentedLinePattern.pattern', 'The RegExp pattern for unIndentedLinePattern.'),
                                default: '',
                            },
                            flags: {
                                type: 'string',
                                description: nls.localize('schema.indentationRules.unIndentedLinePattern.flags', 'The RegExp flags for unIndentedLinePattern.'),
                                default: '',
                                pattern: '^([gimuy]+)$',
                                patternErrorMessage: nls.localize('schema.indentationRules.unIndentedLinePattern.errorMessage', 'Must match the pattern `/^([gimuy]+)$/`.')
                            }
                        }
                    }
                }
            }
        }
    };
    var schemaRegistry = platform_1.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
    schemaRegistry.registerSchema(schemaId, schema);
});
//# sourceMappingURL=languageConfigurationExtensionPoint.js.map