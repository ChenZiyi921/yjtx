<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Badge :dot="!!messageUnreadCount"> -->
      <Badge>
        <Avatar :src="userAvatar" />
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <!-- <DropdownItem name="message">
          消息中心<Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem> -->
        <DropdownItem name="User_Information">{{
          $t("User_Information")
        }}</DropdownItem>
        <DropdownItem name="Change_Password">{{
          $t("Change_Password")
        }}</DropdownItem>
        <DropdownItem name="Logout">{{ $t("loginOutText") }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal
      v-model="modalUserInformation"
      class-name="vertical-center-modal"
      title="User Information"
      width="1000"
    >
      <Form
        :model="userInformation"
        label-position="left"
        :label-width="120"
        inline
      >
        <FormItem label="User Name:" class="user-info-item">{{
          userInformation.loginname
        }}</FormItem>
        <FormItem label="User ID:" class="user-info-item">{{
          userInformation.userid
        }}</FormItem>
        <FormItem label="First Name:" class="user-info-item">{{
          userInformation.firstname
        }}</FormItem>
        <FormItem label="Last Name:" class="user-info-item">{{
          userInformation.lastname
        }}</FormItem>
        <FormItem label="Status:" class="user-info-item">{{
          userInformation.userstatus
        }}</FormItem>
        <FormItem label="Expire Date:" class="user-info-item">{{
          userInformation.userexpiredate
        }}</FormItem>
        <FormItem label="Email:" class="user-info-item">{{
          userInformation.useremail
        }}</FormItem>
        <FormItem label="Phone No.:" class="user-info-item">{{
          userInformation.userphone
        }}</FormItem>
        <FormItem label="Department:" class="user-info-item">{{
          userInformation.userdept
        }}</FormItem>
        <FormItem label="Title:" class="user-info-item">{{
          userInformation.usertitile
        }}</FormItem>
        <FormItem label="Description:" class="user-info-item">{{
          userInformation.usermemo
        }}</FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" @click="modalUserInformation = false"
          >Close</Button
        >
      </div>
    </Modal>
    <change-password
      :modalChangePwd="modalChangePwd"
      :userid="userid"
      @change-password-success="changePasswordSuccess"
      @change-password-cancel="changePasswordCancel"
    ></change-password>
  </div>
</template>

<script>
import "./user.less";
import { mapActions } from "vuex";
import { queryUserByName } from "@/api/global";
import ChangePassword from "@/components/change-password/change-password";

export default {
  name: "User",
  components: {
    ChangePassword
  },
  props: {
    userAvatar: {
      type: String,
      default: ""
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      modalChangePwd: false,
      modalUserInformation: false,
      userInformation: {},
      userid: 0
    };
  },
  mounted() {
    this.userid = this.$store.state.user.userId.userid;
    queryUserByName({ loginname: "admin" }).then(({ data }) => {
      if (data.code === 200) {
        this.userInformation = data.data.content[0];
      }
    });
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    logout() {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: "login"
        });
      });
    },
    message() {
      this.$router.push({
        name: "message_page"
      });
    },
    changePasswordSuccess() {
      this.modalChangePwd = false;
    },
    changePasswordCancel() {
      this.modalChangePwd = false;
    },
    handleClick(name) {
      switch (name) {
        case "Logout":
          this.logout();
          break;
        case "User_Information":
          this.modalUserInformation = true;
          break;
        case "Change_Password":
          this.modalChangePwd = true;
          break;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.user-info-item {
  width: 300px;
  padding: 0 20px;
}
</style>
