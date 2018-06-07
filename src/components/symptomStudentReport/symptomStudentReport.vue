
<template>
  <div>
    <my-header :title="'症状列表'" :isAdd="true"></my-header>
    <div class="add" @click.stop="add">
        <icon  name="add" style="width:100%;height:100%"></icon>
    </div>  
    <div class="contain">
      <mt-loadmore :autoFill=false :bottom-all-loaded="allLoaded" :bottom-method="loadTottom" ref="loadmore" >
        <div> 
            <div  class="item" v-for="item in leaveList"  @click="toDetail(item)">
              <div class="content">
                <p style="font-size:14px;font-weight:bold;color:#000;margin-top:10px;">{{item.zyzz_text||'无症状'}}   
                </p> 
              </div>
              <div class="status">{{item.zjxgrq||''}}</div>
              <div class="icon" style="width:45px;height:25px;margin-top:20px;">
                <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
              </div>
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
      query:'',
      allLoaded:false,
      classShow: false,
      selectClass: {},
      leaveList: [],
      pagesize:7,
      pageNumber: 1,
      student:'',
      id:'',
      showTip:false,
      zanwu:false,
    }
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
    this.$store.commit('setPageTitle','症状列表')
    this.query=this.$store.getters.userInfo.ryxx
    this.student = this.$route.query
    this.id = this.student.id //学生id
    this.loadZZList()
  },
  mounted() {},
  methods: {
    add(){
      this.judgeTime()
     
    },
    loadTottom() {
        this.pageNumber++
        this.loadZZList()
        this.$refs.loadmore.onBottomLoaded()
    },
    loadZZList(){
        let number=number||7
        let param={
            xm:this.student.xm,
            xsid:this.id,
            ksrq:(new Date()).toLocaleDateString(),
            jsrq:(new Date()).toLocaleDateString(),
            rn_s: number * (this.pageNumber - 1) + 1 + "",
            rn_e: number * this.pageNumber + "",
        }
        this.api.getStudentSymptom(param).then(res=>{
          if(res.code==1){
            if (res.data&&res.data.length < this.pagesize) {
              this.allLoaded = true
              this.showTip = true
            }
            this.leaveList.push(...res.data) 
          }
        })
    },
    toDetail(item) {
        this.$router.push({
            name:'symptomReportDetail',
            query:{
            curdata:encodeURI(JSON.stringify(item)),
            id:item.id
            }
        })
    },
    //判断 填报日期是否满足两小时以内
    judgeTime(){
      if(this.leaveList.length>0){
        var timestamp =parseInt(new Date(this.leaveList[0].zjxgrq).getTime()/1000) 
        var curTimestamp = parseInt(new Date().getTime()/1000) //获取当前时间戳
        var timestampDiff = curTimestamp -timestamp
        if(timestampDiff<7200){ // 2小时前之内不允许添加
          this.$toast('两小时之内不允许再次填写！')
        }else{
          this.$router.push({
            name:'symptomReportDetailAdd',
            query:{
            curdata:encodeURI(JSON.stringify(JSON.parse(decodeURI(this.student.curdata)))),
            }
          })
        } 
      }else{
        this.$router.push({
          name:'symptomReportDetailAdd',
          query:{
            curdata:encodeURI(JSON.stringify(JSON.parse(decodeURI(this.student.curdata)))),
          }
        })
      }
    }
  },
  components: {
    myHeader,
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
.add{
    position:absolute;
    top:11px;
    right:15px;
    width:18px;
    height:18px;
}
.contain {
  height: calc(100% - 40px);
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
  min-width: 100px;
  margin-top: 20px;
  font-size: 14px;
  text-align: right;
  padding-right:10px;
}
</style>
