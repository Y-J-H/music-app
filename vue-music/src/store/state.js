import {playMode} from 'common/js/config'

const state = {
  singer: {},
  play: false,
  fullScreen: false,     // 是否全屏播放
  playlist: [],          // 歌曲播放顺序
  sequenceList: [],      // 歌曲顺序
  mode: playMode.sequence,        // 歌曲播放模式
  currentIndex: -1       // 当前播放的歌曲索引
}

export default state
