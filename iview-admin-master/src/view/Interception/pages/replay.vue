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
        <div>
          <span class="mr10">date</span>
          <DatePicker
            type="datetimerange"
            placeholder="Select date and time"
            class="mt10"
            style="width: 300px; display: inline-block;"
          ></DatePicker>
        </div>
        <Checkbox v-model="single" class="mt10">Call & Voice</Checkbox>
        <Tree :data="myCaseTreeData" expand-node></Tree>
      </div>
      <div slot="right" class="demo-split-pane no-padding">
        <Split v-model="split2" mode="vertical">
          <div slot="top" class="demo-split-pane">
            <div>
              <Button class="mr10">Track</Button>
              <Button class="mr10" type="success" ghost>Position</Button>
              <Button class="mr10" type="success">Refresh</Button>
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
  </div>
</template>

<script>
import { queryCdrByIc, execQuery, queryCasesByUser } from "@/api/global";

export default {
  name: "",
  data() {
    return {
      split1: "500px",
      split2: 0.9,
      replayModal1: false,
      single: false,
      myCaseTreeData: [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1"
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }
      ],
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100
      },
      columns: [
        {
          title: "Index",
          key: "name"
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
      data: []
    };
  },
  computed: {},
  mounted() {
    this.queryCdrByIc();
    this.execQuery();
    this.queryCasesByUser();
  },
  create() {},
  methods: {
    queryCasesByUser() {
      queryCasesByUser({
        userid: 1
      }).then(({ data }) => {
        if (data.code === 200) {
          // this.loading = false;
          // this.data = data.data.content;
          // this.searchModal = false;
        }
      });
    },
    queryCdrByIc() {
      queryCdrByIc(this.queryForm).then(({ data }) => {
        if (data.code === 200) {
          this.loading = false;
          this.data = data.data.content;
          this.queryForm.currPage = data.data.currPage;
          this.queryForm.total = data.data.totalCount;
        }
      });
    },
    execQuery() {
      execQuery().then(({ data }) => {
        if (data.code === 200) {
          // this.loading = false;
          // this.data = data.data.content;
          // this.queryForm.currPage = data.data.currPage;
          // this.queryForm.total = data.data.totalCount;
        }
      });
    },
    pageSizeChange(pageSize) {
      // this.loading = true;
      this.queryForm.pageSize = pageSize;
      // this.queryList();
    },
    pageChange(index) {
      // this.loading = true;
      this.queryForm.currPage = index;
      // this.queryList();
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
