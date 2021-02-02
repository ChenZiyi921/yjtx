<template>
  <div class="">
    <Tabs name="userTable" value="Role">
      <TabPane label="Role" name="Role" tab="userTable">
        <Role />
      </TabPane>
      <TabPane
        label="Staff"
        name="Staff"
        tab="userTable"
        style="display: flex;"
      >
        <div style="flex: 1;">
          <Form label-position="left" :label-width="0" inline>
            <FormItem label="">
              <Button type="success" ghost @click="queryUserList"
                >Refresh</Button
              >
            </FormItem>
            <FormItem label="">
              <Button type="success" @click="newUserInfo">New</Button>
            </FormItem>
            <!-- <FormItem label="">
              <Button type="info">Search</Button>
            </FormItem> -->
          </Form>
          <Table
            border
            :columns="columns"
            :data="data"
            :loading="loading"
            @on-row-click="onRowClick"
          >
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button
                type="info"
                ghost
                size="small"
                class="mr10"
                @click.stop="editUserInfo(row)"
                >Edit</Button
              >
              <Button
                type="error"
                size="small"
                class="mr10"
                @click.stop="delUserInfo(row)"
                >Delete</Button
              >
              <Button
                type="error"
                size="small"
                @click.stop="changeUserPwd(row)"
                ghost
                >Password</Button
              >
            </template>
          </Table>
          <Page
            :current="queryForm.currPage"
            :total="queryForm.total"
            :page-size="queryForm.pageSize"
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
            show-elevator
            show-sizer
            show-total
            style="margin-top:10px;"
          />
        </div>
        <div class="user-detail">
          <Form :model="userDetail" label-position="left" :label-width="110">
            <FormItem label="Login Name">
              <Input
                v-model="userDetail.loginname"
                :disabled="userDetailDisabled"
                style="max-width: 187px;"
              />
            </FormItem>
            <template v-if="userDetailIsEdit && showPassword">
              <FormItem label="Password">
                <Input
                  v-model="userDetail.password"
                  :disabled="userDetailDisabled"
                  style="max-width: 187px;"
                />
              </FormItem>
              <FormItem label="Retype Password">
                <Input
                  v-model="passwordRetype"
                  :disabled="userDetailDisabled"
                  style="max-width: 187px;"
                />
              </FormItem>
            </template>
            <FormItem label="User ID">
              <Input
                v-model="userDetail.userid"
                :disabled="userDetailDisabled"
                style="max-width: 187px;"
              />
            </FormItem>
            <FormItem label="First Name">
              <Input
                v-model="userDetail.firstname"
                :disabled="userDetailDisabled"
                style="max-width: 187px;"
              />
            </FormItem>
            <FormItem label="Last Name">
              <Input
                v-model="userDetail.lastname"
                :disabled="userDetailDisabled"
                style="max-width: 187px;"
              />
            </FormItem>
            <FormItem label="Status">
              <Input
                v-model="userDetail.userstatus"
                :disabled="userDetailDisabled"
                style="max-width: 187px;"
              />
            </FormItem>
            <FormItem label="Expire Date">
              <DatePicker
                v-model="userDetail.userexpiredate"
                type="date"
                :options="options"
                placeholder="Select date"
                :disabled="userDetailDisabled"
              ></DatePicker>
            </FormItem>
            <FormItem label="Email">
              <Input
                v-model="userDetail.useremail"
                :disabled="userDetailDisabled"
              />
            </FormItem>
            <FormItem label="Phone Number">
              <Input
                v-model="userDetail.userphone"
                :disabled="userDetailDisabled"
              />
            </FormItem>
            <FormItem label="Department">
              <Input
                v-model="userDetail.userdept"
                :disabled="userDetailDisabled"
              />
            </FormItem>
            <FormItem label="Title">
              <Input
                v-model="userDetail.usertitile"
                :disabled="userDetailDisabled"
              />
            </FormItem>
            <FormItem label="Role">
              <Select v-model="userDetail.role" :disabled="userDetailDisabled">
                <Option
                  v-for="item in roleList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="Description">
              <Input
                v-model="userDetail.usermemo"
                type="textarea"
                :rows="4"
                :disabled="userDetailDisabled"
              />
            </FormItem>
          </Form>
          <div v-if="userDetailIsEdit" style="text-align: right;">
            <Button class="mr10" @click="modifyUserCancel">Cancel</Button>
            <Button type="info" @click="modifyUserSave">Save</Button>
          </div>
        </div>
      </TabPane>
    </Tabs>
    <change-password
      :modalChangePwd="modalChangePwd"
      :userid="userid"
      @change-password-success="changePasswordSuccess"
      @change-password-cancel="changePasswordCancel"
    ></change-password>
    <Modal
      v-model="delUserModal"
      class-name="vertical-center-modal"
      title="Warning"
    >
      <p class="role-del-modal-content">
        Do you really want to delete {{ userName }}
      </p>
      <div slot="footer">
        <Button size="large" @click="delUserModal = false">No</Button>
        <Button size="large" @click="delUserSubmit" type="info">Yes</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Role from "./role";
import ChangePassword from "@/components/change-password/change-password";
import {
  queryRoles,
  queryUser,
  addUser,
  deleteUser,
  modifyUser,
  queryUserByName
} from "@/api/global";

export default {
  name: "",
  components: {
    Role,
    ChangePassword
  },
  data() {
    return {
      loading: false,
      modalChangePwd: false,
      delUserModal: false,
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100
      },
      userid: 0,
      userName: "",
      userDetail: {
        userid: "",
        loginname: "",
        firstname: "",
        lastname: "",
        password: "",
        userstatus: "",
        userexpiredate: "",
        userdept: "",
        usertitile: "",
        useraddr: "",
        usermemo: "",
        userphone: "",
        useremail: ""
      },
      saveType: "",
      passwordRetype: "",
      showPassword: false,
      userDetailDisabled: true,
      userDetailIsEdit: false,
      columns: [
        {
          title: "ID",
          key: "userid",
          width: 60
        },
        {
          title: "Name",
          key: "loginname",
          width: 120
        },
        {
          title: "Status",
          key: "userstatus",
          width: 120
        },
        {
          title: "Address",
          key: "useraddr"
        },
        {
          title: "Create Date",
          key: "usercreatedate"
        },
        {
          title: "Last Login",
          key: "userlastlogin"
        },
        {
          title: "Action",
          slot: "action",
          width: 240,
          align: "center"
        }
      ],
      data: [],
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      roleList: [
        {
          value: "OFFLINE",
          label: "OFFLINE"
        },
        {
          value: "EXPIRED",
          label: "EXPIRED"
        },
        {
          value: "LOCKED",
          label: "LOCKED"
        }
      ]
    };
  },
  computed: {},
  mounted() {
    this.queryUserList();
    this.queryRolesList();
  },
  methods: {
    queryRolesList() {
      queryRoles().then(({ data }) => {
        if (data.code === 200) {
          const { content } = data.data;
          this.roleList = content;
          this.roleList.map(item => {
            item.value = item.rolename;
            item.label = item.rolename;
          });
        }
      });
    },
    queryUserList() {
      this.loading = true;
      queryUser(this.queryForm).then(({ data }) => {
        if (data.code === 200) {
          const { content, currPage, totalCount } = data.data;
          this.loading = false;
          this.data = content;
          this.queryForm = {
            currPage: currPage,
            pageSize: 10,
            total: totalCount
          };
        }
      });
    },
    pageSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.queryUserList();
    },
    pageChange(index) {
      this.queryForm.currPage = index;
      this.queryUserList();
    },
    queryUserInfo(row) {
      const { loginname } = row;
      queryUserByName({ loginname }).then(({ data }) => {
        if (data.code === 200) {
          this.userDetail = data.data.content[0];
        }
      });
    },
    onRowClick(row, index) {
      this.userDetailIsEdit = false;
      this.userDetailDisabled = true;
      this.showPassword = false;
      this.queryUserInfo(row);
    },
    editUserInfo(row) {
      this.userDetailIsEdit = true;
      this.userDetailDisabled = false;
      this.showPassword = false;
      this.saveType = "edit";
      this.queryUserInfo(row);
    },
    newUserInfo() {
      this.userDetailIsEdit = true;
      this.userDetailDisabled = false;
      this.showPassword = true;
      this.saveType = "new";
      this.userDetail = {
        userid: "",
        loginname: "",
        firstname: "",
        lastname: "",
        password: "",
        userstatus: "",
        userexpiredate: "",
        userdept: "",
        usertitile: "",
        useraddr: "",
        usermemo: "",
        userphone: "",
        useremail: ""
      };
    },
    modifyUserCancel() {
      this.onRowClick(this.userDetail);
    },
    modifyUserSave() {
      if (this.saveType === "new") {
        addUser(this.userDetail).then(({ data }) => {
          if (data.code === 200) {
            this.$Message.success("Operation success!");
            this.queryUserList();
          }
        });
      } else {
        console.log(this.userDetail);
        modifyUser(this.userDetail).then(({ data }) => {
          if (data.code === 200) {
            this.$Message.success("Operation success!");
            this.queryUserList();
          }
        });
      }
    },
    delUserInfo(row) {
      this.userName = row.loginname;
      this.userid = row.userid;
      this.delUserModal = true;
    },
    delUserSubmit() {
      deleteUser({ userid: this.userid }).then(({ data }) => {
        if (data.code === 200) {
          this.$Message.success("Operation success!");
          this.queryUserList();
          this.delUserModal = false;
        }
      });
    },
    changeUserPwd(row) {
      const { userid } = row;
      this.modalChangePwd = true;
      this.userid = userid;
    },
    changePasswordSuccess() {
      this.modalChangePwd = false;
    },
    changePasswordCancel() {
      this.modalChangePwd = false;
    }
  }
};
</script>

<style lang="less" scoped>
.user-detail {
  width: 40%;
  padding: 20px;
  border: 1px solid #eee;
  margin-left: 20px;
}
</style>
