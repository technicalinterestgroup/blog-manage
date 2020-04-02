<template>
  <div class="comments-item">
    <div class="pull-left">
      <img class="avatar-32" :src="avatar" alt="" v-if="avatar" @click="handleClickAvatar">
    </div>
    <div class="comments-box">
      <div class="comments-trigger">
        <!-- <div class="pull-right comments-option">
          <a href="javascript:void(0)" class="ml10" data-placement="top" :title="item.title" v-for="item in tools" :key="item.name" @click="handleClickTool($event, item)">
            <i :class="item.icon" v-if="item.icon"></i>
            <span v-if="item.text">{{item.text}}</span>
          </a>
        </div> -->
        <span class="comments-date"> {{levle}} 楼</span>
        <strong><a href="javascript:void(0)" @click="handleClickAuthor"><iv-icon type="person" ></iv-icon> {{userName}}</a></strong>
        <span class="comments-date">&nbsp;&nbsp; <iv-icon type="edit"></iv-icon> {{createTime | filterTime}}</span>
      </div>
      <div class="comments-content">
        <p>{{commentContent}}</p>
      </div>
      <p class="comments-ops">
        <span class="coments-ops-item ml15" v-for="item in ops" :key="item.name" :v-if="item.name">
          <i :class="item.icon + ' coments-ops-icon'" v-if="item.icon"></i>
          <span class="coments-ops-text">{{item.name}}</span>
        </span>
        <span class="comments-reply-btn ml15" @click="handleAddReply"><iv-icon type="chatbox"></iv-icon> 回复</span>
      </p>
      <div class="reply-list" v-show="hasReply">
        <replyItem v-for="reply in replys"
            :key="reply.id" :userName="reply.userName"
            :avatar="reply.avatar"
            :commentContent="reply.commentContent"
            :createTime="reply.createTime"
            :inputFlag="false"
            @saveReply="saveReplyComment">
            </replyItem>
        <div class="reply-item reply-item--ops">
          <a class="reply-inner-btn" href="javascript:void(0);" @click="handleAddReply"><iv-icon type="chatbox"></iv-icon> 添加新评论</a>
        </div>
      </div>
      <br>
       <iv-form class='login-con' ref="commentOne" :model="form" :rules="rules" v-if=inputFlag>
          <iv-form-item prop="commentContent">
              <iv-input type="textarea" v-model="form.commentContent" placeholder="输入评论内容">
              </iv-input>
          </iv-form-item>
          <iv-form-item>
               <iv-button @click="handleSubmit" type="primary">发布</iv-button>
               <iv-button @click="cancel">取消</iv-button>
          </iv-form-item>
      </iv-form>
    </div>
  </div>
</template>

<script>
import ReplyItem from '@/components/BhComments/packages/reply-item/src/main'
export default {
  name: 'CommentsItem',
  components: {
    'replyItem': ReplyItem
  },
  props: {
    avatar: String,
    userName: String,
    commentContent: String,
    ops: Array,
    tools: Array,
    createTime: [String, Number],
    hasReply: Boolean,
    // inputFlag: Boolean,
    replys: Array,
    articleId: String,
    id: Number,
    levle: Number

  },
  data () {
    return {
      inputFlag: false,
      form: {
        commentContent: '',
        articleId: '',
        parentId: ''
      },
      rules: { // 校验表单规则
        commentContent: [ // FormItem标签中的 prop 属性预期值
          { required: true, message: '评论不能为空', trigger: 'click' },
          { type: 'string', max: 200, message: '最多发布200个字符', trigger: 'click' }
        ]
      }
    }
  },
  computed: {
  },
  methods: {
    handleClickAvatar (event) {
      event.stopPropagation()
      this.$emit('clickAvatar', this)
    },
    handleClickTool (event, tool) {
      event.stopPropagation()
      this.$emit('clickTool', this, tool)
    },
    handleClickAuthor (event) {
      let routeUrl = this.$router.resolve({
        path: '/' + this.userName
      })
      window.open(routeUrl.href, '_blank')
      // event.stopPropagation()
      // this.$emit('clickAuthor', this)
    },
    handleAddReply (event) {
      console.log('点击一级回复handleAddReply')
      this.inputFlag = true
      this.form.commentContent = ''
    },
    saveReplyComment (userName) {
      console.log('点击一级回复' + userName)
      this.inputFlag = true
      this.form.commentContent = '@' + userName + ' : '
    },
    cancel () {
      console.log('取消')
      this.inputFlag = false
      this.form.commentContent = ''
    },
    handleSubmit () {
      this.$refs.commentOne.validate((valid) => {
        if (valid) {
          this.form.articleId = this.articleId
          this.form.parentId = this.id
          this.$axios.post('/comment/new', this.form).then(({data}) => {
            if (data.code === '000000') {
              this.$Message.success('评论成功！')
              this.form = {}
              this.$emit('getCommentList', this.articleId)
            } else if (data.code === '000005') {
              this.$Message.warning(data.msg)
            } else {
              this.$Message.warning(data.msg)
            }
          })
        } else {
          this.$Message.error('评论内容不能为空!')
        }
      })
    }
  },
  filters: {
    filterTime (value) {
      if (!value) {
        return '未知时间'
      }
      if (Object.prototype.toString.call(value) === '[object String]') {
        return value
      }
      if (value === '' || isNaN(value)) {
        return '未知时间'
      }
      if (value <= 0) {
        return '未知时间'
      }
      if (value < 10000000000) {
        value *= 1000
      }
      let time = new Date(value)
      let tY = time.getFullYear()
      let tM = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
      let tD = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
      let th = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      let tm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      let ts = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
      let now = new Date()
      let nY = now.getFullYear()
      let nM = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
      let nD = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
      let result = ''
      if (tY !== nY) {
        result += tY + '年'
      }
      if (tM !== nM || tD !== nD) {
        result += tM + '月'
        result += tD + '日'
      }
      if (result === '') {
        result = th + ':' + tm + ':' + ts
      }
      return result
    }
  }
}
</script>

<style scoped>
img {
  border: 0;
  vertical-align: middle;
}
.ml10 {
  margin-left: 10px !important;
}
.ml15 {
  margin-left: 15px !important;
}
.comments-item {
  padding: 15px 0;
  border-bottom: 1px solid rgba(0,0,0,0.09);
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  font-size: 14px;
}
.pull-left {
  float: left !important;
}
.pull-right {
  float: right !important;
}
.avatar-32 {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.comments-item a {
  color: #009a61;
  text-decoration: none;
  background: transparent;
}
.comments-item a:hover,
.comments-item a:active,
.comments-item a:focus {
  outline: 0;
}
.comments-box {
  padding-left: 47px;
}
.comments-box strong {
  font-weight: bold;
}
.comments-trigger {
  margin-bottom: 10px;
  color: #999;
  font-size: 13px;
}
.comments-option {
  /*visibility: hidden;*/
}
.comments-content {
  line-height: 1.6;
  word-wrap: break-word;
  margin-bottom: 10px !important;
}
.comments-content::before,
.comments-content::after {
  display: table;
}
.comments-content::after {
  content: "";
  clear: both;
}
.comments-ops {
  margin: 0;
  color: #999;
  font-size: 13px;
}
.comments-reply-btn {
  cursor: pointer;
}
.reply-list {
  margin-top: 10px;
  font-size: 13px;
  background-color: #FAFAFA;
  padding: 0 10px;
  color: #666;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
}
.reply-item--ops {
  border-bottom: none;
}
.reply-item {
  padding-bottom: 10px;
  padding-top: 10px;
  word-break: break-word;
}
</style>
