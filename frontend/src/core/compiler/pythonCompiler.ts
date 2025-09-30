import type { Block, FunctionBlock, VariableBlock, IfBlock, ForBlock, ReturnBlock } from '../../types/blocks';

export class PythonCompiler {
  compile(blocks: Block[]): string {
    return blocks.map(block => this.compileBlock(block)).join('\n\n');
  }

  private compileBlock(block: Block, indent: number = 0): string {
    const indentStr = '    '.repeat(indent);

    switch (block.type) {
      case 'function':
        return this.compileFunction(block as FunctionBlock, indent);
      case 'variable':
        return this.compileVariable(block as VariableBlock, indent);
      case 'if':
        return this.compileIf(block as IfBlock, indent);
      case 'for':
        return this.compileFor(block as ForBlock, indent);
      case 'return':
        return this.compileReturn(block as ReturnBlock, indent);
      default:
        return `${indentStr}# Unknown block type`;
    }
  }

  private compileFunction(block: FunctionBlock, indent: number): string {
    const indentStr = '    '.repeat(indent);
    const params = block.parameters.join(', ');
    const signature = `${indentStr}def ${block.name}(${params}):`;

    if (!block.children || block.children.length === 0) {
      return `${signature}\n${indentStr}    pass`;
    }

    const body = block.children
      .map(child => this.compileBlock(child, indent + 1))
      .join('\n');

    return `${signature}\n${body}`;
  }

  private compileVariable(block: VariableBlock, indent: number): string {
    const indentStr = '    '.repeat(indent);
    return `${indentStr}${block.name} = ${block.value}`;
  }

  private compileIf(block: IfBlock, indent: number): string {
    const indentStr = '    '.repeat(indent);
    const ifPart = `${indentStr}if ${block.condition}:`;

    // Compile the if body (TRUE branch)
    const ifBody = block.ifBody && block.ifBody.length > 0
      ? block.ifBody.map(child => this.compileBlock(child, indent + 1)).join('\n')
      : `${indentStr}    pass`;

    let result = `${ifPart}\n${ifBody}`;

    // Handle else/elif based on elseType
    if (block.elseType === 'elif' && block.elseBody.length > 0) {
      // Elif: the elseBody should contain exactly one if block
      const elifBlock = block.elseBody[0];
      if (elifBlock && elifBlock.type === 'if') {
        // Compile as "elif" instead of "else: if"
        const elifIfBlock = elifBlock as IfBlock;
        const elifPart = `${indentStr}elif ${elifIfBlock.condition}:`;

        const elifBody = elifIfBlock.ifBody && elifIfBlock.ifBody.length > 0
          ? elifIfBlock.ifBody.map(child => this.compileBlock(child, indent + 1)).join('\n')
          : `${indentStr}    pass`;

        result += `\n${elifPart}\n${elifBody}`;

        // Recursively handle the elif's else/elif
        if (elifIfBlock.elseType !== 'none') {
          const innerElse = this.compileElseOrElif(elifIfBlock, indent);
          if (innerElse) {
            result += `\n${innerElse}`;
          }
        }
      }
    } else if (block.elseType === 'else' && block.elseBody.length > 0) {
      // Regular else: compile all statements in elseBody
      const elsePart = `${indentStr}else:`;
      const elseBody = block.elseBody
        .map(child => this.compileBlock(child, indent + 1))
        .join('\n');
      result += `\n${elsePart}\n${elseBody}`;
    }

    return result;
  }

  private compileElseOrElif(block: IfBlock, indent: number): string {
    const indentStr = '    '.repeat(indent);

    if (block.elseType === 'elif' && block.elseBody.length > 0) {
      const elifBlock = block.elseBody[0];
      if (elifBlock && elifBlock.type === 'if') {
        const elifIfBlock = elifBlock as IfBlock;
        const elifPart = `${indentStr}elif ${elifIfBlock.condition}:`;

        const elifBody = elifIfBlock.ifBody && elifIfBlock.ifBody.length > 0
          ? elifIfBlock.ifBody.map(child => this.compileBlock(child, indent + 1)).join('\n')
          : `${indentStr}    pass`;

        let result = `${elifPart}\n${elifBody}`;

        // Recursively handle nested elif/else
        if (elifIfBlock.elseType !== 'none') {
          const innerElse = this.compileElseOrElif(elifIfBlock, indent);
          if (innerElse) {
            result += `\n${innerElse}`;
          }
        }

        return result;
      }
    } else if (block.elseType === 'else' && block.elseBody.length > 0) {
      const elsePart = `${indentStr}else:`;
      const elseBody = block.elseBody
        .map(child => this.compileBlock(child, indent + 1))
        .join('\n');
      return `${elsePart}\n${elseBody}`;
    }

    return '';
  }

  private compileFor(block: ForBlock, indent: number): string {
    const indentStr = '    '.repeat(indent);
    const forLine = `${indentStr}for ${block.iterator} in ${block.iterable}:`;

    const body = block.children && block.children.length > 0
      ? block.children.map(child => this.compileBlock(child, indent + 1)).join('\n')
      : `${indentStr}    pass`;

    return `${forLine}\n${body}`;
  }

  private compileReturn(block: ReturnBlock, indent: number): string {
    const indentStr = '    '.repeat(indent);
    return `${indentStr}return ${block.value}`;
  }
}