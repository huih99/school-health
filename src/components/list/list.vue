
<template>
  <div style="width:100%;height:100%;background:rgba(0,0,0,0.2)" @click.stop="selectItem('cancle')">
    <transition name="fades">
      <div v-if="fadeshow" style="height:300px;overflow:scroll;background:#fff">
        <ul>
          <li @click.stop="selectItem(item)" v-for="item in data">{{item[custom]}}</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script type="text/javascript">
export default {
  props:{
    data: {
      type: Array,
      default: []
    },
    custom: {
      type: String,
      default:'name'
    }
  },
  data() {
    return {
      fadeshow:false
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.fadeshow = true;
    })
  },  
  methods: {
    selectItem(data) {
/*       if(data.bjmc){
        this.custom='bjmc'
      }else{
        this.custom='name'
      } */
      this.$emit('selectItem', data)
    }
  },
  components: {}
}
</script>

<style  scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
li{
  width: 355px;
  height: 50px;
  line-height: 50px;
  padding: 5px 0 5px 15px;
  margin: 0 10px;
  box-sizing: border-box;
  position: relative;
}
li:after {
  position: absolute;
  content: '';
  height: 0;
  width: 100%;
  border-bottom: 1px solid #dcdcdc;
  bottom: 0;
  left: 0;
  transform: scaleY(0.5)
}
.fades-enter-active {
  transition: all 0.3s ;
}
.fades-enter, .fades-leave-to{
  transform: translateX(300px);
}
</style>
