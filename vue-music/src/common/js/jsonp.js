// 由于请求数据时存在跨域的问题，所以这里我们使用jsonp来解决跨域
import originJSONP from 'jsonp'

export default function jsonp (url, data, option) {
  // 一般的url只会有例如： 1：http://www.baudu.com  2: http://www.baidu.com?wd="js"
  url += (url.indexof('?') > -1) ? '&' : '?' + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)     // 这里返回data
      } else {
        reject(err)
      }
    })
  })
}

// 拼接url,因为jsonp插件中传入的url是一个完整的url
function param (data) {
  let url = ''    // 这个url可以理解为params
  for (var k in data) {  // 注意这里默认传入的data之后一层，没有嵌套
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`    // encodeURIComponent转化是为了转化中文
  }

  return url ? url.substring(1) : ''
}
