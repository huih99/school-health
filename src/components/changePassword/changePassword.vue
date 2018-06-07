
<template>
  <div class="wrap">
    <div style="height:75px;width:75px;margin:35px auto">
      <img style="width:100%;height:100%" src="../../../static/img/login.png" alt="">
    </div>
    <div class="form">
      <div class="form-item" style="margin-top:15px">
        <!-- <icon style="color:#333;height:45px;width:18px;" name="password"></icon> -->
        <input v-model="userInfo.pastPassword" placeholder="请输入旧密码" type="number">
        <icon style="color:#333;height:45px;width:18px;" name="openEyes"></icon>
      </div>
      <div class="form-item" style="margin-top:15px">
        <input v-model="userInfo.password" placeholder="请输入需要修改的密码" type="password">
        <icon style="color:#333;height:45px;width:18px;" name="password"></icon>
      </div>
      <div class="form-item" style="margin-top:15px">
        <input v-model="userInfo.repeatPassword" placeholder="请再次输入密码" type="password">
        <icon style="color:#333;height:45px;width:18px;" name="password"></icon>
      </div>
      <div class="btn-wrap"> 
        <div class="register_btn" @click="submit"> 确认</div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import md5 from 'js-md5'
import axios from 'axios';
let Base64 = require('js-base64').Base64;
import { setLocal } from "../../util/util";
import { getLocal } from "../../util/util"
export default {
  data() {
    return {
      userInfo: {
        pastPassword:"",
        password: "",
        repeatPassword: "",
      },
      sjhm:"",
    };
  },
  created() {
    this.$store.commit("setPageTitle", "修改密码");
    this.sjhm =this.$store.getters.userInfo.ryxx.lxdh
  },
  watch:{
    
  },
  methods: {
    checkUserInfo() {
      if(!this.userInfo.pastPassword||!this.userInfo.password||!this.userInfo.repeatPassword){
        this.$toast("信息填写不完整！");
        return false
      }
      else if (this.userInfo.password  != this.userInfo.repeatPassword) {
        this.$toast("2次密码输入不一致！");
        return false;
      }
      return true;
    },
    clearLocal() {
      setLocal('parent_flag', null);
      setLocal('teacher_flag', null);
    },
    changePassword() {
      let param = {
        jmm: md5(this.userInfo.pastPassword),
        sjhm:this.sjhm,
        mm: md5(this.userInfo.password),
        qrmm:md5(this.userInfo.repeatPassword)
      }
      this.api.changePassword(param).then(res => {
        if (res.code == '1') {
          this.$toast('密码修改成功!');
          this.clearLocal()
          var _this = this //setTimeout 里面的this 为全局
          setTimeout(function(){
						_this.$router.push({
              name: "login",
              query: {
                flag:'parent'
              }
            });
					},2000);
        } else {
          this.$toast(res.msg)
        }
      }).catch(err => {
        this.$toast(err);
      })
    },
    submit() {
        if (!this.checkUserInfo())  return;
        this.changePassword();
    }
  },
  components: {}
};
</script>

<style  scoped>
.wrap {
  width: 100%;
  height: 100%;
  background: url("../../../static/img/login_bj.png");
  background-size: cover;
  overflow: hidden;
}
.form-item {
  position: relative;
  width: 240px;
  margin: auto;
  height: 45px;
  line-height: 45px;
  text-align: center;
  display: flex;
  align-items: center;
  /* padding-left: 20px; */
}
.form-item:after {
  position: absolute;
  content: "";
  bottom: 0;
  border-bottom: 1px solid #dcdcdc;
  height: 0;
  width: 100%;
  left: 0;
  transform: scaleY(0.5);
}
input {
  border: none;
  outline: none;
  height: 28px;
  font-size: 14px;
  flex: 1;
  margin-left: 10px;
}
.btn-wrap {
  margin-top: 40px;
}
.btn-wrap div {
  width: 280px;
  height: 40px;
  border-radius: 20px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  margin: auto;
}
.btn-wrap .register_btn {
  color: #fff;
  background: #17c095;
  box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.2);
}
.span_btn {
  display: inline-block;
  width: 90px;
  height:30px;
  line-height: 30px;
  border-radius: 15px;
  background:#26a2ff;
  color: #fff;
  font-size: 13px;
}
.times_btn {
  background:#dcdcdc;
  color: #26a2ff;
  font-size: 16px;
}
</style>
