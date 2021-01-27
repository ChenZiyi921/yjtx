<template>
  <Modal
    v-model="modalChangePwd"
    :closable="false"
    class-name="vertical-center-modal"
    title="Change Password"
  >
    <Form :model="changePwd" label-position="left" :label-width="120">
      <FormItem label="New Password">
        <Input type="password" password v-model="changePwd.password" />
      </FormItem>
      <FormItem label="Retype Password">
        <Input type="password" password v-model="password" />
      </FormItem>
    </Form>
    <div slot="footer">
      <Button size="large" @click="changeUserPasswordCancel">Cancel</Button>
      <Button type="info" size="large" @click="changeUserPasswordSubmit"
        >OK</Button
      >
    </div>
  </Modal>
</template>

<script>
import { changeUserPassword } from "@/api/global";

export default {
  name: "",
  props: {
    userid: {
      type: Number,
      default: 0
    },
    modalChangePwd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      changePwd: {
        userid: "",
        password: ""
      },
      password: ""
    };
  },
  mounted() {},
  methods: {
    changeUserPasswordCancel() {
      this.$emit("change-password-cancel");
    },
    changeUserPasswordSubmit() {
      if (
        this.changePwd.password !== "" &&
        this.changePwd.password === this.password
      ) {
        this.changePwd.userid = this.userid;
        changeUserPassword(this.changePwd).then(res => {
          this.$Message.success("Operation success!");
          this.$emit("change-password-success");
        });
      } else {
        this.$Message.error("Inconsistent password input!");
      }
    }
  }
};
</script>
<style lang="less" scoped></style>
