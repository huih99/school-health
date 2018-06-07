
<template>
  <div>
    <my-header :title="'统计分析'"></my-header>
    <!-- <p  style="color:#ccc;text-align:center;height:35px;line-height:35px">暂未开发</p> -->
    <div class="container">
      <div class="pie">
        <div id="echartContainer"></div>
      </div>
      <div class="pie">
        <div id="echartContainer1"></div>
      </div> 
      <div class="pie">
        <div id="echartContainer2"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import myHeader from "@/components/header/header.vue"
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
//引入圆形图
require('echarts/lib/chart/pie');
//引入折线
require('echarts/lib/chart/line');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend')
export default {
  data() {
    return {
      RingdiagramData:[
        {name:'在校',value:0},
        {name:'病假',value:0},
        {name:'事假',value:0}
      ],
      SymptomsToday:[
        {name:'发热',value:0},
        {name:'咳嗽',value:0},
        {name:'呕吐',value:0},
        {name:'红眼',value:0},
        {name:'腹泻',value:0},
        {name:'皮疹',value:0},
        {name:'腮腺肿大',value:0},
        {name:'其他',value:0},
      ],
      SymptomsThreeToday:[
        {name:'发热',value:0},
        {name:'咳嗽',value:0},
        {name:'呕吐',value:0},
        {name:'红眼',value:0},
        {name:'腹泻',value:0},
        {name:'皮疹',value:0},
        {name:'腮腺肿大',value:0},
        {name:'其他',value:0},
      ],
      SymptomsThreeYesterday:[
        {name:'发热',value:0},
        {name:'咳嗽',value:0},
        {name:'呕吐',value:0},
        {name:'红眼',value:0},
        {name:'腹泻',value:0},
        {name:'皮疹',value:0},
        {name:'腮腺肿大',value:0},
        {name:'其他',value:0},
      ],
      SymptomsThreeBeforeYesterday:[
        {name:'发热',value:0},
        {name:'咳嗽',value:0},
        {name:'呕吐',value:0},
        {name:'红眼',value:0},
        {name:'腹泻',value:0},
        {name:'皮疹',value:0},
        {name:'腮腺肿大',value:0},
        {name:'其他',value:0},
      ],
      dateTrend:[],
      userInfo:'',
      date:['','','','','']
    }
  },
  computed: {},
  created() {
    this.userInfo = this.$store.getters.userInfo.ryxx
    //显示 当前统计图表下面的日期
    this.date[1] = this.getDay(-2)
    this.date[2] = this.getDay(-1)
    this.date[3] = this.getDay(0)
  },
  mounted() {
    //环形图
    this.initRingDiagram()
    // 当日症状分布
    this.initSymptomsToday()
    //症状趋势分布
    this.initSymptomsTrend()
  },
  methods: {
    //渲染环形图
    initRingDiagram(){
      let params={}
      if(this.userInfo.zwlb=='002'){
        params.xxid= this.userInfo.xxid
        params.bjid=this.userInfo.bjid
      }else{
        params.xxid= this.userInfo.xxid
        params.bjid=this.userInfo.bjid
      }
      this.api.getAnalysisData(params).then(res=>{
        if(res.code==1){
          let data = res.data[0]
          data.zxrs&&(this.RingdiagramData[0].value=data.zxrs||0)
          data.bjrs&&(this.RingdiagramData[1].value=data.bjrs||0)
          data.sjrs&&(this.RingdiagramData[2].value=data.sjrs||0)
          // 基于准备好的dom，初始化echarts实例 
          var myChart = echarts.init(document.getElementById('echartContainer'))
          // 绘制学生状况分布图表 
          myChart.setOption({
            title: {
              text: '当日学生状况分布图',
              x: 'center',
              y: '-3%',
              textStyle: {
                fontSize: 16,
                fontWeight: 'normal',
                color: '#4b4b4b'
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c}"
            },
            color:['#4E81BD','#C1504C','#9BBB58'],
            legend: {
              orient: 'horizontal',
              x: 'center',
              y: 'bottom',
              bottom:'30%',
              width:'100%',
              itemHeight: 5,
              itemWidth: 5,
              //data:['在校','事假','病假'],
              data:[
                {name: '在校',icon: 'circle',textStyle: {color: '#000'}},
                {name: '事假',icon: 'circle',textStyle: {color: '#000'}},
                {name: '病假',icon: 'circle',textStyle: {color: '#000'}},
              ],
            },
            series: [{
              name:'人数',
              type:'pie',
              radius: ['30%', '60%'],
              avoidLabelOverlap: false,
              stillShowZeroSum:true,
              itemStyle:{ //图形样式。折叠详情
                borderType: 'solid',
                borderColor: "#FFFFFF", 
                borderWidth: 2, 
              },
              data:[
                {value:this.RingdiagramData[0].value, name:'在校',
                  label: {
                    show: true, //显示外围 信息
                    position: 'outside',
                    formatter:'{b}:{c}',
                    color: '#000',
                    fontSize:10,
                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                      }
                    },
                  },
                  labelLine: {
                    show:true,
                    length:10,
                    length2:10,
                    smooth: false,
                  },
                },
                 {value:this.RingdiagramData[2].value, name:'事假',
                  label: {
                    show: true, //显示外围 信息
                    position: 'outside',
                    formatter:'{b}:{c}',
                    color: '#000',
                    //padding: [0, 0, 5, 10],
                    fontSize:10,
                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                      }
                    },
                  },
                  labelLine: {
                    show:true,
                    length:3,
                    length2:10,
                    smooth: false,
                  },
                },
                {value:this.RingdiagramData[1].value, name:'病假',
                  label: {
                    show: true, //显示外围 信息
                    position: 'outside',
                    formatter:'{b}:{c}',
                    color: '#000',
                    fontSize:10,
                    emphasis: {
                      show: true,
                      textStyle: {
                        fontSize: '12',
                        fontWeight: 'bold'
                      }
                    },
                  },
                  labelLine: {
                    show:true,
                    length:15,
                    length2:15,
                    smooth: false,
                  },
                },
               
              ]
            }]
          })
        }
      })   
    },
    //渲染当日症状分布
    initSymptomsToday(){
      let params={}
      if(this.userInfo.zwlb=='002'){
        params.xxid= this.userInfo.xxid
        params.bjid=this.userInfo.bjid
      }else{
        params.xxid= this.userInfo.xxid
        params.bjid=this.userInfo.bjid
      }
      this.api.getAnalysisSymptomsData(params).then(res=>{
        if(res.code==1){
          let data = res.data[0]
          data.frrs&&(this.SymptomsToday[0].value=data.frrs||0)
          data.ksrs&&(this.SymptomsToday[1].value=data.ksrs||0)
          data.otrs&&(this.SymptomsToday[2].value=data.otrs||0)
          data.hyrs&&(this.SymptomsToday[3].value=data.hyrs||0)
          data.fxrs&&(this.SymptomsToday[4].value=data.fxrs||0)
          data.pzrs&&(this.SymptomsToday[5].value=data.pzrs||0)
          data.sxzdrs&&(this.SymptomsToday[6].value=data.sxzdrs||0)
          data.qtrs&&(this.SymptomsToday[7].value=data.qtrs||0)
          // 基于准备好的dom，初始化echarts实例 
          var myChart1 = echarts.init(document.getElementById('echartContainer1')); 
          // 当日症状分布图表 
          myChart1.setOption({
            title: {
              text: '当日症状分布',
              x: 'center',
              y: 0,
              textStyle: {
                fontSize: 15,
                fontWeight: 'normal',
                color: '#4b4b4b'
              }
            }, 
            color: ['#4E81BD'],
            tooltip : {
              trigger: 'axis',
              axisPointer : { // 坐标轴指示器，坐标轴触发有效
                type : 'line' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend:{
              show:true,
              orient: 'horizontal',
              top:0,
              // x: 'center',
              // y: 'bottom',
              //bottom:'30%',
              width:'100%',
              data:[
                {name:'发热',icon:'circle',textStyle: {color:'red'}},
                {name:'咳嗽',icon:'circle',textStyle: {}},
                {name:'呕吐',icon:'circle',textStyle: {}},
                {name:'红眼',icon:'circle',textStyle: {}},
                {name:'腹泻',icon:'circle',textStyle: {}},
                {name:'皮疹',icon:'circle',textStyle: {}},
                {name:'腮腺肿大',icon:'circle',textStyle: {}},
                {name:'其他',icon:'circle',textStyle: {}}
              ],
            },
            grid: {
              left: '0%',
              right: '4%',
              bottom: '10%',
              //height:'80%',
              containLabel: true
            },
            xAxis:[{
              show:true,
              type:'category',
              axisLabel:{
                rotate:0,
                interval:0,
                fontSize:'80%',
                color:"#000",
                nameTextStyle:{
                  show:true,
                  fontSize:100,
                  color:'red'
                }
              },
              axisLine:{ //坐标轴轴线
                show:false,
              },
              data:['发热', '咳嗽', '呕吐', '红眼', '腹泻', '皮疹', '腮腺肿大','其他'],
              axisTick: {
                show: false,
              },
            }],
            yAxis : [{
              type : 'value',
              axisTick: {
                show: false,
              },
              axisLine:{ //坐标轴轴线
                show:false,
              },
              //min:0.5,
              interval: 0.5,
            }],
            series : [{
              name:'症状人数',
              type:'bar',
              barWidth: '30%',
              data:[
                this.SymptomsToday[0].value,
                this.SymptomsToday[1].value,
                this.SymptomsToday[2].value,
                this.SymptomsToday[3].value,
                this.SymptomsToday[4].value,
                this.SymptomsToday[5].value,
                this.SymptomsToday[6].value,
                this.SymptomsToday[7].value,
              ]
            }]
          })
        }
      })
      
    }, 
    //渲染症状趋势
    initSymptomsTrend(){
      let params={}
      if(this.userInfo.zwlb=='002'){
        params.xxid= this.userInfo.xxid
        params.bjid=this.userInfo.bjid
      }else{
        params.xxid= this.userInfo.xxid
        params.bjid=this.userInfo.bjid
      }
      this.api.getSymptomsThreeDays(params).then(res=>{
        if(res.code==1&&res.data.length){
          this.dealThreeSymptomsData(res.data)
        }
      })
      
    },
    //处理三日症状分布图数据
    dealThreeSymptomsData(data){
      if(data){
        for(let i =0;i<this.SymptomsThreeBeforeYesterday.length;i++){
          this.SymptomsThreeBeforeYesterday[i].value = data[i].rs
        }
        for(let l =0,j=8;l<this.SymptomsThreeYesterday.length;l++,j++){
          this.SymptomsThreeYesterday[l].value = data[j].rs
        }
        for(let m =0,j=16;m<this.SymptomsThreeToday.length;m++,j++){
          this.SymptomsThreeToday[m].value = data[j].rs
        }
        // 基于准备好的dom，初始化echarts实例 
        var myChart2 = echarts.init(document.getElementById('echartContainer2')); 
        // 三日症状趋势图 
        myChart2.setOption({
          title: {
            text: '三日症状趋势图',
            x: 'center',
            y: 0,
            textStyle: {
              fontSize: 15,
              fontWeight: 'normal',
              color: '#4b4b4b'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          color:['#4E81BD','#C1504C','#9BBB58','#8165A3','#4FADC4','#F79747','#325279','#793432'],
          legend: {
            y:'bottom',
            bottom:'10%',
            width:'80%',
            itemHeight: 5,
            itemWidth: 20,
            data:['发热', '咳嗽', '呕吐', '红眼', '腹泻', '皮疹', '腮腺肿大','其他']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.date //显示日期的地方
          },
          yAxis: {
            type: 'value',
            interval: 0.5,
            axisTick: {
              show: false,
            },
            axisLine:{ //坐标轴轴线
              show:false,
            },
          },
          series: [
            {
              name:'发热',
              type:'line',
              data:[,
                this.SymptomsThreeBeforeYesterday[0].value,
                this.SymptomsThreeYesterday[0].value,
                this.SymptomsThreeToday[0].value,
              ]
              },
            {
              name:'咳嗽',
              type:'line',
              data:[,
                this.SymptomsThreeBeforeYesterday[1].value,
                this.SymptomsThreeYesterday[1].value,
                this.SymptomsThreeToday[1].value,
              ]
            },
            {
              name:'呕吐',
              type:'line',
              data:[,
                this.SymptomsThreeBeforeYesterday[2].value,
                this.SymptomsThreeYesterday[2].value,
                this.SymptomsThreeToday[2].value,
              ]
            },
            {
              name:'红眼',
              type:'line',
              data:[  ,
                this.SymptomsThreeBeforeYesterday[3].value,
                this.SymptomsThreeYesterday[3].value, 
                this.SymptomsThreeToday[3].value,
              ]
            },
            {
              name:'腹泻',
              type:'line',
              data:[ ,
                this.SymptomsThreeBeforeYesterday[4].value, 
                this.SymptomsThreeYesterday[4].value, 
                this.SymptomsThreeToday[4].value,
              ]
            },
            {
              name:'皮疹',
              type:'line',
              data:[,
                this.SymptomsThreeBeforeYesterday[5].value, 
                this.SymptomsThreeYesterday[5].value, 
                this.SymptomsThreeToday[5].value,
              ]
            },
            {
              name:'腮腺肿大',
              type:'line',
              data:[,
                this.SymptomsThreeBeforeYesterday[6].value,
                this.SymptomsThreeYesterday[6].value, 
                this.SymptomsThreeToday[6].value,
              ]
            },
            {
              name:'其他',
              type:'line',
              data:[,
                this.SymptomsThreeBeforeYesterday[7].value, 
                this.SymptomsThreeYesterday[7].value, 
                this.SymptomsThreeToday[7].value,
              ]
            }
          ]
        })
      }
    },
    //拿到当前日期
    getDay(day){    
      var today = new Date()       
      var targetday_milliseconds=today.getTime() + 1000*60*60*24*day            
      today.setTime(targetday_milliseconds) //注意，这行是关键代码      
      var tYear = today.getFullYear()    
      var tMonth = today.getMonth()    
      var tDate = today.getDate()    
      tMonth = this.doHandleMonth(tMonth + 1)    
      tDate = this.doHandleMonth(tDate)  
      return tMonth+"月"+tDate+"日"   
    },  
    doHandleMonth(month){    
      var m = month    
      if(month.toString().length == 1){    
        m = month    
      }    
      return m    
    }  
  },
  components: {myHeader}
}
</script>

<style  scoped>
  .container{
    width:100%;
    max-height:calc(100% - 40px);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .pie{
    width:90%;
    margin:0 auto;
    margin-top:10px;
    border:1px solid #ddd;
    padding:10px;
  }
  #echartContainer{
    width:100%;
    height:200px;
    margin:0 auto;
  }
  #echartContainer1{
    width:100%;
    height:200px;
  }
  #echartContainer2{
    width:100%;
    height:300px;
  }
  
</style>
