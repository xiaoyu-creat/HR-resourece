<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>

    <!-- <UploadExcel :on-success="handleSuccess" :before-upload="beforeUpload" /> -->
    <uploadImg @on-success="onSuccess1" />
    <uploadImg @on-success="onSuccess2" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    // this.$store.dispatch('user/getUserInfo')
  },
  methods: {
    onSuccess1(val) {
      console.log(123, val)
    },
    onSuccess2(val) {
      console.log(456, val)
    }
    // handleSuccess(data) {
    //   console.log('data', data)
    // // 做具体的业务逻辑操作
    // },
    // beforeUpload(file) {
    //   console.log(file)
    //   if (file.size > 1024) {
    //     this.$message.error('文件太大')
    //     return false
    //   }
    //   return true
    // }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
