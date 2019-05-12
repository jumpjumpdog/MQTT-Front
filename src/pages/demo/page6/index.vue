<template>
  <d2-container :filename="filename">
    <template slot="header">用户设备详情</template>
    <OwnerDetail></OwnerDetail>
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
    'OwnerDetail': () => import('../table/OwnerDetail.vue')
  }

}
</script>
