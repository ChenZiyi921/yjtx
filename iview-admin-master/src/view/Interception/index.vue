<template>
  <div>
    <Tabs name="tab1" value="Replay" :animated="false" class="tab1">
      <TabPane label="Replay" name="Replay">
        <Row>
          <Col span="6">col</Col>
          <Col span="18" style="border: 1px solid #eee;">col-6</Col>
        </Row>
      </TabPane>
      <TabPane label="Live" name="Live"> </TabPane>
      <TabPane label="vHLR" name="vHLR"></TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  computed: {},
  mounted() {
    // location.reload();
  },
  create() {
    location.reload();
  }
};
</script>

<style lang="less" scoped></style>
