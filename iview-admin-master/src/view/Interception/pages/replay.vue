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
              type="datetimerange"
              placeholder="Select date and time"
              class="mt10"
              style="width: 300px; display: inline-block;"
            ></DatePicker>
          </div>
          <Checkbox v-model="single" class="mt10">Call & Voice</Checkbox>
          <Tree :data="myCaseTreeData" expand-node></Tree>
        </div>
        <div v-else>
          <Tree
            :data="queryTreeData"
            :render="renderContent"
            class="demo-tree-render"
          ></Tree>
        </div>
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
import {
  queryCdrByIc,
  execQuery,
  queryCasesByUser,
  queryQuery
} from "@/api/global";

export default {
  name: "",
  data() {
    return {
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
          key: "acttype"
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
                        width: "64px"
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
    this.queryCdrByIc();
    this.execQuery();
    this.queryQuery();
    this.queryCasesByUser();
  },
  create() {},
  methods: {
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
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-add"
                }),
                style: {
                  marginRight: "8px"
                },
                on: {
                  click: () => {
                    this.append(data);
                  }
                }
              }),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-remove"
                }),
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
            data.data.content[index].children =
              data.data.content[index].targets;
            data.data.content[index].children.map(item => {
              item.title = item.targetname;
              item.children = item.ics;
              item.children.map(item => {
                item.title = item.icname;
              });
            });
          }
          this.myCaseTreeData[0].children = data.data.content;
          console.log(this.myCaseTreeData);
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
    queryQuery() {
      queryQuery().then(({ data }) => {
        if (data.code === 200) {
          //   this.queryTreeData[0].children = data.data;
          //   let newData = [];
          //   for (const key in data.data) {
          //     data.data[key].title = key;
          //     newData.push(data.data[key]);
          //     let dataItem = [];
          //     for (const k in data.data[key]) {
          //       if (k !== "title") {
          //         for (let i = 0; i < data.data[key][k].length; i++) {
          //           data.data[key][k][i].title = data.data[key][k][i].queryname;
          //           dataItem.push(data.data[key][k][i]);
          //         }
          //         data.data[key].children = dataItem;
          //       }
          //     }
          //   }
          //   // JSON.stringify(data.data)
          //   console.log(newData);
        }
      });
    },
    pageSizeChange(pageSize) {
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
.demo-tree-render /deep/.ivu-tree-title {
  width: 100%;
}
</style>
