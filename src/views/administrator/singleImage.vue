<template>
  <div class="upload-container-admin">
    <el-upload :multiple="false" :show-file-list="false" :http-request="httpRequest" class="image-uploader" list-type="picture-card" action="http://songsong.fun/backstage/back/file/upload?type=8">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"/>
    </el-upload>
  </div>
</template>

<script>
  import { Loading } from 'element-ui'
  import axios from 'axios'

  export default {
    name: 'SingleImageUpload',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        tempUrl: '',
        dataObj: {
          token: '',
          key: ''
        },
        imageUrl: null,
        imgPrefix: 'http://songsong.fun/file' // 图片前缀
      }
    },
    watch: {
      value() {
        this.setData()
      }
    },
    created() {
      this.setData()
      this.dataObj.token = localStorage.getItem('Admin-Token')
    },
    methods: {
      setData() {
        this.imageUrl = this.value ? (this.imgPrefix + this.value) : null
      },
      rmImage() {
        this.emitInput('')
      },
      emitInput(val) {
        this.$emit('input', val)
      },
      handleImageSuccess() {
        this.emitInput(this.tempUrl)
      },
      async httpRequest(option) {
        const loadingInstance = Loading.service({
          fullscreen: true,
          text: '上传图片中...'
        })
        // formData
        const formData = new FormData()
        formData.append(option.filename, option.file)
        const options = {
         // 设置axios的参数
         url: 'http://songsong.fun/backstage/back/file/upload?type=8',
         data: formData,
         method: 'post',
         headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('Admin-Token')
         }
        }
        axios(options).then((res) => {
          loadingInstance.close()
          if (res.data.code !== 200) {
            return this.$notify({ title: '失败', message: '上传文件失败', type: 'error', duration: 2000 })
          }
          this.imageUrl = this.imgPrefix + res.data.data.originalUrl
          this.$emit('update:value', res.data.data.originalUrl)
        })

        return null
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  @import "~@/styles/mixin.scss";

  .upload-container-admin {
    width: 100%;
    position: relative;
    @include clearfix;

    .image-uploader {
      // width: 60%;
      // float: left;
    }

    .el-upload {
      width: 146px;
      height: 146px;
    }

    .image-preview {
      width: 200px;
      height: 200px;
      position: relative;
      border: 1px dashed #d9d9d9;
      float: left;
      margin-left: 50px;

      .image-preview-wrapper {
        position: relative;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .image-preview-action {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
        cursor: pointer;
        text-align: center;
        line-height: 200px;

        .el-icon-delete {
          font-size: 36px;
        }
      }

      &:hover {
        .image-preview-action {
          opacity: 1;
        }
      }
    }
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 146px;
    height: 146px;
    line-height: 146px;
    text-align: center;
  }

  .avatar {
    width: 146px;
    height: 146px;
  }

</style>
