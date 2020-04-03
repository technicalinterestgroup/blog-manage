<template>
  <div class="article-cell" >
    <br>
    <div  class="opreat">
      <iv-form ref="formValidate" v-model="queryParam">
        <iv-row>
        <iv-col :xs="17" :sm="17" :md="17" :lg="10">
          <iv-form-item >
            <iv-input style="width: 200px" v-model="queryParam.userName" placeholder="用户名..." >
            <iv-button slot="append" icon="ios-search" @click="getUserList(queryParam)"></iv-button>
          </iv-input>
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
    <br>
      <Modal
        v-model="modal1"
        title="用户详情">
        <p>用户名：{{info.userName}}</p>
        <p>上传次数：{{info.uploadNum}} 次</p>
        <p>剩余上传次数：{{info.over}} 次</p>
    </Modal>

     <Modal
        @on-ok="ok(info.userName,uploadNum)"
        v-model="modal2"
        title="次数充值">
        <p>用户名：{{info.userName}}</p>
        <p>剩余上传次数：{{info.over}} 次</p>
        <p>充值次数：<iv-input type="number" v-model="uploadNum" style="width:100px"></iv-input></p>
    </Modal>
  </div>

</template>

<script type="text/ecmascript-6">
import merge from 'lodash/merge' // 合并对象工具
export default {
  components: {
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
      modal1: false,
      modal2: false,
      info: {
        userName: null,
        uploadNum: 0,
        over: 0
      },
      uploadNum: 0,
      columns7: [
        {
          title: '用户名',
          key: 'userName',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', { style: {
                display: 'inline-block',
                height: '15px'
              }}, params.row.userName)
            ])
          }
        },
        {
          title: '昵称',
          key: 'nickName',
          align: 'center'
        },
        {
          title: '上传次数',
          key: 'uploadNum',
          align: 'center'
        },
        {
          title: '角色',
          key: 'roleName',
          align: 'center'
        },
        {
          title: '注册时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '状态',
          key: 'state',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const color = row.state === 1 ? '#7AF28C' : '#FCB80B'
            const text = row.state === 1 ? '启用' : '禁用'
            return h('iv-tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const state = row.state === 1 ? '禁用' : '启用'
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
                    this.update(row)
                  }
                }
              }, state),
              h('iv-button', {
                props: {
                  type: 'dashed',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.show(params.row)
                  }
                }
              }, '详情'),
              h('iv-button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.show2(params.row)
                  }
                }
              }, '充值')
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
      this.$axios.get('/admin/auth/user/list', {
        params
      }).then(({data}) => {
        if (data.code === '000000') {
          this.data6 = data.data.pageData
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
      this.info = data
      this.$axios.get('/admin/auth//user/uploadtime/' + data.userName)
        .then(({data}) => {
          if (data.code === '000000') {
            this.info.over = data.data
            this.modal1 = true
          } else {
            this.$Message.warning(data.msg)
          }
        })
    },
    show2 (data) {
      this.info = data
      this.$axios.get('/admin/auth//user/uploadtime/' + data.userName)
        .then(({data}) => {
          if (data.code === '000000') {
            this.info.over = data.data
            this.modal2 = true
          } else {
            this.$Message.warning(data.msg)
          }
        })
    },
    // 修改
    update (data) {
      this.$axios.post('/admin/auth/user/edit', data)
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
    ok (userName, uploadNum) {
      this.$axios.get('/admin/auth/user/addupload/' + userName, {
        params: {
          uploadNum: uploadNum
        }
      })
        .then(({data}) => {
          if (data.code === '000000') {
            this.$Message.success('充值成功')
            this.getUserList()
          } else {
            this.$Message.warning(data.msg)
          }
        })
    },
    cancel () {
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
