
<template>
  <div style="background:#f0efed">
    <div class="look-wrap" v-if="look"></div>
    <my-header :title="title"></my-header>
    <div style="display:flex;width:100%;height:90px;padding-top:10px;background:#fff;box-sizing:border-box;padding-left:25px">
      <div style="width:50px;height:50px">
        <img style="width:100%;height:100%" src="../../../static/img/avator.png" alt="">
      </div>
      <div class="mes" style="flex:1">
        <p style="font-size:17px;color:#333;font-weight:bold">{{childData.xm}}</p>
        <p>{{childData.xxmc}}</p>
        <p>{{childData.bjmc}}</p>
      </div>
    </div>
    <div ref="contain" class="contain">
      <div class="wrap leave-info">
        <div class="form-itme" @click="showSheet('qjlx')">
          <div class="desc">请假类型</div>
          <div class="content" style="flex:1;text-align:right">{{qjdata.qjlx}}</div>
        </div>
        <div class="form-itme">
          <div class="desc">请假日期</div>
          <div class="content" style="flex:1;text-align:right">{{qjdata.qjrq}}</div>
        </div>
        <div class="form-itme">
          <div class="desc">请假天数</div>
          <div class="content" style="flex:1;text-align:right">{{qjdata.qjts?qjdata.qjts:''}}</div>
          <!-- <input @focus="setPos" v-model="qjdata.qjts"  type="number" placeholder="请输入天数"> -->
        </div>
        <div class="form-itme">
          <div class="desc">请假事由</div>
          <div class="content" style="flex:1;text-align:right">{{qjdata.qjyy}}</div>
        </div>
      </div>
      <div class="wrap symptom" v-if="qjdata.qjlx == '病假'">
        <div class="form-itme">
          <div class="desc">发病日期</div>
          <div class="content" style="flex:1;text-align:right">{{qjdata.fbrq}}</div>
        </div>
        <div class="form-itme">
          <div class="desc">是否就诊</div>
          <div class="content" style="flex:1;text-align:right">{{qjdata.sfjz}}</div>
        </div>
        <div class="form-itme" v-if="qjdata.sfjz == '是'">
          <div class="desc">医生诊断</div>
          <div class="content" style="flex:1;text-align:right">{{qjdata.yszd}}</div>
        </div>
        <div style="display:flex;align-items:center;padding:10px 0">
          <p style="color:#666;text-align:left;padding-left:15px;margin-bottom:10px">主要症状</p>
          <div style="flex:1">
            <span class="box choose" v-for="item,index in qjdata.zz">{{item}}</span>
          </div>
        </div>
        <div class="form-itme" v-if="qjdata.qtzz">
          <div class="desc">其他症状</div>
          <div class="content" style="flex:1;text-align:right">{{qjdata.qtzz}}</div>
        </div>
      </div>
      <div style="margin:10px 0;height:40px;background:#fff">
        <div class="form-itme">
          <div class="desc">老师反馈</div>
          <input v-model="bz"  @focus="setPos"  type="text" placeholder="请输入反馈信息">
        </div>
      </div>
    </div>
    <div ref='footer' class="footer">
      <div style="background:#f8c88c" class="button" @click.stop="reject">驳回</div>
      <div style="background:#5dd3a2" class="button" @click.stop="confirm">准假</div>
    </div>
  </div>
</template>

<script type="text/javascript">
import myHeader from "@/components/header/header.vue";

export default {
  data() {
    return {
      title: "请假条",
      look: false,
      zz: ["发热", "呕吐", "咳嗽", "红眼", "腹泻", "皮疹", "腮腺肿大", "其他"],
      qjdata: {
        qjlx:'',
        qjrq:'',
        qjts:'',
        qjyy: '',
        fbrq: '',
        sfjz: '',
        yszd: '',
        zz:["发热", "呕吐", "咳嗽"],
        qtzz: ''
      },
      bz:'',
      childData:'',
      id:''
    };
  },
  created() {
    this.$store.commit('setPageTitle','请假条')
    let query = this.$route.query;
    this.childData = JSON.parse(decodeURI(query.curData))
    this.id=this.childData.id
    if (query.look) {
      this.look = true;
    }
    this.init(this.childData)
  },
  mounted() {
    window.onresize = () => {
      let pos_f = this.$refs.footer.getBoundingClientRect();
      if (!!this.focus_top && this.focus_top > pos_f.top - 45) {
        this.$refs.contain.scrollTop += this.focus_top - pos_f.top + 45;
      }
    };
    setTimeout(() => {
      this.$refs.contain.scrollTop = this.$refs.contain.scrollHeight
    },100)
  },
  methods: {
    init(data){
      if(data){
        this.qjdata.qjlx=data.qqlx_text
        this.qjdata.qjrq=data.tbrq   
        this.qjdata.qjts=data.qqts
        this.qjdata.qjyy=data.qqyy
        this.qjdata.fbrq=data.fbrq
        this.qjdata.sfjz=(data.sfjz=='0'?'否':'是')
        this.qjdata.qtzz=data.qtzz
        this.qjdata.yszd=data.jbzd
        data.zyzz_text&&(this.qjdata.zz=data.zyzz_text.split(","))
      }
      //data.zyzz_text&&(this.setZz(data.zyzz_text.split(",")))
    },
    //从缓存或者数据中拿到症状 赋值上去
    setZz(data){
      for(let i=0;i<data.length;i++){
        if(data[i]=="发热"){
          this.zzCheckd[0]=true
        }
        if(data[i]=='呕吐'){
          this.zzCheckd[1]=true
        }
        if(data[i]=='咳嗽'){
          this.zzCheckd[2]=true
        }
        if(data[i]=='红眼'){
          this.zzCheckd[3]=true
        }
        if(data[i]=='腹泻'){
          this.zzCheckd[4]=true
        }
        if(data[i]=='皮疹'){
         this.zzCheckd[5]=true
        }
        if(data[i]=='腮腺肿大'){
          this.zzCheckd[6]=true
        }
        if(data[i]=='其他'){
          this.zzCheckd[7]=true
        }
      }
    },
    loadQjjlmx() {
      this.api.getQjjlmxByTeacher().then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    chooseQjlx(data) {
      this.saveData.qjyy = data.name;
    },
    chooseSfjz(data) {
      this.saveData.sfjz = data.name;
    },
    showSheet(lx) {
      this.sheetVisible = true;
      if (lx === "qjlx") {
        this.actions = this.qjlx;
      } else if (lx === "sfjz") {
        this.actions = this.sfjz;
      }
    },
    handleConfirm(data) {
      this.saveData[this.current] = data.toLocaleDateString();
    },
    choosePicker(lx) {
      this.current = lx;
      this.pickerValue = this.saveData[lx];
      this.$refs.picker.open();
    },
    chooseQjyy(data) {
      this.saveData.qjyy = data;
    },
    chooseZz(data, index) {
      this.$set(this.zzCheckd, index, !this.zzCheckd[index]);
    },
    getZz() {
      let arr = [];
      for (let [i, v] of this.zz.entries()) {
        if (this.zzCheckd[i]) {
          arr.push(v);
        }
      }
    },
    setPos(e) {
      let pos = e.target.getBoundingClientRect();
      this.focus_top = pos.top;
    },
    //准假
    confirm() {
      let ryxx = this.$store.getters.userInfo.ryxx
      //console.log(ryxx)
      if(this.bz==""){
        this.$toast('请填写反馈信息!') 
      }else{
        //调用接口
        let data = {
          qj_arr:[this.id],
          shzt:'1',
          czyjgjb:'5',
          czyyhid:ryxx.ryid,
          czyyhxm:ryxx.yhm,
          czyjgid:ryxx.xxid,
          czyjwryzwlb:ryxx.zwlb,
          shms:this.bz
        }
        //console.log(JSON.stringify(data))
        this.api.approvalByTeacher(data).then(res=>{
          //console.log(res)
          if(res.code==1){
            this.$toast('保存成功!') 
            this.$router.go(-1)
          }
        })
        
      }
    },
    //驳回
    reject(){
      let ryxx = this.$store.getters.userInfo.ryxx
      let data = {
        qj_arr:[this.id],
        shzt:'2',
        czyjgjb:'5',
        czyyhid:ryxx.ryid,
        czyyhxm:ryxx.yhm,
        czyjgid:ryxx.xxid,
        czyjwryzwlb:ryxx.zwlb,
        shms:this.bz
      }
      this.api.approvalByTeacher(data).then(res=>{
        if(res.code==1){
          this.$toast("该请假信息被驳回！")
          this.$router.go(-1)
        }
      })
      
    }
  },
  components: {
    myHeader
  }
};
</script>

<style  scoped>
.look-wrap {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 40px;
  left: 0;
  z-index: 2;
}
.mes p {
  text-align: left;
  padding-left: 15px;
}
.contain {
  box-sizing: border-box;
  height: calc(100vh - 130px);
  overflow: scroll;
  width: 100%;
  padding-bottom: 50px;
}
.wrap {
  margin-top: 7.5px;
  background: #fff;
}
.symptom {
  min-height: 140px;
}
.footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 56px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
}
.footer .button {
  width: 170px;
  height: 40px;
  line-height: 40px;
  background: #1c8de7;
  color: #fff;
  text-align: center;
  border-radius: 8px;
}
p {
  padding: 0;
  margin: 0;
  height: 24px;
  line-height: 24px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
}
input {
  border: none;
  /* border: 1px solid #ccc; */
  outline: none;
  height: 24px;
  padding: 0 5px;
  text-align: right;
  padding-right: 25px;
  flex: 1;
}
input:focus {
  outline: none;
}
.box {
  display: inline-block;
  min-width: 35px;
  margin: 0 0 10px 10px;
  text-align: center;
  padding: 0 10px;
  color: #666;
  /* border: 1px solid #dcdcdc; */
  /* border: 1px solid #dcdcdc; */
  box-shadow: 0 0 0 0.5px #dcdcdc;
  border-radius: 10px;
  height: 20px;
  line-height: 20px;
}
.box.choose {
  background: #e4f5ea;
  color: #5db1b3;
  box-shadow: 0 0 0 0.5px #5db1b3;
}
.form-itme {
  position: relative;
  min-height: 45px;
  display: flex;
  color: #666;
  flex-wrap: wrap;
  align-items: center;
  margin-left: 15px;
}
.form-itme:after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 100%;
  border-bottom: 1px solid #dcdcdc;
  height: 0;
  transform: scaleY(0.5);
}
.content {
  padding-right: 15px;
  color: #000;
}
</style>
