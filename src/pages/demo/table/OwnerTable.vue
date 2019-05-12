<template>
    <el-table :data="ownerList" style="100%" label-position="top">
      <el-table-column prop="ownerId" label="用户ID" width="100%">
      </el-table-column>
      <el-table-column prop="ownerName" label="用户名" width="100%">
      </el-table-column>
      <el-table-column prop="password" label="用户密码" width="100%">
      </el-table-column>
      <el-table-column prop="eqmList" label="设备列表" width="100%">
      </el-table-column>
    </el-table>
</template>
<script>
export default{
  data () {
    return {
      ownerList: [
        { 'ownerId': 1, 'ownerName': 'sjw', 'password': '123', 'eqmList': 'aaa' },
        { 'ownerId': 2, 'ownerName': 'zxl', 'password': '123', 'eqmList': 'aaa' },
        { 'ownerId': 3, 'ownerName': 'wz', 'password': '123', 'eqmList': 'aaa' }
      ]
    }
  }
}
</script>
