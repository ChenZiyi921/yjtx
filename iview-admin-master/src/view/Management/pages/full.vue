<template>
  <div class="demo-split">
    <Split v-model="split1">
      <div
        slot="left"
        class="demo-split-pane"
        style="height: 100%; background: #fff;"
      >
        <div>
          <Button class="mr10">Tree</Button>
          <Button>Cond</Button>
        </div>
        <DatePicker
          type="datetimerange"
          placeholder="Select date and time"
          class="mt10"
          style="width: 300px; display: block;"
        ></DatePicker>
        <Checkbox v-model="single" class="mt10">Call & Voice</Checkbox>
      </div>
      <div slot="right" class="demo-split-pane no-padding">
        <Split v-model="split2" mode="vertical">
          <div slot="top" class="demo-split-pane">
            <div>
              <Button class="mr10">Track</Button>
              <Button class="mr10" type="success">Position</Button>
              <Button class="mr10" type="success" ghost>Refresh</Button>
              <Button class="mr10" type="info">Export</Button>
              <Button type="info" ghost>Comment</Button>
            </div>
            <Table
              border
              :columns="columns"
              :data="data"
              class="mt10"
              style="background: #fff;"
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
            <Modal v-model="replayModal1" draggable scrollable title="">
            </Modal>
          </div>
          <div slot="bottom" class="demo-split-pane"></div>
        </Split>
      </div>
    </Split>
    <Modal
      v-model="addTaskModal"
      class-name="vertical-center-modal"
      title="Task"
      width="1000"
    >
      <Form :model="addTaskForm" label-position="left" :label-width="110">
        <FormItem label="Task Name">
          <Input v-model="addTaskForm.userstatus" style="max-width: 187px;" />
        </FormItem>
        <FormItem label="Query Type">
          <RadioGroup v-model="queryType">
            <Radio label="Target ID"></Radio>
            <Radio label="Area"></Radio>
            <Radio label="Key Word"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="Time Range">
          <DatePicker
            v-model="addTaskForm.userexpiredate"
            type="date"
            :options="options"
            placeholder="Select date"
          ></DatePicker>
        </FormItem>
      </Form>
      <div
        v-if="queryType === 'Target ID'"
        style="border: 1px solid #eee; padding: 10px;"
      >
        <div>
          <div
            style="border-bottom: 1px solid #eee; padding: 10px; margin-bottom: 20px; text-align: center;"
          >
            Party A
          </div>
          <div style="display: flex; justify-content: center;">
            <div class="mr10">
              <span style="display: block; text-align: center;">MSISDN</span>
              <Input type="textarea" :rows="4" style="width: 300px" />
            </div>
            <div class="mr10">
              <span style="display: block; text-align: center;">MSISDN</span>
              <Input type="textarea" :rows="4" style="width: 300px" />
            </div>
            <div>
              <span style="display: block; text-align: center;">MSISDN</span>
              <Input type="textarea" :rows="4" style="width: 300px" />
            </div>
          </div>
        </div>
        <div>
          <div
            style="border-bottom: 1px solid #eee; padding: 10px; margin-bottom: 20px; text-align: center;"
          >
            Party B
          </div>
          <div style="display: flex; justify-content: center;">
            <div class="mr10">
              <span style="display: block; text-align: center;">MSISDN</span>
              <Input type="textarea" :rows="4" style="width: 300px" />
            </div>
            <div class="mr10">
              <span style="display: block; text-align: center;">MSISDN</span>
              <Input type="textarea" :rows="4" style="width: 300px" />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="queryType === 'Area'"
        style="border: 1px solid #eee; padding: 10px;"
      >
        <div style="display: flex;">
          <div style="width: 400px;" class="mr10">
            <div>
              <Select
                placeholder="templet"
                class="mr10"
                style="display: inline-block; width: 110px;"
              >
                <Option
                  v-for="item in templetList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
              <Upload
                action="/"
                ref="upload"
                accept=".txt"
                :before-upload="beforeUpload"
                :default-file-list="this.fileList"
                style="display: inline-block;"
              >
                <Button type="success" class="mr10">leadingIn</Button>
              </Upload>
              <Button type="info" class="mr10">selectOnMap</Button>
              <Button type="error">clear</Button>
            </div>
            <div style="display: flex;" class="mt10">
              <Input
                type="textarea"
                :rows="14"
                style="width: 120px"
                class="mr10"
              />
              <Input
                type="textarea"
                :rows="14"
                style="width: 120px"
                class="mr10"
              />
              <Input type="textarea" :rows="14" style="width: 120px" />
            </div>
          </div>
          <div style="">
            <p style="line-height: 32px; color: #ed4014;">
              *Support file format slsx please keep file size under 10M
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="queryType === 'Key Word'"
        style="border: 1px solid #eee; padding: 10px;"
      >
        <Input type="textarea" :rows="15" style="width: 100%" />
      </div>
      <div slot="footer">
        <Button size="large" @click="delUserModal = false">Cancel</Button>
        <Button size="large" @click="addTaskSubmit" type="info">Save</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { queryCasesByUser } from "@/api/global";

export default {
  name: "",
  data() {
    return {
      addTaskModal: false,
      addTaskForm: {},
      options: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      queryType: "Target ID",
      templetList: [
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
      split1: 0.3,
      split2: 0.9,
      replayModal1: false,
      single: false,
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100
      },
      columns: [
        {
          type: "index",
          title: "Index",
          key: ""
        },
        {
          title: "VOC",
          key: "age"
        },
        {
          title: "Status",
          key: "address"
        },
        {
          title: "MSISDN",
          key: "name"
        },
        {
          title: "IMSI",
          key: "age"
        },
        {
          title: "IMEI",
          key: "address"
        },
        {
          title: "ActType",
          key: "name"
        },
        {
          title: "Partner No.",
          key: "age"
        }
        // {
        //   title: "Action",
        //   slot: "action",
        //   width: 150,
        //   align: "center"
        // }
      ],
      data: [],
      fileList: [],
      textData: []
    };
  },
  computed: {},
  mounted() {
    // this.queryCasesByUserList();
  },
  created() {},
  beforeCreate() {
    // 读取文件
    FileReader.prototype.reading = function({ encode } = pms) {
      let bytes = new Uint8Array(this.result); //无符号整型数组
      let text = new TextDecoder(encode || "UTF-8").decode(bytes);
      return text;
    };
    /* 重写readAsBinaryString函数 */
    FileReader.prototype.readAsBinaryString = function(f) {
      if (!this.onload)
        //如果this未重写onload函数，则创建一个公共处理方式
        this.onload = e => {
          //在this.onload函数中，完成公共处理
          let rs = this.reading();
          console.log(rs);
        };
      this.readAsArrayBuffer(f); //内部会回调this.onload方法
    };
  },
  methods: {
    beforeUpload(file) {
      this.fileList = [file];
      console.log("选择了文件beforeUpload");
      // 读取数据
      this.read(file);
      return false;
    },
    read(f) {
      let rd = new FileReader();
      rd.onload = e => {
        //this.readAsArrayBuffer函数内，会回调this.onload函数。在这里处理结果
        let cont = rd.reading({ encode: "GBK" });
        console.log(cont.split(/[\n]/g));
        this.textData = cont;
      };
      rd.readAsBinaryString(f);
    },
    pageSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.queryCasesByUserList();
    },
    pageChange(index) {
      this.queryForm.currPage = index;
      this.queryCasesByUserList();
    },
    addTaskSubmit() {},
    queryCasesByUserList() {
      queryCasesByUser({
        userid: this.$store.state.user.userId.userid
      }).then(({ data }) => {
        console.log(data);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.demo-split {
  height: 100%;
  border: 1px solid #dcdee2;
}
.demo-split-pane {
  padding: 10px;
}
.demo-split-pane.no-padding {
  height: 100%;
  padding: 0;
}
</style>
