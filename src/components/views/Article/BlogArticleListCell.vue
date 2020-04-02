<template>
  <!-- 首页文章列表 -->
  <div class="article-cell">
    <a>
      <iv-row type="flex">
        <iv-col :xs="24" :sm="24" :md="24" :lg="24" :order="2" style="padding-left: 0;padding-right: 0;">
          <div class="text-wrapper">
            <h4 class="title">
              <a @click="selectMenu('/'+article.userName+'/article/'+article.id)">{{article.title}}</a>
              <span class="special" v-if="article.isRecommend>0" title="推荐">推荐</span>
            </h4>
            <div class="tags">
              <!-- <iv-tag :color="tag.id | mapTagColor" :key="tag.id" type="border" v-for ="(tag) in article.tagList">{{tag.name}}</iv-tag> -->
              <iv-tag v-if="article.tagId" :color="article.tagId | mapTagColor"  type="border" >{{article.tagCN}}</iv-tag>
            </div>
             <p class="desc">{{article.submit | filterHtml | textLineBreak(70) }}
               <a @click="selectMenu('/'+article.userName+'/article/'+article.id)"> 查看更多
               <iv-icon type="arrow-right-b"></iv-icon>
               </a>
            </p>
            <iv-row>
              <iv-col :xs="24" :sm="14" :md="14" :lg="14" style="padding-left: 0;padding-right: 0;">
                <p class="operate_info">
                  <span class="userName"><a @click="selectMenu('/'+article.userName)"><iv-icon type="person"></iv-icon>  {{article.userName}}   </a></span>
                  <span class="publish-time"><a><iv-icon type="ios-compose"></iv-icon>  {{article.createTime}} </a></span>
                </p>
              </iv-col>
              <iv-col :xs="24" :sm="10" :md="10" :lg="10" style="padding-left: 0;padding-right: 0;">
                <p class="operate_info_1">
                  <span class="readings"><a ><iv-icon type="eye" color="#76EE00"></iv-icon> {{article.readCount}} 阅读</a></span>
                  <span class="likes"><a ><iv-icon type="chatbox-working" color="#7EC0EE"></iv-icon> {{article.commentCount}} 评论</a ></span>
                  <span class="likes"><a ><iv-icon type="thumbsup" color="#F78F8F"></iv-icon> {{article.likeCount}} 点赞</a></span>
                </p>
              </iv-col>
            </iv-row>
          </div>
        </iv-col>
      </iv-row>
    </a>
  </div>
</template>

<script type="text/ecmascript-6">
import { mixin } from '@/utils'

export default {
  props: {
    article: {
      Type: Object
    },
    type: ''
  },
  mixins: [mixin],
  methods: {
    likePost (post) {
      this.$http({
        url: this.$http.adornUrl('/article/like/' + post.id),
        method: 'put',
        data: this.$http.adornData()
      }).then(({data}) => {
        if (data && data.code === 200) {
          post.likeNum += 1
          this.$Message.success('点赞成功')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    selectMenu (url) {
      console.log('url' + url)
      this.$router.push(url)
      // .catch(data => {})
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/index.styl";

  .article-cell
    background-color #fff
    margin-bottom 15px
    > a
      display block
      cursor default
      border 1px solid $color-border
      &:hover
        border 1px solid $color-border-hover
        box-shadow 2px 2px 3px $color-border
      .text-wrapper
        padding 20px 20px 0 20px
        text-align left
        @media only screen and (max-width: 768px)
          padding 15px 15px 0 15px
        .title
          font-size 23px
          font-weight 100
          line-height 27px
          span.special
            border-radius $border-radius
            font-size 12px
            font-weight 100
            padding 3px 5px
            margin-left 1px
            vertical-align top
            color $default-background-color
            background #FF3030
            cursor pointer
          a
            color $color-typegraphy-title
            cursor pointer
            &:hover
              color $color-typegraphy-title-hover
              text-decoration underline
        .info
          margin-top 10px
          font-size 14px
          line-height 18px
          font-weight 200
          a
            color: #777
            cursor pointer
            &:hover
              color $color-main-primary
              text-decoration underline
          .publish-time
            margin-left 20px
        .line
          width 50px
          margin-top 30px
          border-1px(rgba(7, 17, 27, 0.4))
          &::after
            margin-bottom 15px
        .tags
          /*cursor: pointer;*/
          margin: 8px 0
        .desc
          color #666
          font-size 14px
          line-height 20px
          font-weight 200
          a
            color $color-main-primary
            font-weight 500
            cursor pointer
            &:hover
              text-decoration underline
        .operate_info
          margin-top 10px
          font-size 14px
          line-height 18px
          font-weight 200
          span
            margin-right 8px
            + span
              margin-left 8px
            a
              cursor pointer
              &:hover
                color $color-main-primary
                text-decoration underline
        .operate_info_1
          text-align right
          font-size 14px
          margin 15px 0
          @media only screen and (max-width: 768px)
            text-align left
          span
            margin-right 8px
            + span
              margin-left 8px
            a
              cursor pointer
              &:hover
                color $color-main-primary
      .img-wrapper
        padding-bottom: 85%
        width: 100%
        height: 0
        overflow hidden
        &.big-image
          padding-bottom 26%
        img
          width 100%
</style>
