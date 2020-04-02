<template>
  <div class="article-page-header">
    <div class="tags">
      <!-- <iv-tag :color="tag.id | mapTagColor" v-for="(tag) in article.tagList" :key="tag.id">{{tag.name}}</iv-tag> -->
      <iv-tag v-if="article.tagId" :color="article.tagId | mapTagColor">{{article.tagCN}}</iv-tag>
    </div>
    <p class="title">{{article.title}}</p>
    <iv-row>
      <iv-col :xs="24" :sm="10" :md="10" :lg="10" style="padding-left: 0;padding-right: 0;">
        <p class="info"><span class="author">By / <a >{{article.userName}}</a></span><span
                class="publish-time"> <a ><iv-icon type="ios-compose"></iv-icon>  {{article.createTime}}</a></span></p>
      </iv-col>
      <iv-col :xs="24" :sm="14" :md="14" :lg="14" style="padding-left: 0;padding-right: 0;">
        <p class="operate_info">
          <span class="readings"><a ><iv-icon type="eye"></iv-icon> {{article.readCount}} 阅读</a> |</span>
          <span class="likes" v-if=!article.vLike><a @click="likePost(article)"><iv-icon type="thumbsup"></iv-icon> {{article.likeCount}} 点赞</a> |</span>
          <span class="likes" v-if=article.vLike><a @click="delLikePost(article)"><iv-icon type="thumbsup" color="#F78F8F"></iv-icon> {{article.likeCount}} 取消点赞</a>  |</span>
          <span class="collection" v-if=!article.vCollection><a @click="collectionPost(article)"><iv-icon type="star"></iv-icon> 收藏</a></span>
          <span class="collection" v-if=article.vCollection><a @click="delCollectionPost(article)"><iv-icon type="star" color="#EE2C2C"></iv-icon> 取消收藏</a></span>
        </p>
      </iv-col>
    </iv-row>
    <p class="abstract" v-if="article.submit">
      {{article.submit}}
    </p>
  </div>
</template>

<script type="text/ecmascript-6">
import { mixin } from '@/utils'
export default {
  props: {
    article: {}
  },
  data () {
    return {
      // doLike: false,
      // doCollection: false

    }
  },
  mixins: [mixin],
  methods: {
    // 点赞
    likePost (post) {
      this.$axios.get('/like/new/' + post.id, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.$Message.success(data.msg)
          post.likeCount += 1
          post.vLike = true
        } else if (data && data.code === '000005') {
          this.$Message.warning(data.msg)
        } else {
          this.$Message.warning(data.msg)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 取消点赞
    delLikePost (post, doLike) {
      this.$axios.get('/like/del/' + post.id, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          post.likeCount -= 1
          post.vLike = false
          this.$Message.success('取消点赞')
        } else if (data && data.code === '000005') {
          this.$Message.warning(data.msg)
        } else {
          this.$Message.warning(data.msg)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 收藏
    collectionPost (post) {
      this.$axios.get('/collection/new/' + post.id, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.$Message.success(data.msg)
          post.vCollection = true
        } else if (data && data.code === '000005') {
          this.$Message.warning(data.msg)
        } else {
          this.$Message.warning(data.msg)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 取消收藏
    delCollectionPost (post, doLike) {
      this.$axios.get('/collection/del/' + post.id, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          post.vCollection = false
          this.$Message.success('取消收藏')
        } else if (data && data.code === '000005') {
          this.$Message.warning(data.msg)
        } else {
          this.$Message.warning(data.msg)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/index.styl";

  .article-page-header
    text-align left
    padding 25px 5px 10px 5px
    @media only screen and (max-width: 768px)
      padding-top 10px
    @media screen and (min-width: 768px)
      padding-top 10px
    @media screen and (min-width: 992px)
      padding-top 25px
    .tags
      margin-bottom 18px
    .title
      font-size 27px
      line-height 33px
      font-weight 500
      color $color-typegraphy-title
      margin-bottom 23px
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
    .operate_info
      text-align right
      font-size 14px
      margin 15px 0
      @media only screen and (max-width: 768px)
        text-align left
      span
        margin-right 10px
        + span
          margin-left 10px
        a
          cursor pointer
          &:hover
            color $color-main-primary
            text-decoration underline
    .abstract
      color $default-desc-color
      border 1px dashed $default-border-color
      background $default-border-color
      @media only screen and (max-width: $responsive-sm)
        padding 8px
        margin-top 8px
        font-size 13px
        line-height 18px
      @media screen and (min-width: $responsive-sm)
        padding 15px
        margin-top 8px
        font-size 14px
        line-height 24px
      @media screen and (min-width: $responsive-md)
        padding 20px
        margin-top 15px
        line-height 28px
      @media screen and (min-width: $responsive-lg)
        padding 20px
        margin-top 15px
        line-height 28px
</style>
