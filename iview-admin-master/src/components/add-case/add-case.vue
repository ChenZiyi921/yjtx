<template>
  <Modal
    v-model="createModal"
    class-name="vertical-center-modal"
    :closable="false"
    title="Create/Edit"
    fullscreen
  >
    <Form :model="queryForm" label-position="left" :label-width="100">
      <FormItem label="Case Name">
        <Input style="width: 300px" class="mr10" />
        <Button type="warning" ghost @click="checkCaseName">Check</Button>
      </FormItem>
      <FormItem label="Expired Date">
        <DatePicker
          type="datetimerange"
          placeholder="Select date and time"
          style="width: 300px"
        ></DatePicker>
      </FormItem>
      <FormItem label="Description">
        <Input type="textarea" :rows="4" style="width: 300px" />
      </FormItem>
      <FormItem label="Target Name">
        <Input style="width: 150px; float: left;" class="mr10" />
        <Button
          type="success"
          class="mr10"
          style="float: left; width: 32px; height: 32px; text-align: center; padding: 0; font-size: 16px;"
          @click="handleAdd"
          >+</Button
        >
        <div
          style="float: left; width: 200px; min-height: 100px; padding: 0 20px; border: 1px solid #eee;"
        >
          <Tag
            type="dot"
            closable
            color="success"
            :name="item"
            @on-close="handleClose"
            v-for="(item, index) in tagList"
            :key="index"
            >{{ item }}</Tag
          >
        </div>
      </FormItem>
      <FormItem label="Members Name">
        <Select style="width: 300px">
          <Option
            v-for="item in statusList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </FormItem>
      <!-- <FormItem label="Authorization">
          <CheckboxGroup @on-change="checkAllGroupChange">
            <Checkbox label="Manage"></Checkbox>
            <Checkbox label="Monitor"></Checkbox>
            <Checkbox label="View"></Checkbox>
            <Checkbox label="Analyze"></Checkbox>
          </CheckboxGroup>
        </FormItem> -->
      <FormItem label="Authorization">
        <div style="width: 1200px; text-align: right;">
          <Button type="success" @click="createData.push({})">Add</Button>
        </div>
        <Table
          border
          :columns="createColumns"
          :data="createData"
          class="mt10"
          width="1200"
        >
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
        </Table>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button size="large" @click="createModalCancel">Cancel</Button>
      <Button type="info" size="large" @click="addCaseSave">Save</Button>
    </div>
  </Modal>
</template>

<script>
import { addCase, checkCaseName } from "@/api/global";

export default {
  props: {
    createModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100,
        casename: "",
        "casename-cond": "include",
        targetname: "",
        caseowner: "",
        status: "NEW",
        "createdate-start": "",
        "createdate-end": "",
        comment: "",
        casetype: "basic"
      },
      statusList: [
        {
          value: "NEW",
          label: "NEW"
        },
        {
          value: "ACTIVE",
          label: "ACTIVE"
        },
        {
          value: "DEACTIVE",
          label: "DEACTIVE"
        },
        {
          value: "EXPIRED",
          label: "EXPIRED"
        },
        {
          value: "CLOSED",
          label: "CLOSED"
        },
        {
          value: "COMPLETE",
          label: "COMPLETE"
        },
        {
          value: "PENDING",
          label: "PENDING"
        },
        {
          value: "DENIED",
          label: "DENIED"
        }
      ],
      tagList: [],
      createColumns: [
        {
          type: "index",
          width: 100,
          align: "center",
          title: "ID",
          key: "roleid"
        },
        {
          title: "Name",
          key: "rolename",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              // this.roleDetail.rolename = row.rolename;
              edit = [
                h("Input", {
                  props: {
                    value: row.rolename
                  },
                  on: {
                    input: val => {
                      this.roleDetail.rolename = val;
                    }
                  }
                })
              ];
            } else {
              edit = row.rolename;
            }
            return h("div", [edit]);
          }
        },
        {
          title: "Manage",
          key: "rolestatus",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              // this.roleDetail.rolestatus = row.rolestatus;
              edit = [
                h("Select", {
                  props: {
                    value: row.rolestatus
                  },
                  on: {
                    input: val => {
                      this.roleDetail.rolestatus = val;
                    }
                  }
                })
              ];
            } else {
              edit = row.rolestatus;
            }
            return h("div", [edit]);
          }
        },
        {
          title: "Monitor",
          key: "createdate",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              // this.roleDetail.createdate = row.createdate;
              edit = [
                h("Input", {
                  props: {
                    value: row.createdate
                  },
                  on: {
                    input: val => {
                      this.roleDetail.createdate = val;
                    }
                  }
                })
              ];
            } else {
              edit = row.createdate;
            }
            return h("div", [edit]);
          }
        },
        {
          title: "View",
          key: "modifydate",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              // this.roleDetail.modifydate = row.modifydate;
              edit = [
                h("Input", {
                  props: {
                    value: row.modifydate
                  },
                  on: {
                    input: val => {
                      this.roleDetail.modifydate = val;
                    }
                  }
                })
              ];
            } else {
              edit = row.modifydate;
            }
            return h("div", [edit]);
          }
        },
        {
          title: "Analyze",
          key: "modifydate",
          render: (h, { row, index }) => {
            let edit;
            if (this.editIndex === index) {
              // this.roleDetail.modifydate = row.modifydate;
              edit = [
                h("Input", {
                  props: {
                    value: row.modifydate
                  },
                  on: {
                    input: val => {
                      this.roleDetail.modifydate = val;
                    }
                  }
                })
              ];
            } else {
              edit = row.modifydate;
            }
            return h("div", [edit]);
          }
        },
        {
          title: "Action",
          width: 180,
          render: (h, { row, index }) => {
            if (this.editIndex === index) {
              return [
                h(
                  "Button",
                  {
                    props: {},
                    style: {},
                    on: {
                      click: () => {
                        this.editIndex = -1;
                      }
                    }
                  },
                  "Cancel"
                )
              ];
            } else {
              return [
                h(
                  "Button",
                  {
                    props: {
                      type: "info",
                      ghost: true
                    },
                    on: {
                      click: e => {
                        e.stopPropagation();
                        this.saveType = "edit";
                        // this.editRole(row);
                        this.editIndex = index;
                      }
                    }
                  },
                  "Edit"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error"
                    },
                    style: {
                      marginLeft: "10px"
                    },
                    on: {
                      click: () => {
                        this.createData.splice(index, 1);
                      }
                    }
                  },
                  "Delete"
                )
              ];
            }
          }
        }
      ],
      createData: [],
      createDataForm: {},
      checkName: false,
      saveType: "",
      editIndex: -1
    };
  },
  mounted() {
    this.createData.push({});
  },
  methods: {
    createModalCancel() {
      this.$emit("createmodalcancel");
    },
    addCaseSave() {
      if (this.saveType === "new") {
        if (this.checkName) {
          addCase(this.createDataForm).then(({ data }) => {
            if (data.code === 200) {
              this.$Message.success("Operation success!");
              this.queryCaseList();
            }
          });
        }
      } else {
        modifyCase(this.createDataForm).then(({ data }) => {
          if (data.code === 200) {
            this.$Message.success("Operation success!");
            this.queryCaseList();
          }
        });
      }
    },
    checkCaseName() {
      checkCaseName().then(({ data }) => {
        if (data.code === 200) {
          this.checkName = true;
        }
      });
    },
    handleAdd() {
      if (this.tagList.length) {
        this.tagList.push(this.tagList[this.tagList.length - 1] + 1);
      } else {
        this.tagList.push(0);
      }
    },
    handleClose(event, name) {
      const index = this.tagList.indexOf(name);
      this.tagList.splice(index, 1);
    }
  }
};
</script>

<style></style>
