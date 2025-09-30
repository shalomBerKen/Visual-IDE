import type { Block } from '../../types/blocks';
import type { LanguageService } from '../interfaces/LanguageService';
import { PythonCompiler } from '../compiler/pythonCompiler';
import { PythonParser } from '../parser/pythonParser';

/**
 * Language service implementation for Python
 * Provides compilation and parsing for Python code
 */
export class PythonLanguageService implements LanguageService {
  readonly name = 'Python';

  private compiler: PythonCompiler;
  private parser: PythonParser;

  constructor() {
    this.compiler = new PythonCompiler();
    this.parser = new PythonParser();
  }

  /**
   * Compile blocks to Python source code
   */
  compile(blocks: Block[]): string {
    return this.compiler.compile(blocks);
  }

  /**
   * Parse Python source code into blocks
   */
  parse(code: string): Block[] {
    return this.parser.parse(code);
  }
}
