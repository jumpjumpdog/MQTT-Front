<template>
  <div>
    <el-tooltip
      effect="dark"
      :content="tooltipContent"
      placement="bottom">
      <el-button
        class="d2-ml-0 d2-mr btn-text can-hover"
        type="text"
        @click="handleClick">
        <el-badge
          v-if="exceptionLength > 0"
          :max="99"
          :value="exceptionLength"
          :is-dot="exceptionLength === 0">
          <d2-icon
            :name="exceptionLength === 0 ? 'dot-circle-o' : 'bug'"
            style="font-size: 20px"/>
        </el-badge>
        <d2-icon
          v-else
          name="dot-circle-o"
          style="font-size: 20px"/>
      </el-button>
    </el-tooltip>
    <el-dialog
      :fullscreen="true"
      :visible.sync="dialogVisible"
      :append-to-body="true">
      <div class="d2-mb-10">
        <el-button type="danger" size="mini" @click="handleLogClean">
          <d2-icon name="trash-o"/>
          清空
        </el-button>
      </div>
      <d2-error-log-list v-on:childByValue="childByValue"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import D2ErrorLogList from './components/list'
import { Mysql } from '@api/mysql.post'
var mqtt = require('mqtt')
export default {
  components: {
    D2ErrorLogList
  },
  data () {
    return {
      client: 0,
      exceptionLength: 0,
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters('d2admin', {
      logLength: 'log/length',
      logLengthError: 'log/lengthError'
    }),
    tooltipContent () {
      return this.exceptionLength === 0
        ? '无设备异常'
        : `${this.exceptionLength} 条日志${this.exceptionLength > 0
          ? ` `
          : ''}`
    }
  },
  mounted () {
    this.client = mqtt.connect('mqtt://127.0.0.1', { port: 9001 })
    this.client.on('connect', this.onConnected)
    this.client.on('message', this.onMessage)
    this.client.subscribe('exceptionsLength')
    this.initException()
  },
  methods: {
    childByValue: function (childValue) {
      // childValue就是子组件传过来的值
      console.log('childValue:')
      console.log(childValue)
      this.exceptionLength = childValue
    },
    initException: function (params) {
      let exceptions = []
      Mysql({
        action: 'queryException'
      }).then(
        (res) => {
          this.exceptionLength = res.data.length
          exceptions = res.data
        }
      ).catch((err) => console.log(err))
    },
    onConnected: function () {
      // 订阅presence主题
      console.log('已连接')
    },
    onMessage: function (topic, message) {
      console.log('topic' + topic)
      if (topic === 'exceptionsLength') {
        console.log(topic)
        console.log(message.toString())
        message = JSON.parse(message.toString())
        this.exceptionLength = message
      }
    },
    ...mapMutations('d2admin/log', [
      'clean'
    ]),
    handleClick () {
      if (this.exceptionLength > 0) {
        this.dialogVisible = true
      }
    },
    handleLogClean () {
      this.dialogVisible = false
      this.clean()
    }
  }
}
</script>
