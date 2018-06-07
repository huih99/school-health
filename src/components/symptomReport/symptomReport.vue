
<template>
  <div>
    <my-header :title="'症状填报'"></my-header>
    <div class="add" @click.stop="add">
        <icon  name="add" style="width:100%;height:100%"></icon>
    </div>
    <div class="search" @click="showBj">
      <div style="margin-left:20px;width:80px;font-size:16px;text-align:center">{{selectClass.name?selectClass.name:""}}</div>
      <div style="flex:1"><icon style="color:#666;height:80%;width:20px" name="down"></icon></div>
      <div style="width:25px;height:20px;margin-right:15px"><icon style="color:#666;height:100%;width:100%" name="search"></icon></div>
      <div v-if="classShow" style="height:calc(100vh - 90px);position:absolute;top:49px">
        <list @selectItem="selectBj" :data="bjList"></list>
      </div>
    </div>
    <div class="contain">
      <mt-loadmore :autoFill=false :bottom-all-loaded="allLoaded" :bottom-method="loadTottom" ref="loadmore" >
        <div> 
            <div  class="item" v-for="(item,index) in leaveList" :key="index" @click="toDetail(item)">
              <div class="icon-choose" :class="item.show&&'selected'" @click.stop="chooseStudents(item,index)" >
                <icon name="choose_nocircle"></icon> 
              </div>
              <div class="icon">
                <img src="../../../static/img/avator.png" alt="">
              </div>
              <div class="content">
                <p style="font-size:16px;font-weight:bold;color:#000;margin-top:10px;">{{item.xm}}
                  
                </p> 
                <p style="font-size:13px;font-weight:normal">{{item.bjmc}}</p>
                <!-- <p>是否缺勤: {{item.sfqq=="1"?'是':'否'}}</p>
                <p v-if="item.sfqq=='1'">缺勤原因: {{item.qqlx=='1'?'病假':'事假'}}</p> -->
              </div>
              <div class="status">{{item.zzzt?item.zzzt.split('-')[0]:''}}</div>
            </div>
        </div>
        <p v-if="showTip" style="color:#ccc;text-align:center;height:35px;line-height:35px">没有更多了</p>
        <p v-if="zanwu" style="color:#ccc;text-align:center;height:35px;line-height:35px">暂无学生数据</p>
      </mt-loadmore>
    </div>
  </div>
</template>

<script type="text/javascript">
import myHeader from "@/components/header/header.vue";
import list from '@/components/list/list.vue'
export default {
  data() {
    return {
      query:'',
      allLoaded:false,
      classShow: false,
      selectClass: {},
      leaveList: [
        /* { xm: '叶梦溪', sfqq: "是", qqyy:"病假",  zt: 1, result: "症状已报" },
        { xm: '叶梦溪', sfqq: "否", qqyy:"事假",  zt: 2, result: "事假已报" },
        { xm: '叶梦溪', sfqq: "是", qqyy:"病假", zt: 0, result: "病假已报" } */
      ],
      timerList:[],
      leaveListStatus:[],
      bjList: [
        
      ],
      pagesize:7,
      pageNumber: 1,
      xs_arr:[],
      showTip:false,
      zanwu:false,
    }
  },
  created() {
    this.$store.commit('setPageTitle','症状填报')
    this.query=this.$store.getters.userInfo.ryxx
    this.loadClass()
  },
  mounted() {},
  watch:{
    leaveList(val){
      if(val.length==0){
        this.zanwu = true
        this.showTip=false
      }
    }
  },
  methods: {
    loadClass() {
      if(this.query.zwlb=='004'){
        //this.$toast("这是校医的填报！")
        let param = {
          xxid:this.query.xxid
        }
        this.api.getClassByjwry(param).then(res=>{
          if(res.code==1&&res.data.length>0){
            this.bjList.push(...res.data)
            this.selectClass = this.bjList[0]
            this.loadStudents()
          }
        }).catch(err => {
          console.log(err)
        })
      }else if(this.query.zwlb=='002'){
        this.loadStudents()
      }
    },
    loadStudents() { 
        let jwrybjid =''
        if(this.selectClass.code){
          jwrybjid = this.selectClass.code
          
        }else{
          jwrybjid = this.query.bjid
          //this.leaveList=[]
        }
        let param = {
          jwrybjid: jwrybjid,
          rn_s: this.pagesize * (this.pageNumber - 1) + 1 + "",
          rn_e: this.pagesize * this.pageNumber + "",
          xxid:this.$store.getters.userInfo.ryxx.xxid,
          bjid:jwrybjid,
          tbrq:(new Date()).toLocaleDateString() //现在暂时不需要传 tbrq 参数查询
        }
        this.api.getStudentsByClass(param).then(res => {
          if(res.code==1){
            if (res.data&&res.data.length < this.pagesize) {
              this.allLoaded = true
              this.showTip = true
              this.zanwu = false
            }
            for(let i=0;i<res.data.length;i++){
              res.data[i].show = false
            }
            this.leaveList.push(...res.data)
            if(this.query.zwlb=='002'){
              this.bjList.push(this.leaveList[0])
              this.selectClass.name = this.bjList[0].bjmc
            }
          }
        }).catch(err => {
          console.log(err)
        })
    },
    showBj() {
      if(this.query.zwlb=='002'){
        //this.$toast('当前班级唯一')
        return
      }else{
        this.classShow = !this.classShow
      }
      
    },
    selectBj(data) {
      if (data == 'cancle') {
        this.classShow = false;
      } else {
        this.selectClass = data;
        this.classShow = false;
        this.pageNumber=1
        this.leaveList=[]
        this.loadStudents()
      }
    },
    loadTottom() {
      this.pageNumber++
      this.loadStudents();
      this.$refs.loadmore.onBottomLoaded();
    },
    toDetail(item) {
      if (item.zt == '0') {
        return false;
      } 
      this.$router.push({
        name:'symptomStudentReport',
        query:{
          curdata:encodeURI(JSON.stringify(item)),
          xm:item.xm,
          id:item.id,
        }
      })
    },
    //选择学生多选
    chooseStudents(item,index){
      item.show= !item.show
      if(item.show==true){
        this.xs_arr.push(item.id)
        item.zzzt&&(this.timerList.push(item.zzzt.substr(5,24)))
      }else{
        this.xs_arr.remove(item.id)
        item.zzzt&&(this.timerList.remove(item.zzzt.substr(5,24)))
      }
    },
    //症状填报多选的
    add(){
      if(this.xs_arr.length<=0){
        this.$toast('请选择学生！')
      }else {
        if(this.timerList.length){
          for(let i =0;i<this.timerList.length;i++){
            if(this.judgeTime(parseInt(new Date(this.timerList[i]).getTime()/1000))){
              this.$router.push({
                name:'symptomReportDetailAdd',
                query:{
                  xs_arr:this.xs_arr
                }
              })
            }else{
              return false
            }
          }
        }else{
          this.$router.push({
            name:'symptomReportDetailAdd',
            query:{
              xs_arr:this.xs_arr
            }
          })
        }
      }
    },
    //判断 填报日期是否满足两小时以内
    judgeTime(timestamp){
      var curTimestamp = parseInt(new Date().getTime()/1000) //获取当前时间戳
      var timestampDiff = curTimestamp -timestamp
      if(timestampDiff<7200){ // 2小时前之内不允许添加
        this.$toast('两小时之内不允许再次填写！')
        return false
      }else{
        return true 
      } 
    }
  },
  components: {
    myHeader,
    list
  }
}
</script>

<style  scoped>
.search{
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  position: relative;
}
.contain {
  height: calc(100% - 90px);
  background:#f0efed;
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
  min-width: 100px;
  margin-top: 10px;
  font-size: 16px;
  text-align: right;
  padding-right:10px;
}
.item .icon-choose{
  display: inline-block;
  width:20px;
  height:20px;
  border-radius: 8px;
  margin-top:20px;
  color: transparent;
  display: flex;
  margin-right:10px;
  margin-left:10px;
  align-items: center;
  border:1px solid #ccc;
  box-sizing: border-box;
  
}
.icon-choose svg{
    width:100%;
    height:100%;
    transform: scale(1.3);
  }
.icon-choose.selected{
  color: #fff;
  background: #5A8BFF;
  border: none;
}
.add{
  position:absolute;
  top:11px;
  right:15px;
  width:18px;
  height:18px;
}
</style>
