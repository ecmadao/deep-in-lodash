## flatten

### `flatten`

将一个数组扁平化，即如果它是多层 Array 结构，则把各个元素抽出来，组成一个单层的数组。但要注意的是，`flatten` 方法只进行单层的递归

#### Usage

```javascript
// 因为只进行单层的递归，所以 [2, [3, [4]]] 中的 [3, [4]] 不会再被拆出
_.flatten([1, [2, [3, [4]], 5]]);
// => [1, 2, [3, [4]], 5]
```

#### Source Code

> [baseFlatten 源码解析](./others.md)

```javascript
function flatten(array) {
  const length = array == null ? 0 : array.length;
  // 递归深度为 1
  return length ? baseFlatten(array, 1) : [];
}
```

### `flattenDeep`

作用与 `flatten` 相同，但递归深度指定无穷次，因此可以将所有层级的数组拆分

#### Usage

```javascript
_.flattenDeep([1, [2, [3, [4]], 5]]);
// => [1, 2, 3, 4, 5]
```

#### Source Code

```javascript
// 指定递归深度为无穷次
const INFINITY = 1 / 0;

function flattenDeep(array) {
  const length = array == null ? 0 : array.length;
  // 会持续进行递归，直至检查到元素不可被 flatten
  return length ? baseFlatten(array, INFINITY) : [];
}
```

### `flattenDepth`

作用与 `flatten` 相同，但自己指定递归深度。深度默认为 1

#### Usage

```javascript
var array = [1, [2, [3, [4]], 5]];
 
_.flattenDepth(array, 1);
// => [1, 2, [3, [4]], 5]
 
_.flattenDepth(array, 2);
// => [1, 2, 3, [4], 5]
```

#### Source Code

```javascript
function flattenDepth(array, depth) {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  depth = depth === undefined ? 1 : toInteger(depth);
  return baseFlatten(array, depth);
}
```