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
      width="1200"
    >
      <div>
        <div style="overflow: hidden; margin-bottom: 20px;">
          <div style="float: left; display: flex;">
            <span style="padding: 10px 10px;">Case</span>
            <Select style="width: 200px;">
              <Option
                v-for="item in statusList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div style="float: left; display: flex;">
            <span style="padding: 10px 10px;">Suspects</span>
            <Select style="width: 200px;">
              <Option
                v-for="item in statusList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
          <div style="float: left; display: flex;">
            <span style="padding: 10px 10px;">Duty console No.</span>
            <Select style="width: 200px;">
              <Option
                v-for="item in statusList"
                :value="item.value"
                :key="item.value"
                >{{ item.label }}</Option
              >
            </Select>
          </div>
        </div>
        <div>
          <RadioGroup v-model="vertical1" vertical style="padding-left: 10px;">
            <Radio label="Target ID">
              <Icon type="Target ID"></Icon>
              <span>Target ID</span>
            </Radio>
            <div style="padding: 10px 20px;">
              <RadioGroup v-model="vertical2">
                <Radio label="User target">
                  <Icon type="User target"></Icon>
                  <span>User target</span>
                </Radio>
                <div style="overflow: hidden; margin-bottom: 20px;">
                  <div style="display: block; float: left;">
                    <span style="padding: 10px 10px;">ISDN</span>
                    <Input style="width: 200px;" />
                  </div>
                  <div style="display: block;">
                    <span style="padding: 10px 10px;">IMSI</span>
                    <Input style="width: 200px;" />
                  </div>
                  <div style="padding: 10px;">
                    “ISDN Entry Rules:”+” +
                    “CountryCode”+”phoneNo.”,example:”+263791234567”. Support
                    prefix, example:”+263791234*”
                  </div>
                </div>
                <Radio label="IMEI target">
                  <Icon type="IMEI target"></Icon>
                  <span>IMEI target</span>
                </Radio>
                <div style="overflow: hidden; margin-bottom: 20px;">
                  <div style="display: block; float: left;">
                    <span style="padding: 10px 10px;">IMEI</span>
                    <Input style="width: 200px;" />
                  </div>
                  <div style="display: block; float: left;">
                    <span style="padding: 10px 10px;">Description</span>
                    <Input style="width: 200px;" />
                  </div>
                  <div style="display: block; float: left;">
                    <span style="padding: 10px 10px; line-height: 32px"
                      >Enabled network</span
                    >
                    <CheckboxGroup
                      v-model="social"
                      style="float: right; line-height: 32px"
                    >
                      <Checkbox label="NetCell">
                        NetCell
                      </Checkbox>
                      <Checkbox label="Voice">
                        Voice
                      </Checkbox>
                    </CheckboxGroup>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <Radio label="All base station">
              <Icon type="All base station"></Icon>
              <span>All base station</span>
            </Radio>
            <div style="overflow: hidden; margin-bottom: 20px;">
              <div style="float: left; display: flex;">
                <span style="padding: 10px 10px;">Enabled network</span>
                <Select style="width: 200px;">
                  <Option
                    v-for="item in statusList"
                    :value="item.value"
                    :key="item.value"
                    >{{ item.label }}</Option
                  >
                </Select>
              </div>
              <div style="float: left; display: flex;">
                <span style="padding: 10px 10px;">XAC</span>
                <Input style="width: 200px;" />
              </div>
              <div style="float: left; display: flex;">
                <span style="padding: 10px 10px;">XCI</span>
                <Input style="width: 200px;" />
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
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
