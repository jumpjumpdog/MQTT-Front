<template>
  <d2-container :filename="filename">
    <template slot="header">设备详情</template>
    <EqmMonthDetail></EqmMonthDetail>
  </d2-container>
</template>

<script>
export default {
  name: 'EqmDetail',
  data () {
    return {
      filename: __filename
    }
  },
  components: {
    'EqmMonthDetail': () => import('../table/EqmMonDetail.vue')
  }
}
</script>
