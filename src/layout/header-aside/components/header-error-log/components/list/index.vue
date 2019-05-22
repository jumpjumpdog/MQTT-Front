<template>
  <el-table
    :data="exceptions"
    border
    stripe
    style="width: 100%"
    size="mini">

    <el-table-column type="expand">
      <div slot-scope="props" class="d2-error-log-list__expand-group">
        <expand-item
          :type="props.row.type"
          title="类型"
          :value="props.row.type === 'log' ? '日志' : '异常'"/>
        <expand-item
          :type="props.row.type"
          title="内容"
          :value="props.row.info"/>
        <expand-item
          v-if="props.row.type === 'error'"
          type="error"
          title="报错组件"
          :value="get(props.row.vm, '$vnode.tag', '')"/>
        <expand-item
          v-if="props.row.type === 'error'"
          type="error"
          title="错误名称"
          :value="get(props.row.err, 'name', '')"/>
        <expand-item
          v-if="props.row.type === 'error'"
          type="error"
          title="错误信息"
          :value="get(props.row.err, 'message', '')"/>
        <expand-item
          v-if="props.row.type === 'error'"
          type="error"
          title="错误堆栈"
          value="见下">
          <div style="overflow: auto;">
            <pre>{{stackBeautify(props.row.err)}}</pre>
          </div>
        </expand-item>
        <expand-item
          :type="props.row.type"
          title="用户名"
          :value="get(props.row.user, 'name', '')"/>
        <expand-item
          :type="props.row.type"
          title="uuid"
          :value="props.row.uuid"/>
        <expand-item
          :type="props.row.type"
          title="token"
          :value="props.row.token"/>
        <expand-item
          :type="props.row.type"
          title="页面地址"
          :value="props.row.url"/>
        <expand-item
          :type="props.row.type"
          title="时间"
          :value="props.row.time"/>
      </div>
    </el-table-column>

    <el-table-column
      prop="type"
      label="类型"
      width="80px"
      align="center"
      :filters="[
        { text: '日志', value: 'log' },
        { text: '异常', value: 'error' }
      ]"
      :filter-multiple="false"
      :filter-method="filterType"
      filter-placement="bottom">
      <template slot-scope="scope">
        <el-tag
          v-if="scope.row.type === 'error'"
          size="mini"
          type="danger">
          <d2-icon name="bug"/> Bug
        </el-tag>
        <el-tag
          v-else
          size="mini"
          type="info">
          <d2-icon name="dot-circle-o"/> Log
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column
      label="设备编号"
      prop="eqp_id"
      width="200px"
      :show-overflow-tooltip="true">
    </el-table-column>

    <el-table-column
      label="设备名"
      width="200px" :show-overflow-tooltip="true">
      <template
        slot-scope="scope">
        {{get(scope.row, 'name', '')}}
      </template>
    </el-table-column>

    <el-table-column
      label="异常原因"
      width="200px"
      :show-overflow-tooltip="true">
      <template
        slot-scope="scope">
        {{get(scope.row, 'reason', '')}}
      </template>
    </el-table-column>
    <el-table-column
       label="时间"
        width="200px"
      :show-overflow-tooltip="true">
       <template
        slot-scope="scope">
        {{getTime(scope.row.create_date)}}
      </template>
    </el-table-column>
    <el-table-column label="清除" align="center" min-width="20">
            <template scope="scope" >
                <el-button size="small" type="primary" icon="el-icon-check" @click="openHandleDialog(scope.$index, scope.row.propertities)"></el-button>
            </template>
    </el-table-column>
      <el-dialog title="清除" :visible.sync="handleDialogVisible" width="30%" :append-to-body="true">
        <el-form   label-width="80%" label-position="top">
             <el-form-item label="维护人员">
                <el-select
    v-model="owner"
    filterable
    allow-create
    default-first-option
    placeholder="请选择操作员">
    <el-option
      v-for="item in selected_owners"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
    </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
  </el-table>
</template>

<script>
import { mapState } from 'vuex'
import { get } from 'lodash'
import ExpandItem from './components/ExpandItem'
import { Mysql } from '@api/mysql.post'
var mqtt = require('mqtt')
export default {
  name: 'd2-error-log-list',
  components: {
    ExpandItem
  },
  // data () {
  //   return {
  //     ExceptionList: null
  //   }
  // },
  // mounted () {

  // },
  data () {
    return {
      owner: '',
      selected_owners: [],
      handleDialogVisible: false,
      client: 0,
      exceptions: [],
      itemIndex: 0
    }
  },
  computed: {
    ...mapState('d2admin', {
      logList: state => state.log.list
    }),
    logReverse () {
      // 直接 reverse 的话有点问题
      const res = []
      const loglength = this.logList.length
      this.logList.forEach((log, index) => {
        res.push(this.logList[loglength - 1 - index])
      })
      return res
    }
  },
  methods: {
    get,
    filterType (value, row) {
      return row.type === value
    },
    stackBeautify (err) {
      if (!err) {
        return ''
      }
      return err.stack
    },
    openHandleDialog: function (index, row) {
      this.$data.handleDialogVisible = true
      this.$data.itemIndex = index
      var eqp_id = this.$data.exceptions[this.$data.itemIndex].eqp_id
      Mysql({
        action: 'getOwnersByEqpId',
        id: eqp_id
      }).then((res) => {
        this.$data.selected_owners = res.select_owners
      }).catch((err) => { console.log(err) })
    },
    getTime: function (params) {
      var date = new Date(parseInt(params))
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = date.getDate() + ' '
      return Y + M + D
    },
    submit: function () {
      let para = {}
      para['action'] = 'handleException'
      para['id'] = this.exceptions[this.itemIndex]['id']
      para['owner_id'] = this.owner
      para['admin_id'] = '沈金伟'
      Mysql(
        para
      ).then((res) => {
        this.exceptions.splice(this.itemIndex, 1)
        this.exceptionLength = this.exceptionLength - 1
        this.handleDialogVisible = false
        console.log('发送的值')
        console.log(this.exceptionLength)
        this.$emit('childByValue', this.exceptionLength)
        alert('处理成功')
      }).catch((err) => console.log(err))
    },
    initException: function (params) {
      Mysql({
        action: 'queryException'
      }).then(
        (res) => {
          this.exceptions = res.data
          this.exceptionLength = this.exceptions.length
        }
      ).catch((err) => console.log(err))
    },
    onConnected: function () {
      // 订阅presence主题
      console.log('已连接exeption')
    },
    onMessage: function (topic, message) {
      message = JSON.parse(message.toString())
      this.initException()
      this.exceptionLength = message.exceptionLength
    }
  },
  created () {
    // this.client = mqtt.connect('mqtt://127.0.0.1', { port: 9001 })
    // this.client.on('connect', this.onConnected)
    // this.client.on('message', this.onMessage)
  },
  mounted () {
    this.initException()
  }
}
</script>

<style lang="scss">
.d2-error-log-list__expand-group {
  .d2-error-log-list__expand {
    padding-left: 20px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0px;
    }
    .d2-error-log-list__expand-title {
      font-size: 16px;
      font-weight: bold;
      margin-top: 0px;
      margin-bottom: 10px;
    }
    .d2-error-log-list__expand-value {
      font-size: 12px;
      margin-top: 0px;
      margin-bottom: 0px;
    }
  }
  .d2-error-log-list__expand--log {
    border-left: 4px solid $color-info;
  }
  .d2-error-log-list__expand--error {
    border-left: 4px solid $color-danger;
  }
}
</style>
