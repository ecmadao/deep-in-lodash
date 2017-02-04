<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [zip & unzip](#zip-&-unzip)
  - [`zip`](#zip)
    - [Usage](#usage)
    - [Source Code](#source-code)
  - [`unzip`](#unzip)
    - [Usage](#usage-1)
    - [Source Code](#source-code-1)
  - [`zipWith`](#zipwith)
    - [Usage](#usage-2)
    - [Source Code](#source-code-2)
  - [`unzipWith`](#unzipwith)
    - [Usage](#usage-3)
    - [Source Code](#source-code-3)
  - [`zipObject`](#zipobject)
    - [Usage](#usage-4)
    - [Source Code](#source-code-4)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## zip & unzip

> 压缩与解压缩，可以理解为将多个 Array 打包及拆分的过程

### `zip`

分别取各个 Array 中的元素，重组为新的 Array

#### Usage

```javascript
_.zip(['a', 'b'], [1, 2], [true, false]);
// => [['a', 1, true], ['b', 2, false]]
```

#### Source Code

很有意思的是，我们可以看见在 `zip` 中，实际上调用的是 `unzip` API：

```javascript
import unzip from './unzip.js';

/**
 * example
 * zip(['a', 'b'], [1, 2], [true, false]);
 * ===> arrays = [['a', 'b'], [1, 2], [true, false]]
 * ===> unzip(arrays);
 * ===> [['a', 1, true], ['b', 2, false]]
 */
function zip(...arrays) {
  return unzip(arrays);
}
```

### `unzip`

针对于 zip，是一个解压的过程

#### Usage

```javascript
var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
// => [['a', 1, true], ['b', 2, false]]
 
_.unzip(zipped);
// => [['a', 'b'], [1, 2], [true, false]]
```

#### Source Code

```javascript
// arrayFilter(array, predicate) 根据 predicate 方法对 array 中的每个元素进行筛选
import arrayFilter from './.internal/arrayFilter.js';
// arrayMap(array, iteratee) 通过 iteratee 方法对 array 进行遍历
import arrayMap from './.internal/arrayMap.js';
// 获取某个 Object 里指定 key 的 value
import baseProperty from './.internal/baseProperty.js';
// baseTimes(n, iteratee) 重复调用 n 次 iteratee 方法，并返回由 iteratee 调用结果组成的 Array
import baseTimes from './.internal/baseTimes.js';

const nativeMax = Math.max;

// 举个栗子，unzip([['a', 'b'], [1, 2], 3, [true]])
function unzip(array) {
  // array = [['a', 'b'], [1, 2], 3, [true]]
  if (!(array && array.length)) {
    return [];
  }
  let length = 0;
  // 筛选出 array 中仍是 Array 类型的元素，并获取 length 的最大值
  // array = [['a', 'b'], [1, 2], [true]]
  // length = 2
  array = arrayFilter(array, group => {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  // 重复 length 次，返回一个 Array。该 Array 中的每个元素都是 baseTimes 第二个参数调用之后返回的结果。
  // 例如，第一次调用时，index = 0，则针对 array 进行遍历时，其中的每个元素都会调用 baseProperty(0) 方法，本质上是获取每个元素的 index 位于 0 的元素，返回一个 Array，遍历完成之后返回 ['a', 1, true]
  // 最终 return [['a', 1, true], ['b', 2, undefined]]
  return baseTimes(length, index => arrayMap(array, baseProperty(index)));
}
```

### `zipWith`

在 `zip` 以后，将返回的结果代入到附加的函数中，返回最终的结果

#### Usage

```javascript
_.zipWith([1, 2], [10, 20], [100, 200], function(a, b, c) {
  return a + b + c;
});
// => [111, 222]
```

#### Source Code

```javascript
function zipWith(...arrays) {
  const length = arrays.length;
  let iteratee = length > 1 ? arrays[length - 1] : undefined;
  iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
  return unzipWith(arrays, iteratee);
}
```

### `unzipWith`

在 `unzip` 以后，将返回的结果代入到附加的函数中，返回最终的结果

#### Usage

```javascript
var zipped = _.zip([1, 2], [10, 20], [100, 200]);
// => [[1, 10, 100], [2, 20, 200]]
 
// 在 unzip 之后调用 _.add 方法
_.unzipWith(zipped, _.add);
// => [3, 30, 300]
```

#### Source Code

```javascript
import apply from './.internal/apply.js';
import arrayMap from './.internal/arrayMap.js';
import unzip from './unzip.js';

// unzipWith([[1, 10, 100], [2, 20, 200]], _.add)
function unzipWith(array, iteratee) {
  if (!(array && array.length)) {
    return [];
  }
  // 先获取 unzip 的结果
  // result = [[1, 2], [10, 20], [100, 200]]
  const result = unzip(array);
  // 然后进行遍历
  // iteratee = _.add
  // 三次 apply(iteratee, undefined, group) 分别返回 3, 30, 300
  // 最终 return [3, 30, 300]
  return arrayMap(result, group => apply(iteratee, undefined, group));
}
```

### `zipObject`

将多个 Array zip 成一个对象

#### Usage

```javascript
_.zipObject(['a', 'b'], [1, 2]);
// => { 'a': 1, 'b': 2 }
```

#### Source Code

```javascript
// 给对象添加一个键值对
import assignValue from './.internal/assignValue.js';
import baseZipObject from './.internal/baseZipObject.js';

// zipObject(['a', 'b'], [1, 2])
function zipObject(props, values) {
  // baseZipObject(['a', 'b'], [1, 2], assignValue)
  return baseZipObject(props || [], values || [], assignValue);
}
```

```javascript
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
```

```javascript
import baseAssignValue from './baseAssignValue.js';
import eq from '../eq.js';

/** 检查对象是否已有目标 key */
const hasOwnProperty = Object.prototype.hasOwnProperty;

function assignValue(object, key, value) {
  const objValue = object[key];
  // 如果对象中没有目标 key
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

function baseAssignValue(object, key, value) {
  if (key == '__proto__') {
    Object.defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}
```

- [defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [Object.prototype.__proto__](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)