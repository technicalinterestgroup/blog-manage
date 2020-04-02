<template>
  <div class="article-page-footer">
    <!-- <license-tag></license-tag> -->
    <!-- <social-section :type="'Article'" :postId="postId"></social-section> -->
    <comment :articleId="articleId"></comment>
  </div>
</template>

<script type="text/ecmascript-6">
import LicenseTag from '@/components/views/LicenseTag'
import SocialSection from '@/components/views/Comment/SocialSection'
import Comment from '@/components/views/Comment/Comment'
export default {
  components: {
    'license-tag': LicenseTag,
    'social-section': SocialSection,
    'comment': Comment
  },
  props: {
    articleId: String
  }
}
</script>
