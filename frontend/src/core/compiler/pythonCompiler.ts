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

    const ifBody = block.children && block.children.length > 0
      ? block.children.map(child => this.compileBlock(child, indent + 1)).join('\n')
      : `${indentStr}    pass`;

    let result = `${ifPart}\n${ifBody}`;

    if (block.elseChildren && block.elseChildren.length > 0) {
      const elsePart = `${indentStr}else:`;
      const elseBody = block.elseChildren
        .map(child => this.compileBlock(child, indent + 1))
        .join('\n');
      result += `\n${elsePart}\n${elseBody}`;
    }

    return result;
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