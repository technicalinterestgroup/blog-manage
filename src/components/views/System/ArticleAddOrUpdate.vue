  <template>
  <div class="article">
    <iv-form :model="article" labiv-width="80px" :rules="rules" ref="articleForm">
     <iv-form-item prop="title">
        <!-- <iv-col :span="12"> -->
          <iv-input placeholder="输入文章标题" v-model="article.title"  clearable></iv-input>
        <!-- </iv-col> -->
      </iv-form-item>
      <iv-row>
        <iv-col :span="10">
          <iv-form-item label="分类">
             <Select
              style="width: 80%"
              v-model="article.categoryId">
              <Option
                v-for="item in categoryList"
                :key="item.id"
                :value="item.id"
                :label="item.name">
                {{item.name}}
              </Option>
            </Select>
          </iv-form-item>
        </iv-col>
        <iv-col span="10">
          <iv-form-item label="标签">
            <Select
              style="width: 80%"
              v-model="article.tagId" >
              <Option
                v-for="item in tagList"
                  :key="item.id"
                :label="item.name"
                :value="item.id">
                {{ item.name }}
              </Option>
            </Select>
          </iv-form-item>
        </iv-col>
      </iv-row>
      <iv-form-item label="是否置顶">
        <iv-radio-group v-model="article.isTop">
          <iv-radio :label="1" >是</iv-radio>
          <iv-radio :label="0" >否</iv-radio>
        </iv-radio-group>
      </iv-form-item>
     <!-- <iv-form-item label="展示类型">
        <iv-radio-group v-model="article.coverType">
          <iv-radio v-for="type in coverTypeList" :key="type.parKey" :label="type.parKey" >{{type.parValue}}</iv-radio>
        </iv-radio-group>
      </iv-form-item>
      <iv-form-item label="上传封面">
        <iv-col :span="12">
          <iv-upload
            drag
            :action="url"
            list-type="picture"
            :multiple="false"
            :before-upload="beforeUploadHandle"
            :file-list="file"
            :on-remove="handleRemove"
            :on-success="successHandle">
            <i class="iv-icon-upload"></i>
            <div class="iv-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="iv-upload__tip" slot="tip">只支持jpg、png、gif格式的图片！</div>
          </iv-upload>
        </iv-col>
      </iv-form-item>-->
      <iv-form-item label="文章描述" prop="description" >
        <iv-col :span="12">
          <br>
          <iv-input type="textarea" v-model="article.description" placeholder="请输入文章描述,不能超过50个字符" clearable></iv-input>
        </iv-col>
      </iv-form-item>
      <iv-form-item  prop="content" style="height:auto">
        <mavon-editor  style="min-height: 500px" ref=md v-model="article.content" @imgAdd="imgAdd" @change="mavonChangeHandle" :toolbars="markdown.toolbars"></mavon-editor>
      </iv-form-item>
      <iv-form-item>
        <iv-button type="primary" @click="saveArticle()">保存</iv-button>
        <iv-button >重置</iv-button>
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
      article: {
        isTop: 0,
        tagList: [],
        type: 0,
        coverType: 2, // 默认无图片
        state: 1,
        categoryId: '后台管理',
        tagId: null,
        description: ''
      },
      // coverTypeList: this.getSysParamArr('ARTICLE_COVER_TYPE'),
      coverTypeList: [],
      url: '',
      file: [],
      tagList: [],
      tagListSelect: [],
      tagListNew: [],
      categoryList: [],
      categoryListSelect: '选择内容',
      categoryOptions: [],
      categoryOptionsSelect: [],
      categoryListTreeProps: {
        label: 'name',
        children: 'children',
        value: 'id'
      },
      userName: this.$route.params.userName,
      articleId: this.$route.query.articleId,
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
    if (this.articleId) {
      this.getArticle(this.articleId)
    }
    this.init()
  },
  methods: {
    getArticle (articleId) {
      console.log('获取文章详情')
      // 获取文章详情
      this.$axios.get('/article/detail/' + articleId, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          // this.categoryOptions = treeDataTranslate(data.categoryList)
          this.article = data.data
          console.log('this.article' + JSON.stringify(this.article))
        }
      })
    },
    init () {
      // 获取博文分类
      this.$axios.get('/category/list/dic', {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          // this.categoryOptions = treeDataTranslate(data.categoryList)
          this.categoryList = data.data
        }
      }).then(() => {
        this.$axios.get('/tag/list/dic', {
        }).then(({data}) => {
          if (data && data.code === '000000') {
            // this.categoryOptions = treeDataTranslate(data.categoryList)
            this.tagList = data.data
          }
        })
      })
    },
    // 过滤标签
    filterTagList (selectValueList) {
      let tagList = []
      selectValueList.forEach(value => {
        let isInput = true
        for (let i = 0; i < this.tagList.length; i++) {
          let tag = this.tagList[i]
          if (tag.id === value || value.id) {
            isInput = false
            tagList.push({id: tag.id, name: tag.name, type: 0})
          }
        }
        if (isInput) {
          tagList.push({name: value, type: 0})
        }
      })
      this.article.tagList = tagList
    },
    // 上传之前
    beforeUploadHandle (file) {
      if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
        this.$message.error('只支持jpg、png、gif格式的图片！')
        return false
      }
    },
    // 上传成功
    successHandle (response) {
      if (response && response.code === 200) {
        this.article.cover = response.resource.url
        this.file = [response.resource]
        this.$message.success('上传成功！')
      }
    },
    // 移除上传文件
    handleRemove (file, fileList) {
      this.file = []
      this.article.cover = ''
    },
    // 保存文章
    saveArticle () {
      this.$refs['articleForm'].validate((valid) => {
        if (valid) {
          // 转化categoryId
          // this.article.categoryId = this.categoryOptionsSelect.join(',')
          this.$axios.post('/article/new', this.article)
            .then(({data}) => {
              if (data.code === '000000') {
                this.article = {}
                // this.$message.success('保存博文成功')
                this.$router.push({path: '/' + this.userName + '/article/' + data.data})
              } else {
                this.$message.error(data.msg)
              }
            })
        } else {
          return false
        }
      })
    },
    // 文章内容图片上传
    imgAdd (pos, $file) {
      // 第一步.将图片上传到服务器.
      let formData = new FormData()
      formData.append('file', $file)
      // this.$http({
      //   url: '/file/img/upload',
      //   method: 'post',
      //   data: formData,
      //   headers: { 'Content-Type': 'multipart/form-data' }
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      this.$axios.post('/file/img/upload', formData, config)
        .then(({data}) => {
          if (data.code === '000000') {
            this.$refs.md.$img2Url(pos, data.data)
          } else {
            this.$message.warn(data.msg)
          }
        })
    },
    mavonChangeHandle (context, render) {
      this.article.contentFormat = marked(context)
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
</style>
