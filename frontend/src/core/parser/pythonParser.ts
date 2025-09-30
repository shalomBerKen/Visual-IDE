import type { Block, FunctionBlock, VariableBlock, IfBlock, ForBlock, ReturnBlock } from '../../types/blocks';

export class PythonParser {
  private currentId = 0;

  private generateId(type: string): string {
    return `${type}-${Date.now()}-${this.currentId++}`;
  }

  parse(code: string): Block[] {
    this.currentId = 0;
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
        blocks.push({
          id: this.generateId('return'),
          type: 'return',
          value: returnValue
        } as ReturnBlock);
        i++;
        continue;
      }

      // Parse variable assignment
      if (line.trimmed.includes('=') && !line.trimmed.includes('==')) {
        const parts = line.trimmed.split('=');
        if (parts.length >= 2) {
          const varName = parts[0].trim();
          const varValue = parts.slice(1).join('=').trim();
          blocks.push({
            id: this.generateId('variable'),
            type: 'variable',
            name: varName,
            value: varValue
          } as VariableBlock);
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
      return {
        block: {
          id: this.generateId('function'),
          type: 'function',
          name: 'unknown_function',
          parameters: [],
          children: []
        },
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

    return {
      block: {
        id: this.generateId('function'),
        type: 'function',
        name: functionName,
        parameters,
        children
      },
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

    return {
      block: {
        id: this.generateId('if'),
        type: 'if',
        condition,
        ifBody,
        elseType,
        elseBody
      },
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

    return {
      block: {
        id: this.generateId('for'),
        type: 'for',
        iterator,
        iterable,
        children
      },
      nextIndex
    };
  }
}