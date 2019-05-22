/* eslint-disable no-undef */
/* eslint-disable no-tabs */
<template>
        <el-form v-model="eqmForm">
          <el-form-item>
              <el-row>
                <el-col :span="2"><span>设备编号</span></el-col>
                <el-col :span="8">
                    <el-select v-model="eqmForm.eqmId" placeholder="请选择">
                          <el-option v-for="item in eqpid_list" :key="item.value" :label="item.value" :value="item.value"></el-option>
                     </el-select>
                </el-col>
                <el-col :span="4" :offset="2">
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button type="primary" @click="queryButton(eqmForm)">查询</el-button>
                </el-col>
            </el-row>
          </el-form-item >
          <el-form-item v-show="normalInfo" label="设备名称">
            <el-input v-model="eqp_name"></el-input>
          </el-form-item>
          <el-form-item label="运行状态" v-show="normalInfo">
             <el-radio-group v-model="status" size="medium">
                 <el-radio border label="有效"></el-radio>
                 <el-radio border label="失效"></el-radio>
             </el-radio-group>
          </el-form-item>
          <el-form-item label="安全温度" v-show="normalInfo">
             <el-radio-group v-model="t_range" size="medium">
               <el-row>
                 <el-col :span="10">
                    <el-input v-model="temperature[0]+'~'+temperature[1]"></el-input>
                 </el-col>
               </el-row>
             </el-radio-group>
          </el-form-item>
          <el-form-item v-show="normalInfo" label="设备注册时间">
            <el-input v-model="create_date"></el-input>
          </el-form-item>
           <el-form-item label="维护人员" v-show="normalInfo">
                <el-select v-model="selected_owners"  multiple filterable allow-create default-first-option disabled="">
                   <el-option v-for="item in owners" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
          </el-form-item>
            <el-form-item>
                <div id="container" style="min-width:400px;height:400px"></div>
            </el-form-item>
            <el-form-item>
              <div id='container2' style="min-width:400px;height:400px"></div>
            </el-form-item>
        </el-form>

</template>
<script>
import { Mongo } from '@api/mongo.post'
import { Mysql } from '@api/mysql.post'
var mqtt = require('mqtt')

const attributesConst = ['温度', '湿度']
// 气温范围，数据格式：[时间戳, 范围起始值, 范围结束值]
// 平均数据，格式：[时间戳, 值]
let tRangesConst = [
  [1246406400000, 14.3, 27.7],
  [1246492800000, 14.5, 27.8],
  [1246579200000, 15.5, 29.6],
  [1246665600000, 16.7, 30.7],
  [1246752000000, 16.5, 25.0],
  [1246838400000, 17.8, 25.7],
  [1246924800000, 13.5, 24.8],
  [1247011200000, 10.5, 21.4],
  [1247097600000, 9.2, 23.8],
  [1247184000000, 11.6, 21.8],
  [1247270400000, 10.7, 23.7],
  [1247356800000, 11.0, 23.3],
  [1247443200000, 11.6, 23.7],
  [1247529600000, 11.8, 20.7],
  [1247616000000, 12.6, 22.4],
  [1247702400000, 13.6, 19.6],
  [1247788800000, 11.4, 22.6],
  [1247875200000, 13.2, 25.0],
  [1247961600000, 14.2, 21.6],
  [1248048000000, 13.1, 17.1],
  [1248134400000, 12.2, 15.5],
  [1248220800000, 12.0, 20.8],
  [1248307200000, 12.0, 17.1],
  [1248393600000, 12.7, 18.3],
  [1248480000000, 12.4, 19.4],
  [1248566400000, 12.6, 19.9],
  [1248652800000, 11.9, 20.2],
  [1248739200000, 11.0, 19.3],
  [1248825600000, 10.8, 17.8],
  [1248912000000, 11.8, 18.5],
  [1248998400000, 10.8, 16.1]
]
let tAveragesConst = [
  [1246406400000, 21.5],
  [1246492800000, 22.1],
  [1246579200000, 23],
  [1246665600000, 23.8],
  [1246752000000, 21.4],
  [1246838400000, 21.3],
  [1246924800000, 18.3],
  [1247011200000, 15.4],
  [1247097600000, 16.4],
  [1247184000000, 17.7],
  [1247270400000, 17.5],
  [1247356800000, 17.6],
  [1247443200000, 17.7],
  [1247529600000, 16.8],
  [1247616000000, 17.7],
  [1247702400000, 16.3],
  [1247788800000, 17.8],
  [1247875200000, 18.1],
  [1247961600000, 17.2],
  [1248048000000, 14.4],
  [1248134400000, 13.7],
  [1248220800000, 15.7],
  [1248307200000, 14.6],
  [1248393600000, 15.3],
  [1248480000000, 15.3],
  [1248566400000, 15.8],
  [1248652800000, 15.2],
  [1248739200000, 14.8],
  [1248825600000, 14.4],
  [1248912000000, 15],
  [1248998400000, 13.6]
]

let hRangesConst = JSON.parse(JSON.stringify(tRangesConst))
let hAverageConst = JSON.parse(JSON.stringify(tAveragesConst))

const tYAxisConst = { // 第一条Y轴
  labels: {
    format: '{value}\xB0C',
    style: {
      color: Highcharts.getOptions().colors[1]
    }
  },
  title: {
    text: '温度',
    style: {
      color: Highcharts.getOptions().colors[1]
    }
  },
  plotLines: [{
    color: 'red', // 线的颜色，定义为红色
    dashStyle: 'solid', // 默认值，这里定义为实线
    value: 40, // 定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
    width: 2, // 标示线的宽度，2px
    label: {
      text: 'max-t', // 标签的内容
      align: 'left', // 标签的水平位置，水平居左,默认是水平居中center
      x: 10 // 标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
    }
  },
  {
    color: 'blue', // 线的颜色，定义为红色
    dashStyle: 'solid', // 默认值，这里定义为实线
    value: 20, // 定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
    width: 2, // 标示线的宽度，2px
    label: {
      text: 'min-t', // 标签的内容
      align: 'left', // 标签的水平位置，水平居左,默认是水平居中center
      x: 10 // 标签相对于被定位的位置水平偏移的像素，重新定位，水平居左10px
    }
  }]
}

const hYAxisConst = { // 第二条Y轴
  title: {
    text: '湿度',
    style: {
      color: Highcharts.getOptions().colors[0]
    }
  },
  labels: {
    format: '{value} mm',
    style: {
      color: Highcharts.getOptions().colors[0]
    }
  },
  opposite: true
}

const tRangeSeriesConst = {
  name: '温度范围',
  data: tRangesConst,
  tooltip: {
    valueSuffix: ' °C'
  },
  type: 'arearange',
  lineWidth: 0,
  linkedTo: ':previous', // 与上一个数据列进行关联，或者直接赋值 0
  color: Highcharts.getOptions().colors[0],
  fillOpacity: 0.3,
  zIndex: 0,
  marker: {
    enabled: false
  }
}
const tAverageSeriesConst = {
  name: '平均温度',
  data: tAveragesConst,
  tooltip: {
    valueSuffix: ' °C'
  },
  zIndex: 1, // 控制显示层叠
  marker: {
    fillColor: 'white',
    lineWidth: 2,
    // eslint-disable-next-line no-undef
    lineColor: Highcharts.getOptions().colors[0]
  }
}
var i = 0
for (; i < tRangesConst.length; i++) {
  hRangesConst[i][1] = Math.round(Math.random() * 100)
  hRangesConst[i][2] = Math.round(Math.random() * 100)
  hAverageConst[i][1] = (hRangesConst[i][1] + hRangesConst[i][2]) * 0.5
}
const hRangeSeriesConst = {
  name: '范围',
  data: hRangesConst,
  tooltip: {
    valueSuffix: ' %'
  },
  type: 'arearange',
  lineWidth: 0,
  linkedTo: ':previous', // 与上一个数据列进行关联，或者直接赋值 0
  color: Highcharts.getOptions().colors[0],
  fillOpacity: 0.3,
  zIndex: 0,
  marker: {
    enabled: false
  }
}
const hAverageSeriesConst = {
  name: '湿度',
  data: hAverageConst,
  tooltip: {
    valueSuffix: ' %'
  },
  zIndex: 1, // 控制显示层叠
  marker: {
    fillColor: 'white',
    lineWidth: 2,
    // eslint-disable-next-line no-undef
    lineColor: Highcharts.getOptions().colors[0]
  }
}

export default{
  data () {
    return {
      selected_owners: [],
      owners: [],
      eqp_name: '',
      t_range: '',
      create_date: '',
      status: '',
      normalInfo: false,
      eqpid_list: [],
      client: 0,
      chart: null,
      chart2: null,
      max_t: 0,
      min_t: 0,
      temperature: [-10, 100],
      eqmForm: {
        eqmId: 1,
        createDate: '',
        isVaild: 'true',
        eqp_name: '',
        checkedAttributes: ['湿度'],
        attributes: attributesConst,
        temperatureRanges: tRangesConst,
        temperatureAverages: tAveragesConst,
        humidRanges: hRangesConst,
        humidAverage: hAverageConst
      }

    }
  },
  created () {
  },
  watch: {

  },
  methods: {
    handleCommand (command) {
      this.$message('click on item ' + command)
    },
    onConnected: function () {
      // 订阅presence主题
      console.log('已连接')
    },
    onMessage: function (topic, message) {
      console.log(message.toString())
      let series = this.chart.series[0]
      let series1 = this.chart.series[1]
      message = JSON.parse(message.toString())
      series.addPoint([message.create_time, message.temperature['t']], true, true)
      series1.addPoint([message.create_time, message.temperature['min_t'], message.temperature['max_t']], true, true)
      this.activeLastPointToolip(this.chart)
    },
    activeLastPointToolip: function (chart) {
      // eslint-disable-next-line camelcase
      var t_points = chart.series[0].points
      chart.tooltip.refresh(t_points[t_points.length - 1])
      var t_points1 = chart.series[1].points
      chart.tooltip.refresh(t_points1[t_points1.length - 1])

      // eslint-disable-next-line camelcase
      // var h_points = chart.series[1].points
      // chart.tooltip.refresh(h_points.length - 1)
    },
    drawChart: function (title, pSeries, pYAxis, reversed = false) {
      // eslint-disable-next-line no-undef
      Highcharts.setOptions({
        global: {
          useUTC: false
        }
      })
      var chart = Highcharts.chart('container', {
        chart: {
          type: 'spline',
          marginRight: 10
          // events: {
          //   load: function () {
          //     let series = this.series[0]
          //     let series1 = this.series[1]
          //     chart = this
          //     console.log(this)

          //     activeLastPointToolip(this)
          //     // activeLastPointToolip(h)

          //     setInterval(function () {
          //       // eslint-disable-next-line camelcase
          //       series.addPoint([current_time, new_t['t']], true, true)
          //       series1.addPoint([current_time, new_t['min_t'], new_t['max_t']], true, true)
          //       // console.log(this)
          //       // console.log(this.new_t)
          //       // t.addPoint([this.current_time, this.new_t['t']], true, true)
          //       activeLastPointToolip(chart)
          //     }, 2000)
          //   }
          // }
        },
        title: {
          text: title
        },
        xAxis: {
          type: 'datetime',
          crosshairs: true,
          tickPixelInterval: 150
        },
        yAxis: pYAxis,
        // yAxis: {
        //   title: {
        //     text: null
        //   }
        // },
        credits: {
          enabled: false // remove high chart logo hyper-link
        },
        legend: {
          enabled: false
        },
        series: pSeries
      })
      return chart
    },
    queryButton: function (eqmForm) {
      // Mysql({
      //   action: 'getTHistory',
      //   id: eqmForm.eqmId
      // }).then((res) => {
      //   console.log(JSON.parse(res.toString()))
      //   if (res.result === true) {
      //     console.log(JSON.parse(res.toString()))
      //   }
      // // eslint-disable-next-line handle-callback-err
      // }).catch((err) => {
      //   console.log('绘制历史温度图错误')
      // })

      Mysql({
        'action': 'getOwnersByEqpId',
        'id': eqmForm.eqmId
      }).then(
        (res) => {
          if (res.result === true) {
            this.$data.owners = res.owners
            var temp = []
            for (var item of res.select_owners) {
              temp.push(item['value'])
            }
            this.$data.selected_owners = temp
            this.$data.owners = res.owners
            this.normalInfo = true
          } else {
            alert('getOwnersByEqpId fail')
          }
        }
      // eslint-disable-next-line handle-callback-err
      ).catch((err) => {
        console.log('getOwnersByEqpId 失败')
        console.log(err)
      })
      Mysql({
        'eqp_id': eqmForm.eqmId,
        'action': 'normalInfo'
      }).then(
        (res) => {
          if (res.result === true) {
            this.$data.eqp_name = res.data['name']
            this.$data.status = res.data['status']
            this.$data.create_date = res.data['create_date']
            this.$data.temperature = [res.data['min_t'], res.data['max_t']]
            let tdata = res.tdata
            for (var i = 0; i < tdata.length; i++) {
              tdata[i][0] = parseInt(tdata[i][0])
            }
            let title = '历史温度数据'
            if (tdata.length == 0) {
              title = '暂无历史数据'
            }
            this.chart2 = Highcharts.chart('container2', {
              chart: {
                type: 'arearange',
                zoomType: 'x' // 水平缩放
              },
              title: {
                text: title
              },
              xAxis: {
                type: 'datetime',
                crosshairs: true,
                labels: {
                  formatter: function () {
                    return Highcharts.dateFormat('%Y-%m-%d', this.value)
                  }
                }
              },
              yAxis: {
                title: {
                  text: null
                }
              },
              tooltip: {
                shared: true,
                valueSuffix: '°C'
              },
              legend: {
                enabled: false // 关闭图例
              },
              series: [{
                name: '气温',
                data: tdata
              }]
            })
          }
        }
      ).catch(err => { console.log(err) })
      let series = [tAverageSeriesConst, tRangeSeriesConst, hAverageSeriesConst, hRangeSeriesConst]
      let yAxis = [tYAxisConst, hYAxisConst]
      // this.drawChart('T and H charts', series, yAxis)
      Mongo({
        'eqp_id': eqmForm.eqmId
      }).then(
        (res) => {
          if (res.result === true) {
            tAverageSeriesConst.data = res['t_average']
            tRangeSeriesConst.data = res['t_range']
            // let series = [tAverageSeriesConst, tRangeSeriesConst, hAverageSeriesConst, hRangeSeriesConst]
            let series = [tAverageSeriesConst, tRangeSeriesConst]
            // let yAxis = [tYAxisConst, hYAxisConst]
            let yAxis = [tYAxisConst]
            this.$data.chart = this.drawChart('T and H charts', series, yAxis)
            this.client = mqtt.connect('mqtt://127.0.0.1', { port: 9001 })
            this.client.on('connect', this.onConnected)
            this.client.on('message', this.onMessage)
            this.client.subscribe(eqmForm.eqmId + '/temperature')
          } else {
            if (this.$data.chart != null) {
              this.chart.destroy()
              this.client.disconnect()
            }

            alert('no such equipment')
          }
        }
      ).catch((err) => { console.log(err) })
    }
  },
  mounted () {
    Mysql({
      'action': 'equipments'
    }).then((res) => {
      let eqpList = res.data
      for (var eqp of eqpList) {
        this.$data.eqpid_list.push({ 'label': eqp['name'], 'value': eqp['id'] })
      }
    }).catch((err) => { alert('初始化设备id异常') })
  }
}
</script>
