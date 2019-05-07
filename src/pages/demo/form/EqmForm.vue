<template>
  <el-form ref="EqmForm" :model="EqmForm" label-position="top">
    <el-form-item label="设备id">
      <el-input v-model="EqmForm.eqmId" readonly></el-input>
      <el-button type="primary" @click="adminDialogVisible=true" >获取id</el-button>
    </el-form-item>
    <el-form-item label="有效状态">
      <el-radio-group v-model="EqmForm.isVaild" size="medium">
        <el-radio border label="有效"></el-radio>
        <el-radio border label="失效"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="创建时间">
      <span>{{EqmForm.createDate|dataFormat('yyyy-MM-dd hh:mm:ss')}}</span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="createEqm(EqmForm)">
         新建
      </el-button>
    </el-form-item>
    <el-dialog title="账户验证" :visible.sync="adminDialogVisible" width="30%" :append-to-body="true">
        <el-form ref="adminForm" :model="adminForm" label-width="80%" label-position="top">
            <el-form-item label="账户名" prop="adminId" > 
              <el-input v-model="adminForm.adminId"> </el-input>
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
import axios from 'axios'
import Vue from 'vue'
Vue.filter('dataFormat', function (value, fmt) {
  let getDate = new Date(value);
  let o = {
    'M+': getDate.getMonth() + 1,
    'd+': getDate.getDate(),
    'h+': getDate.getHours(),
    'm+': getDate.getMinutes(),
    's+': getDate.getSeconds(),
    'q+': Math.floor((getDate.getMonth() + 3) / 3),
    'S': getDate.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt;
});
export default {
  name: "EqmForm",
  data() {
    return {
      EqmForm: {
        eqmId: "-1",
        createDate:new Date(),
        isVaild:"有效",
      },
      adminForm:{
          adminId:'',
          adminPassword:'',
      },
      adminDialogVisible:false,
    };
  },
  methods:{
    adminAuth:function (adminForm) {
        console.log(adminForm);
        if(adminForm.adminId=='111'&& adminForm.adminPassword=='222')
        {
          alert("验证成功");
          this.$data.EqmForm.eqmId = "123456";
        }
        else{
          alert("验证失败");
        }
        this.$data.adminDialogVisible=false;
    },
    resetForm:function (refname) {
          this.$refs[refname].resetFields();  
    },
    createEqm: function (eqmForm) {
      console.log(eqmForm);
      if(eqmForm.eqmId==-1){
        alert("创建失败 请先获取设备ID");
      }
      else{
        alert("创建成功");
      } 
    }
  },
  mounted(){
    var _this = this; //声明一个变量指向vue实例this,保证作用域一致
     this.timer = setInterval(function() {
      _this.EqmForm.createDate = new Date();//修改数据date
     }, 1000);
  },
  beforeDestroy () {
     if(this.timer) {
      clearInterval(this.timer);//在vue实例销毁钱，清除我们的定时器
     }
    },
  watch: {

    // EqmForm:{
    //     handler(value){
    //       console.log(value);
    //       alert(value);
    //       this.$emit("input",value);
    //     }
    // },
    // form: {
    //   // 处理方法
    //   handler(value) {
    //     alert(value);
    //     this.$emit("input", value);
    //   },
    //   // 深度 watch
    //   deep: true,
    //   // 首先自己执行一次
    //   immediate: true
    // }
  }
};
</script>