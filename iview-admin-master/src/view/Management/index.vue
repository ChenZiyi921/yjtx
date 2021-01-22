<template>
  <div class="main-wrap management">
    <Tabs name="managementTable" value="Interception" :animated="false">
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
}
</style>
