<template>
  <div class="index-carousel" :style="backgroundDiv" :blogInfo="blogInfo">
    <!-- <img class="background" src="../../../assets/background.jpg" alt=""> -->
    <br>
    <h2 class="name">{{blogInfo.vTitle}}</h2>
    <br>
    <h2 class="info">{{blogInfo.vIntroduct}}</h2>
 </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      backgroundDiv: {
        backgroundImage: 'url(' + require('../../../assets/8.png') + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      },
      blogInfo: {
        vTitle: '王树钰',
        vIntroduct: '不积跬步无以至千里'
      }

    }
  },
  created () {
    this.getBlogInfo(this.$route.params.userName)
  },
  methods: {
    getBlogInfo (userName) {
      this.$axios.get('/view/blog/info/' + userName, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.blogInfo = data.data
        }
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

  .index-carousel
    position relative
    width auto
    height 150px
    .name
      font-size 22px
      font-weight bold
      margin-left:20px
    .info
      font-size 12px
      margin-left:20px
      font-style: italic

</style>
