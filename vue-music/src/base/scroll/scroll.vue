<template>
  <!-- 滚动组件 -->
  <div class="wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {    // 滚动时是否要派发点击事件
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {    // 在betterScroll中用于标识是否要去监听滚动事件
      type: Boolean,
      default: false
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {   // 当外层wrapper不存在时直接返回
        return ''
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })

      if (this.listenScroll) {   // 如果要监听scroll滚动事件,那么此时派发一个事件
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }
    },
    enable () {
      // 如果scroll存在那么让其可以滚动
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {    // 滚动到相应位置,this.scrllTo是在betterScroll中已经封装好的的scrollTo方法
      this.scrollTo && this.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {  // 滚动到某个标签的位置
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    // 监听data数据变化,因为我们可能存在下拉继续加载，这样的话data数据是会发生变化的
    data () {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
