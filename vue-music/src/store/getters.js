export const singer = state => state.singer

export const palying = state => state.palying

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {     // 这里的getters也可以作为一个计算属性
  return state.playlist[state.currentIndex] || {}
}
