<template>
  <div class="demo-split">
    <ul class="top-content">
      <li
        v-for="(item, index) in liveListCard"
        :key="index"
        @dblclick="queryList(item)"
      >
        <div class="card-title">
          <span>{{ index + 1 }}</span>
          <span v-if="item.ictype === 'IMSI'"
            ><img style="width: 20px;" src="@/assets/images/i-sim.png" alt=""
          /></span>
          <span v-if="item.ictype === 'IMEI'"
            ><img style="width: 20px;" src="@/assets/images/i-phone.png" alt=""
          /></span>
          <span v-if="item.ictype === 'MSISDN'"
            ><img style="width: 20px;" src="@/assets/images/i-123.png" alt=""
          /></span>
          <span>{{ item.icnum }}</span>
          <Icon
            type="md-call"
            style="font-size: 20px; text-align: center; width: 60%; transform: rotate(180deg); color: red;"
          />
          <span>2</span>
        </div>
        <div style="padding: 10px 0;">
          {{ item.casename }}<span style="padding: 0 20px;">OF</span
          >{{ item.targetname }}
        </div>
        <div style="height: 40px">
          <div style="width: 50%; height: 100%; float: left;">
            {{ "+2637912345648123456789" }}
            {{ "+2623131312312312316789" }}
          </div>
          <div style="width: 50%; height: 100%; float: right;">
            <span style="display: block;">{{ "CMO" }}</span>
            <span>{{ "+263791222333441" }}</span>
          </div>
        </div>
        <div
          style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
        >
          {{ "11111111111" }}
        </div>
        <div>LOC：{{ "Railway station-2" }}</div>
      </li>
    </ul>
    <div style="background: #eee;">
      <DatePicker
        v-model="date"
        :clearable="false"
        type="datetimerange"
        placeholder="Select date and time"
        class="mr10"
        style="width: 300px; display: inline-block;"
      ></DatePicker>
      <Checkbox class="mt10">Call Only</Checkbox>
    </div>
    <div style="height: calc(100vh - 800px); overflow-y: auto;">
      <Table
        border
        :columns="columns"
        :data="data"
        :loading="loading"
        class="mt10"
        style="background: #fff;"
        :row-class-name="rowClassName"
        @on-row-click="rowClick"
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
    </div>
    <Modal
      v-model="wstModal"
      draggable
      scrollable
      footer-hide
      title="Modal"
      width="600"
      :styles="{
        height: '200px',
        top: '600px'
      }"
    >
      <iframe
        src="/wst/wst.html"
        frameborder="0"
        style="width: 100%; height: 100%;"
      ></iframe>
    </Modal>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { queryCdrByIc, queryLiveConsole } from "@/api/global";

export default {
  name: "",
  components: {},
  props: {
    wstModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      split2: 1,
      liveListCard: [],
      consoleForm: {
        userid: "",
        consoles: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20
        ]
      },
      date: [
        dayjs(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000).setHours(
            0,
            0,
            0,
            0
          )
        ).format("YYYY-MM-DD HH:mm:ss"),
        dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
      ],
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100,
        caseid: "",
        icid: "",
        starttime: dayjs(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000).setHours(
            0,
            0,
            0,
            0
          )
        ).format("YYYY-MM-DD HH:mm:ss"),
        endtime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
      },
      columns: [
        {
          title: " ",
          key: "",
          width: "60px",
          render: (h, { row, index }) => {
            if (row.fileName) {
              return h("div", [
                h("Icon", {
                  style: {
                    cursor: "pointer"
                  },
                  attrs: {
                    custom: "iconfont icon-voice"
                  },
                  on: {
                    click: e => {
                      e.stopPropagation();
                    }
                  }
                })
              ]);
            } else {
              return "";
            }
          }
        },
        {
          title: "CdrNo",
          key: "objid",
          width: "80px"
        },
        {
          title: "MSISDN",
          key: "msisdn",
          width: "160px"
        },
        {
          title: "IMSI",
          key: "imsi",
          width: "160px"
        },
        {
          title: "IMEI",
          key: "imei",
          width: "160px"
        },
        {
          title: "Type",
          key: "acttype",
          width: "80px",
          // 101	位置更新	NLU
          // 102	周期更新	PLU
          // 103	开机	PON
          // 104	关机	POFF
          // 107	附着	AAH
          // 108	去附着	ADH
          // 10a	专载去激活	BAH
          // 10b	专载激活	BDH
          // 301	主叫	VO
          // 302	被叫	VT
          // 303	发短信	MO
          // 304	收短信	MT
          // 305	切换	HOVR
          // 306	被寻呼	PTO
          // 30a	发彩信	MMO
          // 30b	收彩信	MMT
          // 400	补充业务	SUPP
          render: (h, { row, index }) => {
            let acttypeStr = "";
            switch (row.acttype) {
              case "101":
                acttypeStr = "NLU";
                break;
              case "102":
                acttypeStr = "PLU";
                break;
              case "103":
                acttypeStr = "PON";
                break;
              case "104":
                acttypeStr = "POFF";
                break;
              case "107":
                acttypeStr = "AAH";
                break;
              case "108":
                acttypeStr = "ADH";
                break;
              case "10a":
                acttypeStr = "BAH";
                break;
              case "10b":
                acttypeStr = "BDH";
                break;
              case "301":
                acttypeStr = "VO";
                break;
              case "302":
                acttypeStr = "VT";
                break;
              case "303":
                acttypeStr = "MO";
                break;
              case "304":
                acttypeStr = "MT";
                break;
              case "305":
                acttypeStr = "HOVR";
                break;
              case "306":
                acttypeStr = "PTO";
                break;
              case "30a":
                acttypeStr = "MMO";
                break;
              case "30b":
                acttypeStr = "MMT";
                break;
              case "400":
                acttypeStr = "SUPP";
                break;
              default:
                acttypeStr = row.acttype;
                break;
            }
            return <span>{acttypeStr}</span>;
          }
        },
        {
          title: "PartyNum",
          key: "objnbr",
          width: "180px"
        },
        {
          title: "StartTime",
          key: "starttime",
          width: "180px"
        },
        {
          title: "Duration",
          key: "duration",
          width: "100px"
        },
        {
          title: "CGI",
          key: "basestation",
          width: "250px",
          render: (h, { row }) => {
            return <span>{row.basestation + " " + row.laccellid}</span>;
          }
        },
        {
          title: "Extra",
          key: "dtmfno",
          width: "80px"
        },
        {
          title: "Network",
          key: "netid",
          width: "100px"
        },
        {
          title: "Comments",
          key: "cdrcomment",
          width: "100px"
        },
        {
          title: "SmsText",
          key: "smstext",
          width: "400px"
        }
      ],
      data: [],
      checkedCities: [],
      selectRow: {}
    };
  },
  computed: {},
  mounted() {
    this.consoleForm.userid = this.$store.state.user.userId.userid;
    this.queryLiveConsole();
  },
  watch: {
    wstModal(newVal) {
      console.log(newVal);
      this.wstModal = newVal;
    }
  },
  created() {},
  methods: {
    rowClick(row, index) {
      // this.selectRow = row;
    },
    rowClassName(row, index) {
      if (this.selectRow.objid === row.objid) {
        return "ivu-table-row-click";
      }
      if (row.ifkeep === "1") {
        return "ifkeep";
      }
      if (row.ifheard === "1") {
        return "ifheard";
      }
      return "";
    },
    queryList(row) {
      this.queryForm.caseid = row.caseid;
      this.queryForm.icid = row.icid;
      this.queryCdrByIc();
    },
    queryLiveConsole() {
      queryLiveConsole(this.consoleForm).then(({ data }) => {
        if (data.code === 200) {
          this.liveListCard = data.data;
        }
      });
    },
    queryCdrByIc() {
      this.loading = true;
      queryCdrByIc(this.queryForm).then(({ data }) => {
        if (data.code === 200) {
          this.loading = false;
          this.data = data.data.content;
          this.queryForm.currPage = data.data.currPage;
          this.queryForm.total = data.data.totalCount;
        }
      });
    },
    pageSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.queryList();
    },
    pageChange(index) {
      this.queryForm.currPage = index;
      this.queryList();
    }
  }
};
</script>

<style lang="less" scoped>
.top-content {
  height: 608px;
  background: #fff;
  li {
    width: 20%;
    height: 152px;
    padding: 10px;
    float: left;
    border: 1px solid #eee;
    list-style: none;
    cursor: pointer;
    .card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
/deep/.ivu-modal-content-drag {
  height: 100%;
}
/deep/.ivu-modal-body {
  height: 200px;
}
</style>
