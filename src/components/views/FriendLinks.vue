<template>
  <div class="friend-links">
    <panel :title="'博主排行'">
      <ul class="link-list" slot="content">
        <li v-for="link in linkList" :key="link.userName">
          <a  @click="selectMenu('/' + link.userName)" target="_blank">
            <img :src="link.photo" alt="">
            <div class="right">
              <p class="title">{{link.nickName}}</p>
              <p class="link">简介:{{link.userSummary}}</p>
            </div>
          </a>
        </li>
      </ul>
    </panel>
  </div>
</template>

<script type="text/ecmascript-6">
import Panel from '@/components/utils/Panel'

export default {
  data () {
    return {
      linkList: []
    }
  },
  created () {
    this.listLink()
  },
  components: {
    'panel': Panel
  },
  methods: {
    listLink () {
      // 博主排行
      this.$axios.get('/view/bloguser', {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.linkList = data.data
        }
      })
    },
    selectMenu (url) {
      this.$router.push(url)
      // .catch(data => {})
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/theme.styl";

  .friend-links
    position relative
    ul.link-list
      padding 15px 0
      li
        padding 2px 25px
        a
          display flex
          transform: translate(0, 0)
          transition: all 0.2s ease-in
          &:hover
            transform: translate(30px, 0)
            transition: all 0.2s ease-in-out
            .link
              color $dark
          img
            flex 0 0 50px
            width 50px
            height 50px
            margin 5px 0
            border-radius 15%
          .right
            display flex
            flex-direction column
            padding-left 12px
            height 60px
            line-height 60px
            p
              flex 1
              text-align left
              &.title
                height 35px
                line-height 45px
                font-size 17px
                color $color-main-primary
              &.link
                height 15px
                line-height 15px
                font-weight 100
                font-size 10px
                margin-top 5px
                font-family Arial
</style>
