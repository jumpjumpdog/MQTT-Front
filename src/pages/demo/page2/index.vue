<template>
  <d2-container :filename="filename">
    <template slot="header">增加设备</template>
    <AddEqmTable></AddEqmTable>
  </d2-container>
</template>

<script>
export default {
  name: 'AddEqm',
  components: {
    'AddEqmTable': () => import('../form/EqmForm.vue')
  },
  data () {
    return {
      filename: __filename
    }
  }
}
</script>
