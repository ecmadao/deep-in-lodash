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