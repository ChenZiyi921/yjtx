<template>
  <div style="display: flex;" class="role">
    <div style="flex: 1;">
      <Form label-position="left" :label-width="0" inline>
        <FormItem label="">
          <Button type="success" ghost @click="queryRolesList">Refresh</Button>
        </FormItem>
        <FormItem label="">
          <Button type="success" @click="newRole">New</Button>
        </FormItem>
      </Form>
      <Table
        border
        :columns="column"
        :data="data"
        :loading="loading"
        @on-row-click="onRowClick"
      >
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.name }}</strong>
        </template>
        <!-- <template slot-scope="{ row, index }" slot="action">
          <Button
            type="info"
            ghost
            size="small"
            class="mr10"
            @click.stop="editRole(row)"
            >Edit</Button
          >
          <Button type="error" size="small" @click.stop="delRole(row)"
            >Delete</Button
          >
        </template> -->
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
        Do you really want to delete User Role role-admin
      </p>
      <div slot="footer">
        <Button size="large" @click="delRoleModal = false">No</Button>
        <Button size="large" @click="delRoleSubmit" type="info">Yes</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { queryRoles, queryResources, deleteRole } from "@/api/global";

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
      roleid: "",
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
      //
      editIndex: -1,
      // editName: "",
      // editEmail: "",
      // editStatus: "",
      column: [
        {
          type: "index",
          width: 100,
          align: "center",
          title: "ID",
          key: "roleid"
        },
        {
          title: "Name",
          key: "rolename",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              this.editName = row.name;
              edit = [
                h("Input", {
                  props: {
                    value: row.name
                  },
                  on: {
                    input: val => {
                      this.editName = val;
                    }
                  }
                })
              ];
            } else {
              edit = row.rolename;
            }
            return h("div", [edit]);
          }
        },
        {
          title: "Status",
          key: "rolestatus",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              this.editStatus = row.status;
              edit = [
                h("Select", {
                  props: {
                    value: row.status
                  },
                  on: {
                    input: val => {
                      this.editStatus = val;
                    }
                  }
                })
              ];
            } else {
              edit = row.rolestatus;
            }
            return h("div", [edit]);
          }
        },
        {
          title: "Create Date",
          key: "createdate",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              this.editEmail = row.email;
              edit = [
                h("Input", {
                  props: {
                    value: row.email
                  },
                  on: {
                    input: val => {
                      this.editEmail = val;
                    }
                  }
                })
              ];
            } else {
              edit = row.createdate;
            }
            return h("div", [edit]);
          }
        },
        {
          title: "Modify Date",
          key: "modifydate",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              this.editEmail = row.email;
              edit = [
                h("Input", {
                  props: {
                    value: row.email
                  },
                  on: {
                    input: val => {
                      this.editEmail = val;
                    }
                  }
                })
              ];
            } else {
              edit = row.modifydate;
            }
            return h("div", [edit]);
          }
        },
        {
          title: "Action",
          render: (h, { row, index }) => {
            if (this.editIndex === index) {
              return [
                h(
                  "Button",
                  {
                    props: {
                      type: "info"
                    },
                    on: {
                      click: () => {
                        this.data[index].name = this.editName;
                        this.data[index].email = this.editEmail;
                        this.data[index].status = this.editStatus;
                        this.editIndex = -1;
                        // save
                      }
                    }
                  },
                  "Save"
                ),
                h(
                  "Button",
                  {
                    props: {},
                    style: {
                      marginLeft: "10px"
                    },
                    on: {
                      click: () => {
                        this.editIndex = -1;
                      }
                    }
                  },
                  "Cancel"
                )
              ];
            } else {
              return [
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      ghost: true
                    },
                    on: {
                      click: e => {
                        e.stopPropagation();
                        this.editRole(row);
                        this.editIndex = index;
                      }
                    }
                  },
                  "Edit"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error"
                    },
                    style: {
                      marginLeft: "10px"
                    },
                    on: {
                      click: () => {
                        this.delRole(row);
                      }
                    }
                  },
                  "Delete"
                )
              ];
            }
          }
        }
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
      this.isEdit = false;
      this.disabled = true;
      this.disableCheckbox();
    },
    editRole(row) {
      this.isEdit = true;
      this.disabled = false;
      this.enableCheckbox();
    },
    modifyRoleCancel() {
      // this.onRowClick(this.userDetail);
    },
    modifyRoleSave() {
      if (this.saveType === "new") {
        // addUser(this.userDetail).then(({ data }) => {
        //   if (data.code === 200) {
        //     this.$Message.success("Operation success!");
        //     this.queryUserList();
        //   }
        // });
      } else {
        // modifyUser(this.userDetail).then(({ data }) => {
        //   if (data.code === 200) {
        //     this.$Message.success("Operation success!");
        //     this.queryUserList();
        //   }
        // });
      }
    },
    newRole() {
      this.isEdit = true;
      this.disabled = false;
      this.enableCheckbox();
      this.data.push({});
    },
    delRole(row) {
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
