<template>
<transition name="slide">
  <div class="singer-detail">
    歌手详情页
  </div>
</transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'

export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getSingerDetail()
  },
  methods: {
    _getSingerDetail () {
      // this.singermid = this.singer.mid    这里使用了currentRoute来直接获取id
      getSingerDetail(this.$router.currentRoute.params.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normailzeSongs(res.data.list)
          console.log(this.songs)
        }
      })
    },
    _normailzeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>