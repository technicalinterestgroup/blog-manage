<template>
  <div class="article-content" v-cloak>
        <div class="layout-left">
          <article-page-header :article="article"></article-page-header>
          <article-page-content>
            <article id="article-main-page" class="typo container" slot="content" ref="article"
                     v-html="article.contentFormat">
            </article>
          </article-page-content>
       </div>
          <!-- <div class="layout-left">
          <article-page-footer :articleId="articleId"></article-page-footer>
        </div>   -->
  </div>
</template>
<script type="text/ecmascript-6">
import ArticlePageHeader from '@/components/views/Article/ArticlePageHeader'
import ArticlePageContent from '@/components/views/Article/ArticlePageContent'
import ArticlePageFooter from '@/components/views/Article/ArticlePageFooter'
import About from '@/components/views/About'
import TagWall from '@/components/views/TagWall'
import SideToc from '@/components/views/SideToc'
import Recommend from '@/components/views/Recommend'
import HotRead from '@/components/views/HotRead'
import TOC from '@/common/js/MarkdownToc'
// TOC滚动监听
import TocScrollSpy from '@/common/js/TocScrollSpy'
import NewArticle from '@/components/views/NewArticle'
import Archive from '@/components/views/Archive'

export default {
  data () {
    return {
      article: {},
      userName: '',
      blogSet: {},
      articleId: this.$route.params.articleId
    }
  },
  components: {
    'article-page-header': ArticlePageHeader,
    'article-page-content': ArticlePageContent,
    'article-page-footer': ArticlePageFooter,
    'about': About,
    'tag-wall': TagWall,
    'side-toc': SideToc,
    'recommend': Recommend,
    'hot-read': HotRead,
    'new-article': NewArticle,
    'archive': Archive
  },
  created: function () {
    this.getUserName()
    this.getArticle(this.articleId)
    this.getBlogSet(this.userName)
  },
  methods: {
    addCodeLineNumber () {
      // 添加行号
      let blocks = this.$refs.article.querySelectorAll('pre code')
      blocks.forEach((block) => {
        window.hljs.highlightBlock(block)
        // 去前后空格并添加行号
        block.innerHTML = '<ul><li>' + block.innerHTML.replace(/(^\s*)|(\s*$)/g, '').replace(/\n/g, '\n</li><li>') + '\n</li></ul>'
      })
    },
    getArticle (articleId) {
      // 查询文章详情
      this.$axios.get('/admin/website/notice/' + articleId, {
        params: {
          userName: this.userName
        }
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.article = data.data
          // 更新目录、高亮代码
          this.$nextTick(function () {
            this.addCodeLineNumber()
            this.refreshDiectory()
            this.refreshMobileDirectory()
            document.title = this.article.title + ' | VBlog 创建你自己的博客'
          })
        } else if (data && data.code === '000101') {
          this.$Message.warning(data.msg)
          this.$router.replace({path: '/'})
        }
      })
    },
    refreshDiectory () {
      /* eslint-disable*/
        new TOC('article-main-page', {
          'level': 5,
          'top': 200,
          'class': 'list',
          'targetId': 'side-toc'
        })
        /* eslint-disable */
        new TocScrollSpy('article-main-page', 'side-toc', {
          'spayLevel': 5,
          'articleMarginTop': 0
        })
      },
      refreshMobileDirectory () {
        /* eslint-disable */
        new TOC('article-main-page', {
          'level': 5,
          'top': 200,
          'class': 'list',
          'targetId': 'sidebar-toc'
        })
        new TocScrollSpy('article-main-page', 'sidebar-toc', {
          'spayLevel': 5,
          'articleMarginTop': 15
        })
      },
      getUserName(){
        if (localStorage.getItem('accessToken') && localStorage.getItem('adminInfo')) {
          var jsonObj = JSON.parse(localStorage.getItem('adminInfo'))
          this.userName = jsonObj.userName
        }
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
  .article-content
    width auto
    .layout-left
      background-color #fff
      padding 0
      
</style>
