
<template>
  <div style="background:#f0efed">
    <div class="look-wrap" v-if="look"></div>
    <my-header :title="title"></my-header>
    <div style="display:flex;width:100%;height:90px;padding-top:10px;background:#fff;box-sizing:border-box;padding-left:25px">
      <div style="width:50px;height:50px">
        <img style="width:100%;height:100%" src="../../../static/img/avator.png" alt="">
      </div>
      <div class="mes" style="flex:1">
        <p style="font-size:17px;color:#333;font-weight:bold">{{curChild.xsxm}}</p>
        <p>{{curChild.xxmc}}</p>
        <p>{{curChild.bjmc}}</p>
      </div>
      <div class="status">
        <p>{{saveData.status}}</p> 
      </div>
    </div>
    <div ref="contain" class="contain">
      <div class="wrap leave-info">
        <div class="form-itme" @click="showSheet('qjlx')">
          <div class="desc">请假类型</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.qjyy||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div>
        <div class="form-itme"  @click="choosePicker('ksrq')">
          <div class="desc">请假开始日期</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.ksrq||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div>
        <!-- <div class="form-itme" v-if="cklx=='0'||cklx=='3'">
          <div class="desc">请假天数</div>
          <input @focus="setPos" v-model="saveData.qjts"  type="number" placeholder="请输入天数">
        </div> -->
        <div class="form-itme">
          <div class="desc">请假天数</div>
          <input @focus="setPos" v-model="saveData.qjts"  type="number" placeholder="请输入天数">
        </div>
        <!-- <div class="form-itme"  @click="choosePicker('jsrq')">
          <div class="desc">请假结束日期</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.jsrq||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div> -->
        <div class="form-itme">
          <div class="desc">请假事由</div>
          <input v-model="saveData.qjyynr"  @focus="setPos"  type="text" placeholder="请输入请假事由">
        </div>
      </div>
      <div class="wrap symptom" v-if="saveData.qjyy == '病假'">
        <div class="form-itme"  @click="choosePicker('fbrq')">
          <div class="desc">发病日期</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.fbrq||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div>
        <div class="form-itme" @click="showSheet('sfjz')">
          <div class="desc">是否就诊</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.sfjz||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div>
        <div class="form-itme" v-if="saveData.sfjz=='是'">
          <div class="desc">医生诊断</div>
          <input v-model="saveData.yszd"  @focus="setPos"  type="text" placeholder="请输入医生诊断">
        </div>
        <div>
          <p style="color:#666;text-align:left;padding-left:15px;margin-bottom:10px">主要症状</p>
          <div>
            <span :class="{choose:zzCheckd[index]}" class="box" v-for="item,index in zz" @click="chooseZz(item, index)">{{item}}</span>
          </div>
        </div>
        <div class="form-itme" v-if="zzCheckd[7]">
          <div class="desc">其他症状</div>
          <input v-model="saveData.qtzz"  @focus="setPos"  type="text" placeholder="请输入其他症状">
        </div>
      </div>
      <div v-if="teacherApproval || look || jzEdit" style="margin:10px 0;height:40px;background:#fff">
        <div class="form-itme">
          <div class="desc">老师反馈</div>
          <input v-model="bz"  @focus="setPos"  type="text" placeholder="" readOnly="true" >
        </div>
      </div>
    </div>
    <div v-if="!look && !teacherApproval" ref='footer' class="footer">
      <div style="background:#f8c88c" class="button" @click="temporarySave">暂存</div>
      <div style="background:#5dd3a2" class="button" @click="confirm">提交</div>
    </div>
    <div v-if="teacherApproval" ref='footer' class="footer">
      <div style="background:#f8c88c" class="button" @click="rejectLeave">驳回</div>
      <div style="background:#5dd3a2" class="button" @click="permitLeave">准假</div>
    </div>
    <mt-datetime-picker
      ref="picker"
      type="date"
      
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
      v-model="pickerValue"
      @confirm="handleConfirm">
    </mt-datetime-picker>
    <mt-actionsheet
      :actions="actions"
      v-model="sheetVisible">
    </mt-actionsheet>
  </div>
</template>

<script type="text/javascript">
import myHeader from "@/components/header/header.vue";
import { getLocal, setLocal,clearLocal } from '@/util/util.js'

export default {
  
  data() {
    return {
      teacherApproval: false,
      title: "请假条",
      sheetVisible: false,
      jzEdit:false,
      look: false,
      curChild: {},
      actions: [],
      // startDate:new Date(),
      qjlx: [
        { name: "病假", method: this.chooseQjlx },
        { name: "事假", method: this.chooseQjlx }
      ],
      sfjz: [
        { name: "是", method: this.chooseSfjz },
        { name: "否", method: this.chooseSfjz }
      ],
      zz: ["发热", "呕吐", "咳嗽", "红眼", "腹泻", "皮疹", "腮腺肿大", "其他"],
      zzbh:'',
      pickerValue: "",
      saveData: {
        id: "",
        qjyy: "事假",
        qjyynr: "",
        ksrq: new Date().toLocaleDateString(),
        jsrq: '',
        qjts: "",
        fbrq: new Date().toLocaleDateString(),
        sfjz: false,
        yszd: "",
        zyzz: "",
        qtzz: "",
        status:""
      },
      bz:'',
      zzCheckd: [],
      cklx:'',
      zt:''
    };
  },
  computed:{
    savedata(){
      return this.saveData
    }
  },
  watch:{
    'saveData.qjyy':function(val){
      if(val == '事假'){
        this.saveData.fbrq=''
        this.saveData.sfjz=false
        this.saveData.yszd=''
        this.saveData.zyzz=''
        this.saveData.qtzz=''
        this.zzCheckd=[]
      }else if (val=='病假'){
        this.saveData.fbrq=this.saveData.ksrq
      }
    },
    'saveData.sfjz':function(val){
      if(val == '否'){
        this.saveData.yszd=''
      }
    },
  },
  created() {
    this.$store.commit('setPageTitle','请假条')
    let query = this.$route.query
    this.zt = JSON.parse(decodeURI(query.curdata)).zt
    this.cklx = query.cklx
    if(this.zt==2){
      this.jzEdit = true
    }
    if (query.cklx == 1) { // 查看
      this.look = true;
      this.curChild = JSON.parse(decodeURI(query.curdata))
      //this.saveData = this.curChild;
      this.init(this.curChild)
    } else if (query.cklx == 2) { // 教务人员编辑 
      this.teacherApproval = true
    } else if (query.cklx == 3) { // 家长编辑
      this.curChild=JSON.parse(decodeURI(query.curdata))
      this.init(this.curChild)
      this.getLocalTemporary(); 
      //this.init(this.curChild)
      //this.jzEdit = true
    } else {
      this.curChild=JSON.parse(decodeURI(query.curdata))
    }
  },
  mounted() {
    window.onresize = () => {
      let pos_f = this.$refs.footer.getBoundingClientRect();
      if (!!this.focus_top && this.focus_top > pos_f.top - 45) {
        this.$refs.contain.scrollTop += this.focus_top - pos_f.top + 45;
      }
    };
  },
  methods: {
    init(data){
      if(data){
        this.saveData.qjyy=data.qqlx_text
        this.saveData.qjyynr=data.qqyy
        this.saveData.ksrq=data.tbrq
        this.saveData.fbrq=data.fbrq
        this.saveData.qjts=data.qqts
        this.saveData.sfjz=(data.sfjz=='0'?'否':(data.sfjz=='1'?'是':''))
        this.saveData.zyzz=data.zyzz_text
        this.saveData.qtzz=data.qtzz
        this.saveData.yszd = data.jbzd
        if(data.zt){
          if(data.zt=='0'){
            this.saveData.status ='未审核'
          }else if(data.zt=='1'){
            this.saveData.status = '审核通过'
          }else if(data.zt=='2'){
            this.saveData.status = '审核驳回'
          }
        }
        //data.zyzz_text&&(this.zzCheckd=data.zyzz_text.split(","))
        data.zyzz_text&&(this.setZz(data.zyzz_text.split(",")))
        data.shms&&(this.bz = data.shms)
      }
    },
    getLocalTemporary() {
      let data = getLocal(`temporary_${this.curChild.xsid}`);
      if(data){
        this.saveData.status=data.qjyy+'未提交'
        this.saveData.qjyy=data.qjyy
        this.saveData.qjyynr=data.qjyynr
        this.saveData.qjts=data.qjts
        this.saveData.ksrq=data.ksrq
        this.saveData.fbrq=data.fbrq
        this.saveData.sfjz=data.sfjz
        this.saveData.qtzz=data.qtzz
        this.saveData.yszd = data.yszd
        data.qtzz&&(this.saveData.qtzz= data.qtzz)
        let zyzz=[]; let zyzz_text=[];
        data.zyzz&&(zyzz=data.zyzz.split(","))
        for(let i = 0;i<zyzz.length;i++){
          if(zyzz[i]=="01"){
            zyzz[i]='发热'
          }
          if(zyzz[i]=='02'){
            zyzz[i]='呕吐'
          }
          if(zyzz[i]=='03'){
            zyzz[i]='咳嗽'
          }
          if(zyzz[i]=='04'){
            zyzz[i]='红眼'
          }
          if(zyzz[i]=='05'){
            zyzz[i]='腹泻'
          }
          if(zyzz[i]=='06'){
            zyzz[i]='皮疹'
          }
          if(zyzz[i]=='07'){
            zyzz[i]='腮腺肿大'
          }
          if(zyzz[i]=='99'){
            zyzz[i]='其他'
          }
        } 
        this.setZz(zyzz)
      } 
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
    loadQljlMx() {
      let param = {

      }
      this.api.getQjjlmxByParent(param).then(res => {
        //console.log(res)
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
      // if (this.current == 'ksrq') {
      //   this.startDate = new Date(this.saveData[this.current]);
      //   this.saveData.jsrq = ''
      // }
    },
    choosePicker(lx) {
      this.current = lx;
      this.pickerValue = new Date(this.saveData[lx]);

      // if (lx != 'jsrq') {
      //   let date = new Date();
      //   date.setFullYear(date.getFullYear() - 10);
      //   this.startDate = new Date(date);
      // }
      this.$refs.picker.open();
    },
    chooseQjyy(data) {
      this.saveData.qjyy = data;
    },
    chooseZz(data, index) {
      this.$set(this.zzCheckd, index, !this.zzCheckd[index]);
    },
    showQttzz(bz) {
      if(bz) {

      } else {

      }
    },
    getZz() {
      let arr = [];
      for (let [i, v] of this.zz.entries()) {
        if (this.zzCheckd[i]) {
          arr.push(v);
        }
      }
      this.checkZZ(arr)
    },
    setPos(e) {
      let pos = e.target.getBoundingClientRect();
      this.focus_top = pos.top;
    },
    checkSaveData() {
      if (this.saveData.qjyy === '病假') {

      } else {
        // if (!this.saveData.jsrq) {
        //   this.$messagebox('未选择请假结束日期!');
        //   return false;
        // }
      }
      return true;
    },
    permitLeave() {
      alert("准假")
    },
    rejectLeave() {
      alert('驳回')
    },
    temporarySave() {
      if(this.saveData.qjyy=='病假'){
        this.getZz()
        this.saveData.zyzz=this.zzbh
      }
      let data = this.saveData;
      let temp = getLocal('temporary_'+this.curChild.xsid);
      let obj = temp ? temp : '';
      setLocal(`temporary_${this.curChild.xsid}`, data);
      this.$toast('暂存成功!');
      this.$router.back();
    },
    confirm() {
      if (!this.checkSaveData()) return;
      let ryxx = this.$store.getters.userInfo.ryxx;
      let param = {
        sjly: '2',
        yhlx: this.$store.getters.roles[0] == 'parent'?'2':"1",
        czyyhxm: ryxx.yhm,
        czyyhid: ryxx.ryid,
        czyyhlx:this.$store.getters.roles[0] == 'parent'?'2':"1",
        czyjwryzwlb:ryxx.zwlb,
        czyjgid:ryxx.xxid,
        czyjglx:"",
        czyjgjb:ryxx.bjid,
        xs_arr: [this.curChild.xsid]
      }
      if (this.saveData.qjyy == '病假') {
        this.submitBj(param);
      } else {
        this.submitSj(param);
      }
    },
    //症状初始化
    checkZZ(data){
      for(let i=0;i<data.length;i++){
        if(data[i]=="发热"){
          data[i]='01'
        }
        if(data[i]=='呕吐'){
          data[i]='02'
        }
        if(data[i]=='咳嗽'){
          data[i]='03'
        }
        if(data[i]=='红眼'){
          data[i]='04'
        }
        if(data[i]=='腹泻'){
          data[i]='05'
        }
        if(data[i]=='皮疹'){
          data[i]='06'
        }
        if(data[i]=='腮腺肿大'){
          data[i]='07'
        }
        if(data[i]=='其他'){
          data[i]='99'
        }
      }
      this.zzbh=data.join(",")
    },
    submitBj(data) {
      this.getZz()
      let param  = {
        qjlx:'2',
        sfjhrsq:'1',
        sfqq:'1',
        qqyy:this.saveData.qjyynr,
        qqlx:'1',
        tbrq:this.saveData.ksrq,
        //qqksrq:this.saveData.ksrq,
        qqts: this.saveData.qjts,
        fbrq:this.saveData.fbrq,
        sfjz:this.saveData.sfjz=='是'?'1':'0',
        zyzz:this.zzbh,
        qtzz:this.saveData.qtzz,
        jbzd:this.saveData.yszd
      }
      param = Object.assign(param, data)
      //console.log(JSON.stringify(param))
      this.api.saveBjByParent(param).then(res => {
        if(res.code==1){
          if(this.cklx==3&&getLocal('temporary_'+this.curChild.xsid)){
            clearLocal('temporary_'+this.curChild.xsid)
          }
          this.$toast('保存成功!')
          this.$router.go(-1)  
        }else{
          //处理提示话语
          if(res.msg=='缺勤天数不能为空！'){
            this.$toast('请假天数不能为空！')
          }else if(res.msg.indexOf('id'+this.curChild.xsid)>0){
            res.msg = res.msg.replace('id'+this.curChild.xsid,'')
            this.$toast(res.msg)
          }else{
            this.$toast(res.msg)
          } 
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submitSj(data) {
      let param  = {
        qjlx:'1',
        qjsy: this.saveData.qjyynr,
        tbrq: this.saveData.ksrq,
        sfjhrsq:'1',
        sfqq:'1',
        qqyy:this.saveData.qjyynr,
        qqlx:'2',
        qqksrq:this.saveData.ksrq,
        qqts: this.saveData.qjts,
      }
      param = Object.assign(param, data);
      //console.log(JSON.stringify(param))
      this.api.saveBjByParent(param).then(res => {
        if(res.code==1){
          if(this.cklx==3&&getLocal('temporary_'+this.curChild.xsid)){
            clearLocal('temporary_'+this.curChild.xsid)
          }
          this.$toast('保存成功!')
          this.$router.go(-1)
        }else{
          //处理提示话语
          if(res.msg=='缺勤天数不能为空！'){
            this.$toast('请假天数不能为空！')
          }else if(res.msg.indexOf('id'+this.curChild.xsid)>0){
            res.msg = res.msg.replace('id'+this.curChild.xsid,'')
            this.$toast(res.msg)
          }else{
            this.$toast(res.msg)
          } 
        }
      }).catch(err => {
        console.log(err)
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
.status{
  text-align: left;
  padding-left: 15px;
  position: absolute;
  right:15px;
  color:red;
  font-size: 20px;
}
.contain {
  box-sizing: border-box;
  height: calc(100vh - 130px);
  overflow: scroll;
  width: 100%;
  padding-bottom: 50px;
  -webkit-overflow-scrolling: touch;
}
.wrap {
  min-height: 150px;
  margin-top: 7.5px;
  background: #fff;
}
.symptom {
  min-height: 240px;
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
  height: 45px;
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
</style>
