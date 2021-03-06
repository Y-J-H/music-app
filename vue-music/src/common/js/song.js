// import { getSongVkey } from 'api/singer'
// import { ERR_OK, guid } from 'api/config'

import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
export default class Song {
  constructor ({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric () {     // 在这里添加一个获取歌词的方法
    if (this.lyric) {   // 歌词已经存在的话
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {     // 获取歌词
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

/**
 *  创建一个工厂方法, 这里传入musicData对象直接返回一个Song实例
 * 这样的话后面就只需要传入musicData而不需要分别传入id, mid, name...
 */
export function createSong (musicData) {
  // let url = getUrl(musicData.songmid)
  // console.log(url)
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://isure.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=32`
  })
}

function filterSinger (singer) {
  let ret = []
  if (!singer) {   // 如果没有歌手数据,也就是singer是一个空数组的情况
    return ''
  }
  singer.forEach((item, index) => {
    ret.push(item.name)
  })
  return ret.join('/')
}

// 获取歌曲的vkey, 利用vkey来播放歌曲
// function getUrl (songmid) {
//   getSongVkey(songmid).then((res) => {
//     console.log(res)
//   })
//   return '23333'
// }
