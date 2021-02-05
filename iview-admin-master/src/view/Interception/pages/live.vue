<template>
  <div>
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
              ><img
                style="width: 20px;"
                src="@/assets/images/i-phone.png"
                alt=""
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
      <div style="height: calc(100vh - 740px); overflow-y: auto;">
        <Table
          border
          :columns="columns"
          :data="data"
          :loading="loading"
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
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { queryCdrByIc, queryLiveConsole } from "@/api/global";

export default {
  name: "",
  components: {},
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
          type: "index",
          title: "Index",
          key: "name"
        },
        {
          title: "VOC",
          key: "",
          render: (h, { row, index }) => {
            if (row.fileName) {
              return h("div", [
                h("img", {
                  style: {
                    width: "20px",
                    verticalAlign: "middle"
                  },
                  attrs: {
                    src: require("@/assets/images/i-music.png")
                  }
                })
              ]);
            } else {
              return "";
            }
          }
        },
        {
          title: "Status",
          key: "",
          render: (h, { row, index }) => {
            if (row.ifHeard && row.ifKeep) {
              return h("div", [
                h("img", {
                  style: {
                    width: "20px",
                    verticalAlign: "middle",
                    marginRight: "10px"
                  },
                  attrs: {
                    src: require("@/assets/images/i-heard.png")
                  }
                }),
                h("img", {
                  style: {
                    width: "20px",
                    verticalAlign: "middle"
                  },
                  attrs: {
                    src: require("@/assets/images/i-keep.png")
                  }
                })
              ]);
            } else if (row.ifHeard) {
              return h("div", [
                h("img", {
                  style: {
                    width: "20px",
                    verticalAlign: "middle"
                  },
                  attrs: {
                    src: require("@/assets/images/i-heard.png")
                  }
                })
              ]);
            } else if (row.ifKeep) {
              return h("div", [
                h("img", {
                  style: {
                    width: "20px",
                    verticalAlign: "middle"
                  },
                  attrs: {
                    src: require("@/assets/images/i-keep.png")
                  }
                })
              ]);
            } else {
              return "";
            }
          }
        },
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
          key: "acttype",
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
          title: "Partner No.",
          key: "objNbr"
        }
      ],
      data: [],
      checkedCities: []
    };
  },
  computed: {},
  mounted() {
    this.consoleForm.userid = this.$store.state.user.userId.userid;
    this.queryLiveConsole();
  },
  create() {},
  methods: {
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
      // this.queryList();
    },
    pageChange(index) {
      this.queryForm.currPage = index;
      // this.queryList();
    }
  }
};
</script>

<style lang="less" scoped>
.top-content {
  height: 560px;
  background: #fff;
  li {
    width: 20%;
    height: 140px;
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
</style>
