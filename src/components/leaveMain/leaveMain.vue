
<template>
  <div>
    <mt-header title="请假记录">
      <a @click="toBack" slot="left">
        <mt-button icon="back">返回</mt-button>
      </a>
      <div class="icon-left" slot="right" @click="add" v-if="childs.length>0">
          <icon  name="add" scale="2"></icon>
      </div>
    </mt-header>
    <div style="display:flex;width:100%;height:150px;background:url('./static/img/bj.png');
      background-size:cover;padding-top:25px;box-sizing:border-box;padding-left:25px">
      <div style="width:50px;height:50px" v-if="childs.length>0">
        <img style="width:100%;height:100%" src="../../../static/img/avator.png" alt="">
      </div>
      <div style="flex:1">
        <p style="font-size:17px;color:#333;font-weight:bold">{{curChild.xsxm}}</p>
        <p>{{curChild.xxmc}}</p>
        <p>{{curChild.bjmc}}</p>
      </div>
      <div style="width:100px;color:#17c095;position:relative">
        <span v-if="childs.length > 1" @click="showChild" style="padding:20px">[切换宝宝]</span>
        <div v-if="childShow" class="child-wrap" @click="closeChild">
          <div class="child-list">
            <div  class="child-item" v-for="child in childs" @click.stop="chooseChild(child)">
              <div style="width:40px;height:40px;margin:10px 0 0 10px"><img style="100%;height:100%" src="../../../static/img/avator.png" alt=""></div>
              <div style="margin-top:10px;flex:1">
                <p style="font-size:14px;color:#333;font-weight:bold">{{child.xsxm}}</p>
                <p style="height:16px;line-height:16px">{{child.xxmc}}</p>
                <p style="height:16px;line-height:16px">{{child.bjmc}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="contain">
      <div style="color:#666;height:40px;line-height:40px;text-align:center" v-if="leaveList.length>0">
        ------{{leaveList.length>0?'历史记录':'无历史记录'}}------
      </div>
      <!-- <div style="color:#666;height:40px;line-height:40px;text-align:center" v-if="childs.length<0">
        ------无相关宝宝信息------
      </div> -->
      <mt-loadmore :autoFill=false :bottom-all-loaded="allLoaded" :bottom-method="loadTottom" ref="loadmore" >
        <div> 
            <div  class="item" v-for="item in leaveList" @click="toDetail(item)">
              <div class="icon">
                <img :src="item.qqlx==2?'./static/img/leave.png':'./static/img/approval.png'" alt="">
              </div>
              <div class="content">
                <p style="font-size:16px;font-weight:bold">{{item.qqlx == 1?'病假':"事假"}}</p>
                <p>请假日期: {{item.tbrq}}</p>
                <!-- <p>请假天数: {{item.qqts?item.qqts:''}}</p> -->
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
import mySwipe from "@/components/mySwipe/mySwipe.vue";
import myHeader from "@/components/header/header.vue";
import { getLocal } from '@/util/util.js'

export default {
  data() {
    return {
      title: "请假系统",
      childShow: false,
      allLoaded: false,
      pagesize: 5,
      pageNumber: 1,
      curChild: {},
      childs: [],
      leaveList: [],
      showTip:false,
      zanwu:false,
    };
  },
  watch:{
    leaveList(val){
      if(val.length==0){
        this.zanwu = true
        this.showTip=false
      }
    }
  },
  created() {
    this.loadChild();
  },
  mounted() {},
  methods: {
    toBack() {
      this.$router.back();
    },
    add() {
      this.$router.push({
        name: "leaveDetail",
        query: {
          cklx: 0,
          curdata: encodeURI(JSON.stringify(this.curChild)),
        }
      });
    },
    loadTottom() {
      this.pageNumber++;
      this.loadQjjl();
      this.$refs.loadmore.onBottomLoaded();
    },
    getDays(date1, date2) {
      let minx = new Date(date1) - new Date(date2)
      return minx / (3600*1000*24);
    },
    addTemporary() {
      let data = getLocal(`temporary_${this.curChild.xsid}`); 
      if (data) {
        let zt_text = ''
        if(data.qjyy=='事假'){
          zt_text = '未提交'
        }else{
          zt_text = '未提交'
        }
        this.leaveList.unshift({
          qqlx: data.qjyy=='事假'?'2':'1',
          tbrq: data.ksrq,
          zt:'-1',
          zt_text: zt_text,
          qqts:data.qjts
        })
      }
    },
    loadChild() {
      let param = {
        sjhm: this.$store.getters.userInfo.ryxx.lxdh
      }
      this.api.getChildByParent(param).then(res => {
        if(res.data.length) {
          this.childs = res.data;
          this.curChild = res.data[0];
          this.loadQjjl();
          this.addTemporary();
        } else {
          this.$toast('没有相关学生信息!')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    loadQjjl() {
      let number=number||5
      let params = {
        xsid: this.curChild.xsid,
        rn_s: number * (this.pageNumber - 1) + 1 + "",
        rn_e: number* this.pageNumber + "",
        xxid: this.curChild.xxid,
        //xm:this.curChild.xsxm
      }
      this.api.getQjjlByParent(params).then(res => {
        if (res.code == 1) {
          if (res.data&&res.data.length < this.pagesize) {
            this.allLoaded = true
            this.showTip = true
            this.zanwu = false
          }
          this.leaveList.push(...res.data) 
        }
      },
      err => {
        console.log(err);
      }).catch(err => {
        console.log(err);
      });
    },
    toDetail(item) {
      //待审核不允许修改
      if (item.zt == '0') {
        return false
      }
      let data = {
        qjyy: item.qjlx_text,
        ksrq: item.qjrq_ks,
        jsrq: item.qjrq_js,
        qjyynr: item.qjsy
      }
      item=Object.assign(item,data,this.curChild)
      this.$router.push({
        name: "leaveDetail",
        query: {
          cklx: item.zt == '-1'||item.zt == '2'/* ||item.zt == '0' */? 3 : 1,//待审核也允许修改
          curdata: encodeURI(JSON.stringify(item)),
        }
      });
    },
    showChild() {
      this.childShow = true;
    },
    chooseChild(data) {
      if (this.curChild.xsid != data.xsid) {
        this.pageNumber = 1;
        this.leaveList = [];
        this.curChild = data;
        this.allLoaded = false
        this.loadQjjl();
      } 
      this.closeChild();
    },
    closeChild() {
      this.childShow = false;
    },
    //判断时间为刚刚 或者多久之前
    zeroize(data){
      return (String(data).length==1?'0':'')+data
    },
    timestampFormat(timestamp){
      this.zeroize(data)
      var curTimestamp = parseInt(new Date().getTime()/1000) //获取当前时间戳
      var timestampDiff = curTimestamp -timestamp //参数时间戳与当前时间戳相差秒数
      var curDate = new Date(curTimestamp * 1000) //得到当前时间日期对象
      var tmDate = new Date(timestamp * 1000) //参数时间戳转换成的日期对象
      var Y =tmDate.getFullYear(), m=tmDate.getMonth()+1, d =tmDate.getDate();
      var H =tmDate.getHours(),i=tmDate.getMinutes(),s=tmDate.getSeconds();
      if(timestampDiff<60){ // 一分钟之内
        return "刚刚"
      }else if(timestampDiff<3600){ // 一小时前之内
        return Math.floor(timestampDiff/3600)+'分钟前'
      }else if(curDate.getFullYear()==Y&&curDate.getMonth()+1 == m && curDate.getDate() == d){
        return "今天"+this.zeroize(H)+":"+this.zeroize(i)
      }else{
        var newDate = new Date((curTimestamp - 86400 )*1000) // 参数中的时间戳加一天转换成的日期对象
        if(newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
          return '昨天'+this.zeroize(H)+':'+this.zeroize(i);
        }else if(curDate.getFullYear()==Y){
          return this.zeroize(m)+'月'+this.zeroize(d)+'日'+this.zeroize(H)+':'+this.zeroize(i);
        }else{
          return Y+'年'+this.zeroize(m)+'月'+this.zeroize(d)+'日'+this.zeroize(H)+':'+this.zeroize(i);
        }
      }
    },
    
  },
  components: {
    mySwipe,
    myHeader
  }
};
</script>

<style  scoped>
.contain {
  background: #f0efed;
  height: calc(100% - 190px);
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
  margin: auto;
  min-height: 75px;
  background: #fff;
  border-radius: 5px;
  display: flex;
  margin-bottom: 10px;
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
  min-width: 80px;
  margin-top: 10px;
  font-size: 14px;
  text-align: right;
  padding-right: 10px;
}
.child-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}
.child-list {
  position: absolute;
  right: 25px;
  border-radius: 5px;
  top: 100px;
  width: 210px;
  min-height: 140px;
  background: #fff;
}
.child-list:after {
  content: "";
  position: absolute;
  right: 20px;
  top: -19px;
  height: 0;
  width: 0;
  border: 10px solid transparent;
  border-bottom-color: #fff;
}
.child-list .child-item {
  position: relative;
  display: flex;
  width: 200px;
  height: 70px;
  margin: auto;
}
.child-item:after {
  position: absolute;
  content: "";
  height: 0;
  left: 0;
  right: 0;
  width: 200px;
  border-bottom: 1px solid #dcdcdc;
  transform: scaleY(0.5);
}
</style>
