<template>
  <div class="about" :userInfo="userInfo">
    <img class="background" src="../../assets/background.jpg" alt="">
    <img class="avatar" :src="userInfo.photo" alt="">
    <p class="name"><a  @click="selectMenu('/'+userInfo.userName)"> {{userInfo.nickName}}</a></p>
    <p class="desc">{{userInfo.userSummary}}</p>
    <ul class="social">
    </ul>
    <div class="line"></div>
    <h4>博客信息</h4>
    <div class="progresses">
      <iv-row :gutter="5">
          <iv-col span="5" style="font-size:12px">博客：{{userInfo.blogCount}}</iv-col>
          <iv-col span="6" style="font-size:12px">获赞：{{userInfo.likeCount}}</iv-col>
          <iv-col span="6" style="font-size:12px">评论：{{userInfo.commentCount}}</iv-col>
          <iv-col span="7" style="font-size:12px">阅读：{{userInfo.readCount}}</iv-col>
      </iv-row>
    </div>
    <br>
    <div class="progresses">
      <iv-row :gutter="2">
        <iv-col :span="12">
          <p class="title">等级 ： <span class="special" title="等级">{{userInfo.grade}}</span></p>
        </iv-col>
         <iv-col :span="12">
          <p class="title">积分 ：<span class="special" title="积分">{{userInfo.integral}}</span></p>
        </iv-col>
      </iv-row>
      <!-- <iv-row :gutter="2">
        <iv-col :span="0">
          <p class="title">积分 ：<span class="special" title="积分">{{userInfo.integral}}</span></p>
        </iv-col>
      </iv-row> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      userInfo: {},
      userName: '',
      nickName: '',
      integral: 0,
      userSummary: '',
      grade: 1,
      photo: ''
    }
  },
  created () {
    this.getUserInfo(this.$route.params.userName)
  },
  methods: {
    getUserInfo (userName) {
      this.$axios.get('/view/user/info/' + userName, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.userInfo = data.data
        }
      })
    },
    selectMenu (url) {
      this.$router.push(url)
      // .catch(data => {})
    }
  }

}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/theme.styl";

  .about
    background-color #fff
    position relative
    text-align center
    border 1px solid $color-border
    padding-bottom 20px
    img.background
      position absolute
      top 0
      left 0
      right 0
      width 100%
      height 125px
      z-index 1
    img.avatar
      position relative
      margin 75px auto 15px
      width 100px
      height 100px
      border 5px solid $color-gradually-gray-91
      border-radius 50%
      z-index 9
    .name
      font-size 22px
      color $color-typegraphy-title
      line-height 30px
      font-weight 700
    .desc
      font-size 15px
      color $color-secondary-info
      line-height 30px
      font-weight 100
    .social
      text-align center
      padding 0 20px
      margin-top 15px
      > li
        padding 8px
        a
          display block
          width: 44px
          height: 44px
          margin: auto
          img
            width 100%
    .line
      height 1px
      background-color $color-gradually-gray-91
      margin 10px 20px
    h4
      font-size 19px
      margin 30px 0 20px
      font-weight 600
    .progresses
      padding 0 20px
      p.title
        font-size 13px
        height 38px
        line-height 38px
        text-align left
      .bar
        margin 10px 0
      span.special
          line-height 38px
          border-radius $border-radius
          font-size 12px
          font-weight 100
          padding 3px 5px
          vertical-align bottom
          color $default-background-color
          background $iview-secondary-warning-color
          cursor pointer
          text-align left
          left 0px
</style>
