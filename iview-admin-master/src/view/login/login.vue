<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <h1 class="login-title">ZiVA Intelligence Center</h1>
      <!-- <Card icon="log-in" title="ZiVA Intelligence Center" :bordered="false"> -->
      <div class="form-con">
        <login-form @on-success-valid="handleSubmit"></login-form>
        <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
      </div>
      <!-- </Card> -->
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          });
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login-con {
  width: 400px;
  padding: 20px 20px 0 20px;
  border-radius: 10px;
  background: #fff;
}
.login-title {
  padding-bottom: 20px;
  font-size: 30px;
}
</style>
