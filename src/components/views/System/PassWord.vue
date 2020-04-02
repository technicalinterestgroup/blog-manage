<template>
  <div class="pass-cell" >
    <br>
    <iv-form class='login-con' ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <iv-form-item prop="oldPassWord">
        <iv-input type="password" v-model="form.oldPassWord" placeholder="请输原密码">
            <span slot="prepend">
            <iv-icon :size="16" type="ios-unlocked"></iv-icon>
            </span>
        </iv-input>
    </iv-form-item>
     <iv-form-item prop="newPassWord">
        <iv-input type="password" v-model="form.newPassWord" placeholder="请输新密码">
            <span slot="prepend">
            <iv-icon :size="16" type="ios-locked-outline"></iv-icon>
            </span>
        </iv-input>
    </iv-form-item>
    <iv-form-item prop="newPassWordRepat">
        <iv-input type="password" v-model="form.newPassWordRepat" placeholder="请输新密码">
            <span slot="prepend">
            <iv-icon :size="14" type="ios-locked"></iv-icon>
            </span>
        </iv-input>
    </iv-form-item>
    <iv-form-item>
        <iv-button @click="handleSubmit" type="primary" long>修改</iv-button>
    </iv-form-item>
</iv-form>
    <br>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'formValidate',
  data () {
    return {
      userName: this.$route.params.userName,
      form: {
        oldPassWord: '',
        newPassWord: '',
        newPassWordRepat: ''
      },
      token: '',
      base64Img: '',
      rules: { // 校验表单规则
        oldPassWord: [ // FormItem标签中的 prop 属性预期值
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPassWord: [ // FormItem标签中的 prop 属性预期值
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '至少6位数密码', trigger: 'blur' }
        ],
        newPassWordRepat: [ // FormItem标签中的 prop 属性预期值
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '至少6位数密码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // this.getUserInfo()
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.form.newPassWord.trim() !== this.form.newPassWordRepat.trim()) {
            this.$Message.warning('两次输入的新密码不一致')
            return
          }
          this.$axios.post('/user//edit/pass', this.form).then(({data}) => {
            if (data.code === '000000') {
              this.$Message.success('密码修改成功')
              this.form = {}
            } else if (data.code === '000005') {
              this.$Message.warning(data.msg)
              this.$router.push({path: '/login'})
            } else {
              this.$Message.warning(data.msg)
            }
          })
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/index.styl";
  .pass-cell
    width auto
    height auto
    padding:10px 10px 10px 10px;
    margin-bottom 15px
    background-color #fff
    .login-con
        right 25%
        width 300px;
        @media only screen and (max-width: 768px)
          center
        @media screen and (min-width: 768px)
         center
        @media screen and (min-width: 992px)
          center
        @media screen and (min-width: 1200px)
          center
        .header
          font-size 16px;
          font-weight 300;
          text-align center;
          padding 30px 0;
        .form-con
          padding 10px 0 0
        .login-tip
          font-size 10px;
          text-align center;
          color #fff
</style>
