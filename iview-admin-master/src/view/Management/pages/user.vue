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
              <Button type="success">New</Button>
            </FormItem>
            <!-- <FormItem label="">
              <Button type="info">Search</Button>
            </FormItem> -->
          </Form>
          <Table border :columns="columns" :data="data" :loading="loading">
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button
                type="info"
                ghost
                size="small"
                class="mr10"
                @click="editUserInfo(row)"
                >Edit</Button
              >
              <Button
                type="error"
                size="small"
                class="mr10"
                @click="delUserInfo(row)"
                >Delete</Button
              >
              <Button
                type="error"
                size="small"
                @click="changeUserPwd(row)"
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
                v-model="userDetail.text"
                :disabled="userDetailDisabled"
                style="max-width: 187px;"
              />
            </FormItem>
            <template v-if="userDetailIsEdit">
              <FormItem label="Password">
                <Input
                  v-model="userDetail.text"
                  :disabled="userDetailDisabled"
                  style="max-width: 187px;"
                />
              </FormItem>
              <FormItem label="Retype Password">
                <Input
                  v-model="userDetail.text"
                  :disabled="userDetailDisabled"
                  style="max-width: 187px;"
                />
              </FormItem>
            </template>
            <FormItem label="User ID">
              <Input
                v-model="userDetail.text"
                :disabled="userDetailDisabled"
                style="max-width: 187px;"
              />
            </FormItem>
            <FormItem label="First Name">
              <Input
                v-model="userDetail.text"
                :disabled="userDetailDisabled"
                style="max-width: 187px;"
              />
            </FormItem>
            <FormItem label="Last Name">
              <Input
                v-model="userDetail.text"
                :disabled="userDetailDisabled"
                style="max-width: 187px;"
              />
            </FormItem>
            <FormItem label="Status">
              <Input
                v-model="userDetail.text"
                :disabled="userDetailDisabled"
                style="max-width: 187px;"
              />
            </FormItem>
            <FormItem label="Expire Date">
              <DatePicker
                type="date"
                :options="options"
                placeholder="Select date"
                :disabled="userDetailDisabled"
              ></DatePicker>
            </FormItem>
            <FormItem label="Email">
              <Input v-model="userDetail.text" :disabled="userDetailDisabled" />
            </FormItem>
            <FormItem label="Phone Number">
              <Input v-model="userDetail.text" :disabled="userDetailDisabled" />
            </FormItem>
            <FormItem label="Department">
              <Input v-model="userDetail.text" :disabled="userDetailDisabled" />
            </FormItem>
            <FormItem label="Title">
              <Input v-model="userDetail.text" :disabled="userDetailDisabled" />
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
              <Input type="textarea" :rows="4" :disabled="userDetailDisabled" />
            </FormItem>
          </Form>
        </div>
      </TabPane>
    </Tabs>
    <Modal
      v-model="modalChangePwd"
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
        <Button size="large" @click="modalChangePwd = false">Cancel</Button>
        <Button type="info" size="large" @click="changeUserPasswordSubmit"
          >OK</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import Role from "./role";
import { queryUser, modifyUser, changeUserPassword } from "@/api/global";

export default {
  name: "",
  components: {
    Role
  },
  data() {
    return {
      loading: false,
      modalChangePwd: false,
      changePwd: {
        userid: "",
        password: ""
      },
      password: "",
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100
      },
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
  },
  methods: {
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
    editUserInfo(row) {},
    delUserInfo(row) {},
    changeUserPwd(row) {
      const { userid } = row;
      this.modalChangePwd = true;
      this.changePwd.userid = userid;
    },
    changeUserPasswordSubmit() {
      if (this.changePwd.password === this.password) {
        changeUserPassword(this.changePwd).then(res => {
          console.log(res);
        });
      } else {
        this.$Message.error("Inconsistent password input!");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.user-detail {
  width: 40%;
  padding: 20px;
  border: 1px solid #eee;
}
</style>
