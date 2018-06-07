
<template>
  <div>
    <my-header :title="'请假审批'"></my-header>
    <div class="nav">
      <div @click="chooseNav(item)" v-for="item in navList" :class="{'active': item.active}" >{{item.name}}</div>
    </div>
    <div class="contain">
      <mt-loadmore :autoFill=false :bottom-all-loaded="allLoaded" :bottom-method="loadTottom" ref="loadmore" >
        <div> 
            <div  class="item" v-for="item in leaveList" @click="toDetail(item)">
              <div class="icon">
                <img src="../../../static/img/avator.png" alt="">
              </div>
              <div class="content">
                <p style="font-size:16px;font-weight:bold;color:#000">{{item.xm}}
                  <span style="font-size:13px;font-weight:normal">{{item.bjmc}}</span></p>
                <p>请假日期: {{item.tbrq}}</p>
                <!-- <p>请假天数: {{item.qqts}}天</p> -->
              </div>
              <div class="status">{{item.zt_text}}</div>
            </div>
        </div>
        <p v-if="showTip" style="color:#ccc;text-align:center;height:35px;line-height:35px">没有更多了</p>
        <p v-if="zanwu" style="color:#ccc;text-align:center;height:35px;line-height:35px">暂无数据</p>
      </mt-loadmore>
    </div>
  </div>
</template>

<script type="text/javascript">
import myHeader from "@/components/header/header.vue";

export default {
  data() {
    return {
      allLoaded: false,
      navList: [{name:'病假',active:true},{name:'事假',active:false}],
      leaveList: [
        // { xm: '叶梦溪', qjrq: "2018-04-16", days: "1", zt: 1, result: "待审批" },
        // { xm: '叶梦溪', qjrq: "2018-04-16", days: "2", zt: 2, result: "准假" },
        // { xm: '叶梦溪', qjrq: "2018-04-16", days: "3", zt: 0, result: "驳回" }
      ],
      bjList:[],
      sjList:[],
      xsList:[],
      pagesize: 10,
      pageNumber: 1,
      qqlx:'1',//请假类型 1--病假 2--事假
      zwlb:'',
      showTip:false,
      zanwu:false,
    }
  },
  computed: {},
  watch:{
    leaveList(val){
      if(val.length==0){
        this.zanwu = true
        this.showTip=false
      }
    }
  },
  created() {
    this.$store.commit('setPageTitle','请假审批')
    this.zwlb = this.$store.getters.userInfo.ryxx.zwlb
  },
  mounted() {
    this.loadQjjl()
  },
  methods: {
    loadQjjl() {
      let bjid = this.$store.getters.userInfo.ryxx.bjid
      let xxid = this.$store.getters.userInfo.ryxx.xxid
      let params = {
        rn_s: this.pagesize * (this.pageNumber - 1) + 1 + "",
        rn_e: this.pagesize * this.pageNumber + "",
        jwrybjid:bjid,
        qqlx:this.qqlx||'1',
        xxid:xxid,
        shzt:'0'
      }
      this.api.getQjjlByTeacher(params).then(res => {
        if (res.code == 1) {
          if (res.data&&res.data.length < this.pagesize) {
            this.allLoaded = true
            this.showTip = true 
            this.zanwu = false
          } 
          for(let i=0;i<res.data.length;i++){
            if(res.data[i].zt=='0'){
              this.leaveList.push(res.data[i]) 
            }
          }
          if(res.data.length ==0){
            this.leaveList=[]
          }
          //this.leaveList.push(...res.data) 
        } 
      },
      err => {
        console.log(err);
      }
      ).catch(err => {
        console.log(err);
      });
    },
    toDetail(item) {
      if(this.zwlb=='002'){
        this.$router.push({
          name:'approvalDetail',
          query: {
            cklx:2,
            curData:encodeURI(JSON.stringify(item))
          }
        })
      }else{
        this.$toast('当前只能班主任审批！')
        return 
      }
      
    },
    loadTottom() {
      this.pageNumber++
      this.loadQjjl();
      this.$refs.loadmore.onBottomLoaded();
    },
    unActive() {
      this.navList.map((v,i) => {
          v.active && (v.active=false)
      })
    },
    chooseNav(data) {
      this.unActive();
      data.active = true;
      //需要做重新查询 
      if(data.name=='事假'){
        this.qqlx='2'
        this.pageNumber = 1
        this.leaveList = []
        this.loadQjjl()
      }else{
        this.qqlx='1'
        this.pageNumber = 1
        this.leaveList = []
        this.loadQjjl()
      } 
    },
  },
  components: {
    myHeader
  }
}
</script>

<style  scoped>
.nav{
  height:45px;
  line-height: 45px;
  font-size: 18px;
  display: flex;
}
.nav div {
  position: relative;
  width: 187.5px;
  text-align: center;
}
.nav div.active {
  color:#17c095
}
.nav div.active:after {
  content:'';
  position: absolute;
  height: 0;
  width: 50px;
  bottom: 0;
  left: 70px;
  border-bottom: 2px solid #17c095;
}
.contain{
  height: calc(100% - 85px);
  background: #f0efed;
  overflow: scroll;
}
p {
  margin: 0;
  height: 20px;
  line-height: 20px;
  color: #666;
  padding-left: 10px;
}
.item {
  width: 350px;
  min-height: 75px;
  background: #fff;
  border-radius: 5px;
  display: flex;
  margin: 10px auto;
}
.item .icon {
  width: 50px;
}
.item .icon img {
  width: 40px;
  height: 40px;
  margin: 10px 0 0 10px;
}
.item .content {
  flex: 1;
  padding-top: 10px;
}
.item .status {
  color: red;
  min-width: 60px;
  margin-top: 10px;
  font-size: 12px;
  text-align: right;
  padding-right:10px;
}
</style>
