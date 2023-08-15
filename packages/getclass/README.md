<a name="getClass"></a>

## getClass ⇒ <code>String</code>
获取传入值的类型

**Kind**: global constant
**Returns**: <code>String</code> - 返回传入值类型
**Access**: public
**Description:**: 传入任意值，返回当前值的类型（默认首字母大写）<npm i -g jsdoc-to-markdown && jsdoc2md index.js>
**Version**: 0.0.4
**Author**: daoxin <liuhangbiaoo@gmail.com>

| Param | Type | Description |
| --- | --- | --- |
| val | <code>\*</code> | 传入值 |
| lowerCase | <code>Boolean</code> | 是否返回传入值为小写 |

**Example**
```js
getClass(/foo/); // => "RegExp"
```