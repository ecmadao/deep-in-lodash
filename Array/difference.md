## difference

### `difference`

筛选出第一个 Array 中有，但其他 Array 中都没有的参数，返回值为元素组成的 Array

#### Usage

```javascript
_.difference([2, 1], [2, 3]);
// => [1]

_.difference([2, 1], [2, 3], [1, 4]);
// => []
```

####  Source Code

```javascript
import baseDifference from './.internal/baseDifference.js';
import baseFlatten from './.internal/baseFlatten.js';
import isArrayLikeObject from './isArrayLikeObject.js';

function difference(array, ...values) {
  return isArrayLikeObject(array)
  	// 将除第一个参数之后的参数扁平化为一个数组之后，通过 baseDifference 获取差值
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
}
```

```javascript
// isArrayLikeObject 私有方法
function isArrayLikeObject(value) {
  // 既是一个类 Object 对象也是一个类 Array 对象
  return isObjectLike(value) && isArrayLike(value);
}
// 检查 value 是否是一个类对象类型的数据。它不应该是 null，且类型应该是 object
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}
// 检查一个 value 是否是类数组的数据。它不是 function，且有 value.length 值，并且 value.length >= 0 && value.length <= Number.MAX_SAFE_INTEGER
function isArrayLike(value) {
  // 注：function 有 length 属性，且默认情况下 length 为 0
  return value != null && isLength(value.length) && !isFunction(value);
}
```

`baseDifference` 方法较为复杂一些，但其本质是比较筛选出两个 Array 中的不同元素，返回一个由它们组成的新的 Array。不过在 `baseDifference` 内针对这些比较做了很多处理工作。

```javascript
/**
 * 不支持比较多个 Array 的基本 `difference` 方法
 *
 * @私有方法
 * @param {Array} array —— 要检查的 Array
 * @param {Array} values —— array 中的各元素不能在 values 里
 * @param {Function} [iteratee] 针对两个 Array 中的每个元素进行调用
 * @param {Function} [comparator] 自定义比较的方法
 * @returns {Array} 返回由筛选出的元素组成的新 Array
 */
baseDifference(array, values, iteratee, comparator)
```

如上，`baseDifference` 可以：

- 单纯的比较两个 Array 中的差值
- 在比较时，对每个 Array 中的元素都代入某种方法进行转换（通过代入 `iteratee` 参数）
- 如果 `values` 的长度小于 `LARGE_ARRAY_SIZE` ，即 200，则可以正常比较，即查看 `array` 中的各个元素是否在 `values` 里
  - 在比较时
    - 没有自定义比较方法，则通过内置的 `arrayIncludes(array, value)` 私有方法进行比较，仅查看 `value` 是否在 `array` 中
    - 有自定义比较方法，则通过内置的  `arrayIncludesWith(array, value, comparator)` 私有方法进行比较，依次将 `array` 中的每个值代入 `comparator(value, target value in array)` 中进行比较
- 否则当长度大于 200 时，则通过 `cacheHas` 方法和 `SetCache` 对象进行比较
  - 本质上是将两个 Array 的比较，转换为了查看 `array` 中的各个元素，是否存在一个对象里（作为 `key` 而存在）
  - 首先，通过 `SetCache` 对象，将 `values` 里的每个元素以键值对的形式储存在 `this.__data__` 中。
  - `this.__data__` 实质上是一个 `MapCache` 对象，它把传入的各个元素根据 type 进行分类，然后将各元素和它对应的 value，储存在 `Hash` 对象或者 `ListCache` 对象中。
  - 最终，其本质就是把 `values` 数组转换为了一个 `key/value('__lodash_hash_undefined__')` 组成的键值对对象 

> [`baseDifference` 源码注释解读](./code/.internal/baseDifference.js)

### `differenceBy`

类似于 `difference` ，但指定了比较时一个类似 format 的方法。相当于 `baseDifference` 中声明了 `iteratee` 参数，在比较过程中，会将每个元素代入 `iteratee` 方法中，用返回的结果进行比较。

#### Usage

```javascript
_.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
// => [1.2]
 
// The `_.property` iteratee shorthand.
_.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
// => [{ 'x': 2 }]
```

#### Source Code

```javascript
// last 方法用于获取数组的最后一个元素
import last from './last.js';

function differenceBy(array, ...values) {
  let iteratee = last(values);
  // 如果没有传入比较的方法的话，则 differenceBy 仅作为一个 difference 方法使用
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), iteratee)
    : [];
}
```

### `differenceWith`

类似于 `difference` ，但声明了 `comparator`方法。相当于 `baseDifference` 中代入了 `comparator` 参数，在比较过程中，将按照 `comparator` 方法作为比较的规则。

#### Usage

```javascript
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 
_.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
// => [{ 'x': 2, 'y': 1 }]
```

#### Source Code

```javascript
function differenceWith(array, ...values) {
  let comparator = last(values);
  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
    : [];
}
```