<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>       <!--在播放器的任何路由页面都有可能有歌曲在播放, 所以播放器组件写在APP.vue中-->
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header'
import Tab from './components/tab/tab'
import player from 'components/player/player'
export default {
  name: 'app',
  components: {
    MHeader,
    Tab,
    player
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "~common/stylus/variable"   // ~common表示一个相对于common的路径

  #app 
    color: $color-theme
</style>
