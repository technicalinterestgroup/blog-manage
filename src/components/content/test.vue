<template>
  <div>
    <iv-form-item label="姓名" prop="name">
                    <iv-input  auto-complete="off"></iv-input>
    </iv-form-item>
    <comments-item
      v-for="comment in comments"
      :key="comment.id"
      :avatar="comment.headimg"
      :author="comment.author"
      :content="comment.content"
      :time="comment.createTime"
      :hasReply="replys[comment.id] && replys[comment.id].length > 0"
      @clickAvatar="handleClickAvatar(comment)"
      @clickAuthor="handleClickAuthor(comment)"
      @addReply="handleAddReply(comment)">
      <reply-item v-for="reply in replys[comment.id]" :key="reply.id" :author="reply.author" :content="reply.content" :time="reply.createTime">
      </reply-item>
    </comments-item>
  </div>
</template>
<script>
import Vue from 'vue'
import BhComments from '@/components/BhComments'
// import CommentService from '@/request/comments/comment'
// import ReplyService from '@/request/comments/reply'

Vue.use(BhComments)

export default {
  name: 'Dashboard',
  data () {
    return {
      comments: [{
        id: 1,
        headimg: '',
        author: '测试',
        content: '内容',
        createTime: '2020-10'
      },
      {
        id: 2,
        headimg: '',
        author: '测试',
        content: '内容',
        createTime: '2020-10'
      }],
      replys: {
        1: [{
          id: 1,
          headimg: '',
          author: '测试',
          content: '内容',
          createTime: '2020-10'
        },
        {
          id: 2,
          headimg: '',
          author: '测试',
          content: '回复内容',
          createTime: '2020-10'
        }]
      },
      CommentService: []
    }
  },
  created: function () {
    this.listComments()
  },
  watch: {
  },
  methods: {
    listComments () {
    //   let self = this
    //   CommentService.list({
    //     target: 2
    //   }).then(data => {
    //     data = data.result
    //     self.comments = data ? [].concat(data) : []
    //     if (self.comments.length > 0) {
    //       self.listReply()
    //     }
    //   })
    },
    listReply () {
      let self = this
      self.replys = {}
      if (self.comments.length < 0) {
        return
      }
      for (let i = 0; i < self.comments.length; i++) {
        // let value = self.comments[i]
        // ReplyService.list({
        //   cid: value.id
        // }).then(data => {
        //   data = data.result
        //   self.$set(self.replys, value.id, data ? [].concat(data) : [])
        // })
      }
    },
    handleClickAvatar (item) {
      console.log('点击了头像')
    },
    handleClickAuthor (item) {
      console.log('点击了用户')
    },
    handleAddReply (item) {
      console.log('点击了添加回复')
      console.log(item)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
