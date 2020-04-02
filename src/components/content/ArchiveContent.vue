<template>
  <!-- 归档查询正文内容 -->
  <div class="article-list-content">
    <iv-row>
      <iv-col :xs="24" :sm="24" :md="24" :lg="17">
        <home-carousel></home-carousel>
        <div class="layout-left">
          <br>
          <section-title :mainTitle="'归档'" :subTitle="this.period"> </section-title>
          <article-list-cell v-for="article in articleList" :article="article" :key="article.id"></article-list-cell>
          <browse-more @browseMore="browseMore" :noMoreData="noMoreData"  ref="browseMore"></browse-more>
        <br>
        </div>
      </iv-col>
      <iv-col :xs="0" :sm="0" :md="0" :lg="7">
        <div class="layout-right">
          <br>
          <about></about>
          <br>
          <new-article></new-article>
           <br>
          <recommend></recommend>
           <br>
          <hot-read></hot-read>
          <br>
          <archive></archive>
          <br>
          <tag-wall style="margin-top: 15px;"></tag-wall>
          <br>
        </div>
      </iv-col>
    </iv-row>
  </div>
</template>

<script type="text/ecmascript-6">
import ArticleListHeader from '@/components/views/Article/ArticleListHeader'
import ArticlePageContent from '@/components/views/Article/ArticlePageContent'
import ArticlePageFooter from '@/components/views/Article/ArticlePageFooter'
import ArticleListCell from '@/components/views/Article/HomeArticleListCell'
import Recommend from '@/components/views/Recommend'
import TagWall from '@/components/views/TagWall'
import BrowseMore from '@/components/views/BrowseMore'
import HotRead from '@/components/views/HotRead'
import FriendLinks from '@/components/views/FriendLinks'
import About from '@/components/views/About'
import NewArticle from '@/components/views/NewArticle'
import Archive from '@/components/views/Archive'
import HomeCarousel from '@/components/views/Carousel/HomeCarousel.vue'
import SectionTitle from '@/components/views/SectionTitle/SectionTitle'
import merge from 'lodash/merge' // 合并对象工具

export default {
  components: {
    'article-list-header': ArticleListHeader,
    'article-page-content': ArticlePageContent,
    'article-page-footer': ArticlePageFooter,
    'article-list-cell': ArticleListCell,
    'recommend': Recommend,
    'tag-wall': TagWall,
    'browse-more': BrowseMore,
    'hot-read': HotRead,
    'friend-links': FriendLinks,
    'about': About,
    'new-article': NewArticle,
    'archive': Archive,
    'home-carousel': HomeCarousel,
    'section-title': SectionTitle
  },
  data () {
    return {
      articleList: [],
      period: this.$route.params.period,
      noMoreData: false,
      userName: this.$route.params.userName,
      pageParam: {
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  created () {
    let param = {}
    param.archiveTime = this.period
    this.listArticle(param)
  },
  methods: {
    listArticle (param) {
      let params = merge(param, this.pageParam)
      this.$axios.get('/view/article/list/' + this.userName, {
        params
      }).then(({data}) => {
        if (data && data.code === '000000') {
          if (data.data.pageCount <= data.data.currentPage) {
            this.noMoreData = true
          } else {
            this.noMoreData = false
          }
          this.articleList = data.data.pageData
          if (this.articleList.length > 0) {
            this.articleList.map(article => {
              article.coverType = 2
            })
          }
        } else if (data.code === '000001') {
          this.noMoreData = true
        } else if (data.code === '000101') {
          this.$Message.warning(data.msg)
          this.$router.replace({path: '/'})
        } else {
          this.$Message.warning(data.msg)
        }
      })
    },
    browseMore () {
      this.pageParam.currentPage++
      let param = {}
      param.archiveTime = this.period
      let params = merge(param, this.pageParam)
      this.$axios.get('/view/article/list', {
        params
      }).then(({data}) => {
        if (data && data.code === '000000') {
          if (data.data.pageCount <= data.data.currentPage) {
            this.noMoreData = true
          } else {
            this.noMoreData = false
          }
          this.articleList = this.articleList.concat(data.data.pageData)
        }
      }).then(response => {
        this.$refs.browseMore.stopLoading()
      }).catch(error => {
        this.$refs.browseMore.stopLoading()
        console.log(error)
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .article-list-content
    width auto
    @media only screen and (max-width: 768px)
      margin 5px 5px 10px 5px
    @media screen and (min-width: 768px)
      margin 10px 10px 20px 10px
    @media screen and (min-width: 992px)
      margin 15px 35px 50px 35px
    @media screen and (min-width: 1200px)
      width 1200px
      margin 15px auto 0
      margin-bottom 50px
    .layout-left
      background-color #fff
      padding 0
      @media only screen and (max-width: 768px)
        padding 0
      @media screen and (min-width: 768px)
        padding 0
      @media screen and (min-width: 992px)
        padding 0 10px
      @media screen and (min-width: 1200px)
        padding 0 10px
    .layout-right
      padding 0
      @media only screen and (max-width: 768px)
        padding 0
      @media screen and (min-width: 768px)
        padding 0
      @media screen and (min-width: 992px)
        padding 0 10px
      @media screen and (min-width: 1200px)
        padding 0 10px
</style>
