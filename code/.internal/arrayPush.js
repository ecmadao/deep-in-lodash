/**
 * 将 values 中的元素依次放到 array 中，类似数组原生方法里的 push
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  let index = -1;
  const length = values.length;
  const offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

export default arrayPush;
