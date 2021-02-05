<template>
  <Modal
    v-model="commentModal"
    class-name="vertical-center-modal"
    :closable="false"
    title="Comments"
    width="700"
  >
    <div>
      <Input
        v-model="caseComment.comment"
        type="textarea"
        :rows="10"
        style="width: 600px"
      />
    </div>
    <div slot="footer">
      <Button size="large" @click="cancelComment">Cancel</Button>
      <Button type="info" size="large" @click="commentCaseSave">Save</Button>
    </div>
  </Modal>
</template>

<script>
import { commentCase } from "@/api/global";

export default {
  name: "",
  props: {
    caseComment: {
      type: Object,
      default: {
        caseid: "",
        comment: ""
      }
    },
    commentModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    cancelComment() {
      this.$emit("cancel-comment");
    },
    commentCaseSave() {
      commentCase(this.caseComment).then(({ data }) => {
        if (data.code === 200) {
          this.$emit("save-comment-success");
          this.$Message.success("Operation success!");
        }
      });
    }
  }
};
</script>
<style lang="less" scoped></style>
