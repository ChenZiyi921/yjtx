<template>
  <div>
    <Tabs name="tab1" value="Replay" :animated="false" class="tab1">
      <TabPane
        label="Replay Console"
        name="Replay"
        style="height: calc(100vh - 160px);"
      >
        <Replay />
      </TabPane>
      <TabPane
        label="Live Console"
        name="Live"
        style="height: calc(100vh - 160px);"
      >
        <Live />
      </TabPane>
      <TabPane
        label="vHLR Console"
        name="vHLR"
        style="height: calc(100vh - 160px);"
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
    return {};
  },
  computed: {},
  mounted() {},
  create() {
    location.reload();
  },
  methods: {}
};
</script>

<style lang="less" scoped></style>
