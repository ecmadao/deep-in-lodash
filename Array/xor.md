<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [xor](#xor)
  - [`xor`](#xor)
    - [Usage](#usage)
    - [Source Code](#source-code)
  - [`xorBy` & `xorWith`](#xorby-&-xorwith)
    - [Usage](#usage-1)
    - [Source Code](#source-code-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## xor

### `xor`

以多个数组作为参数，返回其（合集 - 并集）的结果

#### Usage

```javascript
_.xor([2, 1], [2, 3]);
// => [1, 3]
```

#### Source Code

```javascript
import arrayFilter from './.internal/arrayFilter.js';
import baseXor from './.internal/baseXor.js';

// xor([1, 3], null, [1, 2])
function xor(...arrays) {
  // arrays = [[1, 3], null, [1, 2]]
  // arrayFilter(arrays, isArrayLikeObject)
  // ===> [[1, 3], [1, 2]]
  // baseXor([[1, 3], [1, 2]])
  return baseXor(arrayFilter(arrays, isArrayLikeObject));
}
```

- [baseUniq API](./uniq & union.md#uniq)
- [baseFlatten API](./others.md#concat)
- [baseDifference API](./difference & without.md#difference)

```javascript
function baseXor(arrays, iteratee, comparator) {
  const length = arrays.length;
  // 如果实际上在 xor 里只传入了一个数组，则只需要通过 baseUniq 筛选出不重复的元素就行
  if (length < 2) {
    return length ? baseUniq(arrays[0]) : [];
  }
  let index = -1;
  const result = Array(length);

  // 将 arrays 中的每个 array，依次和其他 array 对比，利用 baseDifference API 获取到该 array 相对其他数组独有的元素，然后赋值给 result[index]
  while (++index < length) {
    const array = arrays[index];
    let othIndex = -1;

    while (++othIndex < length) {
      if (othIndex != index) {
        result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
      }
    }
  }
  // 最后将结果扁平化之后去除重复值
  return baseUniq(baseFlatten(result, 1), iteratee, comparator);
}
```

### `xorBy` & `xorWith`

相对于 `xor` ，`xorBy` API 里数组中的每个元素都经过了额外的方法转换；而 `xorWith` API 则自定义了比较的方法。

#### Usage

```javascript
/* ===== xorBy ===== */
_.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor);
// => [1.2, 3.4]

/* ===== xorWith ===== */
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 
_.xorWith(objects, others, _.isEqual);
// => [{ 'x': 2, 'y': 1 }, { 'x': 1, 'y': 1 }]
```

#### Source Code

```javascript
function xorBy(...arrays) {
  let iteratee = last(arrays);
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return baseXor(arrayFilter(arrays, isArrayLikeObject), iteratee);
}

function xorWith(...arrays) {
  let comparator = last(arrays);
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined, comparator);
}
```

