<template>
    <!-- <iv-row>
        <iv-col span="8"> -->
            <iv-menu :theme="theme2">
                <iv-menu-item name="0">首页</iv-menu-item>
                <Submenu name="1">
                    <template slot="title">
                        <iv-icon type="ios-paper" />
                        博客管理
                    </template>
                    <iv-menu-item name="1-1" @click.native="jump2Page('blog')">文章管理</iv-menu-item>
                    <iv-menu-item name="1-2" @click.native="jump2Page('tag')">标签管理</iv-menu-item>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <iv-icon type="ios-cog" />
                        权限管理
                    </template>
                    <iv-menu-item name="2-1" @click.native="jump2Page('user')">用户列表</iv-menu-item>
                    <iv-menu-item name="2-2"  @click.native="jump2Page('role')">角色列表</iv-menu-item>
                    <iv-menu-item name="2-3"  @click.native="jump2Page('menu')">菜单列表</iv-menu-item>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <iv-icon type="ios-mail-open" />
                        通告管理
                    </template>
                    <iv-menu-item name="3-1" @click.native="jump2Page('notice')">发布通知</iv-menu-item>
                    <iv-menu-item name="3-2" @click.native="jump2Page('noticeList')">通知列表</iv-menu-item>
                </Submenu>
                <Submenu name="4">
                    <template slot="title">
                        <iv-icon type="ios-people" />
                        日志管理
                    </template>
                    <iv-menu-item name="4-1" @click.native="jump2Page('log')">日志记录</iv-menu-item>
                </Submenu>
                <Submenu name="5">
                    <template slot="title">
                        <iv-icon type="ios-lock" />
                        账号管理
                    </template>
                    <iv-menu-item name="5-1">修改密码</iv-menu-item>
                </Submenu>
            </iv-menu>
        <!-- </iv-col>
    </iv-row> -->
    <!-- <RadioGroup v-model="theme2">
        <Radio label="light"></Radio>
        <Radio label="dark"></Radio>
    </RadioGroup> -->
</template>
<script>
export default {
  data () {
    return {
      theme2: 'light'
    }
  },
  methods: {
    jump2Page (routeName) {
      console.log('跳转')
      this.$router.push({
        name: routeName
      })
      // .catch(data => {})
    }
  }
}
</script>
