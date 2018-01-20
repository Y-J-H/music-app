import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
// 当在一个动作中需要改变多个mutations的时候我们就需要封装一个action
export const selectPlay = function ({commit, state}, {list, index}) { // 点击歌曲开始播放
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {   //  点击随机播放按钮
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_MODE, playMode.random)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
