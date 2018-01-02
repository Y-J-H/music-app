import jsonp from 'common/js/jsonp'
import { commonParams, options } from 'api/config'
import axios from 'axios'

export function getRecommend () {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  let data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList () {
  const url = '/api/getDiscList'
  let data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  /**
   * 浏览器端无法直接去修改referer,host
   * 报错：Refused to set unsafe header "referer"
   */
  // return axios.get(url, {
  //   headers: {
  //     referer: 'https://y.qq.com',
  //     host: 'c.y.qq.com'
  //   },
  //   params: data
  // }).then((res) => {
  //   console.log(res)
  //   return Promise.resolve(res)
  // })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}
