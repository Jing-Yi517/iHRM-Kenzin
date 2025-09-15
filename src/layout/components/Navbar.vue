<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <div v-else class="default-avatar">{{ username?.charAt(0) }}</div>
          <span class="username">{{ username }}</span>
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/Jing-Yi517/iHRM-Kenzin">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" @click.prevent="handlePasswordChange">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 修改密码弹窗 -->
      <el-dialog
        title="修改密码"
        :visible.sync="passwordChangeVisible"
        :modal-append-to-body="false"
        width="500px"
        @close="handleDialogClose"
      >
        <el-form
          ref="passwordForm"
          :model="passwordChangeForm"
          label-width="120px"
          :rules="passwordRules"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passwordChangeForm.oldPassword" show-password size="small" />
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-input v-model="passwordChangeForm.password" show-password size="small" />
          </el-form-item>
          <el-form-item label="确认密码" prop="rePassword">
            <el-input v-model="passwordChangeForm.rePassword" show-password size="small" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleDialogClose">取 消</el-button>
          <el-button type="primary" @click="submitPasswordChange">确认修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { Message } from 'element-ui'
import { userChangePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      passwordChangeVisible: false,
      passwordChangeForm: {
        password: '',
        oldPassword: '',
        rePassword: ''
      },
      passwordRules: {
        oldPassword: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请输入旧密码'))
              if (value.length > 16 || value.length < 6) return callback(new Error('请输入6-16位正确格式的密码'))
              callback()
            },
            trigger: 'blur'
          }
        ],
        password: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请输入新密码'))
              if (value.length > 16 || value.length < 6) return callback(new Error('请输入6-16位正确格式的密码'))
              if (value === this.passwordChangeForm.oldPassword) return callback(new Error('新密码不可以和旧密码一致'))
              callback()
            },
            trigger: 'blur'
          }
        ],
        rePassword: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('请再次输入新密码'))
              if (value.length > 16 || value.length < 6) return callback(new Error('请输入6-16位正确格式的密码'))
              if (value !== this.passwordChangeForm.password) return callback(new Error('前后两次密码输入不一致'))
              callback()
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'username'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/userLogout')
      Message({ type: 'success', message: '退出登录成功' })
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handlePasswordChange() {
      this.passwordChangeVisible = true
    },
    async submitPasswordChange() {
      await this.$refs.passwordForm.validate
      await userChangePassword(this.passwordChangeForm.oldPassword, this.passwordChangeForm.password)
      Message.success('密码修改成功')
      this.$refs.passwordForm.resetFields()
      this.passwordChangeVisible = false
    },
    handleDialogClose() {
      this.$refs.passwordForm.resetFields()
      this.passwordChangeVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .default-avatar{
          width: 30px;
          height: 30px;
          border-radius: 50%;
          line-height: 30px;
          text-align: center;
          background-color: #04c9be;
          color:#fff;
          margin-right: 10px;
        }
        .username{
          margin-right: 10px;
          font-size: 16px;
          font-weight: 600;
        }
        .el-icon-setting{
          font-size: 20px;
        }
      }
    }
  }
}
</style>
