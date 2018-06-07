
<template>
  <div class="wrap">
     <mt-swipe >
          <mt-swipe-item v-for="item,index in bannerList" :key="index">
              <div @click="toDetail(item)" class="swipe-img">
                  <img :src="item.src" alt="">
              </div>
          </mt-swipe-item>"
      </mt-swipe>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      bannerList: [
        { src: "./static/img/banner.png" },
        { src: "./static/img/banner.png" },
        { src: "./static/img/banner.png" }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    toDetail() {
      
    }
  },
  components: {}
};
</script>

<style  scoped>
.wrap {
  height: 175px;
  width: 100%;
}
.swipe-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.swipe-img img {
  height: 100%;
  width: 100%;
}
</style>
