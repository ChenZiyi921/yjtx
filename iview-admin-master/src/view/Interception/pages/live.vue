<template>
  <div>
    <div class="demo-split">
      <ul class="top-content">
        <li v-for="(item, index) in liveListCard" :key="index">
          <div class="card-title">
            <span>{{ item.index }}</span>
            <span
              ><img style="width: 20px;" src="@/assets/images/i-sim.png" alt=""
            /></span>
            <!-- <span
              ><img
                style="width: 20px;"
                src="@/assets/images/i-phone.png"
                alt=""
            /></span>
            <span
              ><img style="width: 20px;" src="@/assets/images/i-123.png" alt=""
            /></span> -->
            <Icon
              type="md-call"
              style="font-size: 20px; text-align: center; width: 60%; transform: rotate(180deg); color: red;"
            />
            <span>2</span>
          </div>
          <div style="padding: 10px 0;">
            {{ "Biden" }}<span style="padding: 0 20px;">OF</span
            >{{ "Murder Case" }}
          </div>
          <div style="height: 40px">
            <div style="width: 50%; height: 100%; float: left;">
              {{ "+2637912345648123456789" }}
              {{ "+2623131312312312316789" }}
            </div>
            <div style="width: 50%; height: 100%; float: right;">
              <span style="display: block;">{{ "CMO" }}</span>
              <span>{{ "+263791222333441" }}</span>
            </div>
          </div>
          <div>LOC：{{ "Railway station-2" }}</div>
        </li>
      </ul>
      <Split
        v-model="split2"
        mode="vertical"
        style="height: calc(100vh - 720px);"
      >
        <div slot="top" class="demo-split-pane"></div>
        <div slot="bottom" class="demo-split-pane"></div>
      </Split>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  data() {
    return {
      split2: 1,
      liveListCard: [],
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 100
      },
      columns: [
        {
          title: "Name",
          slot: "name"
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address"
        }
        // {
        //   title: "Action",
        //   slot: "action",
        //   width: 150,
        //   align: "center"
        // }
      ],
      data: [],

      checkedCities: []
    };
  },
  computed: {},
  mounted() {
    for (let i = 0; i < 20; i++) {
      this.liveListCard.push({
        index: i
      });
    }
  },
  create() {},
  methods: {
    pageSizeChange(pageSize) {
      // this.loading = true;
      this.queryForm.pageSize = pageSize;
      // this.queryList();
    },
    pageChange(index) {
      // this.loading = true;
      this.queryForm.currPage = index;
      // this.queryList();
    }
  }
};
</script>

<style lang="less" scoped>
.top-content {
  height: 560px;
  background: #fff;
  li {
    width: 20%;
    height: 140px;
    padding: 10px;
    float: left;
    border: 1px solid #eee;
    list-style: none;
    .card-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
