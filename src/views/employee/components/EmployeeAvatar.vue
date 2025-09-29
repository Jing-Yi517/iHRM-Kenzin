<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="handleAvatarChange"
    :http-request="handleUploadImage"
    :limit="1"
  >
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  methods: {
    isPicture(type) {
      const pics = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
      if (pics.includes(type)) return true
      return false
    },
    handleAvatarChange(file) {
      console.log(file)
      if (this.isPicture(file.type) && file.size / 1024 / 1024 < 5) {
        return true
      }
      return false
    },
    handleUploadImage(params) {
      const cos = new COS({
        SecretId: 'AKID1ub4JL9kHcjcHiv67uTyNk281A81oaO4', // 密匙
        SecretKey: 'Voyuc6NRHxY3WvAC1d2DAtNdhYDhx0ui'// 密钥
      })
      cos.putObject({
        Bucket: 'ihrm-1380999860', // 存储桶名称
        Region: 'ap-chongqing', // 地域名称
        Key: params.file.name, // 文件名
        StorageClass: 'STANDARD',
        Body: params.file // 文件对象
      }, (err, data) => {
        if (data.statusCode === 200 && data.Location) {
          // 如果响应码为 200 且获取到了文件的地址，则进行后续操作
          this.$emit('input', 'https://' + data.Location)
        } else {
          console.log('文件上传至腾讯云出现错误', err)
          this.$message({
            type: 'error',
            message: '图片上传至腾讯云出现错误'
          })
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
.avatar-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 178px;
  height: 178px;
  overflow: hidden;
  display: inline-block;
}
.avatar-uploader:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
