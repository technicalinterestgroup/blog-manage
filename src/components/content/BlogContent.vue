<template>
  <!-- 首页正文内容 -->
  <div class="article-list-content">
    <iv-row>
      <iv-col :xs="24" :sm="24" :md="24" :lg="17">
          <blog-carousel></blog-carousel>
          <div class="layout-left">
          <section-title :mainTitle="''" :subTitle="''" >
            <title-menu-filter @filterByMenu="filterByMenu"  slot="menu" :menu-filter-list="defaultFilterList"></title-menu-filter>
          </section-title>
          <article-list-cell v-for="article in articleList" :article="article" :key="article.id"></article-list-cell>
          <browse-more @browseMore="browseMore" :noMoreData="noMoreData"  ref="browseMore"></browse-more>
          <br>
        </div>
      </iv-col>
      <iv-col :xs="0" :sm="0" :md="0" :lg="7">
        <div class="layout-right">
           <br>
          <new-article></new-article>
           <br>
          <recommend></recommend>
           <br>
          <hot-read></hot-read>
           <br>
          <friend-links style="margin-top:15px;"></friend-links>
          <br>
          <tag-wall style="margin-top: 15px;"></tag-wall>
        </div>
      </iv-col>
    </iv-row>
  </div>
</template>

<script type="text/ecmascript-6">
import ArticleListHeader from '@/components/views/Article/ArticleListHeader'
import ArticlePageContent from '@/components/views/Article/ArticlePageContent'
import ArticlePageFooter from '@/components/views/Article/ArticlePageFooter'
import BlogArticleListCell from '@/components/views/Article/BlogArticleListCell'
import Recommend from '@/components/views/Recommend'
import TagWall from '@/components/views/TagWall'
import BrowseMore from '@/components/views/BrowseMore'
import HotRead from '@/components/views/HotRead'
import FriendLinks from '@/components/views/FriendLinks'
import {DefaultFilterList} from '@/common/js/const'
import SectionTitle from '@/components/views/SectionTitle/SectionTitle'
import TitleMenuFilter from '@/components/views/SectionTitle/TitleMenuFilter'
import NewArticle from '@/components/views/NewArticle'
import BlogCarousel from '@/components/views/Carousel/BlogCarousel'
import merge from 'lodash/merge' // 合并对象工具
export default {
  components: {
    'article-list-header': ArticleListHeader,
    'article-page-content': ArticlePageContent,
    'article-page-footer': ArticlePageFooter,
    'article-list-cell': BlogArticleListCell,
    'recommend': Recommend,
    'tag-wall': TagWall,
    'browse-more': BrowseMore,
    'hot-read': HotRead,
    'friend-links': FriendLinks,
    'section-title': SectionTitle,
    'title-menu-filter': TitleMenuFilter,
    'new-article': NewArticle,
    'blog-carousel': BlogCarousel
  },
  data () {
    return {
      articleList: [],
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      menuParams: {
        nweTime: true
      },
      noMoreData: false,
      defaultFilterList: DefaultFilterList
    }
  },
  created () {
    this.listArticle(this.menuParams)
  },
  methods: {
    listArticle (param) {
      let params = merge(param, this.pageParam)
      this.$axios.get('/view/article/list', {
        params
      }).then(({data}) => {
        if (data && data.code === '000000') {
          console.log(data)
          if (data.data.pageCount <= data.data.currentPage) {
            this.noMoreData = true
          } else {
            this.noMoreData = false
          }
          this.articleList = data.data.pageData
        } else if (data.code === '000001') {
          // 没有数据
          this.articleList = []
          this.noMoreData = true
        } else if (data.code === '000101') {
          // 用户不存在
          this.articleList = []
          this.$Message.warning(data.msg)
          this.$router.replace({path: '/'})
        } else {
          this.articleList = []
          this.$Message.warning(data.msg)
        }
      })
    },
    filterByMenu (params) {
      console.log('刷新值')
      this.resetCurrentPage()
      this.menuParams = params
      this.listArticle(this.menuParams)
    },
    resetCurrentPage () {
      this.currentPage = 1
      this.pageParam.currentPage = 1
    },
    browseMore (param) {
      this.pageParam.currentPage++
      let params = merge(this.menuParams, this.pageParam)
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
        } else if (data.code === '000001') {
          // 没有数据
          this.noMoreData = true
        } else if (data.code === '000101') {
          // 用户不存在
          this.$Message.warning(data.msg)
          this.$router.replace({path: '/'})
        } else {
          this.$Message.warning(data.msg)
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
