<template>
  <transition name="slide">
    <music-list></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
export default {
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transform: all 0.3s
  .slider-enter, .slider-leave-to
    transform: translate3d(100%, 0, 0)
</style>
