<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="'dots' + index" :class=
      "{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'
export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  mounted () {
    // 初始化better-scroll后无法滚动或，报错主要是因为初始化后
    // 组件未渲染,或者高度计算错误.
    setTimeout(() => {  // 这句话是为了保证dom已经渲染完成
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._paly()
      }
    }, 20)

    // 当视口大小改变时
    window.addEventListener('resize', () => {
      if (!this.slider) {    // 如果slider对象还没有生成的话,那么就无须重新执行了
        return ''
      }
      this._setSliderWidth()
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth () {
      let w = 0
      this.children = this.$refs.sliderGroup.children
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        addClass(this.children[i], 'slider-item')
        this.children[i].style.width = sliderWidth + 'px'
        w += sliderWidth
      }
      // 要实现无缝滚动是要在当前banner的左右再分别克隆第一张图和最后一张图
      if (this.loop) {
        w += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = w + 'px'
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        // snap: true,
        // snapLoop: true,
        // snapThreshold: 0.3,
        // snapSpeed: 400,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        bounce: false
      })

      // 这个scrollEnd是betterScroll在页面滚动结束的时候回提交的一个事件
      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
      // if (this.loop) {    // 如果当前是可以循环的话，pageInde要减一
      //   pageIndex -= 1
      // }
      // 改变currentPageIndex
        this.currentPageIndex = pageIndex
        clearTimeout(this.timer)
        this._paly()
      })
    },
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _paly () {
    /**
     * 这里没有使用setInterval来实现,因为用setInterval的话还要考虑当
     * 用户手指点上去的时候,去清除定时器,当手指移开时开启定时器
     */
      this.timer = setTimeout(() => {
        let pageIndex = this.currentPageIndex + 1
        if (pageIndex >= this.dots.length) {
          pageIndex = 0
        }
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

   .slider
    min-height: 1px
    position relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll

</style>
