<template>
  <div id="favorite-content">
    <br>
    <iv-form ref="formValidate" :model="userInfo" :label-width="80" :rules="ruleValidate" @keydown.enter.native="handleSubmit">
        <iv-form-item label="用户名：">
            {{userInfo.userName}}
        </iv-form-item>
         <iv-form-item label="头像：">
            {{userInfo.photo}}
        </iv-form-item>
        <iv-form-item label="姓名：" prop="nickName" style="width: 20%">
          <iv-input :value.sync="userInfo.nickName" placeholder="请输入"></iv-input>
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
            <iv-input :value.sync="userInfo.userSummary" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></iv-input>
        </iv-form-item>
        <iv-form-item>
            <iv-button @click="handleSubmit('userInfo')">修改</iv-button>
        </iv-form-item>
    </iv-form>
    <br>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      userName: this.$route.params.userName,
      userInfo: {
        nickName: '',
        userSummary: ''
      },

      ruleValidate: {
        nickName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
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
  },
  methods: {
    getUserInfo () {
      this.$axios.get('/user/detail/' + this.userName, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.userInfo = data.data
        } else if (data && data.code === '000005') {
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
          console.log('nickName' + this.userInfo.nickName)
          this.$Message.success('提交成功!')
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/article.styl";

  #favorite-content
    width auto
    margin-bottom 15px
    background-color #fff
</style>
