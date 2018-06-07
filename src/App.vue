<template>
    <div>
        <loading></loading>
        <router-view />
    </div>
</template>
<script type="text/javascript">
import loading from "@/components/loading/loading.vue";
import { getLocal } from '@/util/util.js'

export default {
  components: {
    loading
  },
  created() {
    let role  = this.$store.getters.roles;
    let data;
    if (role.length) {
      data = getLocal(`${role[0]}_flag`);
      this.$store.commit('set_userInfo', data);
    }
  },
  mounted () {
  }
};
</script>
<style>
  html{
    font-size: 12px;
  }
</style>
