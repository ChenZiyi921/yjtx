<template>
  <Modal
    v-model="createModal"
    class-name="vertical-center-modal"
    :closable="false"
    title="Create/Edit"
    width="1200"
  >
    <div>
      <div style="overflow: hidden; margin-bottom: 20px;">
        <div style="float: left; display: flex;">
          <span style="padding: 10px 10px;">Case</span>
          <Select style="width: 200px;">
            <Option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
        <div style="float: left; display: flex;">
          <span style="padding: 10px 10px;">Suspects</span>
          <Select style="width: 200px;">
            <Option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
        <div style="float: left; display: flex;">
          <span style="padding: 10px 10px;">Duty console No.</span>
          <Select style="width: 200px;">
            <Option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </div>
      </div>
      <div>
        <RadioGroup v-model="vertical1" vertical style="padding-left: 10px;">
          <Radio label="Target ID">
            <Icon type="Target ID"></Icon>
            <span>Target ID</span>
          </Radio>
          <div style="padding: 10px 20px;">
            <RadioGroup v-model="vertical2">
              <Radio label="User target">
                <Icon type="User target"></Icon>
                <span>User target</span>
              </Radio>
              <div style="overflow: hidden; margin-bottom: 20px;">
                <div style="display: block; float: left;">
                  <span style="padding: 10px 10px;">ISDN</span>
                  <Input style="width: 200px;" />
                </div>
                <div style="display: block;">
                  <span style="padding: 10px 10px;">IMSI</span>
                  <Input style="width: 200px;" />
                </div>
                <div style="padding: 10px;">
                  “ISDN Entry Rules:”+” +
                  “CountryCode”+”phoneNo.”,example:”+263791234567”. Support
                  prefix, example:”+263791234*”
                </div>
              </div>
              <Radio label="IMEI target">
                <Icon type="IMEI target"></Icon>
                <span>IMEI target</span>
              </Radio>
              <div style="overflow: hidden; margin-bottom: 20px;">
                <div style="display: block; float: left;">
                  <span style="padding: 10px 10px;">IMEI</span>
                  <Input style="width: 200px;" />
                </div>
                <div style="display: block; float: left;">
                  <span style="padding: 10px 10px;">Description</span>
                  <Input style="width: 200px;" />
                </div>
                <div style="display: block; float: left;">
                  <span style="padding: 10px 10px; line-height: 32px"
                    >Enabled network</span
                  >
                  <CheckboxGroup
                    v-model="social"
                    style="float: right; line-height: 32px"
                  >
                    <Checkbox label="NetCell">
                      NetCell
                    </Checkbox>
                    <Checkbox label="Voice">
                      Voice
                    </Checkbox>
                  </CheckboxGroup>
                </div>
              </div>
            </RadioGroup>
          </div>
          <Radio label="All base station">
            <Icon type="All base station"></Icon>
            <span>All base station</span>
          </Radio>
          <div style="overflow: hidden; margin-bottom: 20px;">
            <div style="float: left; display: flex;">
              <span style="padding: 10px 10px;">Enabled network</span>
              <Select style="width: 200px;">
                <Option
                  v-for="item in statusList"
                  :value="item.value"
                  :key="item.value"
                  >{{ item.label }}</Option
                >
              </Select>
            </div>
            <div style="float: left; display: flex;">
              <span style="padding: 10px 10px;">XAC</span>
              <Input style="width: 200px;" />
            </div>
            <div style="float: left; display: flex;">
              <span style="padding: 10px 10px;">XCI</span>
              <Input style="width: 200px;" />
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
    <div slot="footer">
      <Button size="large" @click="addICCancel">Cancel</Button>
      <Button type="info" size="large" @click="addICSave">Save</Button>
    </div>
  </Modal>
</template>

<script>
import { addCaseIc } from "@/api/global";

export default {
  props: {
    createModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      vertical1: "Target ID",
      vertical2: "User target",
      social: ["NetCell", "Voice"],
      statusList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        }
      ]
    };
  },
  methods: {
    addICCancel() {
      this.$emit("add-ic-cancel");
    },
    addICSave() {}
  }
};
</script>

<style></style>
