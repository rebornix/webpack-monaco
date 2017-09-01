import * as modes from 'vs/editor/common/modes';
import * as monarchCommon from 'vs/editor/standalone/common/monarch/monarchCommon';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IStandaloneThemeService } from 'vs/editor/standalone/common/standaloneThemeService';
export declare function createTokenizationSupport(modeService: IModeService, standaloneThemeService: IStandaloneThemeService, modeId: string, lexer: monarchCommon.ILexer): modes.ITokenizationSupport;
