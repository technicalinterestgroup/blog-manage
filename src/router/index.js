import Vue from 'vue'
import Router from 'vue-router'
import {LoadingBar} from 'view-design'
import Index from '@/components/index/Index'

// 公共区域
// import CommonHeader from '@/components/header/CommonHeader';
import SimpleHeader from '@/components/header/SimpleHeader/SimpleHeader'
import CommonFooter from '@/components/footer/CommonFooter'
// 首页
// import BlogContent from '@/components/content/BlogContent'

import Login from '@/components/login/Login'
import AdminContent from '@/components/content/AdminContent'
import ArticleContent from '@/components/content/ArticleContent'
import NoticeContent from '@/components/content/NoticeContent'

import AdminIndex from '@/components/views/Admin/AdminIndex'
import Tag from '@/components/views/Blog/Tag'
import BlogTable from '@/components/views/Blog/BlogTable'
import NoticeTable from '@/components/views/Notice/NoticeTable'
import NoticeAddOrUpdate from '@/components/views/Notice/NoticeAddOrUpdate'
import UserTable from '@/components/views/Auth/UserTable'
import RoleTable from '@/components/views/Auth/RoleTable'
import MenuTable from '@/components/views/Auth/MenuTable'
import LogTable from '@/components/views/Log/LogTable'

const [routerPush, routerReplace] = [Router.prototype.push, Router.prototype.replace]
Router.prototype.push = function push (location) {
  return routerPush.call(this, location)
  // .catch(error => error)
}
Router.prototype.replace = function replace (location) {
  return routerReplace.call(this, location)
  // .catch(error => error)
}

Vue.use(Router)

let router = new Router({
  mode: 'history',
  // 测试部署
  base: 'manage',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    // {
    //   path: 'login',
    //   name: 'Login',
    //   components: Login,
    //   meta: {
    //     title: 'VBlog 后台管理系统'
    //   }
    // },
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/',
          name: 'Login',
          components: {
            header: SimpleHeader,
            content: Login,
            footer: CommonFooter
          },
          meta: {
            title: 'VBlog 后台管理系统'
          }
        },
        {
          path: 'admin',
          name: 'admin',
          redirect: 'admin/',
          components: {
            header: SimpleHeader,
            content: AdminContent,
            footer: CommonFooter
          },
          children: [
            {
              path: '/',
              name: 'adminIndex',
              component: AdminIndex,
              meta: {
                title: '首页 | VBlog 后台管理系统'
              }
            },
            {
              path: 'blog',
              name: 'blog',
              component: BlogTable,
              meta: {
                title: '博客列表 | VBlog 后台管理系统'
              }
            },
            {
              path: 'blog/:articleId',
              name: 'blogDetail',
              component: ArticleContent,
              meta: {
                title: '博客详情 | VBlog 后台管理系统'
              }
            },
            {
              path: 'tag',
              name: 'tag',
              component: Tag,
              meta: {
                title: '博客编辑 | VBlog 后台管理系统'
              }
            },
            {
              path: 'user',
              name: 'user',
              component: UserTable,
              meta: {
                title: '用户列表 | VBlog 后台管理系统'
              }
            },
            {
              path: 'role',
              name: 'role',
              component: RoleTable,
              meta: {
                title: '角色列表 | VBlog 后台管理系统'
              }
            },
            {
              path: 'menu',
              name: 'menu',
              component: MenuTable,
              meta: {
                title: '菜单列表 | VBlog 后台管理系统'
              }
            },
            {
              path: 'notice',
              name: 'notice',
              component: NoticeAddOrUpdate,
              meta: {
                title: '发布 | VBlog 后台管理系统'
              }
            },
            {
              path: 'notice/edit/:articleId',
              name: 'noticeEdit',
              component: NoticeAddOrUpdate,
              meta: {
                title: '编辑 | VBlog 后台管理系统'
              }
            },
            {
              path: 'noticelist',
              name: 'noticeList',
              component: NoticeTable,
              meta: {
                title: '通知列表 | VBlog 后台管理系统'
              }
            },
            {
              path: 'notice/:articleId',
              name: 'noticeDetail',
              component: NoticeContent,
              meta: {
                title: '通知列表 | VBlog 后台管理系统'
              }
            },
            {
              path: 'log',
              name: 'log',
              component: LogTable,
              meta: {
                title: '日志记录 | VBlog 后台管理系统'
              }
            }
          ]
        }
      ]
    }
  ]
})

// 配置加载进度条
LoadingBar.config({
  color: '#5cb85c',
  failedColor: '#f0ad4e',
  height: 2
})

router.beforeEach((to, from, next) => {
  LoadingBar.start()
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

router.afterEach((to, from, next) => {
  LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
