<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [find](#find)
  - [`findIndex`](#findindex)
    - [Usage](#usage)
    - [Source Code](#source-code)
  - [`findLastIndex`](#findlastindex)
    - [Usage](#usage-1)
    - [Source Code](#source-code-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## find

### `findIndex`

由传入的判断方法，寻找符合该方法的第一个元素的 `index` 。当没有符合条件的元素时，返回 `-1`

#### Usage

```javascript
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
_.findIndex(users, function(o) { return o.user == 'barney'; });
// => 0

// 相对于 findIndex，原生的 indexOf 只能简单的判断两个元素是否完全相等
```

#### Source Code

```javascript
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  const length = array.length;
  // 可以通过 fromIndex 参数来指定从哪个 index 开始
  // fromRight 则指定查找的方向
  let index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
```

### `findLastIndex`

该方法类似于 `findIndex` ，但是是从右往左开始判断。

#### Usage

```javascript
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
_.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
// => 2
```

#### Source Code

```javascript
const nativeMax = Math.max;
const nativeMin = Math.min;

function findLastIndex(array, predicate, fromIndex) {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  let index = length - 1;
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = fromIndex < 0
      ? nativeMax(length + index, 0)
      : nativeMin(index, length - 1);
  }
  return baseFindIndex(array, predicate, index, true);
}
```
### `indexOf`

获取目标元素在一个数组中的 index

#### Usage

```javascript
_.indexOf([1, 2, 1, 2], 2);
// => 1
 
// Search from the `fromIndex`.
_.indexOf([1, 2, 1, 2], 2, 2);
// => 3
```

#### Source Code

```javascript
// fromIndex 代表比较的起始 index，即从 fromIndex 之后开始寻找 target index
function indexOf(array, value, fromIndex) {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  // fromIndex 可以小于 0，小于 0 则代表从数组尾部开始，因此实际的 fromIndex 为 length + index
  let index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseIndexOf(array, value, index);
}
```

```javascript
function baseIndexOf(array, value, fromIndex) {
  // 如果 value 不是 NaN，则通过 strictIndexOf 获取 index
  // 否则使用 baseFindIndex 方法，同时把 baseIsNaN 代入，以判断数组中的元素是否是 NaN
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

function strictIndexOf(array, value, fromIndex) {
  let index = fromIndex - 1;
  const length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
```

除了 `baseIndexOf` 方法以外，还有一个 `baseIndexOfWith`私有 API，即在比较时通过自定义的方法来判断目标值和数组中的值是否相等：

```javascript
function baseIndexOfWith(array, value, fromIndex, comparator) {
  let index = fromIndex - 1;
  const length = array.length;

  while (++index < length) {
    if (comparator(array[index], value)) {
      return index;
    }
  }
  return -1;
}
```

