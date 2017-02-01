## Array Funcs

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

