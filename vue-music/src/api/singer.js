import jsonp from 'common/js/jsonp'
import { commonParams, options, guid } from 'api/config'
import axios from 'axios'

export function getSinger () {
  let url = 'https://szc.y.qq.com/v8/fcg-bin/v8.fcg'
  let data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    notic: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}

export function getSingerDetail (singermid) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  let data = Object.assign({}, commonParams, {
    loginUIn: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid
  })

  return jsonp(url, data, options)
}

export function getSongVkey (songmid) {
  let url = `api/singer/${songmid}`
  let data = Object.assign({}, commonParams, guid, {
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid,
    filename: `C400${songmid}.m4a`,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res)
  })
}
