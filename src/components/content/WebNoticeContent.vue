<template>
  <div class="article-content" v-cloak>
    <iv-row>
      <iv-col :xs="24" :sm="24" :md="24" :lg="17">
        <div class="layout-left">
          <article-page-header :article="article"></article-page-header>
          <article-page-content>
            <article id="article-main-page" class="typo container" slot="content" ref="article"
                     v-html="article.contentFormat">
            </article>
          </article-page-content>
          </div>
          <br>

          <div class="layout-left">
          <!-- <article-page-footer :postId="noticeId"></article-page-footer> -->
        </div>
      </iv-col>
      <iv-col :xs="0" :sm="0" :md="0" :lg="7">
        <div class="layout-right">
           <br>
          <about></about>
           <br>
           <iv-affix :offset-top="60">
            <side-toc style="margin-top: 15px;"></side-toc>
          </iv-affix>
          <br>
        </div>
      </iv-col>
    </iv-row>
  </div>
</template>
<script type="text/ecmascript-6">
import ArticlePageHeader from '@/components/views/Article/ArticlePageHeader'
import ArticlePageContent from '@/components/views/Article/ArticlePageContent'
import ArticlePageFooter from '@/components/views/Article/ArticlePageFooter'
import AboutWeb from '@/components/views/AboutWeb'
import SideToc from '@/components/views/SideToc'
import TOC from '@/common/js/MarkdownToc'
// TOC滚动监听
import TocScrollSpy from '@/common/js/TocScrollSpy'

export default {
  data () {
    return {
      article: {},
      userName: '',
      noticeId: this.$route.params.noticeId
    }
  },
  components: {
    'article-page-header': ArticlePageHeader,
    'article-page-content': ArticlePageContent,
    'article-page-footer': ArticlePageFooter,
    'about': AboutWeb,
    'side-toc': SideToc
  },
  created: function () {
    this.getUserName()
    this.getNotice(this.noticeId)
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
    getNotice (noticeId) {
      // 查询文章详情
      this.$axios.get('/view/notice/' + noticeId, {
        // params: {
        //   userName: this.userName
        // }
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
        if (localStorage.getItem('accessToken') && localStorage.getItem('userInfo')) {
          var jsonObj = JSON.parse(localStorage.getItem('userInfo'))
          this.userName = jsonObj.userName
        }
      }
    }

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .article-content
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
