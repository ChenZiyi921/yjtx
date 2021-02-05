<template>
  <div>
    <Tabs name="Massive" value="BigData Query" :animated="false" class="tab1">
      <TabPane
        label="BigData Query"
        name="BigData Query"
        style="height: calc(100vh - 160px);"
        tab="Massive"
      >
        <Full />
      </TabPane>
      <TabPane
        label="Group Alarm"
        name="Group Alarm"
        style="height: calc(100vh - 160px);"
        tab="Massive"
      >
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Full from "./full";

const cityOptions = ["Global Telecom", "SuperComm", "EasyComm", "Other"];
export default {
  name: "",
  components: {
    Full
  },
  data() {
    return {
      split2: 1,
      vertical: "General Search",
      verticalUser: "All",
      verticalTime: "All",
      liveListCard: [],
      queryFormGeneral: {},
      queryFormFuzzy: {},
      queryForm: {
        currPage: 1,
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
        }
        // {
        //   title: "Action",
        //   slot: "action",
        //   width: 150,
        //   align: "center"
        // }
      ],
      data: [],

      checkedCities: [],
      cities: cityOptions
    };
  },
  computed: {},
  mounted() {
    for (let i = 0; i < 20; i++) {
      this.liveListCard.push({
        index: i
      });
    }
    for (let i = 0; i < 10; i++) {
      this.data.push({
        name: "Jon Snow",
        age: i,
        address: "Ottawa No. 2 Lake Park"
      });
    }
  },
  create() {
    location.reload();
  },
  methods: {
    pageSizeChange(pageSize) {
      // this.loading = true;
      this.queryForm.pageSize = pageSize;
      // this.queryList();
    },
    pageChange(index) {
      // this.loading = true;
      this.queryForm.currPage = index;
      // this.queryList();
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
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
/deep/.ivu-split-pane {
  // background: #fff;
  overflow: auto;
}
.ivu-form-item {
  margin-bottom: 10px;
}
.vhlr-top-content {
  position: relative;
  height: 260px;
  padding: 10px;
  background: #fff;
  .vhlr-search-button {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
