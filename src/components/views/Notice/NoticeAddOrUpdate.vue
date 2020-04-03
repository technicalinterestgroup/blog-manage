  <template>
  <div class="article">
    <iv-form :model="article" labiv-width="80px" :rules="rules" ref="articleForm">
     <iv-form-item prop="title">
        <!-- <iv-col :span="12"> -->
          <iv-input placeholder="输入文章标题" v-model="article.title"  clearable></iv-input>
        <!-- </iv-col> -->
      </iv-form-item>
      <iv-form-item label="是否轮播">
        <iv-radio-group v-model="article.isIndex">
          <iv-radio :label="1" >是</iv-radio>
          <iv-radio :label="0">否</iv-radio>
        </iv-radio-group>
      </iv-form-item>
      <iv-form-item label="类型">
        <iv-radio-group v-model="article.type">
          <iv-radio :label="1" >首页</iv-radio>
          <iv-radio :label="2">博客页</iv-radio>
        </iv-radio-group>
      </iv-form-item>
      <iv-form-item label="上传封面">
          <img class='indexImg' :src="article.carouselUrl">
          <iv-upload
            :action="url"
            :headers="{accessToken:this.token}"
            :before-upload="beforeUploadHandle"
            :on-remove="handleRemove"
            :on-success="successHandle">
            <!-- <div style="padding: 20px 0">
              <iv-icon type="ios-cloud-upload" size="52" style="color: #3399ff"></iv-icon>
              <p>将文件拖到此处，或<em>点击上传</em></p>
              <p>只支持jpg、png、gif格式的图片！</p>
            </div> -->
            <iv-button icon="ios-cloud-upload-outline">封面图片上传</iv-button>
          </iv-upload>
      </iv-form-item>
      <iv-form-item label="文章描述" prop="description" >
          <br>
          <iv-input type="textarea" v-model="article.description" placeholder="请输入文章描述,不能超过50个字符" clearable></iv-input>
      </iv-form-item>
      <iv-form-item  prop="content" style="height:auto">
        <mavon-editor  style="min-height: 500px" ref=md v-model="article.content" @imgAdd="imgAdd" @change="mavonChangeHandle" :toolbars="markdown.toolbars"></mavon-editor>
      </iv-form-item>
      <iv-form-item>
        <iv-button type="primary" @click="saveArticle()">发布</iv-button>
        <iv-button type="primary" @click="saveArticles()">存为草稿</iv-button>

      </iv-form-item>
    </iv-form>
  </div>
</template>

<script type="text/ecmascript-6">
import MavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// import { treeDataTranslate } from '@/utils'
import marked from 'marked'
export default {
  components: {
    'mavon-editor': MavonEditor.mavonEditor
  },
  data () {
    return {
      markdown: {
        codeStyle: 'atom-one-dark',
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: true, // 标记
          superscript: true, // 上角标
          subscript: true, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: true, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: true, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          save: true, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: true, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true // 预览
        }
      },
      articleId: this.$route.params.articleId,
      article: {
        carouselUrl: '../../../assets/upload.png',
        title: '',
        isIndex: 1,
        type: 1,
        content: '',
        id: null
      },
      token: '',
      url: '/api/vblog/file/img/upload',
      file: [],
      rules: {
        title: {required: true, message: '输入文章标题', trigger: 'change'},
        description: [
          {required: true, message: '输入文章描述', trigger: 'change'},
          { type: 'string', max: 50, message: '不能超出50字', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.userIsLoginFunction()
    if (this.articleId) {
      this.getArticle(this.articleId)
    }
  },
  methods: {
    getArticle (articleId) {
      console.log('获取文章详情')
      // 获取文章详情
      this.$axios.get('/admin/website/notice/' + articleId, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          // this.categoryOptions = treeDataTranslate(data.categoryList)
          this.article = data.data
          console.log('this.article' + JSON.stringify(this.article))
        }
      })
    },
    // 上传之前
    beforeUploadHandle (file) {
      var vm = this
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        vm.$Message.error('只支持jpg、png、gif格式的图片！')
        return false
      }
    },
    // 上传成功
    successHandle (response) {
      var vm = this
      if (response && response.code === '000000') {
        this.article.carouselUrl = response.data
        this.file = [response.resource]
        vm.$Message.success('上传成功！')
      } else {
        vm.$Message.success(response.msg)
      }
    },
    // 移除上传文件
    handleRemove (file, fileList) {
      this.file = []
      this.article.carouselUrl = ''
    },
    // 发布文章
    saveArticle () {
      var vm = this
      this.$refs['articleForm'].validate((valid) => {
        if (valid) {
          // 转化categoryId
          // this.article.categoryId = this.categoryOptionsSelect.join(',')
          this.article.state = true
          this.$axios.post('/admin/website/new', this.article)
            .then(({data}) => {
              if (data.code === '000000') {
                // vm.$Message.success('发布成功')
                this.article = {}
                this.$router.push({name: 'noticeDetail', params: {articleId: data.data}})
              } else {
                this.$Message.warning(data.msg)
              }
            })
        } else {
          vm.$Message.error('缺少必填项')
          return false
        }
      })
    },
    // 存为草稿
    saveArticles () {
      var vm = this
      this.$refs['articleForm'].validate((valid) => {
        if (valid) {
          this.article.state = false
          this.$axios.post('/admin/website/new', this.article)
            .then(({data}) => {
              if (data.code === '000000') {
                this.article = {}
                // vm.$Message.success('发布成功')
                this.$router.push({name: 'noticeDetail', params: {articleId: data.data}})
              } else {
                vm.$Message.error(data.msg)
              }
            })
        } else {
          vm.$Message.error('缺少必填项')
        }
      })
    },
    // 文章内容图片上传
    imgAdd (pos, $file) {
      var vm = this
      // 第一步.将图片上传到服务器.
      let formData = new FormData()
      formData.append('file', $file)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      this.$axios.post('/file/img/upload', formData, config)
        .then(({data}) => {
          if (data.code === '000000') {
            this.$refs.md.$img2Url(pos, data.data)
          } else {
            vm.$Message.error(data.msg)
          }
        })
    },
    mavonChangeHandle (context, render) {
      this.article.contentFormat = marked(context)
    },
    userIsLoginFunction () {
      if (localStorage.getItem('accessToken') && localStorage.getItem('userInfo')) {
        this.token = localStorage.getItem('accessToken')
      } else {
        this.$Message.warning('请先登录！')
        this.$router.replace({path: '/login'})
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/index.styl";
  .article
    width auto
    height auto
    padding:10px 10px 10px 10px;
    margin-bottom 15px
    background-color #fff
    .editor
      height 300px
    img.indexImg
      position relative
      width 250px
      height 50px
</style>
