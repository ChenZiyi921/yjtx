<template>
  <div class="">
    <Tabs name="userTable" value="Role">
      <TabPane label="Role" name="Role" tab="userTable">
        <Role />
      </TabPane>
      <TabPane label="User" name="User" tab="userTable">标签2</TabPane>
    </Tabs>
  </div>
</template>

<script>
import Role from "./role";

export default {
  name: "",
  components: {
    Role
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
