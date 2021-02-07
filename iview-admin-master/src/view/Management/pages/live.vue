<template>
  <div class="demo-split" style="display: flex;">
    <div
      class="demo-split-pane"
      style="width: 500px; height: 100%; background: #fff; overflow-y: auto;"
    >
      <Tree
        :data="myCaseTreeData"
        :render="renderContent"
        @on-select-change="myCaseTreeDataChange"
        class="demo-tree-render"
      ></Tree>
    </div>
    <div
      class="demo-split-pane"
      style="width: calc(100% - 500px); position: relative;"
    >
      <ul
        class="live-list"
        style="position: absolute; top: 0; left: 0; padding: 10px;"
      >
        <li v-for="(item, index) in 20" :key="index"></li>
      </ul>
      <draggable
        class="list-group live-list"
        tag="ul"
        v-model="consoleList"
        v-bind="dragOptions"
        @start="isDragging = true"
        @end="isDragging = false"
        @change="consoleListChange"
        animation="300"
      >
        <transition-group type="transition" name="flip-list">
          <li
            class="list-group-item"
            v-for="element in consoleList"
            :key="element.consolenum"
          >
            <p>{{ element.casename }}</p>
            <p>{{ element.icname }}</p>
            <Button
              @click="delConsole(element.consolenum)"
              type="primary"
              shape="circle"
              icon="ios-close"
              style="position: absolute; right: 10px; top: 10px;"
            ></Button>
          </li>
        </transition-group>
      </draggable>
      <div
        class="mt10"
        style="text-align: right; position: absolute; top: 610px; right: 10px;"
      >
        <Button class="mr10" @click="addLiveCancel">Cancel</Button>
        <Button type="info" @click="addLiveSave">Save</Button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import {
  queryCdrByIc,
  queryCasesByUser,
  queryQuery,
  addLiveConsole,
  deleteLiveConsole
} from "@/api/global";
import dayjs from "dayjs";

export default {
  name: "",
  display: "Transition",
  order: 6,
  components: {
    draggable
  },
  data() {
    return {
      consoleList: [],
      addQueryForm: {
        queryname: "",
        numbers: {
          imsi: "",
          msisdn: "",
          imei: ""
        },
        starttime: "",
        endtime: "",
        lac: "",
        cellid: "",
        sms: "",
        duration: {
          min: "",
          max: ""
        },
        network: [],
        acttype: ""
      },
      queryid: "",
      loading: false,
      showType: "tree",
      single: false,
      treeBtnType: "info",
      condBtnType: "",
      myCaseTreeData: [
        {
          title: "My Case",
          expand: true,
          children: []
        }
      ],
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
      queryCdrByIcForm: {
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
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100
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
      buttonProps: {
        type: "default",
        size: "small"
      },
      isAppend: true,
      saveType: ""
    };
  },
  computed: {},
  mounted() {
    this.queryQuery();
    this.queryCasesByUser();
  },
  created() {},
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    sort() {
      this.consoleList = this.consoleList.sort((a, b) => a.index - b.index);
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [
            h("span", data.title),
            data.isIC
              ? h(
                  "Button",
                  {
                    props: {
                      type: "info"
                    },
                    style: {
                      marginRight: "8px",
                      height: "18px",
                      padding: "0 4px",
                      float: "right"
                    },
                    on: {
                      click: e => {
                        e.stopPropagation();
                        if (this.consoleList.length < 20) {
                          this.consoleList.push({
                            userid: this.$store.state.user.userId.userid,
                            consolenum: this.consoleList.length + 1,
                            caseid: this.myCaseTreeData[0].children[data.index]
                              .caseid,
                            targetid: "",
                            casename: this.myCaseTreeData[0].children[
                              data.index
                            ].casename,
                            targetname: "",
                            icid: data.icid,
                            icname: data.icname,
                            icnum: "",
                            network: "",
                            status: "",
                            updatetime: ""
                          });
                        } else {
                          this.$Message.warning("Maximum limit reached");
                        }
                      }
                    }
                  },
                  "addLive"
                )
              : ""
          ])
        ]
      );
    },
    myCaseTreeDataChange(curArr, cur) {
      if (cur.icid) {
        this.queryCdrByIcForm.icid = cur.icid;
        this.queryCdrByIcForm.caseid = this.myCaseTreeData[0].children[
          cur.index
        ].caseid;
        this.queryCdrByIc();
      }
    },
    append(data) {
      const children = data.children || [];
      if (data.title !== dayjs(new Date()).format("YYYY-MM-DD")) {
        data.children.forEach(current => {
          if (current.title === dayjs(new Date()).format("YYYY-MM-DD")) {
            this.isAppend = false;
          }
        });
        if (this.isAppend) {
          children.push({
            title: dayjs(new Date()).format("YYYY-MM-DD"),
            expand: true
          });
          this.isAppend = false;
        } else {
          this.$Message.warning("The current date already exists");
        }
      }
      this.$set(data, "children", children);
    },
    queryCasesByUser() {
      queryCasesByUser({
        userid: this.$store.state.user.userId.userid
      }).then(({ data }) => {
        if (data.code === 200) {
          for (let index = 0; index < data.data.content.length; index++) {
            data.data.content[index].title = data.data.content[index].casename;
            data.data.content[index].children = data.data.content[
              index
            ].targets.concat(data.data.content[index].ics);
            data.data.content[index].children.map(item => {
              item.title = item.targetname || item.icname;
              item.index = index;
              if (item.targetname) {
                item.children = item.ics;
                item.children.map(item => {
                  item.title = item.icname;
                  item.index = index;
                  item.isIC = true;
                });
              }
              if (item.icname) {
                item.isIC = true;
              }
            });
          }
          this.myCaseTreeData[0].children = data.data.content;
        }
      });
    },
    queryCdrByIc() {
      this.loading = true;
      queryCdrByIc(this.queryCdrByIcForm).then(({ data }) => {
        if (data.code === 200) {
          this.loading = false;
          this.data = data.data.content;
          this.queryForm.currPage = data.data.currPage;
          this.queryForm.total = data.data.totalCount;
        }
      });
    },
    queryQuery() {
      queryQuery().then(({ data }) => {
        if (data.code === 200) {
          for (let index = 0; index < data.data.length; index++) {
            for (const key in data.data[index]) {
              data.data[index].title = key;
              data.data[index].level = 2;
              let arr = [];
              for (const k in data.data[index][key]) {
                for (const l in data.data[index][key][k]) {
                  data.data[index][key][k][l].title =
                    data.data[index][key][k][l].queryname;
                  data.data[index][key][k][l].level = 3;
                  arr.push(data.data[index][key][k][l]);
                }
              }
              data.data[index].children = arr;
            }
          }
        }
      });
    },
    delConsole(index) {
      console.log(index);
      this.consoleList.splice(index - 1, 1);
      this.consoleListChange();
    },
    consoleListChange(data) {
      this.consoleList.map((current, index) => {
        return (current.consolenum = index + 1);
      });
    },
    addLiveCancel() {},
    addLiveSave() {
      console.log(this.consoleList);
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
.demo-tree-render /deep/.ivu-tree-title {
  width: 96%;
}
.live-list {
  width: 100%;
  overflow: hidden;
  li {
    position: relative;
    width: 20%;
    height: 150px;
    border: 1px solid #eee;
    float: left;
    list-style: none;
    p {
      text-align: center;
    }
    p:nth-of-type(1) {
      margin-top: 60px;
    }
  }
}
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
