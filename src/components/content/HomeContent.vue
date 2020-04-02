<template>
  <!-- 用户首页正文内容 -->
  <div class="article-list-content">
    <iv-row>
      <iv-col :xs="24" :sm="24" :md="24" :lg="17">
        <home-carousel></home-carousel>
        <div class="layout-left">
          <br>
          <article-list-header v-if="categoryList.length>0" @filterByMenu="filterByMenu"
                               @filterByCategory="filterByCategory"
                               :categorys="categoryList"
                               :defaultCategory="selected_category"
                               :mainTitle="''" :sub-title="''" ></article-list-header>
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
          <new-article v-if="blogSet.vNew"></new-article>
           <br>
          <recommend v-if="blogSet.vRecommend"></recommend>
           <br>
          <hot-read v-if="blogSet.vHot"></hot-read>
          <br>
          <archive v-if="blogSet.vArchive"></archive>
          <br>
          <tag-wall v-if="blogSet.vTag" style="margin-top: 15px;"></tag-wall>
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
import HomeArticleListCell from '@/components/views/Article/HomeArticleListCell'
import Recommend from '@/components/views/Recommend'
import TagWall from '@/components/views/TagWall'
import BrowseMore from '@/components/views/BrowseMore'
import HotRead from '@/components/views/HotRead'
import FriendLinks from '@/components/views/FriendLinks'
import About from '@/components/views/About'
import {treeDataTranslate} from '@/utils'
import NewArticle from '@/components/views/NewArticle'
import Archive from '@/components/views/Archive'
import HomeCarousel from '@/components/views/Carousel/HomeCarousel.vue'
import merge from 'lodash/merge' // 合并对象工具

export default {
  components: {
    'article-list-header': ArticleListHeader,
    'article-page-content': ArticlePageContent,
    'article-page-footer': ArticlePageFooter,
    'article-list-cell': HomeArticleListCell,
    'recommend': Recommend,
    'tag-wall': TagWall,
    'browse-more': BrowseMore,
    'hot-read': HotRead,
    'friend-links': FriendLinks,
    'about': About,
    'new-article': NewArticle,
    'archive': Archive,
    'home-carousel': HomeCarousel
  },
  data () {
    return {
      articleList: [],
      categoryList: [],
      selected_category: this.$route.query.categoryId,
      categoryId: this.$route.query.categoryId,
      menuParams: {
        newTime: true
      },
      noMoreData: false,
      userName: this.$route.params.userName,
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      blogSet: {}
    }
  },
  created () {
    let param = {}
    param.newTime = true
    this.listArticle(param)
    this.listCategory(this.userName)
    this.getBlogSet(this.userName)
    document.title = this.userName + '的博客 | VBlog 创建你自己的博客'
  },
  methods: {
    listArticle (param) {
      let params = merge(param, this.pageParam)
      params.categoryId = this.categoryId
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
          // 没有数据
          this.noMoreData = true
          this.articleList = []
        } else if (data.code === '000101') {
          // 用户不存在
          this.articleList = []
          this.$Message.warning(data.msg)
          this.$router.replace({path: '/'})
        } else {
          this.articleList = []
          this.$Message.warning(data.msg)
        }
      }).catch(error => {
        this.$refs.browseMore.stopLoading()
        console.log(error)
      })
    },
    listCategory (userName) {
      // let params = {}
      // params.type = 0
      this.$axios.get('/view/article/category/' + userName, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.categoryList = treeDataTranslate(data.data)
        }
      })
    },
    filterByMenu (params) {
      this.resetCurrentPage()
      this.menuParams = params
      this.listArticle(this.menuParams)
    },
    filterByCategory (params) {
      this.resetCurrentPage()
      this.categoryId = params
      let param = {}
      param.newTime = true
      // this.filterByMenu(param)
      this.listArticle(param)
    },
    resetCurrentPage () {
      this.currentPage = 1
      this.pageParam.currentPage = 1
    },
    browseMore () {
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
        }
      }).then(response => {
        this.$refs.browseMore.stopLoading()
      }).catch(error => {
        this.$refs.browseMore.stopLoading()
        console.log(error)
      })
    },
    getBlogSet (userName) {
      this.$axios.get('/view/blog/info/' + userName, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.blogSet = data.data
        }
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
