import type { Block } from '../../types/blocks';

/**
 * Interface for language-specific compilation and parsing services
 * Each programming language (Python, JavaScript, etc.) implements this interface
 */
export interface LanguageService {
  /**
   * The name of the programming language
   * @example "Python", "JavaScript", "TypeScript"
   */
  readonly name: string;

  /**
   * Compile blocks to source code in the target language
   * @param blocks - Array of blocks to compile
   * @returns Source code string in the target language
   */
  compile(blocks: Block[]): string;

  /**
   * Parse source code into blocks
   * @param code - Source code string in the target language
   * @returns Array of parsed blocks
   * @throws Error if code cannot be parsed
   */
  parse(code: string): Block[];
}
