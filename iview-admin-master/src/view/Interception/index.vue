<template>
  <div>
    <Tabs
      name="tab1"
      value="Replay"
      :animated="false"
      class="tab1"
      @on-click="tabChange"
    >
      <TabPane
        label="Replay Console"
        name="Replay"
        style="height: calc(100vh - 170px);"
      >
        <Replay :wstModal="show" />
      </TabPane>
      <TabPane
        label="Live Console"
        name="Live"
        style="height: calc(100vh - 170px);"
      >
        <Live :wstModal="show" />
      </TabPane>
      <TabPane
        label="vHLR Console"
        name="vHLR"
        style="height: calc(100vh - 170px);"
      >
        <Vhlr />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import Replay from "./pages/replay";
import Live from "./pages/live";
import Vhlr from "./pages/vhlr";

export default {
  name: "",
  components: {
    Replay,
    Live,
    Vhlr
  },
  data() {
    return {
      show: false
    };
  },
  computed: {},
  mounted() {},
  created() {},
  methods: {
    tabChange(name) {
      this.show = false;
      console.log(name);
    }
  }
};
</script>

<style lang="less" scoped></style>
