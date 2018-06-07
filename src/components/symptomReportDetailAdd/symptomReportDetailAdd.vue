
<template>
  <div style="background:#f0efed">
    <div class="look-wrap" v-if="look"></div>
    <my-header :title="title"></my-header>
    <div  style="display:flex;width:100%;height:90px;padding-top:10px;background:#fff;box-sizing:border-box;padding-left:25px">
      <div style="width:50px;height:50px">
        <img style="width:100%;height:100%" src="../../../static/img/avator.png" alt="">
      </div>
      <div class="mes" style="flex:1">
        <p style="font-size:17px;color:#333;font-weight:bold">{{saveData.xm}}</p>
        <p>{{saveData.bjmc}}</p>
        <p>{{saveData.xxmc}}</p>
      </div>
    </div>
    <div ref="contain" class="contain">
      <div class="wrap leave-info">
        <div class="form-itme"  @click="showSheet('sfqq')">
          <div class="desc">是否缺勤</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.sfqq||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div>
        <div class="form-itme" @click="showSheet('qqyy')" v-if="saveData.sfqq=='是'">
          <div class="desc">缺勤类型</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.qqyy||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div>
       <!--  <div class="form-itme"  @click="choosePicker('ksrq')">
          <div class="desc">请假日期</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.ksrq||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div> -->
        <!-- <div class="form-itme">
          <div class="desc">请假天数</div>
          <input @focus="setPos" v-model="saveData.qjts"  type="number" placeholder="请输入天数">
        </div> -->
        <div class="form-itme"  @click="choosePicker('ksrq')">
          <div class="desc">填报日期</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.ksrq||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div>
        <div class="form-itme" v-if="saveData.sfqq=='是'">
          <div class="desc">缺勤原因</div>
          <input v-model="saveData.qtyy"  @focus="setPos"  type="text" placeholder="请输入其他缺勤原因">
        </div>
      </div>
      <div class="wrap symptom" v-if="(saveData.sfqq=='是'&&saveData.qqyy!='事假')||saveData.sfqq=='否'">
        <div class="form-itme"  @click="choosePicker('fbrq')" >
          <div class="desc">发病日期</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.fbrq||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div>
        <div class="form-itme" @click="showSheet('sfjz')" >
          <div class="desc">是否就诊</div>
          <div class="content" style="flex:1;text-align:right">{{saveData.sfjz||'请选择'}}</div>
          <div class="icon" style="width:45px;height:25px">
            <icon  name="Arrow-right" style="width:100%;height:100%"></icon>
          </div>
        </div>
        <div class="form-itme" v-if="saveData.sfjz=='是'">
          <div class="desc">医生诊断</div>
          <input v-model="saveData.yszd"  @focus="setPos"  type="text" placeholder="请输入请假事由">
        </div>
        <div>
          <p style="color:#666;text-align:left;padding-left:15px;margin-bottom:10px">主要症状</p>
          <div>
            <span :class="{choose:zzCheckd[index]}" class="box" v-for="item,index in zz" @click="chooseZz(item, index)">{{item}}</span>
          </div>
        </div>
        <!-- <div> -->
        <div v-if="zzCheckd[7]" class="form-itme">
          <div class="desc">其他症状</div>
          <input v-model="saveData.qtzz"  @focus="setPos"  type="text" placeholder="请输入其他症状">
        </div>
        <!-- </div> -->
      </div>
    </div>
    <div ref='footer' class="footer">
      <!-- <div style="background:#f8c88c" class="button">暂存</div> -->
      <div style="background:#5dd3a2" class="button" @click="confirm">保存</div>
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

export default {
  data() {
    return {
      title: "症状填报",
      curChild:{},
      sheetVisible: false,
      look: false,
      actions: [],
      qqyy: [
        { name: "病假", method: this.chooseQqyy },
        { name: "事假", method: this.chooseQqyy }
      ],
      sfqq: [
        { name: "是", method: this.chooseSfqq },
        { name: "否", method: this.chooseSfqq }
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
        xm:"",
        bjmc:"",
        xxmc:"",
        sfqq: "否",
        qqyy: "",
        qtyy: "",
        ksrq: new Date().toLocaleDateString(),
        fbrq: /* new Date().toLocaleDateString() */'',
        sfjz: false,
        yszd: "",
        zyzz: "",
        qtzz: ""
      },
      zzCheckd: [],
      query:''
    };
  },
  created() {
    this.$store.commit('setPageTitle','症状填报')
    this.query = this.$route.query
    if(this.query.xs_arr){
      if(this.query.xs_arr.length==1){
        this.initStudent()
      }
    }else{
      this.init()
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
    //只选中一个学生的时候
    initStudent(){
      this.api.getStudentInfo({xsid:this.query.xs_arr[0]}).then(res=>{
        if(res.code==1&&res.data.length){
          let data = res.data[0]
          this.saveData.id=data.id
          this.saveData.xm = data.xm
          this.saveData.bjmc = data.bjmc
          this.saveData.xxmc = data.xxmc
        }
      })
    },
    init(){
      let query = this.$route.query;
      let data = JSON.parse(decodeURI(query.curdata))
      this.curChild = JSON.parse(decodeURI(query.curdata))
      this.saveData.id=data.id
      this.saveData.xm = data.xm
      this.saveData.bjmc = data.bjmc
      this.saveData.xxmc = data.xxmc
    },
    chooseQqyy(data) {
      this.saveData.qqyy = data.name;
    },
    chooseSfqq(data) {
      this.saveData.sfqq = data.name;
    },
    chooseSfjz(data) {
      this.saveData.sfjz = data.name;
    },
    showSheet(lx) {
      this.sheetVisible = true;
      if (lx === "sfqq") {
        this.actions = this.sfqq;
      } else if (lx === 'sfjz') {
        this.actions = this.sfjz;
      } else if (lx === "qqyy") {
        this.actions = this.qqyy;
      }
    },
    handleConfirm(data) {
      this.saveData[this.current] = data.toLocaleDateString();
    },
    choosePicker(lx) {
      this.current = lx;
      this.pickerValue = new Date(this.saveData[lx])
      if(lx=='fbrq'){
        this.pickerValue = new Date().toLocaleDateString()
      }
      this.$refs.picker.open();
    },
    chooseZz(data, index) {
      this.$set(this.zzCheckd, index, !this.zzCheckd[index]);
    },
    showQtzz(bz) {
      if(bz) {

      } else {

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
    confirm() {
      let ryxx = this.$store.getters.userInfo.ryxx
      let param = {
        sjly: '2',
        czyyhxm: ryxx.yhm,
        czyyhid: ryxx.ryid,
        czyyhlx:this.$store.getters.roles[0] == 'parent'?'2':"1",
        czyjwryzwlb:ryxx.zwlb,
        czyjgid:ryxx.xxid,
        czyjglx:"",
        czyjgjb:'',
        xs_arr: this.query.xs_arr||[this.curChild.id]
      }
      if (this.saveData.qqyy == '病假') {
        this.submitBj(param);
      } else if(this.saveData.qqyy == '事假'){
        this.submitSj(param);
      }else {
        this.submitTb(param)
      }
    },
    submitBj(data) {
      this.getZz()
      let param  = {
        qjlx:'2',
        //qqksrq: this.saveData.ksrq,
        sfjhrsq:'0',
        qqlx:'1',
        //qqksrq:this.saveData.ksrq,
        //qqts: this.saveData.qjts||'1',
        qqyy:this.saveData.qtyy,
        sfqq:this.saveData.sfqq=='是'?"1":"0",
        fbrq:this.saveData.fbrq,
        sfjz:this.saveData.sfjz=='是'?'1':'0',
        zyzz:this.zzbh,
        qtzz:this.saveData.qtzz,
        tbrq:this.saveData.ksrq||(new Date()).toLocaleDateString(),
        //shms:'同意'
      }
      param = Object.assign(param, data)
      //console.log(JSON.stringify(param))
      this.api.saveZZByTeacher(param).then(res => {
        if(res.code==1){
          this.$toast('保存成功!')
          this.$router.go(-1)
        }else{
          this.$toast(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submitSj(data) {
      this.getZz()
      let param  = {
        qjlx:'1',
        qjsy: this.saveData.qjyynr,
        sfjhrsq:'0',
        sfqq:this.saveData.sfqq=='是'?"1":"0",
        qqyy:this.saveData.qtyy,
        qqlx:'2',
        //qqksrq:this.saveData.ksrq,
        //qqts: this.saveData.qjts||'1',
        tbrq:this.saveData.ksrq||(new Date()).toLocaleDateString(),
        zyzz:this.zzbh,
        //shms:'同意'
      }
      param = Object.assign(param, data);
      //console.log(JSON.stringify(param))
      this.api.saveZZByTeacher(param).then(res => {
        if(res.code==1){
          this.$toast('保存成功!')
          this.$router.go(-1)
        }else{
          this.$toast(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    submitTb(data){
      this.getZz()
      let param  = {
        qjlx:'',
        qjsy: this.saveData.qjyynr,
        sfjhrsq:'0',
        sfqq:this.saveData.sfqq=='是'?"1":"0",
        qqyy:this.saveData.qjyy,
        qqlx:'',
        fbrq:this.saveData.fbrq,
        sfjz:this.saveData.sfjz=='是'?'1':(this.saveData.sfjz=='否'?'0':''),
        zyzz:this.zzbh,
        qtzz:this.saveData.qtzz,
        tbrq:this.saveData.ksrq||(new Date()).toLocaleDateString(),
        //qqts: this.saveData.qjts||'1',
      }
      if(this.saveData.sfqq=='否'){
        param.qjlx=''
        param.qqlx=''
      }
      param = Object.assign(param, data)
      //console.log(JSON.stringify(param))
      this.api.saveZZByTeacher(param).then(res => {
        if(res.code==1){
          this.$toast('保存成功!')
          this.$router.go(-1)
        }else{
          this.$toast(res.msg)
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
.contain {
  box-sizing: border-box;
  height: calc(100vh - 130px);
  overflow: scroll;
  width: 100%;
  padding-bottom: 50px;
}
.wrap {
  min-height: 45px;
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
  width: 340px;
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
