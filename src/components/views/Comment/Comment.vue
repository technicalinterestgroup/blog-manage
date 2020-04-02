<template>
  <div class="comment-cell">
    <panel :title="'全部评论'">
      </panel>
      <br>
      <iv-form class='login-con' ref="commentOne" :model="mainform" :rules="rules">
        <iv-form-item prop="" >
             <iv-input type="text" v-model="mainform.articleId" v-if=false>
              </iv-input>
          </iv-form-item>
          <iv-form-item prop="commentContent" >
              <iv-input type="textarea" v-model="mainform.commentContent" placeholder="输入评论内容">
              </iv-input>
          </iv-form-item>
          <iv-form-item>
              <iv-button @click="handleSubmit" type="primary">发布</iv-button>
              <iv-button @click="cancel">取消</iv-button>
          </iv-form-item>
      </iv-form>
      <commentsItem ref="child"
            v-for="(comment,index) in comments"
            :key="comment.id"
            :avatar="comment.avatar"
            :userName="comment.userName"
            :commentContent="comment.commentContent"
            :createTime="comment.createTime"
            :tools="tools"
            :inputFlag="comment.inputFlag"
            :articleId="articleId"
            :id="comment.id"
            :levle="comments.length-index"
            :replys="(replys[comment.id] && replys[comment.id].length > 0)?replys[comment.id]:[]"
            :hasReply="replys[comment.id] && replys[comment.id].length > 0"
            @clickAvatar="handleClickAvatar(comment)"
            @clickAuthor="handleClickAuthor(comment)"
            @addReply="handleAddReply(comment)">
            <!-- <replyItem v-for="reply in replys[comment.id]"
            :key="reply.id" :userName="reply.userName"
            :avatar="reply.avatar"
            :commentContent="reply.commentContent"
            :createTime="reply.createTime"
            :form="form"
            :inputFlag="false"
            @addReply="handleAddReply(comment)">
            </replyItem> -->
            <br>
          </commentsItem>
          <br>
  </div>
</template>

<script type="text/ecmascript-6">
import CommentsItem from '@/components/BhComments/packages/comments-item/src/main'
import ReplyItem from '@/components/BhComments/packages/reply-item/src/main'
import Panel from '@/components/utils/Panel'
export default {
  name: 'Dashboard',
  components: {
    'commentsItem': CommentsItem,
    'replyItem': ReplyItem,
    'panel': Panel
  },
  props: {
    articleId: String
  },
  data () {
    return {
      mainform: {
        commentContent: '',
        articleId: ''
      },
      comments: [],
      replys: {},
      tools: [],
      levle: 0,
      rules: { // 校验表单规则
        commentContent: [ // FormItem标签中的 prop 属性预期值
          { required: true, message: '评论不能为空', trigger: 'click' },
          { type: 'string', max: 200, message: '最多发布200个字符', trigger: 'click' }
        ]
      }
    }
  },
  created () {
    // this.listComments()
    console.log('this.articleId' + this.articleId)
    this.getCommentList(this.articleId)
  },
  watch: {
  },
  methods: {
    handleClickAvatar (item) {
      console.log('点击了头像')
    },
    handleClickAuthor (item) {
      let routeUrl = this.$router.resolve({
        path: '/' + item.userName
      })
      window.open(routeUrl.href, '_blank')
      console.log('点击了用户')
    },
    handleAddReply (item) {
      // item.inputFlag = true
    },
    getCommentList (articleId) {
      this.$axios.get('/view/comment/list/' + articleId, {
      }).then(({data}) => {
        if (data.code === '000000') {
          this.comments = data.data.fristCommnetList
          this.replys = data.data.refCommnet
        } else {
          this.$Message.warning(data.msg)
        }
      })
    },
    handleSubmit () {
      this.$refs.commentOne.validate((valid) => {
        if (valid) {
          this.mainform.articleId = this.articleId
          this.$axios.post('/comment/new', this.mainform).then(({data}) => {
            if (data.code === '000000') {
              this.$Message.success('评论成功')
              this.mainform = {}
              this.getCommentList(this.articleId)
              console.log('comments' + JSON.stringify(this.comments))
            } else if (data.code === '000005') {
              this.$Message.warning(data.msg)
            } else {
              this.$Message.warning(data.msg)
            }
          })
        } else {
          this.$Message.error('评论不能为空!')
        }
      })
    },
    cancel () {
      this.mainform.commentContent = ''
    }
  }

}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/index.styl";

  .comment-cell
    margin-bottom 15px
    .title
      font-size 27px
      line-height 33px
      font-weight 500
      color $color-typegraphy-title
      margin-bottom 23px
</style>
