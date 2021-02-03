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
      <Button size="large" @click="commentModal = false">Cancel</Button>
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
    return {
      changePwd: {
        userid: "",
        password: ""
      },
      password: ""
    };
  },
  mounted() {},
  methods: {
    changeUserPasswordCancel() {
      this.$emit("change-password-cancel");
    },
    commentCaseSave() {
      commentCase(this.caseComment).then(({ data }) => {
        if (data.code === 200) {
          this.commentModal = false;
          this.$Message.success("Operation success!");
          this.queryCaseList();
        }
      });
    }
  }
};
</script>
<style lang="less" scoped></style>
