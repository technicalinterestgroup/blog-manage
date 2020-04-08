<template>
  <div class="article-cell" >
    <br>
    <iv-form ref="formValidate" :model="blog" :label-width="80" :rules="ruleValidate">
        <iv-form-item label="博客标题" prop="vIntroduct" style="width:250px">
            <iv-input v-model="blog.vTitle"  placeholder="请输入"></iv-input>
        </iv-form-item>
         <!-- <iv-form-item label="头像：">
           <iv-row>
             <iv-col >
               <img class='avatar' :src="userInfo.photo">
             </iv-col>
              <iv-col >
                <iv-button class="btn" type="primary" icon="el-icon-upload"  @click="toggleShow">上传头像</iv-button>
              </iv-col>
           </iv-row>
        </iv-form-item> -->
        <iv-form-item label="博客描述" prop="vIntroduct" style="width:300px">
          <iv-input type='textarea' v-model="blog.vIntroduct"  placeholder="请输入"></iv-input>
        </iv-form-item>
        <iv-form-item label="评论开关">
            <iv-switch v-model="blog.commentSwitch" checked="blog.commentSwitch">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </iv-switch>
        </iv-form-item>
        <iv-form-item label="通知开关">
          <iv-switch v-model="blog.noticeSwitch">
              <span slot="open">开</span>
              <span slot="close">关</span>
          </iv-switch>
        </iv-form-item>
         <iv-form-item label="模块设置">
           <br>
           <div>
             <span>最新文章 &nbsp;</span>
             <iv-switch v-model="blog.vNew">
                <span slot="open">开</span>
                <span slot="close">关</span>
             </iv-switch>
           </div>
           <div>
             <span>推荐文章 &nbsp;</span>
              <iv-switch v-model="blog.vRecommend">
                <span slot="open">开</span>
                <span slot="close">关</span>
              </iv-switch>
           </div>
           <div>
             <span>热门文章 &nbsp;</span>
              <iv-switch v-model="blog.vHot">
                <span slot="open">开</span>
                <span slot="close">关</span>
              </iv-switch>
           </div>
           <div>
             <span>归&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;档&nbsp;</span>
              <iv-switch v-model="blog.vArchive">
                <span slot="open">开</span>
                <span slot="close">关</span>
              </iv-switch>
           </div>
            <div>
             <span>标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签&nbsp;</span>
              <iv-switch v-model="blog.vTag">
                <span slot="open">开</span>
                <span slot="close">关</span>
              </iv-switch>
           </div>
        </iv-form-item>
        <iv-form-item>
            <iv-button @click="confirm()">修改</iv-button>
        </iv-form-item>
    </iv-form>
     <div id="app">
    <my-upload
    @crop-success="cropSuccess"
    @crop-upload-success="cropUploadSuccess"
    @crop-upload-fail="cropUploadFail"
    v-model="show"
    :width="100"
    :height="100"
    img-format="png"
    :size="size"
    :headers="{accessToken:this.token}"
    langType='zh'
    field="Avatar1"
    url="http://www.littletree.xyz/vblog/file/avatar/upload"></my-upload>
  </div>
    <br>
  </div>
</template>

<script type="text/ecmascript-6">
import ImageCropper from 'vue-image-crop-upload'
export default {
  components: {
    'my-upload': ImageCropper
  },
  name: 'formValidate',
  data () {
    return {
      imgDataUrl: '',
      show: false,
      size: 2.1,
      userName: this.$route.params.userName,
      token: '',
      blog: {
      },
      ruleValidate: {
        nickName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { type: 'string', max: 10, message: '姓名不能多于10字', trigger: 'blur' }
        ],
        userSummary: [
          { required: true, message: '请输入个人介绍', trigger: 'blur' },
          { type: 'string', min: 5, message: '介绍不能少于5字', trigger: 'blur' },
          { type: 'string', max: 20, message: '介绍不能多于20字', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getBlogSet()
    this.userIsLoginFunction()
  },
  methods: {
    getBlogSet () {
      this.$axios.get('/system/detail', {
      }).then(({data}) => {
        if (data.code === '000000') {
          this.blog = data.data
        } else if (data.code === '000005') {
          this.$Message.warning(data.msg)
          // this.$router.push({path: '/login'})
        } else {
          this.$Message.warning(data.msg)
        }
      })
    },
    handleSubmit () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$axios.post('/system/edit', this.blog)
            .then(({data}) => {
              if (data.code === '000000') {
                this.$Message.success(data.msg)
                this.getBlogSet()
              } else {
                this.$Message.warning(data.msg)
              }
            })
        } else {
          this.$Message.error('验证失败!')
        }
      })
    },
    confirm () {
      this.$Modal.confirm({
        title: '提示信息',
        content: '<p>确定修改博客信息？</p>',
        onOk: () => {
          this.handleSubmit()
        },
        onCancel: () => {
          this.getBlogSet()
        }
      })
    },
    toggleShow () {
      this.show = !this.show
    },
    cropSuccess (imgDataUrl, field) {
      // console.log('-------- crop success --------', imgDataUrl, field)
    },
    // 上传成功回调
    cropUploadSuccess (jsonData, field) {
      // console.log('-------- upload success --------')
      // console.log(jsonData)
      // console.log('field: ' + field)
      this.userInfo.photo = jsonData.data
    },
    // 上传失败回调
    cropUploadFail (status, field) {
      this.$Message.warning('上传失败，请重新上传')
      // console.log('-------- upload fail --------')
      // console.log('上传失败状态' + status)
      // console.log('field: ' + field)
    },
    userIsLoginFunction () {
      if (localStorage.getItem('accessToken') && localStorage.getItem('adminInfo')) {
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
  .article-cell
    width auto
    margin-bottom 15px
    background-color #fff
    img.avatar
      position relative
      width 100px
      height 100px
      border 2px solid $color-gradually-gray-91
      border-radius 50%
</style>
