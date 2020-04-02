<template>
  <div class="index-carousel">
   <iv-carousel autoplay >
        <iv-carousel-item  v-for="carousel in carouselList" :key="carousel.id">
            <div class="demo-carousel"><a  @click="jumpDetail(carousel.id)"><img :src="carousel.carouselUrl" :alt="carousel.title"></a></div>
        </iv-carousel-item>
    </iv-carousel>
 </div>
</template>

<script type="text/ecmascript-6">
import { mixin } from '@/utils'
export default {
  data () {
    return {
      coverType: 1,
      carouselList: []
    }
  },
  props: {
    article: {
      Type: Object
    },
    type: ''
  },
  mixins: [mixin],
  computed: {
  },
  created () {
    this.getCarousels()
  },
  methods: {
    getCarousels () {
      this.$axios.get('/view/carousels', {
        params: {
          type: 1
        }
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.carouselList = data.data
        } else if (data.code === '000001') {
        } else {
          this.$Message.warning(data.msg)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    jumpDetail (id) {
      this.$router.push('/notice/' + id)
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/index.styl";

  .index-Carousel
    margin-bottom 15px
</style>
