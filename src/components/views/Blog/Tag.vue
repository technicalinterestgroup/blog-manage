<template>
  <div class="article-cell" >
    <br>
    <div  class="opreat">
      <iv-form ref="formValidate" >
        <iv-row>
        <iv-col :xs="17" :sm="17" :md="17" :lg="10">
          <iv-form-item  prop="userSummary">
            <iv-input style="width: 90%" v-model="name" placeholder="输入标签..." >
            <iv-button slot="append" icon="ios-search" @click="getCategoryList(name)"></iv-button>
          </iv-input>
          </iv-form-item>
        </iv-col>
        <iv-col :xs="7" :sm="7" :md="7" :lg="14">
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update  ref="mychild" @getCategoryList="getCategoryList"></add-or-update>
    <br>
  </div>
</template>

<script type="text/ecmascript-6">
import AddOrUpdate from './TagAddOrUpdate'
export default {
  components: {
    'addOrUpdate': AddOrUpdate
  },
  // name: 'formValidate',
  data () {
    return {
      name: '',
      columns7: [
        {
          title: '名称',
          key: 'name',
          render: (h, params) => {
            return h('div', [
              h('strong', { style: {
                display: 'inline-block',
                height: '15px'
              }}, params.row.name)
            ])
          }
        },
        {
          title: '文章数',
          key: 'articleNum'
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          align: 'center',
          render: (h, params) => {
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
                    this.show(params.index)
                  }
                }
              }, '查看'),
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
                    this.addOrUpdateHandle(params.index)
                  }
                }
              }, '修改'),
              h('iv-button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
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
    this.getCategoryList()
  },
  methods: {
    getCategoryList (name) {
      this.$axios.get('/admin/tag/list', {
        params: {
          name: name
        }
      }).then(({data}) => {
        if (data.code === '000000') {
          this.data6 = data.data
        } else if (data.code === '000005') {
          this.$Message.warning(data.msg)
          // this.$router.push({path: '/login'})
        } else if (data.code === '000001') {
          this.$Message.warning('没有匹配数据！')
          this.data6 = []
        } else {
          this.$Message.warning(data.msg)
          this.data6 = []
        }
      })
    },
    delCategory (id) {
      this.$axios.get('/admin/tag/del/' + id)
        .then(({data}) => {
          if (data.code === '000000') {
            this.$Message.success(data.msg)
            this.getCategoryList()
          } else {
            this.$Message.warning(data.msg)
          }
        })
    },
    show (index) {
      this.$Modal.info({
        title: '标签详情',
        content: `标签名称：${this.data6[index].name}<br>博客数据：${this.data6[index].articleNum}`
      })
    },
    remove (index) {
      if (this.data6[index].articleNum && this.data6[index].articleNum > 0) {
        this.$Modal.confirm({
          title: '提示信息',
          content: '<p>标签下有已发布博客，确认删该标签吗？</p>',
          onOk: () => {
            this.delCategory(this.data6[index].id)
          },
          onCancel: () => {
            this.getUserInfo()
          }
        })
      } else {
        this.$Modal.confirm({
          title: '提示信息',
          content: '<p>确认删该标签吗？</p>',
          onOk: () => {
            this.delCategory(this.data6[index].id)
          },
          onCancel: () => {
            this.getUserInfo()
          }
        })
      }
    },
    // 新增 / 修改
    addOrUpdateHandle (index) {
      console.log('index' + index)
      this.$refs.mychild.showModal()
      if (index >= 0) {
        console.log('编辑操作')
        this.$nextTick(() => {
          this.$refs.mychild.init(this.data6[index].id, this.data6[index].name)
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
</style>
