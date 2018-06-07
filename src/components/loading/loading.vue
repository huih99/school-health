<template>
  <div>
    <div v-if="loadingShow" class="mask">
      <div class="fa-pulse wrap">
        <icon name="loading" style="color:#2db7f5;width:100%;height:100%"></icon>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  mounted() {
    this.$store.getters.loading;
  },
  computed: {
    loadingShow() {
      return this.$store.getters.loading;
    }
  }
};
</script>

<style  scoped>
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  /* background: rgba(0, 0, 0, 0.1) */
}
.mask .wrap {
  z-index: 9999;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 75px;
  height: 75px;
}
.fa-pulse {
  animation: fa-spin 1s infinite steps(16);
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
