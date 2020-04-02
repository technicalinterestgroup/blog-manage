<template>
  <div class="article-cell" >
    <br>
    <iv-form ref="formValidate" :model="userInfo" :label-width="80" :rules="ruleValidate">
        <iv-form-item label="用户名：">
            {{userInfo.userName}}
        </iv-form-item>
         <iv-form-item label="头像：">
           <iv-row>
             <iv-col >
               <img class='avatar' :src="userInfo.photo">
             </iv-col>
              <iv-col >
                <iv-button class="btn" type="primary" icon="el-icon-upload"  @click="toggleShow">上传头像</iv-button>
              </iv-col>
           </iv-row>
        </iv-form-item>
        <iv-form-item label="姓名：" prop="nickName" style="width:200px">
          <iv-input v-model="userInfo.nickName" value='11' placeholder="请输入"></iv-input>
        </iv-form-item>
        <iv-form-item label="邮箱：">
           {{userInfo.email}}
        </iv-form-item>
        <iv-form-item label="积分：">
           {{userInfo.integral}} 分
        </iv-form-item>
        <iv-form-item label="等级：">
          {{userInfo.grade}}
        </iv-form-item>
        <iv-form-item label="简介：" prop="userSummary" style="width: 60%">
            <iv-input v-model="userInfo.userSummary" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></iv-input>
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
      userInfo: {
        nickName: '',
        userSummary: '',
        photo: ''
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
    this.getUserInfo()
    this.userIsLoginFunction()
  },
  methods: {
    getUserInfo () {
      this.$axios.get('/user/detail', {
      }).then(({data}) => {
        if (data.code === '000000') {
          this.userInfo = data.data
        } else if (data.code === '000005') {
          this.$Message.warning(data.msg)
          this.$router.push({path: '/login'})
        } else {
          this.$Message.warning(data.msg)
        }
      })
    },
    handleSubmit () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$axios.post('/user/edit', this.userInfo)
            .then(({data}) => {
              if (data.code === '000000') {
                this.$Message.success(data.msg)
                this.getUserInfo()
              } else {
                this.$Message.warning(data.msg)
              }
            })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    confirm () {
      this.$Modal.confirm({
        title: '提示信息',
        content: '<p>确定修改个人信息？</p>',
        onOk: () => {
          this.handleSubmit()
        },
        onCancel: () => {
          this.getUserInfo()
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
