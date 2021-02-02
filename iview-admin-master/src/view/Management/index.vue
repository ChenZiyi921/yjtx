<template>
  <div class="main-wrap management">
    <Tabs
      name="managementTable"
      value="Statistics"
      :animated="false"
      class="tab1"
    >
      <TabPane label="Statistics" name="Statistics">
        <Statistics />
      </TabPane>
      <TabPane label="Interception" name="Interception">
        <Interception />
      </TabPane>
      <!-- <TabPane label="Massive" name="Massive">
        <Massive />
      </TabPane> -->
      <TabPane label="User" name="User">
        <User />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import User from "./pages/user";
import Statistics from "./pages/statistics";
import Interception from "./pages/interception";
import Massive from "./pages/massive";

export default {
  name: "",
  data() {
    return {};
  },
  components: {
    User,
    Statistics,
    Interception,
    Massive
  },
  computed: {},
  mounted() {
    window.name = "http://localhost:8080/#/Management";
  },
  create() {
    location.reload();
  }
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
