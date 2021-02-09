<template>
  <div class="">
    <Form label-position="left" :label-width="0" inline>
      <FormItem>
        <Button type="success" class="mr10" ghost @click="queryList"
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
      <template slot-scope="{ row, index }" slot="action">
        <template v-if="true">
          <Button type="info" ghost size="small" class="mr10" @click="show(row)"
            >Copy</Button
          >
          <Button type="info" size="small" class="mr10" @click="show(row)"
            >Submit</Button
          >
          <Button type="error" size="small" class="mr10" @click="remove(index)"
            >Delete</Button
          >
        </template>
        <template v-if="false">
          <Button
            type="success"
            size="small"
            class="mr10"
            @click="remove(index)"
            >Approve</Button
          >
          <Button type="error" size="small" class="mr10" @click="remove(index)"
            >Deny</Button
          >
        </template>
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
      v-model="modal"
      class-name="vertical-center-modal"
      :closable="false"
      title="编辑权限"
    >
      <div slot="footer">
        <Button size="large" @click="modal = false">取消</Button>
        <Button type="info" size="large" @click="modal = false">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="searchModal"
      class-name="vertical-center-modal"
      :closable="false"
      title="Case Search"
      width="1000"
    >
      <Form :model="queryForm" label-position="left" :label-width="100" inline>
        <FormItem label="Case Name">
          <Select style="width: 100px">
            <Option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Input style="width: 200px" />
        </FormItem>
        <FormItem label="Create Date">
          <DatePicker
            type="datetimerange"
            placeholder="Select date and time"
            style="width: 300px"
          ></DatePicker>
        </FormItem>
        <FormItem label="Target">
          <Input style="width: 300px" />
        </FormItem>
        <FormItem label="Case Type">
          <Select style="width: 300px">
            <Option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="Create By">
          <Input style="width: 300px" />
        </FormItem>
        <FormItem label="Status">
          <Select style="width: 300px">
            <Option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="Comments">
          <Input style="width: 300px" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" @click="searchModal = false">Cancel</Button>
        <Button type="info" size="large" @click="searchModal = false"
          >Search</Button
        >
      </div>
    </Modal>
    <Modal
      v-model="commentModal"
      class-name="vertical-center-modal"
      :closable="false"
      title="Comments"
      width="700"
    >
      <div>
        <Input type="textarea" :rows="10" style="width: 600px" />
      </div>
      <div slot="footer">
        <Button size="large" @click="commentModal = false">Cancel</Button>
        <Button type="info" size="large" @click="commentModal = false"
          >Save</Button
        >
      </div>
    </Modal>
    <add-ic :createModal="createModal" @add-ic-cancel="addICCancel" />
  </div>
</template>

<script>
import AddIc from "@/components/add-ic/add-ic";
// import { getTableData } from "@/api/global";

export default {
  components: {
    AddIc
  },
  data() {
    return {
      vertical1: "Target ID",
      vertical2: "User target",
      social: ["NetCell", "Voice"],
      loading: false,
      modal: false,
      searchModal: false,
      createModal: false,
      commentModal: false,
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100
      },
      columns: [
        {
          title: "Status",
          key: "age"
        },
        {
          title: "Case",
          key: "name"
        },
        {
          title: "Target",
          key: "name"
        },
        {
          title: "Type",
          key: "age"
        },
        {
          title: "Live",
          key: "address"
        },
        {
          title: "Content",
          key: "address"
        },
        {
          title: "Action",
          slot: "action",
          width: 300,
          align: "center"
        }
      ],
      data: [],
      statusList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        }
      ],
      tagList: []
    };
  },
  mounted() {
    this.queryList();
    for (let i = 0; i < 10; i++) {
      this.data.push({
        name: "Jon Snow",
        age: i,
        address: "Ottawa No. 2 Lake Park"
      });
    }
  },
  methods: {
    addICCancel() {
      this.createModal = false;
    },
    show(row) {
      this.modal = true;
    },
    remove(index) {
      this.data.splice(index, 1);
    },
    pageSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.queryList();
    },
    pageChange(index) {
      this.queryForm.currPage = index;
      this.queryList();
    },
    queryList() {
      // this.loading = true;
      // getTableData().then(res => {
      //   console.log(res);
      // });
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
    showCommentModal() {
      this.commentModal = true;
    }
  }
};
</script>

<style lang="less" scoped>
// .management {
//   background: #fff;
// }
</style>
