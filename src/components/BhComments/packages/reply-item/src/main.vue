<template>
  <div class="reply-item">
    <div class="reply-content-block">
      <div class="pull-left">
        <img class="avatar-32" :src="avatar" alt="" v-if="avatar" @click="handleClickAvatar">
      </div>
      <div class="comments-box">
           <div class="comments-trigger">
              <span class="comment-meta inline-block">
                <!-- <span> — </span> -->
                <strong><a href="javascript:void(0)" @click="handleClickAuthor($event)"><iv-icon type="person"></iv-icon>  {{userName}}</a></strong>
                <span class="comments-date">&nbsp;&nbsp; <iv-icon type="edit"></iv-icon> {{createTime | filterTime}}</span>
              </span>
            </div>
            <div class="reply-content">
              <p>{{commentContent}}</p>
            </div>
            <a class="reply-inner-btn" href="javascript:void(0);" @click="saveReplyComment($event)"><iv-icon type="chatbox"></iv-icon> 回复</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReplyItem',
  props: {
    avatar: String,
    userName: String,
    commentContent: String,
    tools: Array,
    createTime: [String, Number]
  },
  data () {
    return {
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
      console.log('点击内部用户' + this.userName)
      // event.stopPropagation()
      // this.$emit('clickAuthor', this)
    },
    saveReplyComment (event) {
      console.log('点击内部回复' + this.userName)
      event.stopPropagation()
      this.$emit('saveReply', this.userName)
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
.ml10 {
  margin-left: 10px !important;
}
.ml15 {
  margin-left: 15px !important;
}
.pull-left {
  float: left !important;
}
.pull-right {
  float: right !important;
}
.reply-item {
  padding-bottom: 10px;
  padding-top: 10px;
  border-bottom: 1px dashed rgba(0,0,0,0.09);
  word-break: break-word;
}
.reply-item a {
  color: #009a61;
  text-decoration: none;
  background: transparent;
}
.reply-item a:hover,
.reply-item a:active,
.reply-item a:focus {
  outline: 0;
}
.reply-item p {
  margin-bottom: 5px;
}
.comment-tools {
  /*visibility: hidden;*/
}
.comment-meta {
  color: #999;
}
.inline-block {
  display: inline-block;
}
.avatar-32 {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.comments-box {
  padding-left: 47px;
}
.comments-trigger {
  margin-bottom: 10px;
  color: #999;
  font-size: 13px;
}
.reply-content {
  line-height: 1.6;
  word-wrap: break-word;
  margin-bottom: 10px !important;
}
</style>
