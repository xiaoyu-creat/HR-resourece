<template>
  <div>
    <!-- action：远程服务器接口上传地址 -->
    <el-upload
      v-loading="loading"
      class="elupload"
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="onPreview"
      :on-remove="onRemove"
      :on-change="onChange"
      :http-request="onHttpRequest"
      :before-upload="beforeUpload"
      :limit="1"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 预览图片的弹窗 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialog"
      width="30%"
    >
      <img style="width:100%" :src="previewImgUrl">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDrY4MQGtIVWJtFMI30nNjsnTuCHBsLZZL',
  SecretKey: 'a0HOL6iBTbbP1P3iHertkQuFOOEsMemj'
})

export default {
  name: 'UploadImg',
  props: {
    defaultUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      previewDialog: false,
      previewImgUrl: '',
      loading: false
    }
  },
  watch: {
    defaultUrl() {
      this.fileList.push({
        name: 'default', url: this.defaultUrl
      })
    }
  },
  created() {

  },
  methods: {
    onPreview(file) {
      this.previewImgUrl = file.url
      this.previewDialog = true
    },
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    beforeUpload(file) {
      // 循环查找某个数据 是否在数组中
      // 1.some() 查找某一个数据是否在数组中 返回布尔值
      // 2.find() 查找 返回找到的哪一项
      // 3.findIndex() 查找，找到的哪一项的索引 更复杂的查找
      // 4.indexOf('1') 查找，返回的索引[{id:1},{id:2}] 用于简单类型数组
      // 5.includes 查找 返回布尔值，简单类型数组

      // 文件类型
      const fileType = ['image/jpeg', 'image/gif']
      const ishas = fileType.includes(file.type)
      if (!ishas) {
        this.$message.error('只允许上传' + fileType.join(',') + '的文件类型')
        return false
      }
      // 限制上传图片大小
      const maxsize = 1 * 1024 * 1024
      if (file.size > maxsize) {
        this.$message.error('文件不能超过' + maxsize)
        return false
      }
    },
    // 1.本地选择上传 原来有一个数据+选择的数据
    // 2.请求上传成功/失败 原来有一个数据
    onChange(file, fileList) {
      // console.log(file, fileList)
      // this.fileList.push(file)
      this.fileList = fileList
    },
    onHttpRequest({ file }) {
      this.loading = true
      cos.putObject({
        Bucket: 'zyy-1314348529', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-shanghai', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        // err 上传失败的信息 如果上传成功 err为null
        // data 上传成功的信息
        if (err) return this.$message.error('上传图片失败')
        this.loading = false
        console.log('http://' + data.Location)
        this.$emit('on_success', {
          imgUrl: 'http://' + data.Location
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.elupload{
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
