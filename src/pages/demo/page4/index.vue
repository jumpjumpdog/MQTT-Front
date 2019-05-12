<template>
  <d2-container :filename="filename">
    <template slot="header">用户列表</template>
    <OwnerTable></OwnerTable>
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
    'OwnerTable': () => import('../table/OwnerTable.vue')
  }
}
</script>
