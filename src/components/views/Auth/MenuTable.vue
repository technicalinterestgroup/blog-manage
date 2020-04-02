<template>
  <div class="article-cell" >
    <br>
    <div  class="opreat">
      <iv-form ref="formValidate" v-model="queryParam">
        <iv-row>
        <iv-col :xs="17" :sm="17" :md="17" :lg="6">
            <iv-form-item label='菜单名'>
              <iv-input style="width:75%" v-model="queryParam.name" placeholder="菜单名..." >
            </iv-input>
            </iv-form-item>
          </iv-col>
          <iv-col :xs="17" :sm="17" :md="17" :lg="6">
            <iv-form-item label='链接'>
              <iv-input style="width: 75%" v-model="queryParam.url" placeholder="链接..." >
              </iv-input>
            </iv-form-item>
          </iv-col>
          <iv-col :xs="17" :sm="17" :md="17" :lg="6">
            <iv-form-item label='类型'>
              <Select v-model="queryParam.type" clearable  style="width: 75%">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </iv-form-item>
          </iv-col>
          <iv-col :xs="17" :sm="17" :md="17" :lg="6">
            <iv-button  type="primary" @click="getMenuList(queryParam)">查询</iv-button>
            <iv-button  type="primary" @click="addOrUpdateHandle()">新增</iv-button>
          </iv-col>
       </iv-row>
      </iv-form>
    </div>
    <div  class="tableList">
       <iv-table row-key="id"  :columns="columns16" :data="data13" border></iv-table>
    </div>
    <div style="margin: 10px 10px 10px 10px;overflow: hidden">
        <div style="float: right;margin: 10px 10px 10px 10px;">
          <Page :total="totalCount" :page-size="pageParam.pageSize" @on-change="changepage" show-elevator show-total></Page>
        </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
     <menuAddOrUpdate  ref="mychild" @getMenuList="getMenuList"></menuAddOrUpdate>
     <childMenuAddOrUpdate ref="childMenu" @getMenuList="getMenuList"></childMenuAddOrUpdate>
    <br>
  </div>
</template>

<script type="text/ecmascript-6">
import merge from 'lodash/merge' // 合并对象工具
import MenuAddOrUpdate from './MenuAddOrUpdate'
import ChildMenuAddOrUpdate from './ChildMenuAddOrUpdate'
export default {
  components: {
    'menuAddOrUpdate': MenuAddOrUpdate,
    'childMenuAddOrUpdate': ChildMenuAddOrUpdate
  },
  // name: 'formValidate',
  data () {
    return {
      queryParam: {
        name: null,
        tyep: null,
        url: null
      },
      pageParam: {
        currentPage: 1,
        pageSize: 10
      },
      totalCount: 0,
      typeList: [
        {
          value: '1',
          label: '后台'
        },
        {
          value: '2',
          label: '前台'
        }
      ],
      columns16: [
        {
          title: '菜单名称',
          key: 'name',
          tree: true
        },
        {
          title: '链接',
          key: 'url',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', { style: {
                display: 'inline-block',
                height: '15px'
              }}, params.row.url)
            ])
          }
        },
        {
          title: '图标',
          key: 'icon',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h('iv-icon', {
                props: {
                  type: row.icon
                }
              })
            ])
          }
        },
        {
          title: '类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            const row = params.row
            const text = row.type === 1 ? '后台' : '前台'
            return h('div', text)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 220,
          align: 'center',
          render: (h, params) => {
            const row = params.row
            // const state = row.state === 1 ? '禁用' : '启用'
            if (row.isParent) {
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
                      this.addOrUpdateChildHandle(1, row)
                    }
                  }
                }, '+ 子菜单'),
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
                      this.addOrUpdateHandle(row)
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
                      this.remove(row)
                    }
                  }
                }, '删除')
              ])
            } else {
              return h('div', [
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
                      this.addOrUpdateChildHandle(2, row)
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
        }
      ],
      data13: []
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    getMenuList (param) {
      let params = merge(param, this.pageParam)
      this.$axios.get('/admin/auth/menu/list', {
        params
      }).then(({data}) => {
        if (data.code === '000000') {
          this.data13 = data.data.pageData
          this.totalCount = data.data.totalCount
        } else if (data.code === '000005') {
          this.$Message.warning(data.msg)
        } else if (data.code === '000001') {
          this.$Message.warning('没有匹配数据！')
          this.data13 = []
          this.totalCount = 0
        } else {
          this.$Message.warning(data.msg)
          this.data13 = []
          this.totalCount = 0
        }
      })
    },
    show (data) {
      this.$router.push({name: 'blogDetail', params: {articleId: data.id}})
    },
    // 删除
    remove (data) {
      this.$axios.get('/admin/auth/menu/del/' + data.id)
        .then(({data}) => {
          if (data.code === '000000') {
            this.$Message.success(data.msg)
            this.getMenuList()
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
      this.getMenuList(null)
    },
    addOrUpdateHandle (row) {
      console.log('row' + row)
      this.$refs.mychild.showModal()
      if (row) {
        console.log('父菜单编辑操作')
        this.$nextTick(() => {
          this.$refs.mychild.init(row)
        })
      }
    },
    addOrUpdateChildHandle (type, row) {
      console.log('row' + row)
      this.$refs.childMenu.showModal()
      if (type === 1 && row) {
        console.log('新增操作')
        this.$nextTick(() => {
          this.$refs.childMenu.init(row)
        })
      }
      if (type === 2 && row) {
        console.log('编辑操作')
        this.$nextTick(() => {
          this.$refs.childMenu.editInit(row)
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
