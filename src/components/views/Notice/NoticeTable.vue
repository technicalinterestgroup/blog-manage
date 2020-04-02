<template>
  <div class="article-cell" >
    <br>
    <div  class="opreat">
      <iv-form ref="formValidate" >
        <iv-row>
        <iv-col :xs="17" :sm="17" :md="17" :lg="10">
          <iv-form-item  prop="userSummary">
            <iv-input style="width: 90%" v-model="name" placeholder="输入文章名..." >
            <iv-button slot="append" icon="ios-search" @click="getCategoryList(name)"></iv-button>
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
      name: '',
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      totalCount: 0,
      columns7: [
        {
          title: '文章名',
          key: 'title',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('strong', params.row.title)
            ])
          }
        },
        {
          title: '类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.type === 2 ? '首页' : '博客页'
            return h('div', text)
          }
        },
        {
          title: '文章发布状态',
          key: 'state',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const color = row.state ? '#7AF28C' : '#FCB80B'
            const text = row.state ? '已发布' : '草稿'
            return h('iv-tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '是否轮播',
          key: 'isIndex',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const color = row.isIndex ? '#7AF28C' : '#FD512F'
            const text = row.isIndex ? '轮播' : '停止'
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
          width: 320,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const state = row.state ? '撤销' : '发布'
            const isIndex = row.isIndex ? '取消' : '轮播'
            return h('div', [
              h('iv-button', {
                props: {
                  type: 'info',
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
                  type: 'dashed',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    row.isIndex = !row.isIndex
                    this.update(row)
                  }
                }
              }, isIndex),
              h('iv-button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    row.state = !row.state
                    row.isIndex = row.state ? row.isIndex : false
                    this.update(row)
                  }
                }
              }, state),
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
                    this.addOrUpdateHandle(params.row)
                  }
                }
              }, '编辑'),
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
    this.getWebsiteList(name)
  },
  methods: {
    getWebsiteList (param) {
      let params = merge(param, this.pageParam)
      this.$axios.get('/admin/website/list', {
        params
      }).then(({data}) => {
        if (data.code === '000000') {
          this.data6 = data.data.pageData
          this.totalCount = data.data.totalCount
        } else if (data.code === '000005') {
          this.$Message.warning(data.msg)
          // this.$router.push({path: '/login'})
        } else {
          this.$Message.warning(data.msg)
        }
      })
    },
    delCategory (id) {
      this.$axios.get('/admin/website/del/' + id)
        .then(({data}) => {
          if (data.code === '000000') {
            this.$Message.success(data.msg)
            this.getCategoryList()
          } else {
            this.$Message.warning(data.msg)
          }
        })
    },
    show (data) {
      this.$router.push({name: 'noticeDetail', params: {articleId: data.id}})
    },
    addOrUpdateHandle (data) {
      this.$router.push({name: 'noticeEdit', params: {articleId: data.id}})
    },
    remove (data) {
      this.$Modal.confirm({
        title: '提示信息',
        content: '<p>确定删除该通告吗？</p>',
        onOk: () => {
          this.delCategory(data.id)
        },
        onCancel: () => {
          this.getUserInfo()
        }
      })
    },
    // 修改
    update (data) {
      this.$axios.post('/admin/website/new', data)
        .then(({data}) => {
          if (data.code === '000000') {
            this.$Message.success(data.msg)
            this.getCategoryList()
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
      this.getCategoryList(null)
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
