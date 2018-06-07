
<template>
  <div class="wrap">
    <div style="height:75px;width:75px;margin:35px auto">
      <img style="width:100%;height:100%" src="../../../static/img/login.png" alt="">
    </div>
    <div class="form">
      <div class="form-item">
        <icon style="color:#333;height:45px;width:18px;"  name="user"></icon>
        <input v-model="userInfo.username" placeholder="请输入用户名" type="text">
      </div>
      <div class="form-item" style="margin-top:25px">
        <icon style="color:#333;height:45px;width:18px;" name="password"></icon>
        <input v-model="userInfo.password" placeholder="请输入密码" type="password">
      </div>
      <div class="btn-wrap"> 
        <div class="login_btn" @click.stop="submit"> 登录</div>
        <div class="register_btn" @click.stop="register" v-if="!isTeacher">注册</div>
        <div class="register_btn1" @click.stop="forgetPassword" v-if="!isTeacher">忘记密码</div>
      </div>

    </div>
  </div>
</template>

<script type="text/javascript">
import md5 from "js-md5";

export default {
  data() {
    return {
      userInfo: {
        username: "",
        password: "",
        md5Passwrod: ""
      },
      isTeacher:true
    };
  },
  computed: {},
  created() {
    this.$store.commit("setPageTitle", "用户登录");
    this.flag = this.$route.query.flag
    if(this.flag == 'teacher'){
      this.isTeacher=true
    }else if(this.flag == 'parent'){
      this.isTeacher = false
    }
  },
  methods: {
    checkUserInfo() {
      if (!this.userInfo.username || !this.userInfo.password) {
        this.$toast("信息填写不完整");
        return false;
      }
      return true;
    },
    submit() {
      if (!this.checkUserInfo()) return;
      this.userInfo.md5Passwrod = md5(this.userInfo.password);
      this.$store
        .dispatch("LoginByUsername", this.userInfo)
        .then(res => {
          this.$router.push({
            name: this.flag
          });
        })
        .catch(err => {
          this.$toast(err);
        });
    },
    register() {
      this.$router.push({
        name:'register',
      })
    },
    forgetPassword(){
      this.$router.push({
        name:'forgetPassword'
      })
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
  padding-left: 20px;
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
.btn-wrap .login_btn {
  color: #fff;
  background: #17c095;
  box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.2);
}
.btn-wrap .register_btn {
  width:30%;
  display: inline-block;
  margin-top: 15px;
  margin-left:15%;
  margin-right:5%;
  color: #666;
}
.btn-wrap .register_btn1 {
  width:30%;
  display: inline-block;
  margin-top: 15px;
  color: #666;
}
</style>
