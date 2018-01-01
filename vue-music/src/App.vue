<template>
  <div id="app">
    <m-header></m-header>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header'
export default {
  name: 'app',
  components: {
    MHeader
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "~common/stylus/variable"   // ~common表示一个相对于common的路径

  #app 
    color: $color-theme
</style>
