<template>
  <div class="article-cell" >
    <br>
    <div  class="opreat">
      <iv-form ref="formValidate" v-model="queryParam">
        <iv-row>
        <iv-col :xs="17" :sm="17" :md="17" :lg="8">
            <iv-form-item label='文章名'>
              <iv-input style="width: 150px" v-model="queryParam.keywords" placeholder="文章名..." >
            </iv-input>
            </iv-form-item>
          </iv-col>
          <iv-col :xs="17" :sm="17" :md="17" :lg="8">
            <iv-form-item label='作者'>
              <iv-input style="width: 150px" v-model="queryParam.userName" placeholder="作者..." >
              </iv-input>
            </iv-form-item>
          </iv-col>
          <iv-col :xs="17" :sm="17" :md="17" :lg="8">
            <iv-button  type="primary" @click="getWebsiteList(queryParam)">查询</iv-button>
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
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      totalCount: 0,
      queryParam: {},
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
          title: '作者',
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
          title: '标签',
          key: 'tagCN',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', { style: {
                display: 'inline-block',
                height: '15px'
              }}, params.row.tagCN)
            ])
          }
        },
        {
          title: '时间',
          key: 'createTime',
          align: 'center'
        },
        // {
        //   title: '文章发布状态',
        //   key: 'state',
        //   align: 'center',
        //   render: (h, params) => {
        //     const row = params.row
        //     const color = row.state === 1 ? 'green' : '#FCB80B'
        //     const text = row.state === 1 ? '已发布' : '草稿'
        //     return h('iv-tag', {
        //       props: {
        //         type: 'dot',
        //         color: color
        //       }
        //     }, text)
        //   }
        // },
        {
          title: '设置推荐',
          key: 'isTop',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const color = row.isRecommend === 1 ? '#7AF28C' : '#FCB80B'
            const text = row.isRecommend === 1 ? 'Yes' : 'No'
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
            const state = row.isRecommend === 1 ? '撤销' : '推荐'
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
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    row.recommend = row.isRecommend === 1 ? 0 : 1
                    this.update(row)
                  }
                }
              }, state),
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
    this.getWebsiteList()
  },
  methods: {
    getWebsiteList (param) {
      let params = merge(param, this.pageParam)
      this.$axios.get('/admin/article/blog/list', {
        params
      }).then(({data}) => {
        if (data.code === '000000') {
          this.data6 = data.data.pageData
          this.totalCount = data.data.totalCount
        } else if (data.code === '000005') {
          this.$Message.warning(data.msg)
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
    delCategory (id) {
      this.$axios.get('/website/del/' + id)
        .then(({data}) => {
          if (data.code === '000000') {
            this.$Message.success(data.msg)
            this.getWebsiteList()
          } else {
            this.$Message.warning(data.msg)
          }
        })
    },
    show (data) {
      this.$router.push({name: 'blogDetail', params: {articleId: data.id}})
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
      this.$axios.post('/admin/article/edit', data)
        .then(({data}) => {
          if (data.code === '000000') {
            this.$Message.success(data.msg)
            this.getWebsiteList()
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
      this.getWebsiteList(null)
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
