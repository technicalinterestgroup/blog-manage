<template>
  <!-- 账号管理 -->
  <div class="my-account-content">
    <iv-row>
      <iv-col :xs="0" :sm="0" :md="0" :lg="5">
        <div class="layout-left">
          <myAccountMenu></myAccountMenu>
        </div>
      </iv-col>
      <iv-col :xs="24" :sm="24" :md="24" :lg="19">
        <div class="layout-right">
          <router-view></router-view>
        </div>
      </iv-col>
    </iv-row>
  </div>
</template>

<script type="text/ecmascript-6">
import MyAccountMenu from '@/components/views/Menu/MyAccountMenu'
export default {
  components: {
    'myAccountMenu': MyAccountMenu
  },
  data () {
    return {
    }
  },
  created () {
    this.userIsLoginFunction()
  },
  methods: {
    userIsLoginFunction () {
      if (localStorage.getItem('accessToken') && localStorage.getItem('adminInfo')) {
      } else {
        this.$Message.warning('请先登录！')
        this.$router.replace({path: '/login'})
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .my-account-content
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
      @media only screen and (max-width: 100px)
        padding 0
      @media screen and (min-width: 100px)
        padding 0
      @media screen and (min-width: 100px)
        padding 0 10px
      @media screen and (min-width: 100px)
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
