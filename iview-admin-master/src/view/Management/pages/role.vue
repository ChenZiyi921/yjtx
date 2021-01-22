<template>
  <div class="">
    <Form
      :model="queryForm"
      label-position="left"
      :label-width="60"
      inline
      style
    >
      <FormItem label :label-width="0">
        <Button type="success" class="ml10">新增</Button>
      </FormItem>
      <FormItem label="ID">
        <Input />
      </FormItem>
      <FormItem label="Name">
        <Input />
      </FormItem>
      <FormItem label :label-width="0">
        <Button type="info" class="ml10">查询</Button>
      </FormItem>
    </Form>
    <Table border :columns="columns" :data="data">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="info" ghost size="small" class="ml10" @click="show(index)"
          >Edit</Button
        >
        <Button type="error" size="small" @click="remove(index)">Delete</Button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      modal: false,
      queryForm: {
        pageNum: 1,
        pageSize: 10,
        total: 100
      },
      columns: [
        {
          title: "Name",
          slot: "name"
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address"
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      data: []
    };
  },
  mounted() {
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
    }
  }
};
</script>

<style lang="less" scoped>
// .management {
//   background: #fff;
// }
</style>
