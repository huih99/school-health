
<template>
  <div>
    <mt-header :title="title">
      <a @click="toBack" slot="left" v-if="leftShow">
        <mt-button icon="back" >返回</mt-button>
      </a>
      <a @click="Cancellation" slot="right" v-if="!leftShow&&isTeacher" >注销</a>
      <mt-button icon="more" slot="right"  v-if="!leftShow&&!isTeacher"  @click.stop="showChoose"></mt-button>
    </mt-header>
  </div>
</template>

<script type="text/javascript">
import { setLocal } from "../../util/util";
export default {
  props: {
    title: {
      type: String,
      default: "校园症状监测系统"
    },
    leftShow: {
      type: Boolean,
      default: true
    },
    isTeacher:{
      type: Boolean,
    }
  },
  data() {
    return {
      chooseShow:false
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    clearLocal() {
      setLocal('parent_flag', null);
      setLocal('teacher_flag', null);
    },
    Cancellation() {
      this.clearLocal();
      console.log(location)
      location.href=location.origin + location.pathname
      // this.$router.push({
      //   name: "login"
      // });
    },
    toBack() {
      this.$router.back();
    },
    showChoose(){
      this.$emit('showMore')
    }
  },
  components: {}
};
</script>

<style  scoped>
  

</style>
