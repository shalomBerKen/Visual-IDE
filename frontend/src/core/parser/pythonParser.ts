import type { Block, FunctionBlock, IfBlock, ForBlock } from '../../types/blocks';
import { BlockFactory } from '../../services/BlockFactory';

export class PythonParser {
  parse(code: string): Block[] {
    const lines = code.split('\n').map(line => ({
      text: line,
      indent: this.getIndentation(line),
      trimmed: line.trim()
    }));

    return this.parseLines(lines, 0);
  }

  private getIndentation(line: string): number {
    const match = line.match(/^(\s*)/);
    return match ? match[1].length : 0;
  }

  private parseLines(lines: Array<{text: string, indent: number, trimmed: string}>, startIndex: number, parentIndent: number = -1): Block[] {
    const blocks: Block[] = [];
    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines and comments
      if (!line.trimmed || line.trimmed.startsWith('#')) {
        i++;
        continue;
      }

      // If indentation is less than or equal to parent, we're done with this block
      if (parentIndent >= 0 && line.indent <= parentIndent) {
        break;
      }

      // Parse function definition
      if (line.trimmed.startsWith('def ')) {
        const result = this.parseFunction(lines, i);
        blocks.push(result.block);
        i = result.nextIndex;
        continue;
      }

      // Parse if statement
      if (line.trimmed.startsWith('if ')) {
        const result = this.parseIf(lines, i);
        blocks.push(result.block);
        i = result.nextIndex;
        continue;
      }

      // Parse for loop
      if (line.trimmed.startsWith('for ')) {
        const result = this.parseFor(lines, i);
        blocks.push(result.block);
        i = result.nextIndex;
        continue;
      }

      // Parse return statement
      if (line.trimmed.startsWith('return ')) {
        const returnValue = line.trimmed.substring(7).trim() || 'None';
        const returnBlock = BlockFactory.createReturnBlock();
        if (returnBlock) {
          returnBlock.value = returnValue;
          blocks.push(returnBlock);
        }
        i++;
        continue;
      }

      // Parse variable assignment
      if (line.trimmed.includes('=') && !line.trimmed.includes('==')) {
        const parts = line.trimmed.split('=');
        if (parts.length >= 2) {
          const varName = parts[0].trim();
          const varValue = parts.slice(1).join('=').trim();
          const variableBlock = BlockFactory.createVariableBlock();
          if (variableBlock) {
            variableBlock.name = varName;
            variableBlock.value = varValue;
            blocks.push(variableBlock);
          }
        }
        i++;
        continue;
      }

      // Skip unknown statements
      i++;
    }

    return blocks;
  }

  private parseFunction(lines: Array<{text: string, indent: number, trimmed: string}>, startIndex: number): { block: FunctionBlock, nextIndex: number } {
    const line = lines[startIndex];
    const match = line.trimmed.match(/^def\s+(\w+)\s*\((.*?)\)\s*:/);

    if (!match) {
      const defaultBlock = BlockFactory.createFunctionBlock();
      return {
        block: defaultBlock,
        nextIndex: startIndex + 1
      };
    }

    const functionName = match[1];
    const paramsStr = match[2].trim();
    const parameters = paramsStr ? paramsStr.split(',').map(p => p.trim()) : [];

    // Find function body
    let bodyStartIndex = startIndex + 1;
    const functionIndent = line.indent;

    // Parse body
    const children = this.parseLines(lines, bodyStartIndex, functionIndent);

    // Find where the function ends
    let nextIndex = bodyStartIndex;
    while (nextIndex < lines.length) {
      const nextLine = lines[nextIndex];
      if (nextLine.trimmed && nextLine.indent <= functionIndent) {
        break;
      }
      nextIndex++;
    }

    const functionBlock = BlockFactory.createFunctionBlock();
    functionBlock.name = functionName;
    functionBlock.parameters = parameters;
    functionBlock.children = children;

    return {
      block: functionBlock,
      nextIndex
    };
  }

  private parseIf(lines: Array<{text: string, indent: number, trimmed: string}>, startIndex: number): { block: IfBlock, nextIndex: number } {
    const line = lines[startIndex];
    const match = line.trimmed.match(/^(?:if|elif)\s+(.+):/);

    const condition = match ? match[1].trim() : 'True';
    const ifIndent = line.indent;

    // Parse if body (TRUE branch)
    let bodyStartIndex = startIndex + 1;
    const ifBody = this.parseLines(lines, bodyStartIndex, ifIndent);

    // Find next index and check for elif/else
    let nextIndex = bodyStartIndex;
    while (nextIndex < lines.length) {
      const nextLine = lines[nextIndex];
      if (nextLine.trimmed && nextLine.indent <= ifIndent) {
        break;
      }
      nextIndex++;
    }

    let elseType: 'none' | 'elif' | 'else' = 'none';
    let elseBody: Block[] = [];

    if (nextIndex < lines.length && lines[nextIndex].indent === ifIndent) {
      const nextLine = lines[nextIndex];

      // Check for elif
      if (nextLine.trimmed.startsWith('elif ')) {
        elseType = 'elif';
        // Parse elif as a nested if block
        const elifResult = this.parseIf(lines, nextIndex);
        elseBody = [elifResult.block];
        nextIndex = elifResult.nextIndex;
      }
      // Check for else
      else if (nextLine.trimmed === 'else:') {
        elseType = 'else';
        // Parse else body
        const elseBodyStart = nextIndex + 1;
        elseBody = this.parseLines(lines, elseBodyStart, ifIndent);

        // Move nextIndex past the else block
        nextIndex = elseBodyStart;
        while (nextIndex < lines.length) {
          const laterLine = lines[nextIndex];
          if (laterLine.trimmed && laterLine.indent <= ifIndent) {
            break;
          }
          nextIndex++;
        }
      }
    }

    const ifBlock = BlockFactory.createIfBlock();
    ifBlock.condition = condition;
    ifBlock.ifBody = ifBody;
    ifBlock.elseType = elseType;
    ifBlock.elseBody = elseBody;

    return {
      block: ifBlock,
      nextIndex
    };
  }

  private parseFor(lines: Array<{text: string, indent: number, trimmed: string}>, startIndex: number): { block: ForBlock, nextIndex: number } {
    const line = lines[startIndex];
    const match = line.trimmed.match(/^for\s+(\w+)\s+in\s+(.+):/);

    const iterator = match ? match[1].trim() : 'i';
    const iterable = match ? match[2].trim() : 'range(10)';
    const forIndent = line.indent;

    // Parse loop body
    let bodyStartIndex = startIndex + 1;
    const children = this.parseLines(lines, bodyStartIndex, forIndent);

    // Find where the loop ends
    let nextIndex = bodyStartIndex;
    while (nextIndex < lines.length) {
      const nextLine = lines[nextIndex];
      if (nextLine.trimmed && nextLine.indent <= forIndent) {
        break;
      }
      nextIndex++;
    }

    const forBlock = BlockFactory.createForBlock();
    forBlock.iterator = iterator;
    forBlock.iterable = iterable;
    forBlock.children = children;

    return {
      block: forBlock,
      nextIndex
    };
  }
}