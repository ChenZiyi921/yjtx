<template>
  <div class="">
    <Tabs name="Interception" value="List">
      <TabPane label="List" name="List" tab="Interception">
        <Tabs name="tab1" value="case">
          <TabPane label="Case Management" name="case" tab="tab1">
            <Case />
          </TabPane>
          <TabPane label="IC Management" name="ic" tab="tab1">
            <Ic />
          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane label="Tree" name="Tree" tab="Interception">标签2</TabPane>
    </Tabs>
  </div>
</template>

<script>
import Case from "./case";
import Ic from "./ic";

export default {
  name: "",
  components: {
    Case,
    Ic
  },
  data() {
    return {};
  },
  computed: {}
};
</script>

<style lang="less" scoped>
// .management {
//   background: #fff;
// }
</style>
