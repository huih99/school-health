
<template>
  <div>
    <my-header :leftShow="false" @showMore="showMore" :isTeacher="false"></my-header>
    <my-swipe></my-swipe>
    <!-- 显示注销 修改密码 -->
    <div v-if="moreShow" class="child-wrap" @click.stop="closeMore">
      <div class="child-list">
        <div  class="child-item">
          <a @click.stop="Cancellation" >注销</a>
          <a @click.stop="changePassword"  >修改密码</a>
        </div>
      </div>
    </div>
    <div class="contain">
      <div class="contain-item" v-for="item in itemList"  @click.stop="toTarget(item)">
        <span class="badge" v-if="item.baddge && !!count">{{count}}</span>
        <img :src="item.src" alt="">
      </div>
    </div>
    <div class="title">最新知识</div>
    <div class="article_wrap">
      <div>
          <div class="article_item" v-for="item,index in articles" :key="index" @click.stop="toArticle(item)">
            <div class="package" v-if="item.zst">
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
import { setLocal } from "../../util/util";
export default {
  data() {
    return {
      color:[['#d1f5de',"#a5ebbc"],["#fdedcb","#f7d7a9"],["#f9dada","#f7bfbf"]],
      itemList: [
        { src: "./static/img/parent_leave.png", target: "leaveMain" },
        { src: "./static/img/parent_museum.png", target: "newsList" }
      ],
      articles: [
        
      ],
      
      xxid:'',
      moreShow:false,
    };
  },
  computed: {},
  created() {
    this.$store.commit('setPageTitle','校园症状监测系统');
  },
  mounted() {
    this.loadChild() 
    this.loadArticleList()
  },
  methods: {
    //显示下拉选择 --注销 修改密码
    showMore(){
      this.moreShow = true
    },
    closeMore(){
      this.moreShow=false
    },
    clearLocal() {
      setLocal('parent_flag', null);
      setLocal('teacher_flag', null);
    },
    Cancellation() {
      this.clearLocal();
      console.log(location)
      location.href=location.origin + location.pathname
      // this.$router.push({
      //   name: "login"
      // });
    },
    //修改密码
    changePassword(){
      this.$router.push({
        name:"changePassword",
        query:{

        }
      })
    },
    toTarget(data) {
      if (data.target) {
        this.$router.push({
          name: data.target,
          query:{xxid:this.xxid}
        });
      }
    },
    loadChild() {
      let param = {
        sjhm: this.$store.getters.userInfo.ryxx.lxdh
      }
      this.api.getChildByParent(param).then(res => {
        if(res.data.length) {
          this.xxid = res.data[0].xxid; 
          
        } else {
          this.$toast('没有相关孩子信息')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    loadArticleList() {
      let param = {
        rn_s: '1',
        rn_e: '3',
        zt:'1',
        qyrq_js:(new Date()).toLocaleDateString()
      }
      this.api.getArticleListByPagination(param).then(res => {
        if (res.code ==1&&res.data.length){
          this.articles = res.data;
        } else {
          this.$toast('获取文章出错')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toArticle(item){
      if(this.moreShow==true){
        this.moreShow=false
      }else{
        this.$router.push({
          path: "articlePage",
          query: {
            id: item.id
          }
        });
      }
    },
  },
  components: {
    mySwipe,
    myHeader
  }
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
  width: 150px;
  height: 80px;
  background: #edecea;
  border-radius: 10px;
  /* margin-bottom: 15px; */
}
.contain-item img {
  width: 100%;
  height: 100%;
}
.article_wrap {
  height: calc(100% - 400px);
  overflow: scroll;
  padding: 10px;
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
.child-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
}
.child-list {
  position: absolute;
  right: 0px;
  border-radius: 5px;
  top: 40px;
  width: 60px;
  min-height: 50px;
  background: #fff;
}
.child-list:after {
  content: "";
  position: absolute;
  right: 10px;
  top: -9px;
  height: 0;
  width: 0;
  border: 5px solid transparent;
  border-bottom-color: #fff;
}
.child-list .child-item {
  position: relative;
  /* display: flex; */
  width: 100%;
  height: 40px;
  margin: auto;
}
.child-item:after {
  position: absolute;
  content: "";
  height: 0;
  left: 0;
  right: 0;
  width: 100%;
  /* border-bottom: 1px solid #dcdcdc; */
  transform: scaleY(0.5);
}
.child-item a{
  display:block;
  width:100%;
  height:25px;
  font-size: 12px;
  line-height: 25px;
  text-align: center;
}
.child-item a:first-child{
  border-bottom: 1px solid #dcdcdc;
  position: relative;
  top:-1px;
}
</style>
