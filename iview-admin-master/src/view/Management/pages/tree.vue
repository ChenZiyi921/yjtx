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
    ></div>
    <Modal
      v-model="delModal"
      class-name="vertical-center-modal"
      :closable="false"
      title="delete Case"
      width="700"
    >
      <div>Are you sure you want to delete case {{ delCasename }} ?</div>
      <div slot="footer">
        <Button size="large" @click="delModal = false">Cancel</Button>
        <Button type="info" size="large" @click="delCaseConfirm">Save</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  queryCasesByUser,
  deleteCase,
  deleteTargetIc,
  deleteCaseIc
} from "@/api/global";
import dayjs from "dayjs";

export default {
  name: "",
  display: "Transition",
  order: 6,
  components: {},
  data() {
    return {
      delModal: false,
      delCasename: "",
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
          children: [],
          level: 1,
          render: (h, { data }) => {
            return [
              h("span", data.title),
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-add",
                  type: "primary"
                }),
                style: {
                  width: "44px",
                  height: "18px",
                  padding: 0,
                  float: "right"
                },
                on: {
                  click: e => {
                    e.stopPropagation();
                    this.append(data);
                  }
                }
              })
            ];
          }
        }
      ],
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100
      },
      data: [],
      isAppend: true,
      saveType: ""
    };
  },
  computed: {},
  mounted() {
    this.queryCasesByUser();
  },
  created() {},
  computed: {},
  methods: {
    deleteTargetIc(data) {
      deleteTargetIc({
        caseid: data.caseid,
        targetid: 178,
        ics: [data.icid]
      }).then(({ data }) => {
        if (data.code === 200) {
          this.$Message.success("Operation success!");
          this.queryCasesByUser();
        }
      });
    },
    deleteCaseIc(data) {
      deleteCaseIc({
        caseid: data.caseid,
        ics: [data.icid]
      }).then(({ data }) => {
        if (data.code === 200) {
          this.$Message.success("Operation success!");
          this.queryCasesByUser();
        }
      });
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
            data.isIC && data.level === 4
              ? h("Button", {
                  props: {
                    icon: "ios-remove"
                  },
                  style: {
                    width: "18px",
                    height: "18px",
                    padding: 0,
                    float: "right"
                  },
                  on: {
                    click: e => {
                      this.deleteTargetIc(data);
                      e.stopPropagation();
                    }
                  }
                })
              : data.isIC && data.level === 3
              ? h("Button", {
                  props: {
                    icon: "ios-remove"
                  },
                  style: {
                    width: "18px",
                    height: "18px",
                    padding: 0,
                    float: "right"
                  },
                  on: {
                    click: e => {
                      this.deleteCaseIc(data);
                      e.stopPropagation();
                    }
                  }
                })
              : data.level === 2
              ? [
                  h("Button", {
                    props: {
                      icon: "ios-remove"
                    },
                    style: {
                      width: "18px",
                      height: "18px",
                      padding: 0,
                      float: "right"
                    },
                    on: {
                      click: e => {
                        e.stopPropagation();
                        this.delCase(data);
                      }
                    }
                  }),
                  h("Button", {
                    props: {
                      icon: "ios-add"
                    },
                    style: {
                      width: "18px",
                      height: "18px",
                      padding: 0,
                      float: "right",
                      marginRight: "8px"
                    },
                    on: {
                      click: e => {
                        e.stopPropagation();
                      }
                    }
                  })
                ]
              : ""
          ])
        ]
      );
    },
    myCaseTreeDataChange(curArr, cur) {},
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
            data.data.content[index].level = 2;
            data.data.content[index].children = data.data.content[
              index
            ].targets.concat(data.data.content[index].ics);
            data.data.content[index].children.map(item => {
              item.title = item.targetname || item.icname;
              item.index = index;
              item.level = 3;
              item.caseid = data.data.content[index].caseid;
              if (item.targetname) {
                // item.level = 3;
                item.children = item.ics;
                item.children.map(item => {
                  item.title = item.icname;
                  item.index = index;
                  item.isIC = true;
                  item.level = 4;
                  item.caseid = data.data.content[index].caseid;
                });
              } else {
                // item.level = 4;
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
    delConsole(index) {
      this.consoleList.splice(index - 1, 1);
      this.consoleListChange();
    },
    consoleListChange(data) {
      this.consoleList.map((current, index) => {
        return (current.consolenum = index + 1);
      });
    },
    delCase(row) {
      this.delCasename = row.casename;
      this.delModal = true;
      this.caseid = row.caseid;
    },
    delCaseConfirm() {
      deleteCase({
        caseid: this.caseid
      }).then(({ data }) => {
        if (data.code === 200) {
          this.delModal = false;
          this.$Message.success("Operation success!");
          this.queryCaseList();
        }
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
