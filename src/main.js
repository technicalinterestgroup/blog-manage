import Vue from 'vue'
import router from '@/router'
import store from '@/store'
// import 'iview/dist/styles/iview.css'
import 'view-design/dist/styles/iview.css'
import '@/common/stylus/index.styl'
import App from './App.vue'
import httpRequest from '@/utils/httpRequest'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import ImageCropper from 'vue-image-crop-upload'
// iView UI 组件引入
import {
  Row,
  Col,
  Button,
  Progress,
  Tag,
  Icon,
  Affix,
  Rate,
  Modal,
  Message,
  Notice,
  Card,
  Form,
  Input,
  FormItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Badge,
  Carousel,
  CarouselItem,
  Menu,
  MenuGroup,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Option,
  Table,
  Switch,
  Submenu,
  Page,
  Upload,
  Tree
} from 'view-design'
// use
Vue.use(mavonEditor)
Vue.use(ImageCropper)
// 引用axios，并设置基础URL为后端服务api地址
var axios = require('axios')
axios.defaults.baseURL = '/vblog'
// 将API方法绑定到全局
Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.component('iv-row', Row)
Vue.component('iv-col', Col)
Vue.component('iv-button', Button)
Vue.component('iv-progress', Progress)
Vue.component('iv-tag', Tag)
Vue.component('iv-icon', Icon)
Vue.component('iv-affix', Affix)
Vue.component('iv-rate', Rate)
Vue.component('iv-card', Card)
Vue.component('iv-form', Form)
Vue.component('iv-input', Input)
Vue.component('iv-form-item', FormItem)
Vue.component('Modal', Modal)
Vue.component('iv-dropdown', Dropdown)
Vue.component('iv-dropdownMenu', DropdownMenu)
Vue.component('iv-dropdownItem', DropdownItem)
Vue.component('iv-badge', Badge)
Vue.component('iv-carousel', Carousel)
Vue.component('iv-carousel-item', CarouselItem)
Vue.component('iv-menu', Menu)
Vue.component('iv-menu-group', MenuGroup)
Vue.component('iv-menu-item', MenuItem)
Vue.component('iv-radio', Radio)
Vue.component('iv-radio-group', RadioGroup)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('iv-table', Table)
Vue.component('iv-switch', Switch)
Vue.component('Submenu', Submenu)
Vue.component('Page', Page)
Vue.component('iv-upload', Upload)
Vue.component('Tree', Tree)
Vue.prototype.$http = httpRequest // Ajax 请求方法
Vue.prototype.$Modal = Modal
Vue.prototype.$Message = Message
Vue.prototype.$Notice = Notice
Vue.prototype.$loadScript = (script, url, callback) => {
  script = script || document.createElement('script')
  if (script.readyState) {
    // IE浏览器
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null
        callback()
      }
    }
  } else {
    // 其他浏览器
    script.onload = function () {
      callback()
    }
  }
  script.src = url
  document.getElementsByTagName('head')[0].appendChild(script)
}
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})

Vue.prototype.$Notice.config({
  top: 70,
  duration: 3
})
let vm = new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})

Vue.use({
  vm
})

// 异步请求前在header里加入token
axios.interceptors.request.use(
  config => {
    // console.log('判断是否要携带token')
    if (config.url.indexOf('/view/') === 0) { // view开头的url，则不需要携带header里面的token
    //   // console.log('不需要携带token的url' + config.url)
    } else {
      console.log('需要携带token的url')
      if (localStorage.getItem('accessToken') && localStorage.getItem('adminInfo')) {
        config.headers.accessToken = localStorage.getItem('accessToken')
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  })
// 异步请求后，判断token是否过期
axios.interceptors.response.use(
  response => {
    // console.log('response' + JSON.stringify(response.data))
    if (response.data.code === '000004') {
      router.push('/')
    } else if (response.data.code === '000005') {
      console.log('登录超时------')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
      router.push('/')
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userInfo')
          router.push('/')
      }
    }
  }
)
// 异步请求前判断请求的连接是否需要token
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    console.log('进入判断: ' + to.path)
    next()
  } else {
    let token = localStorage.getItem('accessToken')
    console.log('我是浏览器本地缓存的token: ' + token)
    if (token === 'null' || token === '') {
      next('/')
    } else {
      next()
    }
  }
})
