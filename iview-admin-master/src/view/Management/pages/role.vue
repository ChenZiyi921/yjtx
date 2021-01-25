<template>
  <div style="display: flex;">
    <div style="flex: 1;">
      <Form label-position="left" :label-width="0" inline>
        <FormItem label="">
          <Button type="success" ghost>Refresh</Button>
        </FormItem>
        <FormItem label="">
          <Button type="success">New</Button>
        </FormItem>
      </Form>
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="info"
            ghost
            size="small"
            class="ml10"
            @click="editUserInfo(row)"
            >Edit</Button
          >
          <Button type="error" size="small" @click="delRole(row)"
            >Delete</Button
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
    <div class="role-detail">
      <div class="role-detail-title">Assignment Privileges</div>
      <Tree :data="treeData" show-checkbox multiple></Tree>
      <div class="role-detail-title">Role Information</div>
      <Input type="textarea" :rows="4" :disabled="true" />
    </div>
    <Modal
      v-model="delRoleModal"
      class-name="vertical-center-modal"
      title="Warning"
    >
      <p class="role-del-modal-content">
        Do you really want to delete User Role role-admin
      </p>
      <div slot="footer">
        <Button size="large" @click="delRoleModal = false" type="info"
          >Yes</Button
        >
        <Button size="large" @click="delRoleModal = false">No</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { queryRoles } from "@/api/global";

export default {
  name: "",
  components: {},
  data() {
    return {
      delRoleModal: false,
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
          key: "roleid",
          width: 60
        },
        {
          title: "Name",
          key: "rolename",
          width: 120
        },
        {
          title: "Status",
          key: "rolestatus",
          width: 120
        },
        {
          title: "Create Date",
          key: "createdate"
        },
        {
          title: "Modify Date",
          key: "modifydate"
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
      ],
      treeData: [
        {
          title: "parent 1",
          expand: true,
          selected: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                  // disabled: true
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1"
                  // checked: true
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  computed: {},
  mounted() {
    this.queryRolesList();
  },
  methods: {
    queryRolesList() {
      queryRoles(this.queryForm).then(({ data }) => {
        if (data.code === 200) {
          const { content, currPage, totalCount } = data.data;
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
      // this.loading = true;
      this.queryForm.pageSize = pageSize;
      this.queryRolesList();
    },
    pageChange(index) {
      // this.loading = true;
      this.queryForm.currPage = index;
      this.queryRolesList();
    },
    editUserInfo(row) {},
    delRole(row) {
      this.delRoleModal = true;
    }
  }
};
</script>

<style lang="less" scoped>
.role-detail {
  width: 40%;
  padding: 20px;
  border: 1px solid #eee;
}
.role-detail-title {
  margin-bottom: 10px;
}
.role-del-modal-content {
  padding: 20px 0;
}
</style>
