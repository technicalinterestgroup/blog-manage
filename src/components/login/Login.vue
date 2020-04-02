<template>
<div class="home-content">
  <div class="login">
    <div class="login-con">
      <iv-card  icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" ref="loginForm"></login-form>
        </div>
      </iv-card >
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import LoginForm from '@/components/Login/Login-form' // 驼峰命名法
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      userToken: '',
      userInfo: '',
      userName: 'admin',
      passWord: 'a123456',
      img: '',
      token: ''
    }
  },
  components: {
    LoginForm
  },
  methods: {
    ...mapMutations(['changeLogin']),
    handleSubmit ({username, password, img, token}) {
      let _this = this
      this.$axios.get('/admin/login', {
        params: {
          userName: username,
          passWord: password,
          img: img,
          token: token
        }
      }).then(({data}) => {
        if (data.code === '000000') {
          _this.userToken = data.data.userToken
          _this.userInfo = data.data
          console.log(this.userToken)// 获取到的token
          _this.changeLogin({ accessToken: this.userToken,
            userInfo: this.userInfo })
          if (localStorage.getItem('accessToken') && localStorage.getItem('userInfo')) {
            this.loading()
            this.$router.replace({name: 'admin'})
          } else {
            this.$Message.warning('缓存失败，请重新登录')
          }
        } else {
          this.$refs.loginForm.convert()
          this.$Message.warning(data.msg)
        }
      }).catch((error) => {
        console.log(error.response.data.msg)
      })
    },
    loading () {
      const msg = this.$Message.loading('登录成功...', 0)
      setTimeout(msg, 2000)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .home-content
    width 100vh,
    height 100%
    .login
      height 100vh;
      background-image  url('../../assets/login.png');
      background-size cover;
      background-position center;
      -webkit-font-smoothing antialiased ;// 这个属性可以使页面上的字体抗锯齿,使用后字体看起来会更清晰舒服
      z-index: 999999
      font-weight 300;
      .login-con
        position absolute;
        right 160px;
        top 26em;
        transform translateY(-60%);
        width 300px;
        @media only screen and (max-width: 768px)
          right 20%;
        @media screen and (min-width: 768px)
          right 20%;
        @media screen and (min-width: 992px)
          right 20%;
        @media screen and (min-width: 1200px)
          right 20%;
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
