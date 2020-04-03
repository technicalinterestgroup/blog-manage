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
        userName: null
      },
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      totalCount: 0,
      columns7: [
        {
          title: '用户',
          key: 'userName',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('strong', { style: {
                display: 'inline-block',
                height: '15px'
              }}, params.row.userName)
            ])
          }
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  height: '15px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.operation
                }
              }, params.row.operation)
            ])
          }
        },
        {
          title: 'ip',
          key: 'ip',
          align: 'center'
        },
        {
          title: '参数',
          key: 'params',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  height: '15px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.params
                }
              }, params.row.params)
            ])
          }
        },
        {
          title: '结果',
          key: 'result',
          align: 'center'
        },
        {
          title: '请求时间',
          key: 'createTime',
          align: 'center',
          width: 170
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
      this.$axios.get('/admin/list/log', {
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
      this.$router.push({name: 'blogDetail', params: {articleId: data.id}})
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
