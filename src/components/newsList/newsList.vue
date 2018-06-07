<template>
    <div>
      <my-header :title="'知识馆'"></my-header>
      <!-- <div class="header" ref='header'>
          <div @click="changeWzfl(item, index)"  class="header-item" :class="{active:headerCkList[index]}" v-for="(item, index) in headerList">
              {{item.mc}}
          </div>
      </div> -->
      <!-- 新闻列表 -->
      <div ref="contain" class="container"> 
          <mt-loadmore :autoFill=false :bottom-all-loaded="allLoaded" :bottom-method="loadTottom" ref="loadmore" >
          <div class="flex Newsletter" v-for="item,index in newsList" @click="goArticle(item)">
              <!-- 判断是否有图片 有则显示 -->
              <div class="package" v-if="item.zst">
                  <!-- <img  :src="completeHeadImgSrc(item.zst)"> -->
                  <img v-lazy="completeHeadImgSrc(item.zst)"/>
              </div>
              <div class="package" v-if="!item.zst" :style="'background-color:'+color[index%3][0]">
                  <icon  v-if="!item.zst" name="news_deauflt" :style="'color:'+color[index%3][1]+';border-radius:5px;'+'width:40px;position:relative;left:0px;'"></icon>  
              </div>
              <div class="Newsdetail">
                  <div class="twoRow">
                      {{item.wzbt}}
                  </div>
                  <div class="newsDate" style="">
                      {{item.qyrq&&item.qyrq.split(' ')[0]}}
                  </div>
              </div>
          </div>
          <p v-if="showTip" style="color:#ccc;text-align:center;height:35px;line-height:35px">{{tips}}</p>
          <p v-if="zanwu" style="color:#ccc;text-align:center;height:35px;line-height:35px">暂无文章数据</p>
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
      headerList: [],
      headerCkList: [1, 0, 0, 0],
      newsList: [],
      pagesize: 10,
      pageNumber: 1,
      tips: "没有更多文章了",
      showTip: false,
      zanwu:false,
      color:[['#d1f5de',"#a5ebbc"],["#fdedcb","#f7d7a9"],["#f9dada","#f7bfbf"]],
      query:'',
      xxid:''
    };
  }, 
  created() {
    this.$store.commit('setPageTitle', '知识馆');
    let query = this.$route.query;
    this.xxid = query.xxid
    this.query=this.$store.getters.userInfo.ryxx
    this.loadNewsList()
  },
  mounted() {
    
  },
  components: {myHeader},
  computed: {},
  watch:{
    newsList(val){
      if(val.length==0){
        this.zanwu = true
        this.showTip=false
      }
    }
  },
  methods: {
    loadTottom() {
      this.pageNumber++;
      this.$refs.loadmore.onBottomLoaded();
      this.loadNewsList();
    },
    goArticle(item) {
      this.$router.push({
        path: "articlePage",
        query: {
          id: item.id
        }
      })
    },
    loadNewsList() {
      let params = {
        zt:'1',
        qyrq_js:(new Date()).toLocaleDateString(),
        rn_s: this.pagesize * (this.pageNumber - 1) + 1 + "",
        rn_e: this.pagesize * this.pageNumber + "",
      }
      this.api.getArticleListByPagination(params).then(
        res => {
          if (res.code == 1) {
            if (res.data&&res.data.length < this.pagesize) {
              this.allLoaded = true
              this.showTip = true
            }
            this.newsList.push(...res.data);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    /* 随机选择颜色 */
    setColor(){
      let color=this.color;
      let iNum=parseInt(Math.random()*(color.length));
      let colorArr=[];
      return colorArr;
    }
  }
};
</script>
<style scoped>
/* body */
*{font-family:'MicrosoftYaHei';}
/* 头部样式 */
.header {overflow-x:auto;overflow-y:hidden;z-index: 2;height: 44px;white-space: nowrap;
              position: relative;color:#666666;}
/* 伪类样式 加下面横线 */
.header:after {height: 1px;content: "";width: 100%;border-top: 1px solid #e6e6e6;position: absolute;bottom: -1px;
                right: 0;transform: scaleY(0.5);-webkit-transform: scaleY(0.5);}
/* 头部选项卡-标题 */
.header-item {display: inline-block;width: 80px;padding: 1%;text-align: center;height: 30px;line-height: 30px;
              margin: 5px 0px;color:#666666;font-size: 15px;}
/* 激活选项卡的样式 */
.active{position: relative;color:#333333;}
/* 保证每个item 下面border长度 */
.active:after{height:2px;content:"";width:40px;border-top:4px solid #00b678;position:absolute;bottom:-4px;left:25%;
              transform:scaleY(0.5);-webkit-transform:scaleY(0.5);}
/* 新闻列表容器 */
.container{height:calc(100% - 44px);overflow-y: scroll;}
/* 包裹每个新闻简讯的样式 */
.Newsletter{width:auto;font-size: 12px;position: relative;margin:15px;} 
.flex{position:relative;height:100px;display:flex}
/* 每个新闻简讯的伪类 */
.flex:after{height:1px;content:"";width:100%;border-top:2px solid #e6e6e6;position:absolute;bottom:-1px;right:0;transform:scaleY(0.5);-webkit-transform:scaleY(0.5);}
/* 包裹 图片/新闻详情 的样式 */
/* 圆角 */
.package{width:90px;height:70px;border:1px solid transparent;border-radius:5px;overflow:hidden;text-align: center}
/* 图片 */
.package>img,svg{width:100%;height:100%}
/* 新闻详情 */
.Newsdetail{flex:1;margin-left: 10px; height:100px;}
.twoRow {
  display: -webkit-box;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.Newsdetail>.twoRow{font-size:16px;line-height: 24px;height:48px;color:#333333;}
/* 字体时间 */
.Newsdetail>.newsDate{color:#999999;font-size: 12px;margin-top:15px;float:right;}
</style>
