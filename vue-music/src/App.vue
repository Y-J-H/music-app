<template>
  <div id="app">
    hello world
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
   @import "~common/stylus/variable"   // ~common表示一个相对于common的路径

  #app 
    color: $color-theme
</style>
