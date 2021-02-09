<template>
  <div id="interception">
    <Tabs name="Interception" value="List">
      <TabPane label="List" name="List" tab="Interception">
        <Tabs name="tab1" value="case">
          <TabPane label="Case Management" name="case" tab="tab1">
            <Case />
          </TabPane>
          <TabPane label="IC Management" name="ic" tab="tab1">
            <Ic />
          </TabPane>
          <TabPane label="Live Management" name="live" tab="tab1">
            <Live />
          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane label="Tree" name="Tree" tab="Interception">
        <Tree />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Case from "./case";
import Ic from "./ic";
import Live from "./live";
import Tree from "./tree";

export default {
  name: "",
  components: {
    Case,
    Ic,
    Live,
    Tree
  },
  data() {
    return {};
  },
  computed: {}
};
</script>

<style lang="less" scoped>
#interception {
  /deep/.ivu-tabs-nav-scroll {
    float: left;
  }
}
</style>
