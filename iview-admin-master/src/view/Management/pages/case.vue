<template>
  <div class="">
    <Form label-position="left" :label-width="0" inline>
      <FormItem>
        <Button type="success" class="mr10" ghost @click="queryCaseList"
          >Refresh</Button
        >
      </FormItem>
      <FormItem>
        <Button type="success" class="mr10" @click="showCreateModal"
          >New</Button
        >
      </FormItem>
      <FormItem>
        <Button type="info" class="mr10" @click="showSearchModal"
          >Search</Button
        >
      </FormItem>
    </Form>
    <Table border :columns="columns" :data="data" :loading="loading">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row }" slot="action">
        <template v-if="true">
          <Button
            size="small"
            class="mr10"
            @click="showCommonModal(row, 'deactive')"
            >DeActive</Button
          >
          <Button
            type="info"
            size="small"
            class="mr10"
            @click="showCommonModal(row, 'active')"
            >Active</Button
          >
          <Button
            type="success"
            size="small"
            class="mr10"
            @click="showCommonModal(row, 'submit')"
            >Submit</Button
          >
          <Button
            type="info"
            ghost
            size="small"
            class="mr10"
            @click="showCreateModal"
            >Edit</Button
          >
          <Button type="error" size="small" class="mr10" @click="delCase(row)"
            >Delete</Button
          >
          <Button
            :disabled="row.casestatus === 'CLOSED'"
            type="error"
            size="small"
            class="mr10"
            @click="closeCaseConfirm(row, 'close')"
            ghost
            >Close</Button
          >
        </template>
        <template v-if="false">
          <Button
            type="success"
            size="small"
            class="mr10"
            @click="closeCaseConfirm(row, 'approve')"
            >Approve</Button
          >
          <Button
            type="error"
            size="small"
            class="mr10"
            @click="closeCaseConfirm(row, 'deny')"
            >Deny</Button
          >
        </template>

        <Button type="success" ghost size="small" @click="showCommentModal(row)"
          >Comment</Button
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
    <Modal
      v-model="searchModal"
      class-name="vertical-center-modal"
      :closable="false"
      title="Case Search"
      width="1000"
    >
      <Form :model="queryForm" label-position="left" :label-width="100" inline>
        <FormItem label="Case Name">
          <Select style="width: 100px" v-model="queryForm['casename-cond']">
            <Option
              v-for="item in caseNameList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Input v-model="queryForm.casename" style="width: 200px" />
        </FormItem>
        <FormItem label="Create Date">
          <DatePicker
            @on-change="queryFormDateChange"
            type="datetimerange"
            placeholder="Select date and time"
            style="width: 300px"
          ></DatePicker>
        </FormItem>
        <FormItem label="Target">
          <Input v-model="queryForm.targetname" style="width: 300px" />
        </FormItem>
        <FormItem label="Case Type">
          <Select v-model="queryForm.casetype" style="width: 300px">
            <Option
              v-for="item in caseTypeList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="Create By">
          <Input v-model="queryForm.caseowner" style="width: 300px" />
        </FormItem>
        <FormItem label="Status">
          <Select v-model="queryForm.status" style="width: 300px">
            <Option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="Comments">
          <Input v-model="queryForm.comment" style="width: 300px" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" @click="searchModal = false">Cancel</Button>
        <Button type="info" size="large" @click="searchCaseConfirm"
          >Search</Button
        >
      </div>
    </Modal>
    <Modal
      v-model="createModal"
      class-name="vertical-center-modal"
      :closable="false"
      title="Create/Edit"
      fullscreen
    >
      <Form :model="queryForm" label-position="left" :label-width="100">
        <FormItem label="Case Name">
          <Input style="width: 300px" class="mr10" />
          <Button type="warning" ghost @click="checkCaseName">Check</Button>
        </FormItem>
        <FormItem label="Expired Date">
          <DatePicker
            type="datetimerange"
            placeholder="Select date and time"
            style="width: 300px"
          ></DatePicker>
        </FormItem>
        <FormItem label="Description">
          <Input type="textarea" :rows="4" style="width: 300px" />
        </FormItem>
        <FormItem label="Target Name">
          <Input style="width: 150px; float: left;" class="mr10" />
          <Button
            type="success"
            class="mr10"
            style="float: left; width: 32px; height: 32px; text-align: center; padding: 0; font-size: 16px;"
            @click="handleAdd"
            >+</Button
          >
          <div
            style="float: left; width: 200px; min-height: 100px; padding: 0 20px; border: 1px solid #eee;"
          >
            <Tag
              type="dot"
              closable
              color="success"
              :name="item"
              @on-close="handleClose"
              v-for="(item, index) in tagList"
              :key="index"
              >{{ item }}</Tag
            >
          </div>
        </FormItem>
        <FormItem label="Members Name">
          <Select style="width: 300px">
            <Option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <!-- <FormItem label="Authorization">
          <CheckboxGroup @on-change="checkAllGroupChange">
            <Checkbox label="Manage"></Checkbox>
            <Checkbox label="Monitor"></Checkbox>
            <Checkbox label="View"></Checkbox>
            <Checkbox label="Analyze"></Checkbox>
          </CheckboxGroup>
        </FormItem> -->
        <FormItem label="Authorization">
          <div style="width: 1200px; text-align: right;">
            <Button type="success" @click="createData.push({})">Add</Button>
          </div>
          <Table
            border
            :columns="createColumns"
            :data="createData"
            class="mt10"
            width="1200"
          >
            <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
            </template>
          </Table>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button size="large" @click="createModal = false">Cancel</Button>
        <Button type="info" size="large" @click="addCaseSave">Save</Button>
      </div>
    </Modal>
    <case-comment
      :commentModal="commentModal"
      :caseComment="caseComment"
      @cancel-comment="cancelComment"
      @save-comment-success="saveCommentSuccess"
    />
    <Modal
      v-model="delModal"
      class-name="vertical-center-modal"
      :closable="false"
      title="delete Case"
      width="700"
    >
      <div>Are you sure you want to delete case {{ delCasename }} ?</div>
      <div slot="footer">
        <Button size="large" @click="delModal = false">Cancel</Button>
        <Button type="info" size="large" @click="delCaseConfirm">Save</Button>
      </div>
    </Modal>
    <Modal
      v-model="closeModal"
      class-name="vertical-center-modal"
      :closable="false"
      title="close"
      width="700"
    >
      <div>Are you sure you want to close case {{ delCasename }} ?</div>
      <div slot="footer">
        <Button size="large" @click="closeModal = false">Cancel</Button>
        <Button type="info" size="large" @click="caseOperationCommon"
          >Save</Button
        >
      </div>
    </Modal>
    <Modal
      v-model="commonModal.show"
      class-name="vertical-center-modal"
      :closable="false"
      :title="commonModal.title"
      width="700"
    >
      <div>{{ commonModal.content }}</div>
      <div slot="footer">
        <Button size="large" @click="commonModal.show = false">Cancel</Button>
        <Button type="info" size="large" @click="caseOperationCommon"
          >Save</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  queryCasesByUser,
  deleteCase,
  caseOperation,
  commentCase,
  searchCase,
  addCase,
  checkCaseName
} from "@/api/global";
import caseComment from "@/components/case-comment/case-comment";

export default {
  components: {
    caseComment
  },
  data() {
    return {
      loading: false,
      delModal: false,
      closeModal: false,
      searchModal: false,
      createModal: false,
      commentModal: false,
      commonModal: {
        title: "",
        content: "",
        show: false,
        type: ""
      },
      delCasename: "",
      caseid: "",
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100,
        casename: "",
        "casename-cond": "include",
        targetname: "",
        caseowner: "",
        status: "NEW",
        "createdate-start": "",
        "createdate-end": "",
        comment: "",
        casetype: "basic"
      },
      caseOperatorForm: {
        caseid: "",
        operation: ""
      },
      caseComment: {
        caseid: "",
        comment: ""
      },
      columns: [
        {
          type: "index",
          title: "Index",
          key: "name"
        },
        {
          title: "Name",
          key: "casename"
        },
        {
          title: "Status",
          key: "casestatus"
        },
        {
          title: "Type",
          key: "casetype"
        },
        {
          title: "Expired",
          key: "caseexpireddate"
        },
        {
          title: "Auto Active",
          key: "caseautoact"
        },
        {
          title: "Active Date",
          key: "caseactivedate"
        },
        {
          title: "Close Date",
          key: "caseclosedate"
        },
        {
          title: "Create Date",
          key: "casecreatedate"
        },
        {
          title: "Creator",
          key: "casecreator"
        },
        {
          title: "Comments",
          key: "casememo",
          render: (h, { row, index }) => {
            return row.casememo ? (
              <Icon type="ios-bulb" size="20" style="color: yellow;" />
            ) : (
              ""
            );
          }
        },
        {
          title: "Action",
          slot: "action",
          width: 500,
          align: "center"
        }
      ],
      data: [],
      caseNameList: [
        {
          value: "include",
          label: "include"
        },
        {
          value: "exact",
          label: "exact"
        }
      ],
      caseTypeList: [
        {
          value: "basic",
          label: "basic"
        }
      ],
      statusList: [
        {
          value: "NEW",
          label: "NEW"
        },
        {
          value: "ACTIVE",
          label: "ACTIVE"
        },
        {
          value: "DEACTIVE",
          label: "DEACTIVE"
        },
        {
          value: "EXPIRED",
          label: "EXPIRED"
        },
        {
          value: "CLOSED",
          label: "CLOSED"
        },
        {
          value: "COMPLETE",
          label: "COMPLETE"
        },
        {
          value: "PENDING",
          label: "PENDING"
        },
        {
          value: "DENIED",
          label: "DENIED"
        }
      ],
      tagList: [],
      rowData: {},
      editIndex: -1,
      createColumns: [
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
              // this.roleDetail.rolename = row.rolename;
              edit = [
                h("Input", {
                  props: {
                    value: row.rolename
                  },
                  on: {
                    input: val => {
                      this.roleDetail.rolename = val;
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
          title: "Manage",
          key: "rolestatus",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              // this.roleDetail.rolestatus = row.rolestatus;
              edit = [
                h("Select", {
                  props: {
                    value: row.rolestatus
                  },
                  on: {
                    input: val => {
                      this.roleDetail.rolestatus = val;
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
          title: "Monitor",
          key: "createdate",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              // this.roleDetail.createdate = row.createdate;
              edit = [
                h("Input", {
                  props: {
                    value: row.createdate
                  },
                  on: {
                    input: val => {
                      this.roleDetail.createdate = val;
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
          title: "View",
          key: "modifydate",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              // this.roleDetail.modifydate = row.modifydate;
              edit = [
                h("Input", {
                  props: {
                    value: row.modifydate
                  },
                  on: {
                    input: val => {
                      this.roleDetail.modifydate = val;
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
          title: "Analyze",
          key: "modifydate",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              // this.roleDetail.modifydate = row.modifydate;
              edit = [
                h("Input", {
                  props: {
                    value: row.modifydate
                  },
                  on: {
                    input: val => {
                      this.roleDetail.modifydate = val;
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
          width: 180,
          render: (h, { row, index }) => {
            if (this.editIndex === index) {
              return [
                h(
                  "Button",
                  {
                    props: {},
                    style: {},
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
                        this.saveType = "edit";
                        // this.editRole(row);
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
                        this.createData.splice(index, 1);
                      }
                    }
                  },
                  "Delete"
                )
              ];
            }
          }
        }
      ],
      createData: [],
      createDataForm: {},
      checkName: false,
      saveType: ""
    };
  },
  mounted() {
    this.queryCaseList();
    this.createData.push({});
  },
  methods: {
    delCase(row) {
      this.delCasename = row.casename;
      this.delModal = true;
      this.caseid = row.caseid;
    },
    delCaseConfirm() {
      deleteCase({
        caseid: this.caseid
      }).then(({ data }) => {
        if (data.code === 200) {
          this.delModal = false;
          this.$Message.success("Operation success!");
          this.queryCaseList();
        }
      });
    },
    setOperatorType(row, type) {
      this.caseOperatorForm = {
        caseid: row.caseid,
        operation: type
      };
      this.delCasename = row.casename;
    },
    closeCaseConfirm(row, type) {
      this.setOperatorType(row, type);
      this.closeModal = true;
    },
    showCommonModal(row, type) {
      this.setOperatorType(row, type);
      this.commonModal = {
        title: type,
        content: `Are you sure you want to execute ${type}?`,
        show: true,
        type
      };
    },
    caseOperationCommon() {
      caseOperation(this.caseOperatorForm).then(({ data }) => {
        if (data.code === 200) {
          this.closeModal = false;
          this.commonModal.show = false;
          this.$Message.success("Operation success!");
          this.queryCaseList();
        }
      });
    },
    pageSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.queryCaseList();
    },
    pageChange(index) {
      this.queryForm.currPage = index;
      this.queryCaseList();
    },
    searchCaseConfirm() {
      this.loading = true;
      searchCase(this.queryForm).then(({ data }) => {
        if (data.code === 200) {
          this.loading = false;
          this.data = data.data.content;
        }
      });
    },
    queryCaseList() {
      this.loading = true;
      queryCasesByUser({
        userid: this.$store.state.user.userId.userid
      }).then(({ data }) => {
        if (data.code === 200) {
          this.loading = false;
          this.data = data.data.content;
          this.searchModal = false;
        }
      });
    },
    checkCaseName() {
      checkCaseName().then(({ data }) => {
        if (data.code === 200) {
          this.checkName = true;
        }
      });
    },
    addCaseSave() {
      if (this.saveType === "new") {
        if (this.checkName) {
          addCase(this.createDataForm).then(({ data }) => {
            if (data.code === 200) {
              this.$Message.success("Operation success!");
              this.queryCaseList();
            }
          });
        }
      } else {
        modifyCase(this.createDataForm).then(({ data }) => {
          if (data.code === 200) {
            this.$Message.success("Operation success!");
            this.queryCaseList();
          }
        });
      }
    },
    cancelComment() {
      this.commentModal = false;
    },
    saveCommentSuccess() {
      this.commentModal = false;
      this.queryCaseList();
    },
    showCreateModal() {
      this.createModal = true;
    },
    showSearchModal() {
      this.searchModal = true;
    },
    checkAllGroupChange(data) {},
    handleAdd() {
      if (this.tagList.length) {
        this.tagList.push(this.tagList[this.tagList.length - 1] + 1);
      } else {
        this.tagList.push(0);
      }
    },
    handleClose(event, name) {
      const index = this.tagList.indexOf(name);
      this.tagList.splice(index, 1);
    },
    showCommentModal(row) {
      this.commentModal = true;
      this.caseComment.caseid = row.caseid;
      this.caseComment.comment = row.casememo;
    },
    queryFormDateChange(date) {
      this.queryForm["createdate-start"] = date[0];
      this.queryForm["createdate-end"] = date[1];
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.ivu-table-wrapper {
  overflow: auto;
}
</style>
