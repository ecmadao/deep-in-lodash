<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [pull](#pull)
  - [`pull`](#pull)
    - [Usage](#usage)
    - [Source Code](#source-code)
  - [`pullAll`](#pullall)
    - [Usage](#usage-1)
    - [Source Code](#source-code-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## pull

> pull 系列方法用于从一个 Array 中去除指定的元素，**会修改原有的数组**

### `pull`

接收一个 Array 和多个参数，返回从 Array 中去除那些参数之后的数组

#### Usage

```javascript
var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 
_.pull(array, 'a', 'c');
// => ['b', 'b']
```

#### Source Code

```javascript
// 在内部，将所有参数转为类数组元素之后，调用 pullAll API
function pull(array, ...values) {
  return pullAll(array, values);
}
```

### `pullAll`

类似于 `pull` ，但要去除的元素以一个数组的形式代入

#### Usage

```javascript
var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 
_.pullAll(array, ['a', 'c']);
console.log(array);
// => ['b', 'b']
```

#### Source Code

```javascript
function pullAll(array, values) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values)
    : array;
}
```

- [`baseIndexOf`/`baseIndexOfWith` 私有方法](./find.md#indexOf)

```javascript
const splice = Array.prototype.splice;

function basePullAll(array, values, iteratee, comparator) {
  const indexOf = comparator ? baseIndexOfWith : baseIndexOf;
  const length = values.length;

  let index = -1;
  let seen = array;

  if (array === values) {
    values = copyArray(values);
  }
  // 如果有指定规则，则使用规则进行一遍遍历
  if (iteratee) {
    seen = arrayMap(array, value => iteratee(value));
  }
  // 遍历每个要去除的元素，获取其在 array 中的 index
  // 若不是 -1，则通过原生的 slice 方法去除它
  while (++index < length) {
    let fromIndex = 0;
    const value = values[index];
    const computed = iteratee ? iteratee(value) : value;

    while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
      if (seen !== array) {
        splice.call(seen, fromIndex, 1);
      }
      splice.call(array, fromIndex, 1);
    }
  }
  return array;
}
```
### `pullAllBy`

在 `pullAll` 的时候指定一个规则，该规则在比较参数是否应该被 `pull` 之前，会先作用于 array 上

#### Usage

```javascript
var array = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
 
_.pullAllBy(array, [{ 'x': 1 }, { 'x': 3 }], 'x');
console.log(array);
// => [{ 'x': 2 }]
```

#### Source Code

```javascript
function pullAllBy(array, values, iteratee) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values, iteratee)
    : array;
}
```

### `pullAllWith`

最基本的 `pull` 方法，是通过 `===` 比较目标元素是否在数组中，存在则去除。而 `pullAllWith` 则自定义了比较的方法，在比较时通过自定义方法来决定是否去除该元素。

#### Usage

```javascript
var array = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
 
_.pullAllWith(array, [{ 'x': 3, 'y': 4 }], _.isEqual);
console.log(array);
// => [{ 'x': 1, 'y': 2 }, { 'x': 5, 'y': 6 }]
```

#### Source Code

```javascript
function pullAllWith(array, values, comparator) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values, undefined, comparator)
    : array;
}
```

### `pullAt`

第二个参数为 Array，代表想要 `pull` 的元素的 index；或者连续多个想要 `pull` 的元素的 index

#### Usage

```javascript
var array = ['a', 'b', 'c', 'd'];
var pulled = _.pullAt(array, [1, 3]);
 
console.log(array);
// => ['a', 'c']
 
console.log(pulled);
// => ['b', 'd']
```

#### Source Code

```javascript
import baseAt from './.internal/baseAt.js';
import basePullAt from './.internal/basePullAt.js';
import compareAscending from './.internal/compareAscending.js';
import isIndex from './.internal/isIndex.js';

function pullAt(array, ...indexes) {
  const length = array == null ? 0 : array.length;
  const result = baseAt(array, indexes);

  basePullAt(array, arrayMap(indexes, index => isIndex(index, length) ? +index : index).sort(compareAscending));
  return result;
}
```

