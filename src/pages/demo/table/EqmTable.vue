<template>
    <el-table :data="eqmList" style="100%" label-position="top">
        <el-table-column prop="id" label="设备ID" min-width="30%">
        </el-table-column>
        <el-table-column prop="name" label="设备名称" min-width="20%">
        </el-table-column>
        <el-table-column prop="create_date" label="创建时间" min-width="20%">
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="10%">
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="20">
            <template scope="scope" >
                <el-button size="small" type="primary" icon="el-icon-edit" @click="openEditDialog(scope.$index, scope.row.propertities)"></el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="openDeleteDialog(scope.$index, scope.row.propertities)"></el-button>
            </template>
        </el-table-column>
        <el-table-column label="监控" align="center" min-width="10%">
          <template scope="scope" >
                <el-button size="small" type="primary" icon="el-icon-caret-right" @click="openWatchDialog(scope.$index, scope.row.propertities)"></el-button>
            </template>
        </el-table-column>
    <el-dialog title="视频监控" :visible.sync="watchDialogVisible" width="30%" :append-to-body="true">
       <div class="player-container">
    <video-player class="vjs-custom-skin" :options="playerOptions"></video-player>
  </div>

      <!-- <video
     id="livestream"
     class="video-js vjs-default-skin vjs-big-play-centered"
     controls
     autoplay
     preload="auto"
     data-setup='{"techorder" : ["flash","html5] }'>
     <source src="rtmp://dev.svideo.com.cn/myapp/50047" type="rtmp/mp4">
   </video> -->
    </el-dialog>
    <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%" :append-to-body="true">
        <span>确认删除?</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取 消</el-button>
            <el-button type="danger" @click="handleDelete">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="editDialogVisible" width="30%" :append-to-body="true">
        <el-form ref="editForm" :model="editForm" label-width="80%" label-position="top">
            <el-form-item label="设备编号" prop="id">
                <el-input v-model="editForm.id" readonly></el-input>
            </el-form-item>
            <el-form-item label="设备名称" prop="name">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="create_date">
                <el-input v-model="editForm.create_date" ></el-input>
            </el-form-item>
            <el-form-item label="状态"  prop="status">
                <el-input v-model="editForm.status"></el-input>
            </el-form-item>
             <el-form-item label="维护人员">
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
// 引入video样式
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

export default {
  data () {
    return {
      playerOptions: {
        crossOrigin: 'Anonymous',
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        controls: true, // 控制条
        preload: 'auto', // 视频预加载
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL',
          src: 'http://dev.svideo.com.cn:1880/hlslive/50047.m3u8'
        }, {
          type: 'application/x-mpegURL',
          src: 'http://dev.svideo.com.cn:1880/hlslive/14859.m3u8'
        }],
        poster: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg', // 你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
      watchDialogVisible: false,
      selected_owners: [],
      owners: [],
      eqmList: [

      ],
      deleteDialogVisible: false,
      editDialogVisible: false,
      itemIndex: -1,
      editForm: {
        id: '',
        create_date: '',
        status: '' }
    }
  },
  methods: {
    openWatchDialog: function (index, row) {
      var sourceForm = this.$data.eqmList[index]
      if (sourceForm['url'] !== null) {
        console.log(sourceForm['url'])
        this.playerOptions.sources[0].src = sourceForm.url
        this.watchDialogVisible = true
      } else {
        alert('该设备未指定视频源')
      }
    },
    handleDelete: function () {
      // handleDelete(scope.$index, scope.row.properties)
      let deleteItem = this.$data.eqmList[this.$data.itemIndex]
      Mysql({
        action: 'deleteEqp',
        id: deleteItem.id
      }).then((res) => {
        if (res.result === true) {
          alert('删除成功')
          this.$data.eqmList.splice(this.$data.itemIndex, 1)
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
      var sourceForm = this.$data.eqmList[this.$data.itemIndex]
      for (let key in sourceForm) {
        this.$data.editForm[key] = sourceForm[key]
      }
      let eqp_id = this.$data.editForm['id']
      Mysql({
        'action': 'getOwnersByEqpId',
        'id': eqp_id
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
          } else {
            alert('getOwnersByEqpId fail')
          }
        }
      // eslint-disable-next-line handle-callback-err
      ).catch((err) => {
        console.log('getOwnersByEqpId 失败')
        console.log(err)
      })
      console.log(this.selected_owners)
    },
    handleEdit: function () {
      let para = {}
      para['action'] = 'editEqp'
      for (let key in this.$data.editForm) {
        para[key] = this.$data.editForm[key]
      }
      para['owners'] = this.$data.selected_owners
      Mysql(
        para
      ).then((res) => {
        if (res.result === true) {
          for (let key in this.$data.editForm) {
            this.$data.eqmList[this.$data.itemIndex][key] = this.$data.editForm[key]
          }
          alert('修改成功')
        } else {
          alert('修改失败')
        }
      // eslint-disable-next-line handle-callback-err
      }).catch((err) => {
        console.log('修改设备的axios异常')
      })
      this.$data.eqmList[this.$data.itemIndex]['status'] = this.$data.editForm['status']
      console.log(this.$data.eqmList)
      this.$data.editDialogVisible = false
    },
    resetForm: function (refname) {
      this.$refs[refname].resetFields()
    },
    handleClose (done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    }

  },
  mounted () {
    Mysql({
      action: 'equipments'
    }).then((response) => {
      this.$data.eqmList = response.data
      // this.initVideo()
      // console.log('获取成功')
      // console.log(this.$data.eqmList)
    // eslint-disable-next-line handle-callback-err
    }).catch((err) => {
      console.log(err)
      alert('获取设备列表失败')
    })
  }
}
</script>
