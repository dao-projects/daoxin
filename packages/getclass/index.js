/**
 * 获取传入值的类型
 * @public
 * @version 0.0.4
 * @author daoxin <liuhangbiaoo@gmail.com>
 * @description: 传入任意值，返回当前值的类型（默认首字母大写）<npm i -g jsdoc-to-markdown && jsdoc2md index.js>
 * @param { * } val 传入值
 * @param { Boolean } lowerCase 是否返回传入值为小写
 * @returns { String } 返回传入值类型
 * @example
 *   getClass(/foo/); // => "RegExp"    
 */
export const getClass = function (val, lowerCase = false) {
  const valTemp = Object.prototype.toString.call(val).match(/^\[object\s(.*)\]$/)[1];
  // 转换成小写
  if (lowerCase) valTemp = valTemp?.toLowerCase();
  return valTemp;
};
