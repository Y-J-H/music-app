import { commonParams, options } from 'api/config'
// import axios from 'axios'
import jsonp from 'common/js/jsonp'

export function getLyric (songmid) {
  let url = 'api/getLyric'
  let data = Object.assign({}, commonParams, {
    songmid,
    loginUin: 0,
    hostUin: 0,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0
  })

  // return axios.get(url, {
  //   params: data
  // }).then((res) => {
  //   return Promise.resolve(res.data)
  // })

  /**
   * 因为返回的数据是jsonp格式的所以这里我们使用jsonp去请求
   */
  return jsonp(url, data, options)
}
