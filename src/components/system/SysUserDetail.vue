<template>
  <div style="width: 50%;padding-top: 3%;padding-left: 20%">
    <el-form ref="form" :model="sysUser" label-width="120px">
      <el-form-item label="用户真实姓名">
        <el-input v-model="sysUser.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户登录名">
        <el-input v-model="sysUser.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户密码">
        <el-input v-model="sysUser.password" clearable show-password></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="sysUser.phone" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="sysUser.remark" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户头像">
        <el-upload
          class="avatar-uploader"
          action="/manage/file/saveImage"
          :show-file-list="false"
          :on-success="pictureSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="sysUser.headUrl" :src="sysUser.headUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item style="padding-left: 50%">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
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
<script>
  export default {
    data() {
      return {
        sysUser: {
          id: 0,
          name: '',
          username: '',
          password: '',
          phone: '',
          remark: '',
          headUrl: ''
        }
      }
    },
    created() {
      this.sysUser.id = this.$route.query.userId;
      if (this.sysUser.id > 0) {
        this.getInfo(this.sysUser.id)
      }
    },
    methods: {
      getInfo: function (sysUserId) {
        let _this = this;
        _this.getRequest('/permission/getUserById?id=' + sysUserId).then(resp=> {
          if (resp && resp.status === 200 && resp.data.errCode === 0) {
            _this.sysUser.name = resp.data.data.name;
            _this.sysUser.username = resp.data.data.username;
            _this.sysUser.password = resp.data.data.password;
            _this.sysUser.phone = resp.data.data.phone;
            _this.sysUser.remark = resp.data.data.remark;
            _this.sysUser.headUrl = resp.data.data.headUrl;
          }
        });
      },
      onSubmit: function () {
        let _this = this;
        console.log(JSON.stringify(_this.sysUser));
        const loading = _this.$loading({
          lock: true,
          text: '保存中,请稍后。。。',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        _this.postRequest('/permission/user',_this.sysUser).then(resp=> {
          loading.close();
          console.log(resp.status + '---' + resp.data.errCode)
          if (resp && resp.status === 200 && resp.data.errCode === 0) {
            _this.$alert('操作成功', 'result', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push({path: '/sys/userList'});
              }
            });
          } else {
            _this.$alert('操作失败-' + resp.data.errMsg, 'result', {
              confirmButtonText: '确定',
              callback: action => {
              }
            });
          }
        }).catch(function (error) {
          loading.close();
          _this.$alert('操作失败-系统异常', 'result', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        })
      }
    }
  }
</script>

<style scoped>

</style>
