define(["require", "exports", "vs/nls", "vs/platform/registry/common/platform", "vs/platform/jsonschemas/common/jsonContributionRegistry", "vs/platform/theme/common/colorRegistry"], function (require, exports, nls, platform_1, jsonContributionRegistry_1, colorRegistry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var themingRegistry = platform_1.Registry.as(colorRegistry_1.Extensions.ColorContribution);
    var textMateScopes = [
        'comment',
        'comment.block',
        'comment.block.documentation',
        'comment.line',
        'constant',
        'constant.character',
        'constant.character.escape',
        'constant.numeric',
        'constant.numeric.integer',
        'constant.numeric.float',
        'constant.numeric.hex',
        'constant.numeric.octal',
        'constant.other',
        'constant.regexp',
        'constant.rgb-value',
        'emphasis',
        'entity',
        'entity.name',
        'entity.name.class',
        'entity.name.function',
        'entity.name.method',
        'entity.name.section',
        'entity.name.selector',
        'entity.name.tag',
        'entity.name.type',
        'entity.other',
        'entity.other.attribute-name',
        'entity.other.inherited-class',
        'invalid',
        'invalid.deprecated',
        'invalid.illegal',
        'keyword',
        'keyword.control',
        'keyword.operator',
        'keyword.operator.new',
        'keyword.operator.assignment',
        'keyword.operator.arithmetic',
        'keyword.operator.logical',
        'keyword.other',
        'markup',
        'markup.bold',
        'markup.changed',
        'markup.deleted',
        'markup.heading',
        'markup.inline.raw',
        'markup.inserted',
        'markup.italic',
        'markup.list',
        'markup.list.numbered',
        'markup.list.unnumbered',
        'markup.other',
        'markup.quote',
        'markup.raw',
        'markup.underline',
        'markup.underline.link',
        'meta',
        'meta.block',
        'meta.cast',
        'meta.class',
        'meta.function',
        'meta.function-call',
        'meta.preprocessor',
        'meta.return-type',
        'meta.selector',
        'meta.tag',
        'meta.type.annotation',
        'meta.type',
        'punctuation.definition.string.begin',
        'punctuation.definition.string.end',
        'punctuation.separator',
        'punctuation.separator.continuation',
        'punctuation.terminator',
        'storage',
        'storage.modifier',
        'storage.type',
        'string',
        'string.interpolated',
        'string.other',
        'string.quoted',
        'string.quoted.double',
        'string.quoted.other',
        'string.quoted.single',
        'string.quoted.triple',
        'string.regexp',
        'string.unquoted',
        'strong',
        'support',
        'support.class',
        'support.constant',
        'support.function',
        'support.other',
        'support.type',
        'support.type.property-name',
        'support.variable',
        'variable',
        'variable.language',
        'variable.name',
        'variable.other',
        'variable.other.readwrite',
        'variable.parameter'
    ];
    exports.tokenColorizationSettingSchema = {
        type: 'object',
        description: nls.localize('schema.token.settings', 'Colors and styles for the token.'),
        properties: {
            foreground: {
                type: 'string',
                description: nls.localize('schema.token.foreground', 'Foreground color for the token.'),
                format: 'color',
                defaultSnippets: [{ body: '${1:#FF0000}' }]
            },
            fontStyle: {
                type: 'string',
                description: nls.localize('schema.token.fontStyle', 'Font style of the rule: One or a combination of \'italic\', \'bold\' and \'underline\''),
                pattern: '^(\\s*\\b(italic|bold|underline))*\\s*$',
                patternErrorMessage: nls.localize('schema.fontStyle.error', 'Font style must be a combination of \'italic\', \'bold\' and \'underline\''),
                defaultSnippets: [{ body: 'italic' }, { body: 'bold' }, { body: 'underline' }, { body: 'italic bold' }, { body: 'italic underline' }, { body: 'bold underline' }, { body: 'italic bold underline' }]
            }
        },
        defaultSnippets: [{ body: { foreground: '${1:#FF0000}', fontStyle: '${2:bold}' } }]
    };
    exports.colorsSchema = themingRegistry.getColorSchema();
    function tokenColorsSchema(description) {
        return {
            type: 'array',
            description: description,
            items: {
                type: 'object',
                defaultSnippets: [{ body: { scope: '${1:keyword.operator}', settings: { foreground: '${2:#FF0000}' } } }],
                properties: {
                    name: {
                        type: 'string',
                        description: nls.localize('schema.properties.name', 'Description of the rule.')
                    },
                    scope: {
                        description: nls.localize('schema.properties.scope', 'Scope selector against which this rule matches.'),
                        anyOf: [
                            {
                                enum: textMateScopes
                            },
                            {
                                type: 'string'
                            },
                            {
                                type: 'array',
                                items: {
                                    enum: textMateScopes
                                }
                            },
                            {
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            }
                        ]
                    },
                    settings: exports.tokenColorizationSettingSchema
                }
            }
        };
    }
    exports.tokenColorsSchema = tokenColorsSchema;
    var schemaId = 'vscode://schemas/color-theme';
    var schema = {
        type: 'object',
        properties: {
            colors: exports.colorsSchema,
            tokenColors: {
                anyOf: [{
                        type: 'string',
                        description: nls.localize('schema.tokenColors.path', 'Path to a tmTheme file (relative to the current file).')
                    },
                    tokenColorsSchema(nls.localize('schema.colors', 'Colors for syntax highlighting'))
                ]
            }
        }
    };
    function register() {
        var schemaRegistry = platform_1.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
        schemaRegistry.registerSchema(schemaId, schema);
    }
    exports.register = register;
});
//# sourceMappingURL=colorThemeSchema.js.map