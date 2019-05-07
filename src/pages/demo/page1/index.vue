<template>
  <d2-container :filename="filename">
    <template slot="header">设备列表</template>
    <EqmTable></EqmTable>
  </d2-container>
</template>

<script>
export default {
  name: 'EqmList',
  components: {
    'EqmTable': () => import('../table/EqmTable.vue')
  },
  data () {
    return {
      filename: __filename
    }
  }
}
</script>
