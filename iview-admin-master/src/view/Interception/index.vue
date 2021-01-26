<template>
  <div>
    <Tabs name="tab1" value="Replay" :animated="false" class="tab1">
      <TabPane
        label="Replay Console"
        name="Replay"
        style="height: calc(100vh - 160px);"
      >
        <Replay />
      </TabPane>
      <TabPane
        label="Live Console"
        name="Live"
        style="height: calc(100vh - 160px);"
      >
        <!-- <div class="demo-split">
          <ul class="top-content">
            <li v-for="(item, index) in liveListCard" :key="index">
              {{ item.index }}
            </li>
          </ul>
          <Split
            v-model="split2"
            mode="vertical"
            style="height: calc(100vh - 720px);"
          >
            <div slot="top" class="demo-split-pane"></div>
            <div slot="bottom" class="demo-split-pane"></div>
          </Split>
        </div> -->
        <Live />
      </TabPane>
      <TabPane
        label="vHLR Console"
        name="vHLR"
        style="height: calc(100vh - 160px);"
      >
        <div class="demo-split">
          <div class="vhlr-top-content">
            <Button type="info" class="vhlr-search-button">Search</Button>
            <RadioGroup v-model="vertical" style="margin-top: 10px;">
              <Radio label="General Search">
                <Icon type="General Search"></Icon>
                <span>General Search</span>
              </Radio>
              <Form
                :model="queryFormGeneral"
                label-position="left"
                :label-width="60"
                inline
                style="padding-left: 24px; margin-top: 10px;"
              >
                <FormItem label="IMSI/MIN">
                  <Input />
                </FormItem>
                <FormItem label="IMEI/ESN">
                  <Input />
                </FormItem>
                <FormItem label="MSISDN/MLDN" :label-width="90">
                  <Input />
                </FormItem>
              </Form>
              <Radio label="Fuzzy Query">
                <Icon type="Fuzzy Query"></Icon>
                <span>Fuzzy Query</span>
              </Radio>
              <Form
                :model="queryFormFuzzy"
                label-position="left"
                :label-width="60"
                style="padding-left: 24px; margin-top: 10px;"
              >
                <FormItem label="User:">
                  <RadioGroup v-model="verticalUser">
                    <Radio label="All">
                      <Icon type="All"></Icon>
                      <span>All</span>
                    </Radio>
                    <Radio label="Domestic users">
                      <Icon type="Domestic users"></Icon>
                      <span>Domestic users</span>
                    </Radio>
                    <Radio label="Overseas users">
                      <Icon type="Overseas users"></Icon>
                      <span>Overseas users</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="dataTime:">
                  <RadioGroup v-model="verticalTime">
                    <Radio label="All">
                      <Icon type="All"></Icon>
                      <span>All</span>
                    </Radio>
                    <Radio label="Time">
                      <Icon type="Time"></Icon>
                      <span>Time</span>
                    </Radio>
                    <Radio label="History Time">
                      <Icon type="History Time"></Icon>
                      <span>History Time</span>
                    </Radio>
                  </RadioGroup>
                </FormItem>
              </Form>
            </RadioGroup>
            <div
              style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 14px 0;"
            >
              <span>Operator</span>
              <Checkbox-group
                v-model="checkedCities"
                @change="handleCheckedCitiesChange"
                style="display: inline-block; margin-left: 20px;"
              >
                <Checkbox v-for="city in cities" :label="city" :key="city">{{
                  city
                }}</Checkbox>
              </Checkbox-group>
            </div>
          </div>
          <Split
            v-model="split2"
            mode="vertical"
            style="height: calc(100vh - 460px);"
          >
            <div slot="top" class="demo-split-pane">
              <Table border :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="name">
                  <strong>{{ row.name }}</strong>
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
            </div>
            <div slot="bottom" class="demo-split-pane"></div>
          </Split>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Replay from "./pages/replay";
import Live from "./pages/live";

const cityOptions = ["Global Telecom", "SuperComm", "EasyComm", "Other"];
export default {
  name: "",
  components: {
    Replay,
    Live
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
      this.queryForm.pageNum = index;
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
