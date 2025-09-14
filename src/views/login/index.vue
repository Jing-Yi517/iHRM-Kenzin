<template>
  <div class="loginContainer">
    <div class="loginBox">
      <div class="left">
        <div class="logo">iHRM</div>
        <div class="welcome-text">
          <div class="welcome">Welcome Back!</div>
          <div>Please sign in to access more features</div>
        </div>
      </div>
      <div class="right">
        <h2 style="cursor: default">Sign in</h2>
        <el-form ref="loginForm" :model="formModel" :rules="rules">
          <el-form-item label="Account" class="login-account" prop="account">
            <el-input v-model="formModel.account" />
          </el-form-item>
          <el-form-item label="Password" class="login-password" prop="password">
            <el-input v-model="formModel.password" show-password />
          </el-form-item>
          <div class="jump-to-regis">
            <div>New user <span class="sign-up-btn">Contact admin</span></div>
            <div class="change-password">Forget Password?</div>
          </div>
          <el-form-item class="sign-in-btn">
            <el-button @click="handleSignIn">Sign in</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formModel: { account: '', password: '' },
      rules: {
        account: [
          { validator: function(rule, value, callback) {
            if (!value) {
              callback(new Error('请输入账号'))
            } else {
              callback() // 校验通过
            }
          },
          trigger: 'blur'
          },
          { pattern: /^1[3-9]\d{9}$/, message: '请检查手机号码格式', trigger: 'blur' }
        ],
        password: [
          { validator: function(rule, value, callback) {
            if (!value) {
              callback(new Error('请输入密码'))
            } else if (value.length < 6 || value.length > 16) {
              callback(new Error('请输入6-16位的密码'))
            } else {
              callback() // 校验通过
            }
          }, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleSignIn() {
      await this.$refs.loginForm.validate()
      this.$store.dispatch('user/userLogin', this.formModel)
    }
  }
}
</script>

<style scoped lang="scss">
.loginContainer {
  position: relative;
  height: 100%;
  background-color: rgb(227, 210, 255);
  .loginBox{
    width: 60%;
    height: 70%;
    background-color: #fff;
    border-radius: 20px;
    margin: auto;
    position: absolute;
    top: 10%;
    left: 20%;
    display: flex;
    justify-content: space-between;

    .left{
      width: 45%;
      background-image: url('~@/assets/common/login-background.jpg');
      background-size:cover;
      position: relative;

      .logo{
        position: absolute;
        font-size: 20px;
        font-weight: 800;
        color:#fff;
        cursor: default;
        left: 2%;
        top: 2%;
      }
      .welcome-text{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 150px auto;
        color:#fff;
        cursor: default;
        .welcome{
          font-size: 22px;
          margin-bottom: 10px;
          font-weight: 600;
        }
      }
    }
    .right {
      width: 55%;
      background-color: #fff;
      padding: 80px;
      color: #797792;

      /* 输入框整体 */
      ::v-deep .el-input__inner {
        border: none;
        border-bottom: 2px solid #ccc; /* 默认浅灰色下划线 */
        border-radius: 0; /* 去掉圆角 */
        background-color: transparent; /* 透明背景 */
        color: #333; /* 输入文字颜色深灰 */
        font-size: 14px;
        padding: 6px 0; /* 保证文字上下有点空间 */
        transition: all 0.3s ease; /* 平滑过渡效果 */
      }

      /* hover 效果 */
      ::v-deep .el-input__inner:hover {
        border-bottom-color: #999;
      }

      /* focus 聚焦时 */
      ::v-deep .el-input__inner:focus {
        border-bottom: 2px solid rgb(147, 119, 203);
        outline: none;
        color: #222; /* 聚焦时字体更深 */
      }

      /* 错误状态下 */
      ::v-deep(.is-error .el-input__inner) {
        border-bottom: 2px solid #f56c6c !important; /* 红色提示 */
      }

      /* 错误提示文字 */
      ::v-deep(.el-form-item__error) {
        color: #f56c6c;
        font-size: 12px;
        margin-top: 4px;
      }

      .login-password{
        margin-bottom: 30px;
      }
      .jump-to-regis {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        margin-bottom: 30px;
        .sign-up-btn{
          color: rgb(140, 130, 160);
          font-weight: 500;
          cursor: pointer;
          &:hover{
            text-decoration: underline;
          }
        }
        .change-password{
          color: rgb(140, 130, 160);
          font-weight: 500;
          cursor: pointer;
          &:hover{
            text-decoration: underline;
          }
        }
      }
      .sign-in-btn{
        ::v-deep .el-form-item__content{
          display: flex;
          justify-content: center;
        }
        ::v-deep .el-button{
          width: 40%;
          border-radius: 20px;
          background-color: rgb(147, 119, 203);
          color:#fff;
          &:hover{
            animation: button-move-up .5s forwards linear;
          }
        }
      }
    }
  }
}

@keyframes button-move-up {
  0%{
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
