/**
 * High-precision calculation engine for DARK CALCULADORA
 * Handles order of operations, percentages, scientific functions,
 * floating point correction, and division by zero prevention.
 */

import { AngleMode } from '../types';

export class MathEngine {
  /**
   * Sanitizes and parses an expression string, returning the computed result
   * or an error string if invalid.
   */
  public static evaluate(rawExpression: string, angleMode: AngleMode = 'DEG'): { result: string; error?: string } {
    if (!rawExpression || rawExpression.trim() === '') {
      return { result: '0' };
    }

    try {
      // Step 1: Pre-process expression tokens
      let expr = rawExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/,/g, '.')
        .replace(/π/g, `(${Math.PI})`)
        .replace(/e/g, `(${Math.E})`);

      // Balance open parentheses
      const openParens = (expr.match(/\(/g) || []).length;
      const closeParens = (expr.match(/\)/g) || []).length;
      if (openParens > closeParens) {
        expr += ')'.repeat(openParens - closeParens);
      }

      // Handle square roots: √(expr) or √number -> Math.sqrt(...)
      expr = expr.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
      expr = expr.replace(/√([0-9.]+)/g, 'Math.sqrt($1)');

      // Handle power x^y -> Math.pow(x, y)
      // Replace a^b with Math.pow(a, b) handling numbers/parentheses
      expr = this.replacePowers(expr);

      // Handle trigonometry with angle mode
      expr = this.replaceTrig(expr, angleMode);

      // Handle logarithms
      expr = expr.replace(/ln\(/g, 'Math.log(');
      expr = expr.replace(/log\(/g, 'Math.log10(');

      // Handle percentages
      expr = this.handlePercentages(expr);

      // Check for division by zero before evaluation
      if (/\/0(?![.0-9])|\/0\.0+(?![0-9])/.test(expr)) {
        return { result: 'Erro', error: 'Não é possível dividir por zero' };
      }

      // Safe evaluation using Function with Math sandbox
      const mathScope = {
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        sqrt: Math.sqrt,
        pow: Math.pow,
        log: Math.log,
        log10: Math.log10,
        PI: Math.PI,
        E: Math.E,
        abs: Math.abs,
      };

      // Ensure no harmful injection or syntax
      if (!/^[0-9+\-*/().,%^ Matha-z_]+$/i.test(expr)) {
        return { result: 'Erro', error: 'Expressão inválida' };
      }

      // Evaluate within Math scope
      const evalFn = new Function('Math', `"use strict"; return (${expr});`);
      const rawResult = evalFn(Math);

      if (typeof rawResult !== 'number' || isNaN(rawResult)) {
        return { result: 'Erro', error: 'Cálculo indefinido' };
      }

      if (!isFinite(rawResult)) {
        return { result: 'Erro', error: 'Não é possível dividir por zero' };
      }

      // Format output with floating-point precision correction
      const formatted = this.formatNumber(rawResult);
      return { result: formatted };
    } catch {
      return { result: 'Erro', error: 'Expressão incompleta' };
    }
  }

  /**
   * Corrects standard floating-point representation (e.g. 0.1 + 0.2 = 0.3)
   */
  public static formatNumber(num: number): string {
    if (isNaN(num)) return 'Erro';
    if (!isFinite(num)) return 'Infinito';

    // Round away floating point inaccuracy up to 12 digits
    const rounded = parseFloat(num.toPrecision(12));

    // If exponential notation is very large or very small
    if (Math.abs(rounded) >= 1e15 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-7)) {
      return rounded.toExponential(6).replace('e+', 'e+').replace('e-', 'e-');
    }

    return rounded.toString();
  }

  /**
   * Evaluates percentages contextually:
   * e.g., "100 + 10%" -> "100 + (100 * (10/100))"
   * e.g., "200 - 15%" -> "200 - (200 * (15/100))"
   * e.g., "50 * 20%"  -> "50 * (20/100)"
   * e.g., "25%"       -> "(25/100)"
   */
  private static handlePercentages(expr: string): string {
    // Case 1: additive/subtractive percentage: base [+-] rate%
    const addSubRegex = /([0-9.]+)\s*([+-])\s*([0-9.]+)%/g;
    expr = expr.replace(addSubRegex, '($1 $2 ($1 * ($3 / 100)))');

    // Case 2: multiplicative percentage: base [* /] rate%
    const mulDivRegex = /([0-9.]+)\s*([*/])\s*([0-9.]+)%/g;
    expr = expr.replace(mulDivRegex, '($1 $2 ($3 / 100))');

    // Case 3: standalone percentage: number%
    expr = expr.replace(/([0-9.]+)%/g, '($1 / 100)');

    return expr;
  }

  /**
   * Handles power operator ^
   */
  private static replacePowers(expr: string): string {
    // Regex for basic power: (a)^b or a^b
    const powerRegex = /([0-9.]+|\([^()]+\))\s*\^\s*([0-9.]+|\([^()]+\))/;
    while (powerRegex.test(expr)) {
      expr = expr.replace(powerRegex, 'Math.pow($1, $2)');
    }
    return expr;
  }

  /**
   * Handles trig functions converting degrees to radians if needed
   */
  private static replaceTrig(expr: string, angleMode: AngleMode): string {
    const funcs = ['sin', 'cos', 'tan'];
    funcs.forEach((fn) => {
      const regex = new RegExp(`${fn}\\(([^)]+)\\)`, 'g');
      expr = expr.replace(regex, (_, arg) => {
        if (angleMode === 'DEG') {
          return `Math.${fn}((${arg}) * Math.PI / 180)`;
        }
        return `Math.${fn}(${arg})`;
      });
    });
    return expr;
  }

  /**
   * Formats a raw number or string with standard visual thousand separators
   * e.g. "1234567.89" -> "1 234 567.89" or localized formatting
   */
  public static formatDisplayValue(val: string): string {
    if (!val) return '0';
    if (val === 'Erro' || val === 'Infinito' || val.includes('dividir')) return val;

    // Check if ends with decimal point
    const hasTrailingDot = val.endsWith('.');

    // Split sign and number
    const isNegative = val.startsWith('-');
    const cleanVal = isNegative ? val.substring(1) : val;

    const parts = cleanVal.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    // Format integer part with thousands space separator for clean dark aesthetic
    const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    let result = (isNegative ? '-' : '') + formattedInt;
    if (decimalPart !== undefined) {
      result += '.' + decimalPart;
    } else if (hasTrailingDot) {
      result += '.';
    }

    return result;
  }
}
