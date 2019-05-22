<template>
<el-form :model="ownerForm">
    <el-form-item label="用户名" prop="ownerName">
        <el-input  v-model="ownerForm.ownerName" ></el-input>
    </el-form-item>
    <el-form-item label="用户ID" prop="ownerId">
        <el-input v-model="ownerForm.ownerId" auto-complete="off" disabled=""></el-input>
    </el-form-item>
    <el-form-item>
        <el-button @click="adminDialogVisible=true">获取Id</el-button>
    </el-form-item>
    <el-form-item label="密码" prop="ownerPassword">
        <el-input type="password" v-model="ownerForm.ownerPassword" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="ownerPasswordCheck">
        <el-input type="password" v-model="ownerForm.ownerPasswordCheck" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="联系方式" prop="ownerPassword">
        <el-input type="telephone" v-model="ownerForm.telephone" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" @click="submitForm(ownerForm)">提交</el-button>
        <el-button @click="resetForm('ownerForm')">重置</el-button>
    </el-form-item>
     <el-dialog title="账户验证" :visible.sync="adminDialogVisible" width="30%" :append-to-body="true">
        <el-form ref="adminForm" :model="adminForm" label-width="80%" label-position="top">
            <el-form-item label="账户名" prop="adminName" >
              <el-input v-model="adminForm.adminName"> </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="adminPassword">
                <el-input v-model="adminForm.adminPassword"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="adminDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="resetForm('adminForm')">重置</el-button>
            <el-button type="primary" @click="adminAuth(adminForm)">确 定</el-button>
        </span>
    </el-dialog>
</el-form>
</template>
<script>
import { Mysql } from '@api/mysql.post'
export default {
  data () {
    return {
      adminDialogVisible: false,
      ownerForm: {
        'ownerId': '',
        'ownerName': '',
        'ownerPassword': '',
        'ownerPasswordCheck': '',
        'telephone': ''
      },
      adminForm: {
        adminName: '',
        adminPassword: ''
      }
    }
  },
  methods: {
    adminAuth: function (adminForm) {
      Mysql({
        'name': adminForm.adminName,
        'password': adminForm.adminPassword,
        'action': 'adminAuth'
      }).then(
        (response) => {
          console.log(response)
          if (response.result === true) {
            console.log(response['data']['uuid'])
            this.$data.ownerForm.ownerId = response['data']['uuid']
            alert('验证成功')
          } else {
            alert('验证失败')
          }
        }
      ).catch(error => { console.log(JSON.stringify(error)) })
      this.$data.adminDialogVisible = false
    },
    submitForm: function (ownerForm) {
      if (ownerForm.ownerId === -1) {
        alert('创建失败 请先获取用户')
      } else {
        Mysql({
          action: 'createOwner',
          id: ownerForm.ownerId,
          name: ownerForm.ownerName,
          password: ownerForm.ownerPassword,
          telephone: ownerForm.telephone
        }).then((res) => {
          console.log(res)
          if (res.result === true) {
            alert('创建成功')
          } else {
            alert('创建失败')
          }
        }).catch((err) => { alert('创建用户的axios错误') })
      }
    }
  }
}
</script>
