<template>
  <Modal v-model="addApply"  title="新增角色" :mask-closable="false" @on-ok="ok"
        @on-cancel="cancel">
      <iv-form ref="formValidate" :model="role" :rules="ruleValidate">
         <iv-form-item label="角色类型:">
            <iv-radio-group v-model="role.type">
              <iv-radio :label="1" >管理员</iv-radio>
              <iv-radio :label="2">普通用户</iv-radio>
            </iv-radio-group>
          </iv-form-item>
         <iv-form-item  prop="name" label="角色名">
            <iv-input style="width:200px"  v-model="role.name" placeholder="输入角色名..." >
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
  name: 'roleAaddOrUpdate',
  components: {
  },
  props: {
  },
  data () {
    return {
      addApply: false,
      role: {
        id: null,
        name: '',
        type: 2
      },
      ruleValidate: {
        name: [
          { required: true, message: '标签名不能为空', trigger: 'blur' },
          { type: 'string', max: 10, message: '标签名不能为空不能多于10字', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    init (id, name, type) {
      this.role.id = id
      this.role.name = name
      this.role.type = type
    },
    showModal () {
      this.addApply = true
    },
    ok () {
      console.log('点击了确定')
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$axios.post('/admin/role/new', this.role)
            .then(({data}) => {
              if (data.code === '000000') {
                this.$Message.success(data.msg)
                this.role.name = ''
                this.addApply = false
                this.$emit('getUserList', '')
              } else {
                this.$Message.warning(data.msg)
              }
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
      this.role.name = ''
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
