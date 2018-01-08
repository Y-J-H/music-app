<template>
  <div>
    歌手页面
  </div>
</template>

<script>
import { getSinger } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSinger()
  },
  methods: {
    _getSinger () {
      return getSinger().then((res) => {
        console.log(res)
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
          console.log(this.singers)
        }
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 分类热门数据
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_id,
            mid: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 以A,B,C...来分类数据
        if (!map[item['Findex']]) {
          map[item.Findex] = {
            title: item.Findex,
            list: []
          }
        }

        map[item.Findex].list.push(new Singer({
          id: item.Fsinger_id,
          mid: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })

        // 将map中的数据序列化
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        console.log(arguments)
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
