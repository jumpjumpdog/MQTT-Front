/* eslint-disable no-undef */
/* eslint-disable no-tabs */
<template>
        <el-form v-model="eqmForm">
            <el-row>
                <el-col :span="2"><span>设备编号</span></el-col>
                <el-col :span="2">
                    <el-input v-model="eqmForm.eqmId"></el-input>
                </el-col>
                <el-col :span="4" :offset="2">
                <el-checkbox-group v-model="eqmForm.checkedAttributes" :min="1" :max="2">
                    <el-checkbox v-for="attribute in eqmForm.attributes" :label="attribute" :key="attribute">
                        {{attribute}}
                    </el-checkbox>
                </el-checkbox-group>
                </el-col>
                <el-col :span="2" :offset="1">
                    <el-button type="primary" @click="queryButton(eqmForm)">查询</el-button>
                </el-col>
            </el-row>
            <el-form-item>
                <div id="container" style="min-width:400px;height:400px"></div>
            </el-form-item>
        </el-form>
</template>
<script>
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
  }
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
console.log(hAverageConst)
console.log(tAveragesConst)
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
      eqmForm: { 'eqmId': 1,
        'createDate': '2016-05-02',
        'isVaild': 'true',
        checkedAttributes: ['湿度'],
        attributes: attributesConst,
        temperatureRanges: tRangesConst,
        temperatureAverages: tAveragesConst,
        humidRanges: hRangesConst,
        humidAverage: hAverageConst
      }

    }
  },
  computed: {
    checkedAttributes () {
      return this.$data.eqmForm.checkedAttributes
    }
  },
  watch: {
    // checkedAttributes (newValue, oldValue) {
    //   console.log(newValue)
    //   console.log(oldValue)
    //   if (newValue.length === 2) {
    //     let series = [tAverageSeriesConst, tRangeSeriesConst, hAverageSeriesConst, hRangeSeriesConst]
    //     let yAxis = [tYAxisConst, hYAxisConst]
    //     this.drawChart('T and H charts', series, yAxis)
    //   } else if (newValue.length === 0) {
    //     this.drawChart('T and H charts', [], [])
    //   } else if (newValue[0] === '温度') {
    //     let series = [tAverageSeriesConst, tRangeSeriesConst]
    //     let yAxis = [tYAxisConst]
    //     this.drawChart('T charts', series, yAxis)
    //   } else if (newValue[0] === '湿度') {
    //     let series = [hAverageSeriesConst, hRangeSeriesConst]
    //     let yAxis = [hYAxisConst]
    //     this.drawChart('H charts', series, yAxis)
    //   }
    // }
  },
  methods: {
    drawChart: function (title, pSeries, pYAxis, reversed = false) {
      // eslint-disable-next-line no-undef
      console.log(pSeries.length)
      Highcharts.chart('container', {
        title: {
          text: title
        },
        xAxis: {
          type: 'datetime',
          crosshairs: true
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
        series: pSeries
      })
    },
    queryButton: function (eqmForm) {
      console.log(eqmForm)
      this.$data.eqmForm = { 'eqmId': 2,
        'createDate': '2016-05-02',
        'isVaild': 'true',
        checkedAttributes: ['湿度'],
        attributes: attributesConst,
        temperatureRanges: tRangesConst,
        temperatureAverages: tAveragesConst,
        humidRanges: hRangesConst,
        humidAverage: hAverageConst
      }
      let series = [tAverageSeriesConst, tRangeSeriesConst, hAverageSeriesConst, hRangeSeriesConst]
      let yAxis = [tYAxisConst, hYAxisConst]
      this.drawChart('T and H charts', series, yAxis)
    }
  },
  mounted () {
    let series = [tAverageSeriesConst, tRangeSeriesConst, hAverageSeriesConst, hRangeSeriesConst]
    let yAxis = [tYAxisConst, hYAxisConst]
    this.drawChart('T and H charts', series, yAxis)
  }
}
</script>
