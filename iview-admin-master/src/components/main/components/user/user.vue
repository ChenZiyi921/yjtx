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
      v-model="modal"
      class-name="vertical-center-modal"
      title="Change Password"
    >
      <Form :model="changePwd" label-position="left" :label-width="120">
        <FormItem label="Old Password">
          <Input type="password" password />
        </FormItem>
        <FormItem label="New Password">
          <Input type="password" password />
        </FormItem>
        <FormItem label="Retype Password">
          <Input type="password" password />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" @click="modal = false">Cancel</Button>
        <Button type="info" size="large" @click="modal = false">OK</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import "./user.less";
import { mapActions } from "vuex";
export default {
  name: "User",
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
      modal: false,
      changePwd: {}
    };
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
    handleClick(name) {
      switch (name) {
        case "Logout":
          this.logout();
          break;
        case "User_Information":
          break;
        case "Change_Password":
          this.modal = true;
          break;
      }
    }
  }
};
</script>
