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