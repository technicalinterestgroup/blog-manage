<template>
  <div class="hotRead">
    <panel :title="'最热阅读'">
      <div slot="content" class="content">
        <!-- <div class="top">
          <a :href="'/' + topHotRead.urlType + '/' + topHotRead.linkId">
            <p class="title">{{topHotRead.title}}</p>
            <div class="tags">
              <iv-tag  :color="tag.id | mapTagColor" v-for="(tag)  in topHotRead.tagList" :key="tag.id">{{tag.name}}</iv-tag>
            </div>
            <p class="info">
              <span class="time">{{topHotRead.createTime | socialDate }}</span>
              <span class="likes"><a ><iv-icon type="heart"></iv-icon> {{topHotRead.likeNum}} </a></span>
              <span class="comments"><a><iv-icon type="compose"></iv-icon> {{topHotRead.commentNum}} </a></span>
              <span class="readings"><a><iv-icon type="eye"></iv-icon> {{topHotRead.readNum}} </a></span>
            </p>-->
            <!--<div class="img">-->
              <!--<img :src="topHotRead.cover" alt="">-->
            <!--</div>-->
           <!-- <p class="desc">{{topHotRead.description | textLineBreak(60)}}</p>
          </a>
        </div> -->
        <ul class="others">
          <li v-for="hotRead in hotReadList" :key="hotRead.id">
              <p class="title"> <a @click="selectMenu('/'+hotRead.userName +'/article/'+hotRead.id)">{{hotRead.title}} </a></p>
              <p class="info">
                <span class="time">{{hotRead.createTime }}</span>
                <span class="user" v-if=!isUserHomeFlag><a @click="selectMenu(hotRead.userName)"><iv-icon type="person"></iv-icon> {{hotRead.userName}} </a></span>
                <span class="readings" v-if=isUserHomeFlag><a ><iv-icon type="eye"></iv-icon> {{hotRead.readCount}} </a></span>
              </p>
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
      hotReadList: [],
      topHotRead: {},
      userName: this.$route.params.userName,
      isUserHomeFlag: false
    }
  },
  mixins: [mixin],
  created () {
    this.listHotRead(this.$route.params.userName)
    this.isUserHome()
  },
  methods: {
    listHotRead (userName) {
      var url = '/view/article/hot'
      if (userName) {
        url = url + '/' + userName
      }
      // 热门阅读
      this.$axios.get(url, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.hotReadList = data.data
          // this.topHotRead = this.hotReadList.shift()
        }
      })
    },
    isUserHome () {
      if (this.userName !== null && this.userName !== undefined && this.userName !== '') {
        this.isUserHomeFlag = true
      }
    },
    selectMenu (url) {
      console.log('selectMenu  ' + url)
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

  .hotRead
    border 1px solid $color-border
    .content
      padding 5px 20px
    .top, .others
      .tags
        margin-bottom 10px
      .title
        text-align justify
        font-size 16px
        line-height 23px
        margin-bottom 5px
        a
          color #696969
          overflow hidden
          font-size 16px
          &:hover
            color $color-main-primary
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
