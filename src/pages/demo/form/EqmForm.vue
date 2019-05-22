<template>
  <el-form ref="EqmForm" :model="EqmForm" label-position="top">
    <el-form-item label="设备id">
      <el-input v-model="EqmForm.eqmId" readonly ></el-input>
      <el-button type="primary" @click="adminDialogVisible=true" >获取id</el-button>
    </el-form-item>
    <el-form-item label="设备名称">
      <el-input v-model="EqmForm.eqmName"></el-input>
    </el-form-item>
    <el-form-item label="相关人员">
                <el-select
    v-model="selected_owners"
    multiple
    filterable
    allow-create
    default-first-option
    placeholder="请选择操作员">
    <el-option
      v-for="item in owners"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    </el-form-item>
    <el-form-item label="设备安全温度范围">
      <div class="block">
          <el-slider v-model="EqmForm.temperature" range show-stops :max="110"></el-slider>
      </div>
    </el-form-item>
    <el-form-item label="设备安全湿度范围">
      <div class="block">
          <el-slider v-model="EqmForm.humid" range show-stops :max="100"></el-slider>
      </div>
    </el-form-item>
    <el-form-item label="运行状态">
      <el-radio-group v-model="EqmForm.isVaild" size="medium">
        <el-radio border label="正常"></el-radio>
        <el-radio border label="异常"></el-radio>
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
import Vue from 'vue'
import { Mysql } from '@api/mysql.post'
Vue.filter('dataFormat', function (value, fmt) {
  let getDate = new Date(value)
  let o = {
    'M+': getDate.getMonth() + 1,
    'd+': getDate.getDate(),
    'h+': getDate.getHours(),
    'm+': getDate.getMinutes(),
    's+': getDate.getSeconds(),
    'q+': Math.floor((getDate.getMonth() + 3) / 3),
    'S': getDate.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
})
export default {
  name: 'EqmForm',
  data () {
    return {
      selected_owners: [],
      EqmForm: {

        eqmId: '-1',
        createDate: new Date(),
        isVaild: '有效',
        owner: [],
        temperature: [-10, 100],
        humid: [4, 10],
        eqmName: ''
      },
      adminForm: {
        adminName: '',
        adminPassword: ''
      },
      adminDialogVisible: false,
      owners: []
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
            this.$data.EqmForm.eqmId = response['data']['uuid']
            alert('验证成功')
          } else {
            alert('验证失败')
          }
        }
      ).catch(error => { console.log(JSON.stringify(error)) })
      this.$data.adminDialogVisible = false
    },
    resetForm: function (refname) {
      this.$refs[refname].resetFields()
    },
    createEqm: function (eqmForm) {
      let selected_owners = this.selected_owners
      if (eqmForm.eqmId == -1) {
        console.log(selected_owners[0])
        alert('创建失败 请先获取设备ID')
      } else {
        Mysql({
          action: 'createEqm',
          eqm_id: eqmForm.eqmId,
          eqm_name: eqmForm.eqmName,
          owner_id: eqmForm.owner,
          max_t: eqmForm.temperature[1],
          min_t: eqmForm.temperature[0],
          max_h: eqmForm.humid[1],
          min_h: eqmForm.humid[0],
          is_valid: eqmForm.isVaild,
          selected_owners: selected_owners
        }).then(
          (response) => {
            if (response.result === true) {
              console.log(response.data)
              alert('创建成功')
            } else {
              alert('创建失败')
            }
          }
        // eslint-disable-next-line handle-callback-err
        ).catch(err => { alert('创建设备的axios错误') })
      }
    }
  },
  mounted () {
    var _this = this // 声明一个变量指向vue实例this,保证作用域一致
    this.timer = setInterval(function () {
      _this.EqmForm.createDate = new Date()// 修改数据date
    }, 1000)
    Mysql({
      'action': 'owners'
    }).then((response) => {
      console.log(response)
      var _owners = response['data']
      console.log(_owners)
      for (var i = 0; i < _owners.length; i++) {
        this.$data.owners.push({ value: _owners[i]['id'], label: _owners[i]['name'] })
      }
      console.log(this)
    })
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)// 在vue实例销毁钱，清除我们的定时器
    }
  },
  watch: {
  }
}
</script>
