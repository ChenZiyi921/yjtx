<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <h1 class="login-title">ZiVA Intelligence Center</h1>
      <div class="form-con">
        <login-form @on-success-valid="handleSubmit"></login-form>
      </div>
    </div>
    <Modal
      title="Sorry, Login failure"
      v-model="modal"
      class-name="vertical-center-modal"
      cancel-text=""
      ok-text="Close"
    >
      <p>{{ content }}</p>
    </Modal>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      modal: false,
      content: ""
    };
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then(data => {
        if (data.code !== 200) {
          this.modal = true;
          this.content = data.msg;
          return;
        }
        this.getUserInfo().then(data => {
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
