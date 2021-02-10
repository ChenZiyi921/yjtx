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
      style="padding: 10px; background: #fff;"
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
    <add-case-modal
      :createModal="createModal"
      @createmodalcancel="createModalCancel"
    />
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
  searchCase
} from "@/api/global";
import caseComment from "@/components/case-comment/case-comment";
import addCaseModal from "@/components/add-case/add-case";

export default {
  components: {
    addCaseModal,
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
      rowData: {}
    };
  },
  mounted() {
    this.queryCaseList();
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
    cancelComment() {
      this.commentModal = false;
    },
    saveCommentSuccess() {
      this.commentModal = false;
      this.queryCaseList();
    },
    createModalCancel() {
      this.createModal = false;
    },
    showCreateModal() {
      this.createModal = true;
    },
    showSearchModal() {
      this.searchModal = true;
    },
    checkAllGroupChange(data) {},
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
