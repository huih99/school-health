
<template>
  <div style="height:100%;padding-top:35px;box-sizing:border-box">
    <h1 style="font-weight:normal;font-size:24px;padding-left:25px;">请问您是?</h1>
    <div class="wrap wrap-parent" @click="checkUserInfo('parent')">
      <img src="../../../static/img/parent.png" alt="">
      <p>家长</p>
    </div>
    <div class="wrap wrap-teacher" @click="checkUserInfo('teacher')">
      <img src="../../../static/img/teacher.png" alt="">
      <p>教务人员</p>
    </div>
  </div>
</template>

<script type="text/javascript">
import { getLocal } from '@/util/util.js'

export default {
  data() {
    return {}
  },
  mounted() {
  },
  created () {
    this.$store.commit('set_roles',[])
  },
  methods: {
    checkUserInfo(lx) {
      this.$store.commit('set_rybz',lx)
      let data = getLocal(`${lx}_flag`);
      if (data) {
        this.$store.commit('set_userInfo', data)
        this.$router.push( {
          name:lx
        })
      } else {
        this.$router.push({
          name:'login',
          query: {
            flag:lx
          }
        })
      }
    },
  },
  components: {
  }
}
</script>

<style  scoped>
.wrap {
  width: 140px;
  height: 140px;
  margin: 25px auto 75px;
}
.wrap img{
  width: 100%;
  height: 100%;
}
p{
  text-align: center;
  font-size: 16px;
  color: #666;
}
</style>
