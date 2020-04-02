<template>
  <Modal  v-model="addApply"  title="新增分类" :mask-closable="false" @on-ok="ok"
        @on-cancel="cancel">
      <iv-form ref="formValidate" :model="category" :rules="ruleValidate">
         <iv-form-item  prop="name" label="分类名：">
            <iv-input style="width:200px"  v-model="category.name" placeholder="输入分类..." >
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
  name: 'addOrUpdate',
  components: {
  },
  props: {
  },
  data () {
    return {
      addApply: false,
      category: {
        id: 0,
        name: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '分类名不能为空', trigger: 'blur' },
          { type: 'string', max: 10, message: '分类名不能为空不能多于10字', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    init (id, name) {
      this.category.id = id
      this.category.name = name
    },
    showModal () {
      this.addApply = true
    },
    ok () {
      console.log('点击了确定')
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.$axios.post('/category/new', this.category)
            .then(({data}) => {
              if (data.code === '000000') {
                this.$Message.success(data.msg)
                this.category.name = ''
                this.addApply = false
                this.$emit('categoryList', '')
              } else {
                this.$Message.warning(data.msg)
              }
            })
        } else {
          this.$Message.error('分类名不能为空!')
        }
      })
    },
    cancel () {
      console.log('点击了取消')
      // this.$parent.cancle()
      this.addApply = false
      this.category.name = ''
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
