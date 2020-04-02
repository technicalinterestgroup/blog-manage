<template>
  <div class="article-cell" >
    <br>
    <div  class="opreat">
      <iv-form ref="formValidate" v-model="queryParam">
        <iv-row>
        <iv-col :xs="17" :sm="17" :md="17" :lg="7">
          <iv-form-item >
            <iv-input style="width: 90%" v-model="queryParam.userName" placeholder="角色名..." >
            <iv-button slot="append" icon="ios-search" @click="getUserList(queryParam)"></iv-button>
          </iv-input>
          </iv-form-item>
        </iv-col>
        <iv-col :xs="7" :sm="7" :md="7" :lg="17">
          <iv-form-item>
            <iv-button type="primary" @click="addOrUpdateHandle()">新增</iv-button>
          </iv-form-item>
        </iv-col>
       </iv-row>
      </iv-form>
    </div>
    <div  class="tableList">
       <iv-table border :columns="columns7" :data="data6"></iv-table>
    </div>
    <div style="margin: 10px 10px 10px 10px;overflow: hidden">
        <div style="float: right;margin: 10px 10px 10px 10px;">
          <Page :total="totalCount" :page-size="pageParam.pageSize" @on-change="changepage" show-elevator show-total></Page>
        </div>
    </div>
     <!-- 弹窗, 新增 / 修改 -->
    <add-or-update  ref="mychild" @getUserList="getUserList"></add-or-update>
    <roleAuthEdit  ref="roleAuthEdit" @getUserList="getUserList"></roleAuthEdit>
    <br>
  </div>
</template>

<script type="text/ecmascript-6">
import merge from 'lodash/merge' // 合并对象工具
import AddOrUpdate from './RoleAddOrUpdate'
import RoleAuthEdit from './RoleAuthEdit'
export default {
  components: {
    'addOrUpdate': AddOrUpdate,
    'roleAuthEdit': RoleAuthEdit
  },
  // name: 'formValidate',
  data () {
    return {
      queryParam: {
        userName: ''
      },
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      totalCount: 0,
      columns7: [
        {
          title: '角色名',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('strong', params.row.name)
            ])
          }
        },
        {
          title: '角色类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const color = row.type === 1 ? '#7AF28C' : '#FCB80B'
            const text = row.type === 1 ? '管理员' : '普通用户'
            return h('iv-tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '用户数',
          key: 'userNum',
          align: 'center'
        },
        {
          title: '添加时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h('iv-button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    row.state = row.state === 1 ? 0 : 1
                    this.roleAuthEdit(row)
                  }
                }
              }, '权限'),
              h('iv-button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data6: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    getUserList (param) {
      let params = merge(param, this.pageParam)
      this.$axios.get('/admin/role/list', {
        params
      }).then(({data}) => {
        if (data.code === '000000') {
          this.data6 = data.data
          this.totalCount = data.data.totalCount
        } else if (data.code === '000005') {
          this.$Message.warning(data.msg)
          // this.$router.push({path: '/login'})
        } else if (data.code === '000001') {
          this.$Message.warning('没有匹配数据！')
          this.data6 = []
          this.totalCount = 0
        } else {
          this.$Message.warning(data.msg)
          this.data6 = []
          this.totalCount = 0
        }
      })
    },
    show (data) {
      this.$router.push({name: 'blogDetail', params: {articleId: data.id}})
    },
    // 修改
    update (data) {
      this.$axios.post('/admin/role/edit', data)
        .then(({data}) => {
          if (data.code === '000000') {
            this.$Message.success(data.msg)
            this.getUserList()
          } else {
            this.$Message.warning(data.msg)
          }
        })
    },
    changepage (index) {
      // var _start = (index - 1) * this.pageParam.pageSize
      // var _end = index * this.pageParam.pageSize
      // this.historyData = this.ajaxHistoryData.slice(_start, _end)
      this.pageParam.currentPage = index
      this.getUserList(null)
    },
    // 新增 / 修改
    addOrUpdateHandle (row) {
      console.log('row' + row)
      this.$refs.mychild.showModal()
      if (row) {
        console.log('编辑操作')
        this.$nextTick(() => {
          this.$refs.mychild.init(row.id, row.name, row.type)
        })
      }
    },
    // 权限编辑
    roleAuthEdit (row) {
      console.log('row' + row)
      this.$refs.roleAuthEdit.showModal()
      if (row) {
        console.log('编辑操作')
        this.$nextTick(() => {
          this.$refs.roleAuthEdit.getRoleList(row.id, row.type)
        })
      }
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
    .footer
      margin: 10px 10px;
</style>
