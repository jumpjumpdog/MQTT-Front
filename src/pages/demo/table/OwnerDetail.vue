<template>
    <el-form >
       <el-form-item>
              <el-row>
                <el-col :span="2"><span>工号</span></el-col>
                <el-col :span="8">
                    <el-select v-model="ownerId" placeholder="请选择">
                          <el-option v-for="item in ownerIdList" :key="item.value" :label="item.value" :value="item.value"></el-option>
                     </el-select>
                </el-col>
                <el-col :span="4" :offset="2">
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button type="primary" @click="queryButton(ownerId)">查询</el-button>
                </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-show="normalInfo">
                  <el-form-item  label="员工名" >
                      <el-input v-model="ownerName"></el-input>
                  </el-form-item>
                  <el-form-item label="联系方式">
                      <el-input v-model="telephone"></el-input>
                  </el-form-item>
                  <el-form-item>
                          <data-tables :data="data" :table-props="tableProps">
                            <!--这里加入 table-props 监听-->
                          <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.label" sortable="custom"></el-table-column>
                         </data-tables>
                  </el-form-item>
            </el-form-item>

    </el-form>
</template>
<script>
import { Mysql } from '@api/mysql.post'
export default {
  data () {
    return {
      normalInfo: true,
      ownerId: '',
      ownerName: '',
      telephone: '',
      owners: [],
      ownerIdList: [],
      tableProps: {
        size: 'mini' // 这里写 el-table 的属性和相应设置
      },
      data: [],
      titles: [{
        prop: 'id',
        label: '记录编号.'
      }, {
        prop: 'eqp_id',
        label: '设备编号'
      }, {
        prop: 'create_date',
        label: '异常时间'
      },
      {
        prop: 'reason',
        label: '异常原因'
      },
      {
        prop: 'fix_date',
        label: '维护时间'
      },
      {
        prop: 'admin_id',
        label: '审核人'
      } ]
    }
  },
  methods: {
    getTime: function (params) {
      var date = new Date(parseInt(params))
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      return Y + M + D
    },
    queryButton: function (ownerId) {
      for (var item of this.owners) {
        if (item.id == ownerId) {
          this.ownerName = item.name
          this.telephone = item.telephone
          break
        }
      }
      Mysql({
        action: 'getFixHisory',
        id: ownerId
      }).then(
        (res) => {
          this.$data.data = res.data
          for (var i = 0; i < res.data.length; i++) {
            this.$data.data[i].create_date = this.getTime(this.$data.data[i].create_date)
            this.$data.data[i].fix_date = this.getTime(this.$data.data[i].fix_date)
          }
        }
      ).catch((err) => { console.log(err) })
    }
  },
  mounted () {
    Mysql({
      action: 'owners'
    }).then(
      (res) => {
        console.log('获取到的用户')
        console.log(res.owner_list)
        this.owners = res.data
        for (var item of this.owners) {
          this.ownerIdList.push({ label: item.name, value: item.id })
        }
      }
    ).catch((err) => { console.log(err) })
  }
}
</script>
