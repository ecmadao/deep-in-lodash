/**
 * This base implementation of `zipObject` which assigns values using `assignFunc`.
 *
 * @private
 * @param {Array} props The property identifiers.
 * @param {Array} values The property values.
 * @param {Function} assignFunc The function to assign values.
 * @returns {Object} Returns the new object.
 */
function baseZipObject(props, values, assignFunc) {
  let index = -1;
  const length = props.length;
  const valsLength = values.length;
  const result = {};

  while (++index < length) {
    // 获取 values 里相同 index 的元素，不存在则使用 undefined
    const value = index < valsLength ? values[index] : undefined;
    // 每次遍历时给 result 添加键值对
    assignFunc(result, props[index], value);
  }
  return result;
}

export default baseZipObject;
