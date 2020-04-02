<template>
  <div class="tag-wall">
    <panel :title="'标签墙'">
      <div slot="content" class="content">
        <iv-tag v-for="(tag, index) in tagList" type="dot" :color="index | mapTagColor" :key="index" style="margin: 0 5px 5px 0;" class="dot-tag">{{ tag.name +' ['+ tag.articleNum + ']'}}
        </iv-tag>
      </div>
    </panel>
  </div>
</template>

<script type="text/ecmascript-6">
import Panel from '@/components/utils/Panel'
import {mixin} from '@/utils/index'
export default {
  data () {
    return {
      tagList: []
    }
  },
  components: {
    'panel': Panel
  },
  mixins: [mixin],
  created () {
    this.listTag(this.$route.params.userName)
  },
  methods: {
    listTag (userName) {
      var url = '/view/article/tags'
      if (userName) {
        url = url + '/' + userName
      }
      this.$axios.get(url, {
      }).then(({data}) => {
        if (data && data.code === '000000') {
          this.tagList = data.data
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index.styl";

  .tag-wall
    .content
      padding 5px 20px

</style>
