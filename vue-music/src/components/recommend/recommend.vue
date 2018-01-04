<template>
  <div class="recommend">
    <!--
      这里通过data绑定数据,原理是当data绑定的 discList改变了,那么在scroll组件中的watch就会监听到
      然后就会调用this.refresh()方法
    -->
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <!--注意外层的这个div必须要有-->
      <div>    
        <div v-if="recommend.length > 0" class="slider-wrapper">
          <slider>
            <div v-for="(item, index) in recommend" :key="'slider'+index">
              <a :href="item.linkUrl">
                <img @load="loadedImg" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item, index) in discList" :key="'item' + index">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-text="item.creator.name"></h2>
                <p class="desc" v-text="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 这里也就是当discList中没有数据的时候,先显示正在加载的动图 -->
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'

export default {
  data () {
    return {
      recommend: [],
      discList: []
    }
  },
  created () {
    // setTimeout(() => {
    this._getRecommend()
    // }, 6000)
    this._getDiscList()
  },
  methods: {
    // 获取banner图数据
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommend = res.data.slider
        }
      })
    },
    // 获取歌单数据
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.data.code === ERR_OK) {
          this.discList = res.data.data.list
        }
      })
    },
    // 确保banner图片已经有一张加载了
    loadedImg () {
      // if (this.ImageLoaded) {        // 用 if 判断让该方法只执行一次
      //   this.$refs.scroll.refresh()
      //   this.ImageLoaded = true
      // }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
 @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center       // 水平方向上保持居中
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center   // 垂直方向上保持居中
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
