<template>
  <d2-container :filename="filename">
    <template slot="header">增加用户</template>
    <OwnerForm></OwnerForm>
  </d2-container>
</template>
<script>
export default {
  data () {
    return {
      filename: __filename
    }
  },
  components: {
    'OwnerForm': () => import('../form/OwnerForm.vue')
  }
}
</script>
