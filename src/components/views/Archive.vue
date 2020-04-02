<template>
<!-- 归档 -->
  <div class="archiveRead">
    <panel :title="'归档'">
      <div slot="content" class="content">
        <ul class="others">
          <li v-for="archive in archiveList" :key="archive.time">
            <a @click="selectMenu('/' + archive.userName+'/archive/'+archive.time)">
              <p class="info">
                <span class="time"><a @click="selectMenu('/' + archive.userName+'/archive/'+archive.time)">{{archive.time}}</a></span>
                <span class="time">{{archive.sum}}篇</span>
                <!-- <span class="likes"><a :href="'/' + archive.userName"><iv-icon type="person"></iv-icon> {{archive.userName}} </a></span> -->
              </p>
            </a>
          </li>
        </ul>
      </div>
    </panel>
  </div>
</template>

<script type="text/ecmascript-6">
import {mixin} from '@/utils/index'
import Panel from '@/components/utils/Panel'

export default {
  data () {
    return {
      archiveList: []
    }
  },
  mixins: [mixin],
  created () {
    this.listArchive(this.$route.params.userName)
  },
  methods: {
    listArchive (userName) {
      // 归档
      this.$axios.get('/view/article/archive/' + userName, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.archiveList = data.data
        }
      })
    },
    selectMenu (url) {
      this.$router.push(url)
      // .catch(data => {})
    }
  },
  components: {
    'panel': Panel
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index.styl";

  .archiveRead
    border 1px solid $color-border
    .content
      padding 5px 20px
    .top, .others
      a
        display block
        overflow hidden
        .tags
          margin-bottom 10px
        .title
          text-align justify
          color $color-gradually-gray-41
          font-size 16px
          line-height 23px
          margin-bottom 5px
        .info
          margin 5px 0 0px
          span
            font-size 13px
            line-height 18px
            font-weight 100
            color $color-secondary-info
            + span
              float right
              margin-left 10px
          a
            display inline-block
            color: #777
            cursor pointer
            &:hover
              color $color-main-primary
              text-decoration underline
        .img
          padding-bottom: 40%
          width: 100%
          height: 0
          margin 5px 0
          overflow hidden
          img
            width 100%
            transition: All 0.4s ease-in-out
            transform: scale(1.0)
            zoom: 1.0
        .desc
          text-align justify
          color $color-secondary-info
          font-size 13px
          line-height 20px
          margin 5px 0 0
        &:hover
          .title
            color $color-main-primary
          img
            transition: All 0.4s ease-in-out
            transform: scale(1.05)
            zoom: 1.05
    .others
      li
        list-style-type none
        margin-top 10px
        padding-top 10px
        border-top 1px solid $color-border

</style>
