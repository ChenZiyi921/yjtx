<template>
  <div class="demo-split">
    <div class="top-content"></div>
    <Split v-model="split2" mode="vertical">
      <div slot="top" class="demo-split-pane">
        <img
          src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2350817201,1137116540&fm=26&gp=0.jpg"
          alt=""
        />
      </div>
      <div slot="bottom" class="demo-split-pane">
        Bottom Pane
      </div>
    </Split>
  </div>
</template>
<script>
export default {
  data() {
    return {
      split2: 0.5
    };
  }
};
</script>
<style lang="less" scoped>
.demo-split {
  height: 100%;
  border: 1px solid #dcdee2;
}
.demo-split-pane {
  padding: 10px;
}
/deep/.ivu-split-pane {
  background: #fff;
  overflow: auto;
}
.top-content {
  height: 200px;
  background: #09f;
}
</style>
