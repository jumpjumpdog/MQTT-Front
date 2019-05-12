<template>
<el-form :model="ownerForm">
    <el-form-item label="用户名" prop="ownerName">
        <el-input  v-model="ownerForm.ownerName" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="用户ID" prop="ownerId">
        <el-input v-model="ownerForm.ownerId" auto-complete="off" disabled=""></el-input>
    </el-form-item>
    <el-form-item>
        <el-button>获取Id</el-button>
    </el-form-item>
    <el-form-item label="密码" prop="ownerPassword">
        <el-input type="password" v-model="ownerForm.ownerPassword" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="ownerPasswordCheck">
        <el-input type="password" v-model="ownerForm.ownerPasswordCheck" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
    </el-form-item>
</el-form>
</template>
<script>
export default {
  data () {
    return {
      ownerForm: {
        'ownerId': '',
        'ownerName': '',
        'ownerPassword': '',
        'ownerPasswordCheck': ''
      }
    }
  }
}
</script>
