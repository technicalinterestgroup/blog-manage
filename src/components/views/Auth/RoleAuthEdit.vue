<template>
  <Modal v-model="addApply"  title="菜单选择" :mask-closable="false" @on-ok="ok"
        @on-cancel="cancel">
      <Tree :data="data4" show-checkbox multiple ref="tree"></Tree>
  </Modal>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'roleAaddOrUpdate',
  components: {
  },
  props: {
  },
  data () {
    return {
      addApply: false,
      data4: [],
      roleId: null
    }
  },
  created () {
  },
  methods: {
    getRoleList (roleId, type) {
      this.roleId = roleId
      this.data4 = []
      this.$axios.get('/admin/role/tree', {
        params: {
          roleId: roleId,
          type: type
        }
      }).then(({data}) => {
        if (data.code === '000000') {
          this.data4 = data.data
        } else if (data.code === '000005') {
          this.$Message.warning(data.msg)
          // this.$router.push({path: '/login'})
        } else if (data.code === '000001') {
          this.$Message.warning('没有匹配数据！')
          this.data4 = []
        } else {
          this.$Message.warning(data.msg)
          this.data4 = []
        }
      })
    },
    showModal () {
      this.addApply = true
    },
    ok () {
      let arr = this.mergeTree(this.data4)
      console.log('点击了确定' + JSON.stringify(arr))
      if (!arr || arr.length === 0) {
        this.$Message.warning('没有选择权限！')
        return false
      }
      let param = {}
      param.roleId = this.roleId
      param.roleAuthList = arr
      this.$axios.post('/admin/role/auth/edit', param)
        .then(({data}) => {
          if (data.code === '000000') {
            this.$Message.success(data.msg)
            this.addApply = false
            // this.$emit('getUserList', '')
          } else {
            this.$Message.warning(data.msg)
          }
        })
      this.data4 = []
    },
    cancel () {
      console.log('点击了取消')
      this.addApply = false
      this.data4 = []
    },
    mergeTree (tree = []) {
      let arr = []
      if (!!tree && tree.length !== 0) {
        tree.forEach(item => {
          let obj = {}
          if (item.checked) {
            obj.title = item.title
            obj.roleId = this.roleId
            obj.authId = item.id
            arr.push(obj)
          } else if (item.indeterminate) {
            obj.title = item.title
            obj.roleId = this.roleId
            obj.authId = item.id
            arr.push(obj)
          }
          if (!!item.children && item.children !== 0) {
            let child = this.mergeTree(item.children)
            arr = arr.concat(child)
          }
        })
      }
      return arr
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
    align center
    .opreat
    .tableList
      margin: 10px 10px;
</style>
