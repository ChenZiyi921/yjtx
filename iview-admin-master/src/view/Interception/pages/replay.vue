<template>
  <div class="demo-split">
    <Split v-model="split1">
      <div
        slot="left"
        class="demo-split-pane"
        style="height: 100%; background: #fff; overflow-y: auto;"
      >
        <div>
          <Button
            class="mr10"
            @click="
              (showType = 'tree'), (treeBtnType = 'info'), (condBtnType = '')
            "
            :type="treeBtnType"
            >Tree</Button
          >
          <Button
            @click="
              (showType = 'cond'), (condBtnType = 'info'), (treeBtnType = '')
            "
            :type="condBtnType"
            >Cond</Button
          >
        </div>
        <div v-if="showType === 'tree'">
          <div>
            <span class="mr10">date</span>
            <DatePicker
              :clearable="false"
              v-model="date"
              type="datetimerange"
              placeholder="Select date and time"
              class="mt10"
              style="width: 300px; display: inline-block;"
            ></DatePicker>
          </div>
          <Checkbox v-model="single" class="mt10">Call & Voice</Checkbox>
          <Tree
            :data="myCaseTreeData"
            @on-select-change="myCaseTreeDataChange"
          ></Tree>
        </div>
        <div v-else>
          <Tree
            :data="queryTreeData"
            :render="renderContent"
            @on-select-change="queryTreeDataChange"
            class="demo-tree-render"
          ></Tree>
        </div>
      </div>
      <div slot="right" class="demo-split-pane no-padding">
        <Split v-model="split2" mode="vertical">
          <div slot="top" class="demo-split-pane">
            <div>
              <Button class="mr10">Track</Button>
              <Button class="mr10" type="success">Position</Button>
              <Button
                class="mr10"
                type="success"
                @click="
                  () => {
                    queryCdrByIcForm.caseid !== '' && this.queryCdrByIc();
                  }
                "
                ghost
                >Refresh</Button
              >
              <Button class="mr10" type="info">Export</Button>
              <Button class="mr10" type="info">Archive</Button>
              <Button type="info" ghost @click="showCommentModal"
                >Comment</Button
              >
            </div>
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
            <Modal v-model="replayModal1" draggable scrollable title="">
            </Modal>
          </div>
          <div slot="bottom" class="demo-split-pane"></div>
        </Split>
      </div>
    </Split>
    <case-comment
      :commentModal="commentModal"
      :caseComment="caseComment"
      @cancel-comment="cancelComment"
      @save-comment-success="saveCommentSuccess"
    />
  </div>
</template>

<script>
import {
  queryCdrByIc,
  execQuery,
  queryCasesByUser,
  queryQuery
} from "@/api/global";
import dayjs from "dayjs";
import caseComment from "@/components/case-comment/case-comment";

export default {
  name: "",
  components: {
    caseComment
  },
  data() {
    return {
      commentModal: false,
      caseComment: {
        caseid: "",
        comment: ""
      },
      loading: false,
      showType: "tree",
      split1: "500px",
      split2: 0.9,
      replayModal1: false,
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
      queryTreeData: [
        {
          title: "Query",
          expand: true,
          render: (h, { root, node, data }) => {
            console.log(data);
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
                  h("Icon", {
                    props: {
                      type: "ios-folder-outline"
                    },
                    style: {
                      marginRight: "8px"
                    }
                  }),
                  h("span", data.title)
                ]),
                h(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      float: "right",
                      marginRight: "32px"
                    }
                  },
                  [
                    h("Button", {
                      props: Object.assign({}, this.buttonProps, {
                        icon: "ios-add",
                        type: "primary"
                      }),
                      style: {
                        width: "44px",
                        height: "18px",
                        padding: 0
                      },
                      on: {
                        click: () => {
                          this.append(data);
                        }
                      }
                    })
                  ]
                )
              ]
            );
          },
          children: []
        }
      ],
      buttonProps: {
        type: "default",
        size: "small"
      }
    };
  },
  computed: {},
  mounted() {
    this.execQuery();
    this.queryQuery();
    this.queryCasesByUser();
  },
  create() {},
  methods: {
    myCaseTreeDataChange(curArr, cur) {
      if (cur.icid) {
        this.queryCdrByIcForm.icid = cur.icid;
        this.queryCdrByIcForm.caseid = this.myCaseTreeData[0].children[
          cur.index
        ].caseid;
        this.queryCdrByIc();
      }
    },
    queryTreeDataChange(curArr, cur) {
      console.log(cur);
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
            h("Icon", {
              props: {
                type: "ios-paper-outline"
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.title)
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              data.level !== 3
                ? h("Button", {
                    props: Object.assign({}, this.buttonProps, {
                      icon: "ios-add"
                    }),
                    style: {
                      marginRight: "8px",
                      width: "18px",
                      height: "18px",
                      padding: 0
                    },
                    on: {
                      click: () => {
                        this.append(data);
                      }
                    }
                  })
                : "",
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-remove"
                }),
                style: {
                  width: "18px",
                  height: "18px",
                  padding: 0
                },
                on: {
                  click: () => {
                    this.remove(root, node, data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    append(data) {
      const children = data.children || [];
      children.push({
        title: "appended node",
        expand: true
      });
      this.$set(data, "children", children);
    },
    remove(root, node, data) {
      console.log(data.level);
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    },
    queryCasesByUser() {
      queryCasesByUser({
        userid: 1
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
                });
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
    queryQuery() {
      queryQuery().then(({ data }) => {
        if (data.code === 200) {
          for (let index = 0; index < data.data.length; index++) {
            for (const key in data.data[index]) {
              data.data[index].title = key;
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
          this.queryTreeData[0].children = data.data;
          console.log(this.queryTreeData[0].children);
        }
      });
    },
    showCommentModal() {
      if (this.queryCdrByIcForm.icid) {
        this.caseComment.caseid = this.queryCdrByIcForm.caseid;
        this.commentModal = true;
      } else {
        this.$Message.warning("Please select ics first");
      }
    },
    cancelComment() {
      this.commentModal = false;
    },
    saveCommentSuccess() {
      this.commentModal = false;
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
.demo-tree-render /deep/.ivu-tree-title {
  width: 100%;
}
</style>
