
<template>
  <div>
    <my-header :leftShow="false" :isTeacher="true"></my-header>
    <my-swipe></my-swipe>
    <div class="contain">
      <div class="contain-item" v-for="item in itemList"  @click="toTarget(item)">
        <span class="badge" v-if="item.baddge && !!count">{{count}}</span>
        <img :src="item.src" alt="">
      </div>
    </div>
    <div class="title">最新知识</div>
    <div class="article_wrap">
      <div>
          <div class="article_item" v-for="item,index in articles" :key="index" @click.stop="toArticle(item)">
            <div class="package"  v-if="item.zst">
              <!-- <img src="../../../static/img/parent_leave.png" alt=""> -->
              <img v-lazy="completeHeadImgSrc(item.zst)"/>
            </div>
            <div class="package" v-if="!item.zst" :style="'background-color:'+color[index%3][0]" style="width:90px;height:65px;border-radius:4px;margin-right:10px;">
              <icon  v-if="!item.zst" name="news_deauflt" :style="'color:'+color[index%3][1]" style="width:30px;height:30px;margin-top:12.5px;margin-left:30px;"></icon>  
            </div>
            <div style="flex:1;padding:10px 0">
              <div class="content twoRow">
                 {{item.wzbt}}
              </div>
              <div class="time">
                {{item.qyrq&&item.qyrq.split(' ')[0]}}
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import mySwipe from "@/components/mySwipe/mySwipe.vue";
import myHeader from "@/components/header/header.vue";

export default {
  data() {
    return {
      count:'',
      color:[['#d1f5de',"#a5ebbc"],["#fdedcb","#f7d7a9"],["#f9dada","#f7bfbf"]],
      itemList: [
        { src: "./static/img/t_leave.png", target: "leaveApproval" ,baddge:true },
        { src: "./static/img/t_approval.png", target: "symptomReport" },
        { src: "./static/img/t_analysis.png", target: "analysis" },
        { src: "./static/img/t_museum.png", target: "newsList" },
      ],
      articles: [
        
      ],
      pagesize:100,
      pageNumber:1,
      zwlb:''
    };
  },
  computed: {},
  components: {mySwipe,myHeader},
  created() {
     this.$store.commit('setPageTitle','校园症状监测系统')
     this.zwlb = this.$store.getters.userInfo.ryxx.zwlb
  },
  mounted() {
    this.loadQjjl()
    this.loadArticleList()
  },
  methods: {
    loadTaskCount() {
      this.api.getTaskCount().then(res => {
      }).catch(err => {
        console.log(err)
      })
    },
    loadArticleList() {
      let param = {
        // czyjgid: this.$store.getters.userInfo.ryxx.xxid,
        // rn_s: this.pagesize * (this.pageNumber - 1) + 1 + "",
        // rn_e: this.pagesize * this.pageNumber + ""
        rn_s: '1',
        rn_e: '3',
        zt:'1',
        qyrq_js:(new Date()).toLocaleDateString()
      }
      this.api.getArticleListByPagination(param).then(res => {
        //console.log(res)
        if (res.code == '1') {
          this.articles = res.data;
        } else {
          this.$toast('获取文章出错')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toTarget(data) {
      if(data.target=="leaveApproval"){
        if(this.zwlb=='002'){
          this.$router.push({
            name: data.target
          });
        }else{
          this.$toast('当前只能班主任审批')
        }
      }else if(data.target=='newsList') {
        this.$router.push({
          name: data.target,
          query:{xxid: this.$store.getters.userInfo.ryxx.xxid}
        });
      }else{
        this.$router.push({
          name: data.target,
        })
      }
    },
    toArticle(item){
      this.$router.push({
        path: "articlePage",
        query: {
          id: item.id
        }
      });
    },
    loadQjjl() {
      let bjid = this.$store.getters.userInfo.ryxx.bjid
      let xxid = this.$store.getters.userInfo.ryxx.xxid
      let params = {
        rn_s: this.pagesize * (this.pageNumber - 1) + 1 + "",
        rn_e: this.pagesize * this.pageNumber + "",
        jwrybjid:bjid,
        xxid:xxid,
        shzt:'0'
      }
      this.api.getQjjlByTeacher(params).then(res => {
        if(res.code==1&&res.data.length>0){
          this.count=res.data.length
        }
      })
    }
  },
  
};
</script>

<style scoped>
.contain {
  height: 115px;
  border-bottom: 10px solid #f0efed;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
}
.contain-item {
  width: 25%;
  height: 80px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;
}
.badge{
  position: absolute;
  top: 0;
  right: 10px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  text-align: center;
  background: #f44f29;
  color: #fff;
}
.contain-item img {
  width: 60px;
  height: 80px;
}
.article_wrap {
  height: calc(100% - 400px);
  overflow: scroll;
  padding: 10px;
  -webkit-overflow-scrolling: touch;
}
 .title {
  position: relative;
  font-size: 16px;
  color: #666;
  font-weight: normal;
  height: 40px;
  padding-left: 25px;
  line-height: 40px;
  /* box-sizing: border-box; */
}
.title:before {
  content: "";
  position: absolute;
  bottom: 10px;
  left: 10px;
  height: 20px;
  width: 0;
  border-left: 5px solid #17c095;
}
 .title:after {
  content: "";
  position: absolute;
  bottom: 0;
  height: 0;
  left: 0;
  width: 100%;
  border-top: 1px solid #dcdcdc;
  transform: scaleY(0.5);
}
.article_item {
  position: relative;
  display: flex;
  box-sizing: border-box;
  height: 100px;
  margin: 0 0 10px 0;
}
.article_item .package {
  width: 100px;
  padding: 10px 0 0 0;
}
.article_item .package img {
  width: 90px;
  height: 65px;
}
.twoRow {
  display: -webkit-box;
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.article_item .content {
  font-size: 16px;
  line-height: 28px;
  height: 56px;
}
.article_item .time {
  height: 34px;
  line-height: 34px;
  font-size: 13px;
  text-align: right;
  color: #999;
}
.article_item:before {
  content: "";
  position: absolute;
  bottom: 0;
  height: 0;
  width: 100%;
  border-top: 1px solid #dcdcdc;
  transform: scaleY(0.5);
}
</style>
