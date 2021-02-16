<template>
  <div style="display: flex;" class="role">
    <div style="flex: 1;">
      <div style="text-align: right;">
        <Button
          type="success"
          ghost
          @click="queryRolesList"
          class="mr10"
          custom-icon="iconfont icon-refresh"
          >Refresh</Button
        >
        <Button
          type="success"
          @click="newRole"
          class="mr10"
          custom-icon="iconfont icon-new"
          >New</Button
        >
        <Button
          type="info"
          ghost
          @click="queryRolesList"
          class="mr10"
          custom-icon="iconfont icon-edit"
          >Edit</Button
        >
        <Button type="error" @click="newRole" custom-icon="iconfont icon-delete"
          >Delete</Button
        >
      </div>
      <Table
        border
        :columns="column"
        :data="data"
        :loading="loading"
        @on-row-click="onRowClick"
        class="mt10"
      >
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.name }}</strong>
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
        style="padding: 10px; background: #fff;"
      />
    </div>
    <div class="role-detail">
      <Form label-position="left" :label-width="60" inline>
        <FormItem label="Name">
          <Input :disabled="!isEdit" />
        </FormItem>
        <FormItem label="Status">
          <Select :disabled="!isEdit" style="width: 162px;">
            <Option
              v-for="item in roleList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
      </Form>
      <div class="role-detail-title">Assignment Privileges</div>
      <Tree :data="treeData" show-checkbox multiple :select-node="false"></Tree>
      <div class="role-detail-title">Role Information</div>
      <Input
        type="textarea"
        :rows="4"
        :disabled="disabled"
        style="margin-bottom: 24px;"
      />
      <div v-if="isEdit" style="text-align: right;">
        <Button class="mr10" @click="modifyRoleCancel">Cancel</Button>
        <Button type="info" @click="modifyRoleSave">Save</Button>
      </div>
    </div>
    <Modal
      v-model="delRoleModal"
      class-name="vertical-center-modal"
      title="Warning"
    >
      <p class="role-del-modal-content">
        Do you really want to delete User Role {{ roleName }}
      </p>
      <div slot="footer">
        <Button size="large" @click="delRoleModal = false">No</Button>
        <Button size="large" @click="delRoleSubmit" type="info">Yes</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  queryRoles,
  queryResources,
  deleteRole,
  addRole,
  modifyRole
} from "@/api/global";

export default {
  name: "",
  components: {},
  data() {
    return {
      loading: false,
      delRoleModal: false,
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100
      },
      roleDetail: {
        roleid: "",
        rolename: "",
        rolestatus: "",
        createdate: "",
        modifydate: "",
        rolememo: ""
      },
      roleid: "",
      roleName: "",
      disabled: true,
      isEdit: false,
      saveType: "",
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
      treeData: [],
      editIndex: -1,
      column: [
        {
          width: 100,
          align: "center",
          title: "ID",
          key: "roleid"
        },
        {
          title: "Name",
          key: "rolename",
          render: (h, { row, index }) => {
            return h("div", [row.rolename]);
          }
        },
        {
          title: "Status",
          key: "rolestatus",
          render: (h, { row, index }) => {
            return h("div", [row.rolestatus]);
          }
        },
        {
          title: "Create Date",
          key: "createdate",
          render: (h, { row, index }) => {
            return h("div", [row.createdate]);
          }
        },
        {
          title: "Modify Date",
          key: "modifydate",
          render: (h, { row, index }) => {
            return h("div", [row.modifydate]);
          }
        },
        {
          title: "Description",
          key: "rolememo",
          render: (h, { row, index }) => {
            return h("div", [row.modifydate]);
          }
        }
        // {
        //   title: "Action",
        //   render: (h, { row, index }) => {
        //     if (this.editIndex === index) {
        //       return [
        //         h(
        //           "Button",
        //           {
        //             props: {},
        //             style: {},
        //             on: {
        //               click: () => {
        //                 this.editIndex = -1;
        //               }
        //             }
        //           },
        //           "Cancel"
        //         )
        //       ];
        //     } else {
        //       return [
        //         h(
        //           "Button",
        //           {
        //             props: {
        //               type: "info",
        //               ghost: true,
        //               disabled: row.rolename ? false : true
        //             },
        //             on: {
        //               click: e => {
        //                 e.stopPropagation();
        //                 this.saveType = "edit";
        //                 this.editRole(row);
        //                 this.editIndex = index;
        //               }
        //             }
        //           },
        //           "Edit"
        //         ),
        //         h(
        //           "Button",
        //           {
        //             props: {
        //               type: "error"
        //             },
        //             style: {
        //               marginLeft: "10px"
        //             },
        //             on: {
        //               click: () => {
        //                 this.delRole(row);
        //               }
        //             }
        //           },
        //           "Delete"
        //         )
        //       ];
        //     }
        //   }
        // }
      ]
    };
  },
  computed: {},
  mounted() {
    this.queryRolesList();
    this.queryResources();
  },
  methods: {
    queryRolesList() {
      this.loading = true;
      queryRoles(this.queryForm).then(({ data }) => {
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
    queryResources() {
      queryResources().then(({ data }) => {
        function getTrees(list, parentid = 0) {
          let parentObj = {};
          list.forEach(o => {
            parentObj[o.resourceid] = o;
          });
          if (!parentid) {
            return list
              .filter(o => !parentObj[o.parentid])
              .map(o => ((o.children = getTrees(list, o.resourceid)), o));
          } else {
            return list
              .filter(o => o.parentid == parentid)
              .map(o => ((o.children = getTrees(list, o.resourceid)), o));
          }
        }
        data.data.content.map(current => {
          return (
            (current.title = current.resourcename),
            (current.expand = true),
            (current.disabled = true)
          );
        });
        this.treeData = getTrees(data.data.content);
      });
    },
    disableCheckbox() {
      function disable(data) {
        data.forEach(current => {
          current.disabled = true;
          if (current.children.length > 0) {
            disable(current.children);
          }
        });
      }
      disable(this.treeData);
    },
    enableCheckbox() {
      function enable(data) {
        data.forEach(current => {
          current.disabled = false;
          if (current.children.length > 0) {
            enable(current.children);
          }
        });
      }
      enable(this.treeData);
    },
    pageSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.queryRolesList();
    },
    pageChange(index) {
      this.queryForm.currPage = index;
      this.queryRolesList();
    },
    onRowClick(row, index) {
      this.editIndex = -1;
      this.isEdit = false;
      this.disabled = true;
      this.disableCheckbox();
    },
    editRole(row) {
      this.isEdit = true;
      this.disabled = false;
      this.enableCheckbox();
      if (row.roleid) {
        this.roleDetail.roleid = row.roleid;
        this.roleDetail.rolememo = row.rolememo;
      } else {
        this.saveType = "new";
      }
    },
    modifyRoleCancel() {
      this.onRowClick();
    },
    modifyRoleSave() {
      if (this.saveType === "new") {
        addRole(this.roleDetail).then(({ data }) => {
          if (data.code === 200) {
            this.$Message.success("Operation success!");
            this.onRowClick();
            this.queryRolesList();
          }
        });
      } else {
        modifyRole(this.roleDetail).then(({ data }) => {
          if (data.code === 200) {
            this.$Message.success("Operation success!");
            this.onRowClick();
            this.queryRolesList();
          }
        });
      }
    },
    newRole() {
      this.saveType = "new";
      this.isEdit = true;
      this.disabled = false;
      this.enableCheckbox();
      // this.data.push({});
    },
    delRole(row) {
      this.roleName = row.rolename;
      this.roleid = row.roleid;
      this.delRoleModal = true;
    },
    delRoleSubmit() {
      deleteRole({ roleid: this.roleid }).then(({ data }) => {
        if (data.code === 200) {
          this.$Message.success("Operation success!");
          this.queryRolesList();
          this.delRoleModal = false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.role {
  /deep/.ivu-tree-arrow {
    display: none;
  }
}
.role-detail {
  width: 40%;
  padding: 20px;
  border: 1px solid #eee;
  margin-left: 20px;
}
.role-detail-title {
  margin-bottom: 10px;
}
.role-del-modal-content {
  padding: 20px 0;
}
</style>
