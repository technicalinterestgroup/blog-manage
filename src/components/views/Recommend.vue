<template>
  <div class="recommend">
    <panel :title="'推荐阅读'">
      <div slot="content" class="content">
        <!-- <div class="top" v-if="topRecommend">
          <a :href="'/' + topRecommend.urlType + '/' + topRecommend.linkId">
            <p class="title">{{topRecommend.title}}</p>
            <div class="tags">
              <iv-tag  :color="tag.id | mapTagColor" v-for="(tag) in topRecommend.tagList" :key="tag.id">{{tag.name}}</iv-tag>
            </div>
            <p class="info">
              <span class="time">{{topRecommend.createTime }}</span>
              <span class="likes"><a><iv-icon type="heart"></iv-icon> {{topRecommend.likeNum}} </a></span>
              <span class="comments"><a><iv-icon type="compose"></iv-icon> {{topRecommend.commentNum}} </a></span>
              <span class="readings"><a><iv-icon type="eye"></iv-icon> {{topRecommend.readNum}} </a></span>
            </p>-->
            <!--<div class="img">-->
              <!--<img :src="topRecommend.cover" alt="">-->
            <!--</div>-->
          <!--  <p class="desc">{{topRecommend.description | textLineBreak(60)}}</p>
          </a>
        </div> -->
        <ul class="others">
          <li v-for="recommend in recommendList" :key="recommend.id">
              <p class="title"> <a @click="selectMenu('/' +recommend.userName + '/article/' +recommend.id)">{{recommend.title}}</a></p>
              <p class="info">
                <span class="time">{{recommend.createTime }}</span>
                <span class="user" v-if=!isUserHomeFlag><a @click="selectMenu('/' +recommend.userName)"><iv-icon type="person"></iv-icon> {{recommend.userName}} </a></span>
                <span class="likes" v-if=isUserHomeFlag><a ><iv-icon type="thumbsup" color="#F78F8F"></iv-icon> {{recommend.likeCount}} </a></span>
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
      recommendList: [],
      topRecommend: {},
      userName: this.$route.params.userName,
      isUserHomeFlag: false
    }
  },
  mixins: [mixin],
  created () {
    this.listRecommend(this.userName)
    this.isUserHome()
  },
  methods: {
    listRecommend (userName) {
      var url = '/view/article/recommend'
      if (userName) {
        url = url + '/' + userName
      }
      // 推荐文章
      this.$axios.get(url, {
      }).then(reponse => {
        if (reponse && reponse.data.code === '000000') {
          this.recommendList = reponse.data.data
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

  .recommend
     border 1px solid $color-border
    .content
      padding 5px 20px
    .top, .others
      .tags
        margin-bottom 10px
      .title
        text-align justify
        color $color-gradually-gray-41
        font-size 16px
        line-height 23px
        margin-bottom 5px
        a
          color #696969
          display block
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
