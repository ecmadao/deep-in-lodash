/**
 * 获取某个 Object 里指定 key 的 value
 * The base implementation of `property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return object => object == null ? undefined : object[key];
}

export default baseProperty;
