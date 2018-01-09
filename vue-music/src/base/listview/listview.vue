<template>
  <scroll class="listview" 
    :data="data" 
    :listenScroll="listenScroll"
    :probeType="probeType"
    ref="listview"
    @scroll="scroll">
    <ul>
      <li v-for="(group, index) in data" class="list-group" :key="'list-group'
      +index" ref="listgroup">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li v-for="(item, index) in group.items" class="list-group-item" :key="'list-group-item'+index">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" 
    @touchstart="onShortcutTouchStart"
    @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" 
        class="item" 
        :class="{'current': currentIndex === index}"
        :data-index="index" 
        :key="'shortcutList' + index">
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18
export default {
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      listHeight: [],   // 存储各个listgroup的最大值
      listenScroll: true,
      probeType: 3   // batter-scroll中的 probeType只有设置为3才能在滚动时实时获取
    }
  },
  created () {
    this.touch = {}
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    shortcutList () {    // 将data 中的title进行排序：热 A-Z...
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    }
  },
  methods: {
    onShortcutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')     // 获取左边被点击的字母的索引
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY     // 存储初始点击的位置
      this.touch.anchorIndex = anchorIndex  // 存储初始点击的索引
      //  通过左侧索引获取到右侧对应的那个标签
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]     // 存储滑动后的位置
      this.touch.y2 = firstTouch.pageY
      let deleta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0   // 计算出滑动经过了多少个字母
      let anchorIndex = parseInt(this.touch.anchorIndex) + deleta      // 初始位置加上deleta获得最终位置(字母)
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      if (index === null) {    // 当点击最两端的黑色区块时, 不做任何处理直接返回
        return ''
      }
      if (index < 0) {      // 当拖动时拖到右侧最顶端还要上面的时候, 也就是控制index最小为0
        index = 0
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)  // 第二个参数0,表示动画缓动时间
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listgroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {     // 把每个listgroup底部距离顶端的高度计算出来并存储
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      let listHeight = this.listHeight
      // 当滚动到顶部, newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return ''
      }
      // 当滚动到中间部分
      for (let i = 0; i < listHeight.length - 1; i++) {
        let heightStart = listHeight[i]
        let heightEnd = listHeight[i + 1]
        if ((!heightEnd || (-newY)) >= heightStart && -newY < heightEnd) { // 向上滚是负值
          this.currentIndex = i
          return ''
        }
      }
      // 当滚动到底部,且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2   // ???
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
