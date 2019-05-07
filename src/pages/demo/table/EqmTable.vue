<template>
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
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" :append-to-body="true">
        <span>确认删除?</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取 消</el-button>
            <el-button type="danger" @click="handleDelete">确 定</el-button>
        </span> 
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="30%" :append-to-body="true">
        <el-form ref="editForm" :model="editForm" label-width="80%" label-position="top">
            <el-form-item label="设备编号" prop="eqmId">
                <el-input v-model="editForm.eqmId" readonly></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="createDate">
                <el-input v-model="editForm.createDate" readonly></el-input>
            </el-form-item>
            <el-form-item label="有效状态"  prop="isVaild">
                <el-input v-model="editForm.isVaild"></el-input>
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
export default {
    data(){
        return{
            eqmList:[
                {'eqmId':1,'createDate':'2016-05-02','isVaild':'true'},
                {'eqmId':2,'createDate':'2016-05-03','isVaild':'true'},
                {'eqmId':3,'createDate':'2016-05-04','isVaild':'false'},
            ],
            deleteDialogVisible:false,   
            editDialogVisible:false, 
            itemIndex:-1,
            editForm:{},
        }
    },
    methods:{
        handleDelete: function () {
            // handleDelete(scope.$index, scope.row.properties)
            this.$data.eqmList.splice(this.$data.itemIndex,1);
            this.$data.deleteDialogVisible = false; 
        },
        openDeleteDialog: function (index, row) {
            this.$data.deleteDialogVisible = true;
            this.$data.itemIndex = index;
        },
        openEditDialog: function (index, row) {
            this.$data.editDialogVisible = true;
            this.$data.itemIndex = index;
            this.$data.editForm = this.$data.eqmList[this.$data.itemIndex];
        },
        handleEdit: function () {
          this.$data.eqmList[this.$data.itemIndex] = this.$data.editForm;  
          this.$data.editDialogVisible = false;
        },
        resetForm: function (refname) {
          console.log( this.$data.eqmList[this.$data.itemIndex]);
          this.$data.editForm = this.$data.eqmList[this.$data.itemIndex];
          this.$refs[refname].resetFields();
        },
          handleClose(done) {
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      }
    
    }
}
</script>

