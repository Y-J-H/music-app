<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
                v-bind:css="false">   
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image"/>
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart="middleTouchStart"
             @touchmove="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">    <!-- 显示唱片的区域 -->
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img :src="currentSong.image" alt="" class="image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{ playingLyric }}
              </div>
            </div>
          </div>
          <Scroll class="middle-r" 
                  ref="lyricList"
                  :data="currentLyric && currentLyric.lines">     <!-- 显示歌词的区域 -->
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                  class="text"
                  :class="{'current' : currentLineNum === index}"
                  v-for="(line, index) in currentLyric.lines"
                  :key="'lyric' + index">
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formateTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar @touchMoveEnd="touchMoveEnd" :progressWidth="progressWidth" ref="progress"></progress-bar>
            </div>
            <span class="time time-r">{{ formateTime(this.currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="pre"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini"> 
      <div class="mini-player" v-show="!fullScreen" @click="openScreen">
        <div class="icon">
          <img :class="cdCls" :src="currentSong.image" alt="" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :precent="precent">
            <i class="icon-mini" :class="miniIcon" @click.stop="togglePlaying"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!--canplay是audio上的原生事件-->
    <audio :src="currentSong.url" 
            ref="audio" 
            @canplay="ready"
            @error="error"
            @timeupdate="updateTime"
            @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  data () {
    return {
      progressBarWidth: 0,     // 进度条的总宽度
      songReady: false,
      currentTime: 0,          // 当前播放时间
      progressWidth: 0,        // 当前进度条走过的距离
      precent: 0,
      radius: 32,
      currentLyric: null,      // 当前歌曲的歌词
      currentLineNum: 0,       // 当前正在播放的那句的行号
      playingLyric: '',        // 当前正在播放的那句歌词
      currentShow: 'cd'
    }
  },
  computed: {
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  created () {
    /**
     *   在created的时候添加一个touch对象,这个对象仅仅是为了
     * 在下面不同的方法中数据可以获取到,vue页不需要去监听它们,不用
     * 为它们添加get,set方法
     */
    this.touch = {}
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    openScreen () {
      this.setFullScreen(true)
    },
    togglePlaying () {        // 控制音乐播放和暂停的函数
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {       // 当歌曲在播放和暂停之间切换时, 歌词是否滚动页跟着切换
        this.currentLyric.togglePlay()
      }
    },
    ready () {        // 歌曲加载完毕可以播放了
      this.songReady = true
    },
    error () {        // 歌曲加载出错了,可能是因为网络，或者其他任何原因
      this.songReady = true
    },
    next () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {     // 如果只有一首歌，当点下一首时触发
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {       // 当在循环播放状态下,歌曲播放结束, 我们将歌词从头开始显示
          this.currentLyric.seek(0)
        }
      }
      let nextIndex = this.currentIndex + 1
      if (nextIndex >= this.playlist.length) {
        nextIndex = 0
      }
      this.setCurrentIndex(nextIndex)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    pre () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {     // 如果只有一首歌，当点上一首时触发
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {       // 当在循环播放状态下,歌曲播放结束, 我们将歌词从头开始显示
          this.currentLyric.seek(0)
        }
      }
      let preIndex = this.currentIndex - 1
      if (preIndex < 0) {
        preIndex = this.playlist.length - 1
      }
      this.setCurrentIndex(preIndex)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime     // 获取当前播放的时间
      this.getProcessWidth()               // 获取进度条长度
    },
    formateTime (time) {
      let newTime = time | 0
      let minute = parseInt(time / 60)
      let second = this._pad(newTime % 60)
      return `${minute}:${second}`
    },
    _pad (num, n = 2) {           // 补零的方法
      let newNum = num.toString()
      while (newNum.length < n) {
        newNum = '0' + newNum
      }
      return newNum
    },
    changeMode () {             // 改变播放模式的方法
      let mode = (this.mode + 1) % 3          // 加1模3这样的返回的就是0,1,2
      this.setPlayMode(mode)           // 改变mode
      let list = []
      if (mode === playMode.random) {        // 当在随机模式下
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList             // 当在顺序模式下，循环模式下
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 保证我们在点随机播放后当前播放的这一首歌不变
    resetCurrentIndex (list) {       // 通过id去找到当前播放的那首歌，并返回其索引
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getLyric () {
      this.currentSong.getLyric().then((res) => {
        this.currentLyric = new Lyric(res, this.handleLyric)
        if (this.playing) {     // 如果歌曲正在播放, 那么歌词也随之滚动
          this.currentLyric.play()
        }
      }).catch(() => {
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    handleLyric ({lineNum, txt}) {        // 当行上的歌词改变,就会调用这个方法
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart (e) {
      this.touch.initiated = true    // 标识已经初始化
      this.touch.percent = 0
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {   // 当纵向偏移大于横向偏移时,就认为用户在上下滑动,而非左右滑动
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)        // 计算出手滑多少, 占总的百分比
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style['opacity'] = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd (e) {
      this.touch.initiated = false
      let offsetWidth
      let opacity
      console.log(this.touch.percent)
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9 && this.touch.percent !== 0) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style['opacity'] = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
    },
    end () {          // 当当前歌曲播放结束时触发的方法
      if (this.mode !== playMode.loop) {
        this.next()
        return
      }
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {       // 当在循环播放状态下,歌曲播放结束, 我们将歌词从头开始显示
        this.currentLyric.seek(0)
      }
    },
    getProcessWidth () {
      if (this.progressBarWidth === 0) {
        this.progressBarWidth = this.$refs.progress.$el.clientWidth
      }
      this.precent = this.currentTime / this.currentSong.duration
      this.progressWidth = this.progressBarWidth * this.precent | 0
    },
    touchMoveEnd (val) {
      this.precent = val / this.progressBarWidth
      // audio标签的currentTime 属性可以控制播放的进度
      let currTime = this.precent * this.currentSong.duration
      this.$refs.audio.currentTime = currTime
      this.progressWidth = val
      if (this.currentLyric) {       // 由人为拖动引起的进度条的改变此时,歌词也应跟着变化
        this.currentLyric.seek(currTime * 1000)
      }
      this.setPlayingState(true)     // 让拖动结束后歌曲开始播放
    },
    // 下面是vue提供的js动画的钩子函数
    enter (el, done) {
      const { x, y, scale } = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.05)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    _getPosAndScale () {   // 获取初始位置(水平和垂直方向上的偏移量), 缩放尺寸
      const targetWidth = 40            // 小圆的直径
      const paddingLeft = 40            // 小圆圆心距左侧边的距离
      const paddingBottom = 30          // 小圆圆心距右侧边的距离
      const paddingTop = 80             // 大圆剧顶部的距离
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)       // 计算出x轴的偏移量
      const y = (window.innerHeight - paddingTop - width / 2 - paddingBottom)   // 计算出y轴的偏移量
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULLSCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  watch: {
    currentSong (newSong, oldSong) {      // 观察currentSong当currentSong改变就开始播放
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.getLyric()         // 获取新歌曲的歌词
      setTimeout(() => {      // 歌曲改变重新播放
        this.$refs.audio.play()
      }, 1000)
    },
    playing (playingState) {
      let audio = this.$refs.audio
      this.$nextTick(() => {
        playingState ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
