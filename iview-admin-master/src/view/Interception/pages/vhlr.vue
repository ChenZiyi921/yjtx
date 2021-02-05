<template>
  <div class="demo-split">
    <div class="vhlr-top-content">
      <Button type="info" class="vhlr-search-button" @click="queryVhlrList"
        >Search</Button
      >
      <RadioGroup
        v-model="vertical"
        style="margin-top: 10px;"
        @on-change="verticalChange"
      >
        <Radio label="General Search">
          <Icon type="General Search"></Icon>
          <span>General Search</span>
        </Radio>
        <Form
          :model="queryForm"
          label-position="left"
          :label-width="60"
          inline
          style="padding-left: 24px; margin-top: 10px;"
        >
          <FormItem label="IMSI/MIN">
            <Input v-model="queryForm.general['imsi-min']" />
          </FormItem>
          <FormItem label="IMEI/ESN">
            <Input v-model="queryForm.general['imei-esn']" />
          </FormItem>
          <FormItem label="MSISDN/MLDN" :label-width="90">
            <Input v-model="queryForm.general['msisdn-mldn']" />
          </FormItem>
        </Form>
        <Radio label="Fuzzy Query">
          <Icon type="Fuzzy Query"></Icon>
          <span>Fuzzy Query</span>
        </Radio>
        <Form
          :model="queryForm"
          label-position="left"
          :label-width="60"
          style="padding-left: 24px; margin-top: 10px;"
        >
          <FormItem label="User:">
            <RadioGroup v-model="verticalUser" @on-change="verticalUserChange">
              <Radio label="All" :disabled="disabled">
                <Icon type="All"></Icon>
                <span>All</span>
              </Radio>
              <Radio label="Domestic users" :disabled="disabled">
                <Icon type="Domestic users"></Icon>
                <span>Domestic users</span>
              </Radio>
              <Radio label="Overseas users" :disabled="disabled">
                <Icon type="Overseas users"></Icon>
                <span>Overseas users</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="dateTime:">
            <RadioGroup v-model="verticalTime" @on-change="verticalTimeChange">
              <Radio label="All" :disabled="disabled">
                <Icon type="All"></Icon>
                <span>All</span>
              </Radio>
              <Radio label="Time" :disabled="disabled">
                <Icon type="Time"></Icon>
                <span>Time</span>
              </Radio>
              <Select
                v-if="datetimeIsshow"
                class="mr10"
                style="width: 100px"
                v-model="queryForm.fuzzy.datetime.time.val"
              >
                <Option
                  v-for="item in timeList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
              <Radio label="History Time" :disabled="disabled">
                <Icon type="History Time"></Icon>
                <span>History Time</span>
              </Radio>
              <DatePicker
                v-if="historyTimeIsshow"
                @on-change="queryFormDateChange"
                type="datetimerange"
                placeholder="Select date and time"
                style="width: 300px"
              ></DatePicker>
            </RadioGroup>
          </FormItem>
          <FormItem label="Operator:">
            <Checkbox-group
              v-model="checkedCities"
              @on-change="handleCheckedCitiesChange"
            >
              <Checkbox
                v-for="city in cities"
                :label="city"
                :key="city"
                :disabled="disabled"
                >{{ city }}</Checkbox
              >
            </Checkbox-group>
          </FormItem>
        </Form>
      </RadioGroup>
    </div>
    <Split
      v-model="split2"
      mode="vertical"
      style="height: calc(100vh - 460px);"
    >
      <div slot="top" class="demo-split-pane">
        <Table border :columns="columns" :data="data" :loading="loading">
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
      </div>
      <div slot="bottom" class="demo-split-pane"></div>
    </Split>
  </div>
</template>

<script>
import { queryVhlr } from "@/api/global";

const cityOptions = ["Global Telecom", "SuperComm", "EasyComm", "Other"];

export default {
  data() {
    return {
      loading: false,
      split2: 1,
      vertical: "General Search",
      verticalUser: "All",
      verticalTime: "All",
      disabled: true,
      operatorCheckbox: [],
      datetimeIsshow: false,
      historyTimeIsshow: false,
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100,

        general: {
          "imsi-min": "",
          "imei-esn": "",
          "msisdn-mldn": ""
        },
        fuzzy: {
          user: {
            domestic: false,
            overseas: false
          },
          basestation: [
            {
              lai: "",
              cellid: ""
            }
          ],
          datetime: {
            time: {
              val: ""
            },
            history: {
              starttime: "",
              endtime: ""
            }
          },
          operator: []
        }
      },
      columns: [
        {
          title: "MSISDN",
          key: "msisdn"
        },
        {
          title: "IMSI",
          key: "imsi"
        },
        {
          title: "IMEI",
          key: "imei"
        },
        {
          title: "ActType",
          key: "acttype"
        },
        {
          title: "Current Base Station",
          key: "currbs"
        },

        {
          title: "Last Base Station",
          key: "lastbs"
        },
        {
          title: "Active Time",
          key: "acttime"
        },
        {
          title: "Stay Time",
          key: "staytime"
        }
      ],
      data: [],
      checkedCities: [],
      cities: cityOptions,
      timeList: [
        {
          value: "30min",
          label: "30min"
        },
        {
          value: "1hour",
          label: "1hour"
        },
        {
          value: "8hour",
          label: "8hour"
        },
        {
          value: "1day",
          label: "1day"
        },
        {
          value: "1week",
          label: "1week"
        },
        {
          value: "1month",
          label: "1month"
        },
        {
          value: "1year",
          label: "1year"
        }
      ]
    };
  },
  mounted() {
    this.queryVhlrList();
  },
  methods: {
    queryVhlrList() {
      this.loading = true;
      this.operatorCheckbox.forEach((element, index) => {
        if (element === "Global Telecom") {
          this.queryForm.fuzzy.operator.splice(
            this.queryForm.fuzzy.operator.indexOf(element),
            0,
            "global-telcom"
          );
        }
        if (element === "SuperComm") {
          this.queryForm.fuzzy.operator.splice(
            this.queryForm.fuzzy.operator.indexOf(element),
            0,
            "supercomm"
          );
        }
        if (element === "EasyComm") {
          this.queryForm.fuzzy.operator.splice(
            this.queryForm.fuzzy.operator.indexOf(element),
            0,
            "easycomm"
          );
        }
        if (element === "Other") {
          this.queryForm.fuzzy.operator.splice(
            this.queryForm.fuzzy.operator.indexOf(element),
            0,
            "other"
          );
        }
      });
      console.log(this.queryForm);
      queryVhlr(this.queryForm).then(({ data }) => {
        if (data.code === 200) {
          this.loading = false;
          this.data = data.data.content;
          this.queryForm.currPage = data.data.currPage;
          this.queryForm.total = data.data.totalCount;
        }
      });
    },
    verticalChange(val) {
      switch (val) {
        case "General Search":
          this.disabled = true;
          this.datetimeIsshow = false;
          this.historyTimeIsshow = false;
          this.queryForm.fuzzy.datetime.history = {
            starttime: "",
            endtime: ""
          };
          this.queryForm.fuzzy.operator = [];
          break;
        case "Fuzzy Query":
          this.disabled = false;
          this.queryForm.general = {
            "imsi-min": "",
            "imei-esn": "",
            "msisdn-mldn": ""
          };
          break;
        default:
          break;
      }
    },
    verticalUserChange(val) {
      switch (val) {
        case "All":
          this.queryForm.fuzzy.user = {
            domestic: true,
            overseas: true
          };
          break;
        case "Domestic users":
          this.queryForm.fuzzy.user = {
            domestic: true,
            overseas: false
          };
          break;
        case "Overseas users":
          this.queryForm.fuzzy.user = {
            domestic: false,
            overseas: true
          };
          break;
        default:
          break;
      }
    },
    verticalTimeChange(val) {
      switch (val) {
        case "All":
          this.datetimeIsshow = false;
          this.historyTimeIsshow = false;
          this.queryForm.fuzzy.datetime.history = {
            starttime: "",
            endtime: ""
          };
          this.queryForm.fuzzy.datetime.time.val = "";
          break;
        case "Time":
          this.datetimeIsshow = true;
          this.historyTimeIsshow = false;
          this.queryForm.fuzzy.datetime.history = {
            starttime: "",
            endtime: ""
          };
          break;
        case "History Time":
          this.datetimeIsshow = false;
          this.historyTimeIsshow = true;
          this.queryForm.fuzzy.datetime.time.val = "";
          break;
        default:
          break;
      }
    },
    queryFormDateChange(date) {
      this.queryForm.fuzzy.datetime.history = {
        starttime: date[0],
        endtime: date[1]
      };
    },
    pageSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.queryVhlrList();
    },
    pageChange(index) {
      this.queryForm.currPage = index;
      this.queryVhlrList();
    },
    handleCheckedCitiesChange(value) {
      this.operatorCheckbox = value;
      this.queryForm.fuzzy.operator = [];
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
