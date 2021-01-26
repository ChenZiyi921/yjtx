<template>
  <div class="">
    <Form label-position="left" :label-width="0" inline>
      <FormItem>
        <Button type="success" class="mr10" ghost>Refresh</Button>
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
    <Table border :columns="columns" :data="data">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <template v-if="true">
          <Button
            type="info"
            ghost
            size="small"
            class="mr10"
            @click="show(index)"
            >Copy</Button
          >
          <Button type="info" size="small" class="mr10" @click="show(index)"
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
      :current="queryForm.pageNum"
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
      v-model="createModal"
      class-name="vertical-center-modal"
      :closable="false"
      title="Create/Edit"
      width="700"
    >
      <Form :model="queryForm" label-position="left" :label-width="100" inline>
        <FormItem label="Case Name">
          <Input style="width: 300px" class="mr10" />
          <Button type="warning" ghost>Check</Button>
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
          <Input style="width: 150px" class="mr10" />
          <Button
            type="success"
            class="mr10"
            style="width: 32px; height: 32px; text-align: center; padding: 0; font-size: 16px;"
            @click="handleAdd"
            >+</Button
          >
          <div
            style="width: 200px; min-height: 100px; float: right; padding: 0 20px; border: 1px solid #eee;"
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
        <FormItem label="Authorization">
          <CheckboxGroup @on-change="checkAllGroupChange">
            <Checkbox label="Manage"></Checkbox>
            <Checkbox label="Monitor"></Checkbox>
            <Checkbox label="View"></Checkbox>
            <Checkbox label="Analyze"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <!-- <FormItem label="">
          <Button></Button>
        </FormItem> -->
      </Form>
      <div slot="footer">
        <Button size="large" @click="createModal = false">Cancel</Button>
        <Button type="info" size="large" @click="createModal = false"
          >Save</Button
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
  </div>
</template>

<script>
// import { getTableData } from "@/api/global";

export default {
  data() {
    return {
      modal: false,
      searchModal: false,
      createModal: false,
      commentModal: false,
      queryForm: {
        pageNum: 1,
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
    show(index) {
      this.modal = true;
    },
    remove(index) {
      this.data.splice(index, 1);
    },
    pageSizeChange(pageSize) {
      // this.loading = true;
      this.queryForm.pageSize = pageSize;
      // this.queryList();
    },
    pageChange(index) {
      // this.loading = true;
      this.queryForm.pageNum = index;
      // this.queryList();
    },
    queryList() {
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
