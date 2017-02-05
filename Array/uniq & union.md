<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [uniq & union](#uniq-&-union)
- [uniq](#uniq)
  - [`uniq`](#uniq)
    - [Usage](#usage)
    - [Source Code](#source-code)
  - [`uniqBy` & `uniqWith`](#uniqby-&-uniqwith)
    - [Usage](#usage-1)
    - [Source Code](#source-code-1)
- [union](#union)
  - [`union`](#union)
    - [Usage](#usage-2)
    - [Source Code](#source-code-2)
  - [`unionBy` & `uniqWith`](#unionby-&-uniqwith)
    - [Usage](#usage-3)
    - [Source Code](#source-code-3)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### uniq & union

### uniq

> 从数组中筛选出不重复的元素

#### `uniq`

##### Usage

```javascript
_.uniq([2, 1, 2]);
// => [2, 1]
```

##### Source Code

```javascript
import baseUniq from './.internal/baseUniq.js';
function uniq(array) {
  return (array && array.length) ? baseUniq(array) : [];
}
```

`baseUniq` 的源码如下，可以发现它的逻辑非常像 [`baseDifference`](./difference.md#difference)

```javascript
// baseUniq.js
import SetCache from './SetCache.js';
// arrayIncludesWith 相当于 arrayIncludes，在比较时通过自定义的方法来比较两个元素是否相等
import arrayIncludes from './arrayIncludes.js';
import arrayIncludesWith from './arrayIncludesWith.js';
import cacheHas from './cacheHas.js';
// 将 Array 转为 Set
// [1, 2, 3, 3] => Set {1, 2, 3}
import createSet from './createSet.js';
// 将 Set 转为 Array
// Set {1, 2, 3} => [1, 2, 3]
import setToArray from './setToArray.js';

/**
 * 从一个给定的 array 中筛选出不重复的元素，不改变原有数组
 *
 * @私有方法
 * @param {Array} array —— 要筛选的 Array
 * @param {Function} [iteratee] 针对两个 Array 中的每个元素进行调用
 * @param {Function} [comparator] 自定义比较的方法
 * @returns {Array} 返回由筛选出的元素组成的新 Array
 */

// array = [1, 1, 2], baseUniq(array)
function baseUniq(array, iteratee, comparator) {
  let index = -1;
  let includes = arrayIncludes;
  let isCommon = true;

  const length = array.length;
  const result = [];
  let seen = result;

  // 如果自定义了比较的方法，则通过 arrayIncludesWith API，在比较时代入自定义的方法
  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  // 当数组长度大于 LARGE_ARRAY_SIZE 时，传统的遍历方法速度不快
  else if (length >= LARGE_ARRAY_SIZE) {
    // 将数组转为 Set 的时候，会自动去除数组中重复的元素。但如果自定义了数组的转换方法，则不能再单纯的使用 Set API
    const set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
	// 则需以数组的各元素作 key，将数组转换为 Object，然后通过查看 key 是否在 Object 中来判断是否重复
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  // length = 3, index = -1, result = [], seen = [] = result
  outer:
  while (++index < length) {
    // value = 1, computed = 1
    // value = 1, computed = 1
    // value = 2, computed = 2
    let value = array[index];
    // computed 为 iteratee 调用过后，实际比较时的元素
    const computed = iteratee ? iteratee(value) : value;
    value = (comparator || value !== 0) ? value : 0;
 
    if (isCommon && computed === computed) {
      // seenIndex = 0, seen = []
      // seenIndex = 1, seen = [1]
      // seenIndex = 1, seen = [1]
      let seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          // result = [1], seen = [1]
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      // result = [1], seen = [1]
      // result = [1, 2], seen = [1, 2]
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}
```

```javascript
const INFINITY = 1 / 0;
// 首先进行了检查，如果没有 Set API，或者 API 不符合预期，则返回一个空函数
// Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY is used to
// check if set is available
const createSet = (Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY)
  ? values => new Set(values)
  : () => {};
```

#### `uniqBy` & `uniqWith`

相对于 `uniq` ，多了一个作用于数组中每个元素上的方法，在比较前会先利用该方法，对每个元素进行转换。而 `uniqWith` API 则相对于 `uniq` ，自定义的各元素比较的方法。

##### Usage

```javascript
/* ===== uniqBy ===== */
_.uniqBy([2.1, 1.2, 2.3], Math.floor);
// => [2.1, 1.2]

/* ===== uniqWith ===== */
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
_.uniqWith(objects, _.isEqual);
// => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
```

##### Source Code

```javascript
function uniqBy(array, iteratee) {
  return (array && array.length) ? baseUniq(array, iteratee) : [];
}

function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
}
```

### union

> 将多个数组进行合并，但在合并时会忽略重复的值。其底层利用的还是 `uniq` API，相当于把所有的参数（多个数组）转换为一个数组之后，调用 `uniq` 相关的方法

#### `union`

合并多个数组（不包括重复值）

##### Usage

```javascript
_.union([2], [1, 2]);
// => [2, 1]
```

##### Source Code

- [baseFlatten API 解析](./others.md#concat)

```javascript
// 利用 baseFlatten API 将传入的多个数组扁平化为一个
// 例如，
// union([1], [1, 2])
function union(...arrays) {
  // arrays = [[1], [1, 2]]
  // baseFlatten(arrays, 1, isArrayLikeObject, true)
  // ===> [1, 1, 2]
  // baseUniq([1, 1, 2])
  // ===> [1, 2]
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
}
```

#### `unionBy` & `uniqWith`

##### Usage

```javascript
/* ===== unionBy ===== */
_.unionBy([2.1], [1.2, 2.3], Math.floor);
// => [2.1, 1.2]

/* ===== uniqWith ===== */
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
_.uniqWith(objects, _.isEqual);
// => [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
```

##### Source Code

```javascript
function unionBy(...arrays) {
  let iteratee = last(arrays);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), iteratee);
}

function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return (array && array.length) ? baseUniq(array, undefined, comparator) : [];
}
```

