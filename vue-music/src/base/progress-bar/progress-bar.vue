<template>
  <div class="progress-bar" @click="progressClick">
    <div class="bar-inner" ref="bar">           <!--整个进度条-->
      <div class="progress" :style="{width: progressWidthData + 'px'}"></div>     <!--进度条走过的距离-->
      <div class="progress-btn-wrapper">   <!--可拖拽的小圆点按钮-->
        <div class="progress-btn"
             :style="{left: btnLeft + 'px'}"
             @touchstart.prevent="progressTouchStart"
             @touchmove.prevent="progressTouchMove"
             @touchend.prevent="progressTouchEnd"></div>
      </div>
    </div>
  </div>
</template>

<script>
// const btnWidth = 16
export default {
  data () {
    return {
      touchStartX: 0,
      deltaX: 0,
      progressWidthData: this.progressWidth
    }
  },

  props: {
    // 因为这里传过来的是Number类型,是基本数据类型所以在我们改变progressWidthData
    // progressWidth是不会跟着发生变化的,但是如果传过来的是数组,对象之类的就不同了,
    // 如果传过来的是数组或对象,那么就应该使用computed计算属性
    progressWidth: {
      type: Number,
      default: 0
    }
  },
  computed: {
    btnLeft () {
      return this.progressWidthData
    }
  },
  methods: {
    progressTouchStart (e) {
      this.initiated = true      // 标识已经初始化了,可以开始拖动
      this.touchStartX = e.touches[0].pageX
    },
    progressTouchMove (e) {
      let moveX = e.touches[0].pageX
      this.deltaX = moveX - this.touchStartX
      let finallX = this.progressWidth + this.deltaX
      if (finallX < 0) {
        finallX = 0
      } else if (finallX > this.$refs.bar.clientWidth) {
        finallX = this.$refs.bar.clientWidth
      }
      this.progressWidthData = finallX
    },
    progressTouchEnd (e) {
      this.initiated = false      // 拖动结束
      this.$emit('touchMoveEnd', this.progressWidthData)
    },
    progressClick (e) {
      this.progressWidthData = e.offsetX
      this.$emit('touchMoveEnd', this.progressWidthData)
    }
  },
  watch: {
    progressWidth () {
      if (this.initiated) {
        return
      }
      this.progressWidthData = this.progressWidth
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
