<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [others](#others)
  - [`compact`](#compact)
    - [Usage](#usage)
    - [Source Code](#source-code)
  - [`concat`](#concat)
    - [Usage](#usage-1)
    - [Source Code](#source-code-1)
  - [`fill`](#fill)
    - [Usage](#usage-2)
    - [Source Code](#source-code-2)
  - [`fromPairs`](#frompairs)
    - [Usage](#usage-3)
    - [Source Code](#source-code-3)
  - [`chunk`](#chunk)
    - [Usage](#usage-4)
    - [Source Code](#source-code-4)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## others

### `compact`

以一个 Array 为参数，筛选出其中合法的值（排除 `false`、`null`、`0`、`""`、`undefined` 以及 `NaN`）

#### Usage

```javascript
_.compact([0, 1, false, 2, '', 3]);
// => [1, 2, 3]
```

#### Source Code

```javascript
function compact(array) {
  let index = -1;
  const length = array == null ? 0 : array.length;
  let resIndex = 0;
  const result = [];

  while (++index < length) {
    const value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}
```

值得一看的基本知识点：[++someVariable Vs. someVariable++ in Javascript](http://stackoverflow.com/questions/3469885/somevariable-vs-somevariable-in-javascript)

### `concat`

将 Array 和之后的任意多个参数合并，返回一个新的 Array

#### Usage

```javascript
var array = [1];
var other = _.concat(array, 2, [3], [[4]]);
 
console.log(other);
// => [1, 2, 3, [4]]
 
// 不会修改原有 Array
console.log(array);
// => [1]
```

####  Source Code

```javascript
import arrayPush from './.internal/arrayPush.js';
import baseFlatten from './.internal/baseFlatten.js';
import copyArray from './.internal/copyArray.js';

function concat(array, ...values) {
  return arrayPush(Array.isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}
```

```javascript
// arrayPush 私有方法
// 两个参数都是 Array；将第二个参数的元素依次 push 到第一个 Array 中
// 即数组原生方法里的 push
function arrayPush(array, values) {
  let index = -1;
  const length = values.length;
  const offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}
```

```javascript
// baseFlatten 私有方法

import arrayPush from './arrayPush.js';
import isFlattenable from './isFlattenable.js';

// 将一个 Array 扁平化
// 如果 Array 有多层的嵌套，比如 [[[1], [2]], [3], 4]，则根据 depth 的值，通过递归进行处理
// 如果 depth 大于等于可递归的层数，则最终返回 [1, 2, 3, 4]
function baseFlatten(array, depth, predicate, isStrict, result) {
  let index = -1;
  const length = array.length;

  // 是否可继续进行递归的判断之一，isFlattenable 用于判断一个值是否是可以被扁平化（Object 或者 Array）
  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    const value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // 进行递归，并将 result 代入，以便所有的值都放入同一个 Array 中
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
```

```javascript
// copyArray 私有方法
// 用于拷贝一个 Array
function copyArray(source, array) {
  let index = -1;
  const length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
```

### `fill`

用 `value` 填充一个数组从 `[start, end)` 里的元素。

#### Usage

```javascript
var array = [1, 2, 3];
 
_.fill(array, 'a');
console.log(array);
// => ['a', 'a', 'a']
 
_.fill(Array(3), 2);
// => [2, 2, 2]
 
_.fill([4, 6, 8, 10], '*', 1, 3);
// => [4, '*', '*', 10]
```

#### Source Code

```javascript
function baseFill(array, value, start, end) {
  const length = array.length;

  start = toInteger(start);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : toInteger(end);
  if (end < 0) {
    end += length;
  }
  end = start > end ? 0 : toLength(end);
  while (start < end) {
    array[start++] = value;
  }
  return array;
}
```

`fill` 的内部其实很简单，就是遍历一个数组，把 `index` 从 `[start, end` 的元素改成 `value`（直接修改原数组）。而且，由例子可知，利用 `fill` 可以创建一个由指定 `value` 填充的新数组：

```javascript
_.fill(Array(3), 2);
// => [2, 2, 2]

//但我们也可以通过 ES6 API 来实现：
new Array(3).fill(0) // => [0, 0, 0]

// 可惜的是 ES6 fill 兼容性还不是很高，在安卓微信内就会报错。因此，还有一种完全兼容的写法：
Array.from(new Array(3), (item, index) => 0); // => [0, 0, 0]
```

### `fromPairs`

将 Array 转为 key/value 形式的对象

#### Usage

```javascript
_.fromPairs([['a', 1], ['b', 2]]);
// => { 'a': 1, 'b': 2 }
```

题外话，在 Python 中可实现类似功能：

```python
example = [['a', 1], ['b', 2]]
print(dict(example))
# {'a': 1, 'b': 2}
```

#### Source Code

```javascript
function fromPairs(pairs) {
  let index = -1;
  const length = pairs == null ? 0 : pairs.length;
  const result = {};

  while (++index < length) {
    const pair = pairs[index];
    result[pair[0]] = pair[1];
  }
  return result;
}
```

### `chunk`

将一个 Array 按照 `size` 参数进行分段，形成由多个 Array 组成的 Array

#### Usage

```javascript
// API
_.chunk(array, [size=1])

// example
_.chunk(['a', 'b', 'c', 'd'], 2);
// => [['a', 'b'], ['c', 'd']]
 
_.chunk(['a', 'b', 'c', 'd'], 3);
// => [['a', 'b', 'c'], ['d']]
```

#### Source Code

```javascript
function chunk(array, size, guard) {
  // 如果是递归的调用，或者没有定义 size，则默认 size 为 1
  if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }
  const length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  // 定义返回结果的 array 长度为 length / size 向上取整的值
  const result = Array(nativeCeil(length / size));

  // 遍历 length % index 次
  // 每次从 array 中切割从 index 到 index + size 的元素并组成新的 Array
  while (index < length) {
    result[resIndex++] = baseSlice(array, index, (index += size));
  }
  return result;
}
```

自己实现 `chunk` 方法：

```javascript
const splitArray = (array, size = 1) => {
  const length = array.length;
  if (length <= size) {
    return [array];
  }
  const loop = Math.floor(length / size) + 1;
  return new Array(loop).fill(0).map((i, index) => {
    return array.slice(index * size, (index + 1) * size)
  });
};
```

