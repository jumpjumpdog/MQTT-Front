<template>
    <el-table :data="ownerList" style="100%" label-position="top">
      <el-table-column prop="id" label="用户ID"  min-width="30%">
      </el-table-column>
      <el-table-column prop="name" label="用户名"  min-width="30%">
      </el-table-column>
      <el-table-column prop="password" label="密码"  min-width="30%">
        <template slot-scope="scope">
          <el-input    type="password" v-model="scope.row.password" placeholder="请输入新密码">
            <i slot="suffix" title="显示密码" @click="changePass(scope.$index,'show',$event)" style="cursor:pointer;"
               class="el-input__icon iconfont icon-yincang el-icon-view"></i>
          </el-input>
        </template>

      </el-table-column>

      <el-table-column prop="telephone" label=""  min-width="30%">
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="20">
            <template scope="scope" >
                <el-button size="small" type="primary" icon="el-icon-edit" @click="openEditDialog(scope.$index, scope.row.propertities)"></el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="openDeleteDialog(scope.$index, scope.row.propertities)"></el-button>
            </template>
        </el-table-column>
        <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" :append-to-body="true">
        <span>确认删除?</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取 消</el-button>
            <el-button type="danger" @click="handleDelete">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="30%" :append-to-body="true">
        <el-form ref="editForm" :model="editForm" label-width="80%" label-position="top">
            <el-form-item label="工号" prop="id">
                <el-input v-model="editForm.id" readonly></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" >
                <el-input type="password" v-model="editForm.password" placeholder="请输入新密码">
            <i slot="suffix" title="passwordTitle" @click="changePass()" style="cursor:pointer;"
               class="el-input__icon iconfont icon-yincang"></i>
          </el-input>
            </el-form-item>
            <el-form-item label="联系方式"  prop="telephone">
                <el-input v-model="editForm.telephone"></el-input>
            </el-form-item>
             <el-form-item label="设备权限">
                <el-select v-model="selectedEqpList" multiple filterable allow-create  default-first-option placeholder="请选择操作员">
                    <el-option v-for="item in eqpList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="resetForm('editForm')">重置</el-button>
            <el-button type="primary" @click="handleEdit">确 定</el-button>
        </span>
    </el-dialog>
    </el-table>
</template>
<script>
import { Mysql } from '@api/mysql.post'
export default{
  data () {
    return {
      deleteDialogVisible: false,
      editDialogVisible: false,
      eqpList: [],
      selectedEqpList: [],
      itemIndex: -1,
      editForm: {
        id: '',
        name: '',
        password: '',
        telephone: '' },
      ownerList: []
    }
  },
  methods: {
    changePass: function (index, value, event) {
      if (event.target.title === '显示密码') {
        event.target.parentElement.parentElement.previousElementSibling.type = 'text'
        event.target.title = '隐藏密码'
        event.target.class = 'el-icon-thumb'
        // event.target.parentElement
      } else {
        event.target.title = '显示密码'
        event.target.class = 'el-icon-view'
        event.target.parentElement.parentElement.previousElementSibling.type = 'password'
      }
      // console.log(index)
      // console.log(value)
      // this.$data.ownerList[index]['visible'] = !(value === 'show')
      // if (this.passwordShow === 'password') {
      //   this.passwordShow = 'text'
      //   this.passwordTitle = '隐藏密码'
      // } else {
      //   this.passwordShow = 'password'
      //   this.passwordTitle = '显示密码'
      // }
    },
    handleDelete: function () {
      // handleDelete(scope.$index, scope.row.properties)
      let deleteItem = this.$data.ownerList[this.$data.itemIndex]
      Mysql({
        action: 'deleteOwner',
        id: deleteItem.id
      }).then((res) => {
        if (res.result === true) {
          alert('删除成功')
          this.$data.ownerList.splice(this.$data.itemIndex, 1)
        } else {
          alert('删除失败')
        }
      // eslint-disable-next-line handle-callback-err
      }).catch((err) => {
        alert('删除error')
      })
      this.$data.deleteDialogVisible = false
    },
    openDeleteDialog: function (index, row) {
      this.$data.deleteDialogVisible = true
      this.$data.itemIndex = index
    },
    openEditDialog: function (index, row) {
      this.$data.editDialogVisible = true
      this.$data.itemIndex = index
      var sourceForm = this.$data.ownerList[this.$data.itemIndex]
      for (let key in sourceForm) {
        this.$data.editForm[key] = sourceForm[key]
      }
      let owner_id = this.$data.editForm['id']
      Mysql({
        'action': 'getEqpsByOwnerId',
        'id': owner_id
      }).then(
        (res) => {
          if (res.result === true) {
            this.$data.eqpList = res.eqpList
            var temp = []
            for (var item of res.selectedEqpList) {
              temp.push(item['value'])
            }
            this.$data.selectedEqpList = temp
            this.$data.eqpList = res.eqpList
          } else {
            alert('getEqpByOwnerId fail')
          }
        }
      // eslint-disable-next-line handle-callback-err
      ).catch((err) => {
        console.log('getEqpByOwnerId 失败')
        console.log(err)
      })
    },
    handleEdit: function () {
      let para = {}
      para['action'] = 'editOwner'
      for (let key in this.$data.editForm) {
        para[key] = this.$data.editForm[key]
      }
      para['eqp_list'] = this.$data.selectedEqpList
      Mysql(
        para
      ).then((res) => {
        if (res.result === true) {
          for (let key in this.$data.editForm) {
            this.$data.ownerList[this.$data.itemIndex][key] = this.$data.editForm[key]
          }
          alert('修改成功')
        } else {
          alert('修改失败')
        }
      // eslint-disable-next-line handle-callback-err
      }).catch((err) => {
        console.log('修改用户的axios异常')
        console.log(err)
      })
      this.$data.ownerList[this.$data.itemIndex]['telephone'] = this.$data.editForm['telephone']
      this.$data.editDialogVisible = false
    },
    resetForm: function (refname) {
      this.$refs[refname].resetFields()
    }
  },
  mounted () {
    Mysql({
      action: 'owners'
    }).then((res) => {
      if (res.result === true) {
        console.log(res.data)
        this.$data.ownerList = res.data
        for (var i = 0; i < res.data.length; i++) {
          this.$data.ownerList[i]['visible'] = false
        }
      } else {
        alert('获取所有用户 fail')
      }
    // eslint-disable-next-line handle-callback-err
    }).catch((err) => {
      console.log('获取所有用户异常')
    })
  }
}
</script>
