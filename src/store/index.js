import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common
  },
  state: {
    // 存储token
    accessToken: localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : '',
    userInfo: localStorage.getItem('userInfo') ? localStorage.getItem('userInfo') : ''
  },
  /* actions: {
   changeLogin(ctx,Authorization){
     ctx.commit('changeLogin',Authorization);
   }
 }, */
  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin (state, user) {
      state.accessToken = user.accessToken
      // console.log('store/index.js---到这里了!' + JSON.stringify(user))
      localStorage.setItem('accessToken', user.accessToken)
      localStorage.setItem('userInfo', JSON.stringify(user.userInfo))
    }
  }
})
