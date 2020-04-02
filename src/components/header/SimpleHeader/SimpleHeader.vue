<template>
  <div class="simple-header">
    <transition name="slide-fade">
      <div id="mobile-bar" v-show="show" >
        <a class="menu-button" ref="menubutton"></a>
        <router-link class="logo" to="/"></router-link>
      </div>
    </transition>
    <transition name="slide-fade">
      <div id="header"  v-show="show">
        <ul>
          <router-link id="logo" to="/">
            <img src="../../../assets/logo.png">
            <span class="title">VBlog</span>
            <span class="motto">后台管理系统！</span>
          </router-link>
        </ul>
        <ul id="nav">
          <!-- <li><a @click="selectMenu('/')" class="nav-link contribute">首页</a></li>
          <li><a @click="selectMenu('/blog')" class="nav-link contribute">博客</a></li>
          <li><a @click="selectMenu('/books')" class="nav-link contribute">阅读</a></li>
          <li><a @click="selectMenu('/timeline')" class="nav-link contribute">时光轴</a></li>
          <li><a @click="selectMenu('/timeline')" class="nav-link contribute">关于</a></li>
          <li>
            <form id="search-form" action="/so/search">
              <span class="algolia-autocomplete" style="position: relative; display: inline-block; direction: ltr;">
              <input
              type="text" id="search-query-nav" class="search-query st-default-search-input aa-input" name="keywords" v-model="keywords" @keyup.enter="submit"
              autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false"
              aria-owns="algolia-autocomplete-listbox-0" dir="auto" style="position: relative; vertical-align: top;">
              <pre
              aria-hidden="true"
              style="position: absolute; visibility: hidden; white-space: pre; font-family: system-ui; font-size: 12px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; word-spacing: 0px; letter-spacing: normal; text-indent: 0px; text-rendering: auto; text-transform: none;"></pre>
              <span
              class="aa-dropdown-menu" role="listbox" id="algolia-autocomplete-listbox-0"
              style="position: absolute; top: 100%; z-index: 100; display: none; left: 0px; right: auto;"><div
              class="aa-dataset-1"></div></span></span>
            </form>
          </li> -->
        </ul>
        <ul id="nav-login" v-if=!userIsLogin>
           <li><a @click="selectMenu('/login')" class="motto">登录</a></li>
           <li><a @click="selectMenu('/register')" class="motto">注册</a></li>
        </ul>
        <ul id="nav-login" v-if=userIsLogin :userInfo="userInfo">
           <iv-dropdown @on-click="changeMenu" trigger="click">
             <div class='avatar-div'>
                  <a class='userName' href="javascript:void(0)">
                       <img class='avatar' :src="userInfo.photo">
                  </a>
             </div>
              <iv-dropdownMenu slot ="list" >
                <iv-dropdownItem v-for="auth in userInfo.authList" :key="auth.url" :name="auth.url"> <iv-icon :type="auth.icon"></iv-icon>&nbsp;{{auth.authName}}</iv-dropdownItem>
              </iv-dropdownMenu>
            </iv-dropdown>
        </ul>
    </div>
    </transition>
      <sidebar ref="sidebar" :userIsLogin="userIsLogin" :userInfo="userInfo"></sidebar>
  </div>

</template>

<script type="text/ecmascript-6">
import SideBar from '@/components/header/SimpleHeader/SideBar'
export default {
  components: {
    'sidebar': SideBar
  },
  data () {
    return {
      show: true,
      keywords: '',
      userIsLogin: false,
      userInfo: {
        photo: '',
        userName: '',
        authList: []
      }
    }
  },
  created () {
    this.keywords = this.$route.query.keywords
    this.userIsLoginFunction()
  },
  watch: {
    $route (now, old) {
      if (old.path === '/' && now.path !== old.path) {
        console.log('刷新用户')
        this.userIsLoginFunction()
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.initMobileMenu()
    })
    // 给页面绑定滑轮滚动事件
    // if (document.addEventListener) { // firefox
    //   document.addEventListener('DOMMouseScroll', this.watchScroll, false)
    // }
    // 滚动滑轮触发scrollFunc方法  //ie 谷歌
    // window.onmousewheel = document.onmousewheel = this.watchScroll
  },
  methods: {
    initMobileMenu () {
      // 显示手机端的菜单
      var sidebar = this.$refs.sidebar
      this.$refs.menubutton.addEventListener('click', function () {
        sidebar.toggleSideBar()
      })
    },
    watchScroll (e) {
      e = e || window.event
      if (e.wheelDelta) {
        if (e.wheelDelta > 0 && this.show === false) { // 当滑轮向上滚动
          this.show = true
        }
        if (e.wheelDelta < 0 && this.show === true) { // 当滑轮向下滚动
          this.show = false
        }
      } else if (e.detail) {
        if (e.detail < 0 && this.show === false) { // 当滑轮向上滚动
          this.show = true
        }
        if (e.detail > 0 && this.show === true) { // 当滑轮向下滚动
          this.show = false
        }
      }
    },
    userIsLoginFunction () {
      if (localStorage.getItem('accessToken') && localStorage.getItem('userInfo')) {
        console.log('已经登录')
        var jsonObj = JSON.parse(localStorage.getItem('userInfo'))
        this.userInfo = jsonObj
        this.userName = jsonObj.userName
        this.list = jsonObj.authList
        this.userIsLogin = true
      } else {
        console.log('没有登录用户')
        this.userIsLogin = false
      }
    },
    changeMenu (name) {
      console.log('url' + name)
      if (name) {
        if (name === '/logout') {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userInfo')
          this.userIsLoginFunction()
          this.$Message.warning('退出登录')
          this.$router.replace('/')
          // .catch(data => { })
        } else {
          this.$router.push('/' + this.userName + name)
          // .catch(data => { })
        }
      } else {
        this.$Message.warning('地址无效')
      }
    },
    selectMenu (url) {
      this.$router.push(url)
      // .catch(data => {})
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "stylus/header.styl";
   // 添加导航栏显示动画
  .slide-fade-enter-active ,.slide-fade-leave-active {
    transition: all .8s ease;
  }
  .slide-fade-leave-to ,.slide-fade-enter {
    /* .slide-fade-leave-active for below version 2.1.8 */
    transform: translateY(-70px);
    opacity: 0;
  }
  .avatar-div
    width: auto;
    height: 50px;
    align: center
    text-align: center
    line-height: 50px
    position: relative
    .username
     margin-top 5px
    img.avatar
        position relative
        width 35px
        height 35px
        border-radius 50%
</style>
