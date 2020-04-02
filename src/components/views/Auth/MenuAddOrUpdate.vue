<template>
  <Modal v-model="addApply"  title="父级菜单" :mask-closable="false" @on-ok="ok"
        @on-cancel="cancel">
      <iv-form ref="formValidate" :model="menu" :rules="ruleValidate">
         <iv-form-item label="菜单类型:">
            <iv-radio-group v-model="menu.type">
              <iv-radio :label="1" >后台</iv-radio>
              <iv-radio :label="2">前台</iv-radio>
            </iv-radio-group>
          </iv-form-item>
         <iv-form-item  prop="name" label="名称">
            <iv-input style="width:200px"  v-model="menu.name" placeholder="菜单名..." >
          </iv-input>
          </iv-form-item>
         <iv-form-item  prop="url" label="链接">
            <iv-input style="width:200px"  v-model="menu.url" placeholder="链接..." >
         </iv-input>
         </iv-form-item>
          <iv-form-item  prop="icon" label="图标">
            <iv-input style="width:200px"  v-model="menu.icon" placeholder="图标..." >
         </iv-input>
        </iv-form-item>
        <!-- <div slot="footer">
           <iv-button type="ghost" @click="cancle()">取消</iv-button>
           <iv-button type="primary" @click="handleSubmit()">确定</iv-button>
        </div> -->
      </iv-form>
  </Modal>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'menuAaddOrUpdate',
  components: {
  },
  props: {
  },
  data () {
    return {
      addApply: false,
      menu: {
        id: null,
        name: '',
        type: 2,
        url: null,
        icon: null
      },
      ruleValidate: {
        name: [
          { required: true, message: '菜单名不能为空', trigger: 'blur' },
          { type: 'string', max: 10, message: '菜单名不能多于10字', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '链接不能为空', trigger: 'blur' },
          { type: 'string', max: 10, message: '链接不能多于10字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    init (param) {
      this.menu.id = param.id
      this.menu.name = param.name
      this.menu.type = param.type
      this.menu.icon = param.icon
      this.menu.url = param.url
    },
    showModal () {
      this.addApply = true
    },
    ok () {
      console.log('点击了确定')
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$axios.post('/admin/auth/menu/new', this.menu)
            .then(({data}) => {
              if (data.code === '000000') {
                this.$Message.success(data.msg)
                this.addApply = false
                this.$emit('getMenuList', '')
              } else {
                this.$Message.warning(data.msg)
              }
              this.menu = {}
            })
        } else {
          this.$Message.error('标签名不能为空!')
        }
      })
    },
    cancel () {
      console.log('点击了取消')
      // this.$parent.cancle()
      this.addApply = false
      this.menu.name = ''
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
