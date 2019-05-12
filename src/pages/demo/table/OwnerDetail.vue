<template>
    <el-form :model="ownerForm">
        <el-form-item label="用户ID" prop="ownerId">
        <el-input v-model="ownerForm.ownerId" auto-complete="off" disabled=""></el-input>
    </el-form-item>
     <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm2')">查询</el-button>
        <el-button @click="resetForm('ruleForm2')">重置</el-button>
    </el-form-item>
    <el-table :data="eqmList" style="100%" label-position="top">
        <el-table-column prop="eqmId" label="设备ID" width="100%">
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="100%">
        </el-table-column>
        <el-table-column prop="isVaild" label="有效状态" width="100%">
        </el-table-column>
        <el-table-column label="操作" align="center">
            <template scope="scope" >
                <el-button size="small" type="primary" icon="el-icon-edit" @click="openEditDialog(scope.$index, scope.row.propertities)"></el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="openDeleteDialog(scope.$index, scope.row.propertities)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    </el-form>
</template>
<script>
export default {
  data () {
    return {
      ownerForm: {
        'userId': ''
      },
      eqmList: []
    }
  }
}
</script>
