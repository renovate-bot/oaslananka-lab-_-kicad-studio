import * as fs from 'node:fs';
import * as path from 'node:path';
import { LARGE_FILE_BYTES } from '../../src/constants';
import { SExpressionParser } from '../../src/language/sExpressionParser';

describe('SExpressionParser', () => {
  const fixture = fs.readFileSync(
    path.join(__dirname, '..', 'fixtures', 'sample.kicad_sch'),
    'utf8'
  );

  it('parses a simple schematic file', () => {
    const parser = new SExpressionParser();
    const ast = parser.parse(fixture);
    expect(ast.type).toBe('list');
    expect(ast.children?.[0]?.children?.[0]?.value).toBe('kicad_sch');
  });

  it('returns an empty root list for empty input', () => {
    const parser = new SExpressionParser();
    const ast = parser.parse('');
    expect(ast.type).toBe('list');
    expect(ast.children).toEqual([]);
  });

  it('handles malformed input gracefully', () => {
    const parser = new SExpressionParser();
    const ast = parser.parse('(kicad_sch (symbol "U1"');
    expect(ast.type).toBe('list');
    expect(parser.getErrors(ast).length).toBeGreaterThan(0);
  });

  it('finds nested nodes by path', () => {
    const parser = new SExpressionParser();
    const ast = parser.parse(fixture);
    const symbol = parser.findNode(ast, 'kicad_sch', 'symbol');
    expect(symbol).toBeDefined();
  });

  it('finds deeply nested nodes by path', () => {
    const parser = new SExpressionParser();
    const ast = parser.parse('(kicad_sch (component (property "Name" "R1")))');
    expect(
      parser.findNode(ast, 'kicad_sch', 'component', 'property')
    ).toBeDefined();
  });

  it('extracts all symbol references', () => {
    const parser = new SExpressionParser();
    const ast = parser.parse(fixture);
    const symbols = parser.findAllNodes(ast, 'symbol');
    expect(symbols).toHaveLength(3);
  });

  it('handles nested S-expressions and unicode text', () => {
    const parser = new SExpressionParser();
    const ast = parser.parse('(a (b (c "çşğü")))');
    expect(parser.findNode(ast, 'a', 'b', 'c')?.children?.[1]?.value).toBe(
      'çşğü'
    );
  });

  it('parses comments, escaped strings, numbers, and atom values', () => {
    const parser = new SExpressionParser();
    const ast = parser.parse(
      '(root # comment\n (value -1.5) (label "A \\"quoted\\" label"))'
    );
    const root = parser.findNode(ast, 'root');

    if (!root) {
      throw new Error('Expected root node.');
    }

    expect(parser.getAtomValue(root, 'value')).toBe('-1.5');
    expect(parser.getAtomValue(root, 'label')).toBe('A "quoted" label');
    expect(parser.getAtomValue(root, 'missing')).toBeUndefined();
  });

  it('reports unexpected closing parentheses and unterminated strings', () => {
    const parser = new SExpressionParser();
    const closing = parser.parse(')');
    const unterminated = parser.parse('(root "unterminated');

    expect(parser.getErrors(closing).map((error) => error.message)).toContain(
      'Unexpected closing parenthesis.'
    );
    expect(
      parser.getErrors(unterminated).map((error) => error.message)
    ).toEqual(
      expect.arrayContaining([
        'Unterminated string literal.',
        'Unterminated list; expected closing parenthesis.'
      ])
    );
  });

  it('tracks range information for parsed nodes', () => {
    const parser = new SExpressionParser();
    const ast = parser.parse('(root\n  (child "x"))');
    const child = parser.findNode(ast, 'root', 'child');
    const range = child ? parser.getPosition(child) : undefined;
    expect(range?.start.line).toBe(1);
    expect(range?.start.character).toBe(2);
  });

  it('stores lazy full text for large inputs', () => {
    const parser = new SExpressionParser();
    const largeText = `(root "${'x'.repeat(LARGE_FILE_BYTES + 1)}")`;
    const ast = parser.parse(largeText);
    expect((parser as any).lazyFullText.get(ast)).toBe(largeText);
  });

  it('expands lazy large input before answering tree queries', () => {
    const parser = new SExpressionParser();
    const largeText = `(root (child "ready") "${'x'.repeat(LARGE_FILE_BYTES + 1)}")`;
    const ast = parser.parse(largeText);

    expect(parser.findNode(ast, 'root', 'child')?.children?.[1]?.value).toBe(
      'ready'
    );
    expect((parser as any).lazyFullText.get(ast)).toBeUndefined();
  });
});
