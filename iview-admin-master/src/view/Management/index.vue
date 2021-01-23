<template>
  <div class="main-wrap management">
    <Tabs
      name="managementTable"
      value="Statistics"
      :animated="false"
      class="tab1"
    >
      <TabPane label="Statistics" name="Statistics">
        <!-- <Interception /> -->
      </TabPane>
      <TabPane label="Interception" name="Interception">
        <Interception />
      </TabPane>
      <TabPane label="Massive" name="Massive">标签二的内容</TabPane>
      <TabPane label="User" name="User">
        <User />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import User from "./pages/user";
import Interception from "./pages/interception";

export default {
  name: "",
  data() {
    return {};
  },
  components: {
    User,
    Interception
  },
  computed: {}
};
</script>

<style lang="less" scoped>
.management {
  background: #fff;
  /deep/.ivu-tabs-nav-scroll {
    float: right;
  }
}
</style>
