<template>
  <div class="">
    <Form label-position="left" :label-width="0" inline>
      <FormItem>
        <Button type="success" class="mr10" ghost>Refresh</Button>
      </FormItem>
      <FormItem>
        <Button type="success" class="mr10">New</Button>
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
        <Button type="info" ghost size="small" class="mr10" @click="show(index)"
          >Edit</Button
        >
        <Button type="error" size="small" class="mr10" @click="remove(index)"
          >Delete</Button
        >
        <Button
          type="error"
          size="small"
          class="mr10"
          @click="remove(index)"
          ghost
          >Close</Button
        >
        <Button type="success" ghost size="small" @click="remove(index)"
          >Comment</Button
        >
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
  </div>
</template>

<script>
// import { getTableData } from "@/api/global";

export default {
  data() {
    return {
      modal: false,
      searchModal: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        total: 100
      },
      columns: [
        {
          title: "Index",
          key: "name"
        },
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Status",
          key: "age"
        },
        {
          title: "Type",
          key: "age"
        },
        {
          title: "Expired",
          key: "address"
        },
        {
          title: "Auto Active",
          key: "address"
        },
        {
          title: "Active Date",
          key: "name"
        },
        {
          title: "Close Date",
          key: "age"
        },
        {
          title: "Create Date",
          key: "address"
        },
        {
          title: "Creator",
          key: "age"
        },
        {
          title: "Comments",
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
      ]
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
    showSearchModal() {
      this.searchModal = true;
    }
  }
};
</script>

<Button lang="less" scoped>
// .management {
//   background: #fff;
// }
</Button>
