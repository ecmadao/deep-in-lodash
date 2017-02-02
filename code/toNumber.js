import isObject from './isObject.js';
import isSymbol from './isSymbol.js';

/** Used as references for various `Number` constants. */
const NAN = 0 / 0;

/** 用于匹配头部和尾部的空白 */
const reTrim = /^\s+|\s+$/g;

/** 检测十六进制 */
const reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** 检测二进制 */
const reIsBinary = /^0b[01]+$/i;

/** 检测八进制 */
const reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
const freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @see isInteger, toInteger, isNumber
 * @example
 *
 * toNumber(3.2);
 * // => 3.2
 *
 * toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * toNumber(Infinity);
 * // => Infinity
 *
 * toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    const other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? `${ other }` : other;
  }
  if (typeof value != 'string') {
    // +value 将转换为 int
    // var a = '1'
    // +a => 1
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  const isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

export default toNumber;
