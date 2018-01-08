<template>
<div class="nav">
  <div class="menu">
      <div @mouseleave='hide1'>
      <div class="all-sort">
        <h2>
            <a onclick="window.location.reload()">全部彩种（14种）</a>
             <i id="more-sort" class="iconfont icon-weiruan" @mouseenter='show1'></i>
        </h2>
      </div>
      <div class="sideNavB hide" id='wrap-sort-all'  :style="{display:this.$route.path=='/index'?'block':''}">
          <div class="hotMain">
            <div class="oneLi" v-for="(item,index) in topList" :key="index">
                <div class="imgL">
                    <img :src='item.logo' />
                </div>
                <div class="title">
                    <a @click="openWin('/buyLottery/bet'+item.lotteryNumber)">{{item.lotteryName}}</a>
                </div>
            </div>
          </div>
          <div class="sortMain" @mouseenter ='enter($event)' @mouseleave='leave($event)'>
              <div class="sortDiv" i='0' id="sortDiv0" style="border-top: 1px dashed rgb(230, 211, 207);" >
                <div class="sLeft">
                    <div class="sTitle red">高频彩</div>
                </div>
                <i class="el-icon-arrow-right" style="position:absolute;right:5px;top:28px;color: #999;"></i>
                <div class="sRight">
                    <ul>
                         <li v-for="(item,index) in highShowList" :key="index">
                            <a @click="openWin('/buyLottery/bet'+item.lotteryNumber)">{{item.lotteryName}}</a>
                        </li>
                    </ul>
                </div>
              </div>
              <div class="secondNav" style="display:none;">
                <div class="title">高频彩</div>
                <div class="ulDiv">
                    <ul>
                        <li v-for="(item,index) in highHideList" :key="index"><a @click="openWin('/buyLottery/bet'+item.lotteryNumber)">{{item.lotteryName}}</a>
                        </li>
                    </ul>
                </div>
              </div>
          </div>
          <div class="sortMain" @mouseenter ='enter($event)' @mouseleave='leave($event)'>
              <div class="sortDiv" i='1' id="sortDiv1" style="border-top: 1px dashed rgb(230, 211, 207);">
                <div class="sLeft">
                    <div class="sTitle blue">低频彩</div>
                </div>
                <div class="sRight">
                    <ul>
                        <li v-for="(item,index) in downShowList" :key="index">
                            <a @click="openWin('/buyLottery/bet'+item.lotteryNumber)">{{item.lotteryName}}</a>
                        </li>
                    </ul>
                </div>
              </div>
          </div>
          <div class="sortMain" @mouseenter ='enter($event)' @mouseleave='leave($event)'>
              <div class="sortDiv" i='2' id="sortDiv2" style="border-top: 1px dashed rgb(230, 211, 207);">
                  <i class="el-icon-arrow-right" style="position:absolute;right:5px;top:28px;color: #999;"></i>
                <div class="sLeft">
                    <div class="sTitle green">全部</div>
                </div>
                <div class="sRight">
                    <ul>
                        <li v-for="(item,index) in AllShowList" :key="index">
                            <a @click="openWin('/buyLottery/bet'+item.lotteryNumber)">{{item.lotteryName}}</a>
                        </li>
                    </ul>
                </div>

              </div>
              <div class="secondNav" style="display:none;top:-138px;">
                <div class="title">全部</div>
                
                <div class="ulDiv">
                    <ul>
                        <li v-for="(item,index) in AllHideList" :key="index"><a @click="openWin('/buyLottery/bet'+item.lotteryNumber)">{{item.lotteryName}}</a></li>
                    </ul>
                </div>
              </div>
          </div>
      </div>
      </div>
      <div class="nav">
        <ul class="clearfix" id="headNav">
            <li>
                <router-link to="/index" :class='{active:this.$route.path=="/index"?true:false}'>首页</router-link>
            </li>
            <li>
                <a @click="openLotteryWin">购彩大厅</a>
            </li>
            <li class="tit">
                <i class="icon_nav_new"></i>
                <router-link to="/mobile" :class='{active:this.$route.path=="/mobile"?true:false}'>
                <i class="icon_nav_mobile"></i>
                手机购彩
                </router-link>
            </li>
            <li>
                <router-link to="/activity" :class='{active:this.$route.path=="/activity"?true:false}'>优惠活动</router-link>
            </li>
            <li>
                <router-link to="/notice" :class='{active:this.$route.path=="/notice"?true:false}'>开奖公告</router-link>
            </li>
            <li>
                <!--<router-link to="/charts" :class='{active:this.$route.path=="/charts"?true:false}'>走势图表</router-link>-->
                <router-link to="" :class='{active:this.$route.path=="/charts"?true:false}'>走势图表</router-link>
            </li>
        </ul>
      </div>
  </div>
</div>  
</template>
<script>
import url from "static/url.js";
export default {
  props: {
    styl: String
  },
  data() {
    return {
      AllHideList: [],
      arr: ["天津时时彩", "山东11选5", "新疆时时彩", "北京PK拾", "广西快三", "香港六合彩", "重庆时时彩"],
      win:null
    };
  } /* slice(start,end) */,
  computed: {
    AllShowList() {
      return this.AllHideList.slice(0, 4);
    },
    downShowList() {
      return this.AllHideList.filter(item => {
        return item.lotteryType == 1;
      });
    },
    highHideList() {
      return this.AllHideList.filter(item => {
        return item.lotteryType == 0;
      });
    },
    highShowList() {
      return this.highHideList.slice(0, 4);
    },
    topList() {
      return this.AllHideList.filter(item => {
        return this.arr.includes(item.lotteryName);
      });
    }
  },
  methods: {
    close(){
      if(this.win){
        this.win.close()
      }
    },
    openWin(a) {
      this.win = window.open(url + a, "lottery", "width=1300, height=950,left=10,top=10,");
    },
    show1() {
      var sort = document.getElementById("wrap-sort-all");
      sort.classList.add("show");
    },
    hide1() {
      var sort = document.getElementById("wrap-sort-all");
      if (sort.classList.contains("show")) {
        sort.classList.remove("show");
      }
    },
    enter(a) {
      var target = a.target;
      if (target.childNodes.length != 1) {
        target.firstChild.classList.add("hover");
        target.lastChild.style.display = "block";
      }
    },
    leave(a) {
      var target = a.target;
      if (target.childNodes.length != 1) {
        target.firstChild.classList.remove("hover");
        target.lastChild.style.display = "none";
      }
    },
    openLotteryWin() {
       let lottery = window.open(
        url + "/buyLottery",
        'lottery',
        "width=1300, height=950,left=10,top=10,attention"
      );
      lottery.focus()
    }
  },
  created() {
    this.$http
      .post("/api/lottery/list")
      .then(res => {
        //console.log(res.data);
        if (res.data.status == 200) {
          this.AllHideList = res.data.lotteryList;
        }
      })
      .catch(res => console.log(res));
  },
};
</script>
<style scoped>
.show {
  display: block !important;
}
.hide {
  display: none;
}
.sideNavB .hover {
  position: absolute;
  left: 0;
  top: 0;
  border-bottom: 2px solid #ffccbf;
  border-top: 2px solid #ffccbf !important;
  padding: 2px 3px 4px 15px !important;
  z-index: 1000;
  width: 225px;
  background-color: #ffffff;
}
.nav {
  background: #e94335;
}
.menu {
  position: relative;
  width: 1000px;
  margin: 0px auto;
  height: 45px;
}
.menu .all-sort {
  left: 0px;
  width: 250px;
  text-align: left;
  font-size: 0.875rem;
  background: #d51910;
  position: relative;
}
.menu .all-sort h2 {
  position: relative;
  display: block;
  width: 250px;
  box-shadow: 2px 0px 9px rgba(90, 90, 90, 0.28);
  opacity: 1;
  height: 45px;
}
.menu .all-sort a {
  color: #fff;
  width: 100%;
  height: 100%;
  line-height: 45px;
  padding-left: 20px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 100;
}
.menu .all-sort h2 i.iconfont {
  font-size: 1.3rem;
  color: #fff;
  position: absolute;
  right: 15px;
  top: 15px;
}
.sideNavB {
  box-sizing: border-box;
  border: 2px solid #d51910;
  border-top: none;
  width: 250px;
  line-height: 55px;
  background-color: #fff;
  z-index: 9999;
  position: absolute;
}
.sideNavB .hotMain {
  height: 342px;
  overflow: hidden;
  padding-top: 7px;
}
.sideNavB .oneLi {
  padding: 4px 0px 4px 15px;
  overflow: hidden;
  height: 40px;
  line-height: 35px;
}
.sideNavB .oneLi .imgL {
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  float: left;
}
.sideNavB .oneLi .imgL img {
  width: 32px;
  height: 32px;
}
.sideNavB .oneLi .title {
  float: left;
  padding: 0 1px;
  margin-left: 12px;
  color: #333;
  font-size: 16px;
  vertical-align: bottom;
}
.sideNavB .oneLi .desc {
  padding-top: 3px;
  font-size: 12px;
  float: left;
  margin-left: 5px;
  font-size: 12px;
  color: #999;
  line-height: 29px;
  height: 29px;
  width: 95px;
  overflow: hidden;
}

.sideNavB .sortMain {
  position: relative;
  height: 70px;
  font-size: 14px;
}
.sideNavB .sortDiv {
  position: absolute;
  left: 0;
  top: 0;
  padding: 3px 3px 3px 15px;
  border-top: 1px dashed #e6d3cf;
  width: 230px;
  color: #333;
}
.sideNavB .secondNav {
  position: absolute;
  z-index: 88;
  left: 246px;
  border: 2px solid #ffccbf;
  width: 742px;
  height: 208px;
  background-color: #ffffff;
  padding-left: 6px;
}
.sideNavB .secondNav .title {
  padding-top: 20px;
  padding-left: 10px;
  width: 100%;
  font-weight: 800;
  font-size: 18px;
  color: #999;
  height: 30px;
  line-height: 30px;
}
.sideNavB .secondNav .ulDiv {
  padding-left: 10px;
  margin-top: 7px;
  color: #333;
}
.sideNavB .secondNav ul {
  overflow: hidden;
}
.sideNavB .secondNav li {
  float: left;
  width: 94px;
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
  margin-right: 10px;
  overflow: hidden;
}
.sideNavB .secondNav li a {
  color: #666;
}
.sideNavB .secondNav li a:hover {
  color: #e94335;
}
.sideNavB .sLeft {
  float: left;
  width: 25px;
}
.sideNavB .sLeft .red {
  color: red;
  background-color: #ffcdcd;
  border: 1px solid #ffffff;
}
.sideNavB .sLeft .blue {
  color: #0040ff;
  background-color: #dce5ff;
  border: 1px solid #b4c7ff;
}
.sideNavB .sLeft .green {
  padding: 15px 5px 14px 5px !important;
  color: #005d19;
  background-color: #d9f9df;
  border: 1px solid #b0e6bb;
}
.sideNavB .sLeft .sTitle {
  width: 14px;
  line-height: 16px;
  font-size: 14px;
  margin-top: 1px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  text-align: center;
  padding: 5px;
}
.sideNavB .sRight {
  float: left;
  width: 180px;
  line-height: 24px;
  padding-left: 17px;
}
.sideNavB .sRight ul {
  overflow: hidden;
  padding-top: 2px;
  line-height: 25px;
  font-size: 14px;
}
.sideNavB .sRight li {
  color: #666;
  float: left;
  width: 90px;
  font-weight: 500;
}

/* 横向导航 */
.menu .nav {
  position: absolute;
  width: 740px;
  left: 260px;
  top: 0;
}
.menu .nav ul li {
  float: left;
  width: 107px;
  line-height: 45px;
  margin-right: 2px;
  margin-left: 2px;
}
/* .menu .nav ul li a.index {
    background: #DA1B25;
    text-decoration: none;
    color: #fff;
    height: 43px;
    margin-top: 2px;
    line-height: 41px;
} */
.menu .nav ul li a {
  display: block;
  width: 100%;
  color: #fff;
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 16px;
}
.menu .nav ul li a:hover,
.menu .nav ul li a.current {
  background: #da1b25;
  text-decoration: none;
  color: #fff;
  height: 43px;
  margin-top: 2px;
  line-height: 41px;
}
.active {
  background: #da1b25;
  color: #fff;
}
.icon_nav_new {
  display: block;
  background: url("https://cpweb.kosunmobile.com/c9/Public/static/images/hot_01.gif");
  height: 16px;
  width: 27px;
  position: absolute;
  bottom: 29px;
  right: 11px;
  z-index: 0;
  background-size: 27px 16px;
}
.icon_nav_mobile {
  display: block;
  background: url(https://cpweb.kosunmobile.com/c9/Public/static/images/icon_nav_mobile.png);
  height: 21px;
  width: 13px;
  position: absolute;
  bottom: 11px;
  left: 4px;
  background-size: 13px 21px;
  z-index: 0;
  background-repeat: no-repeat;
}
.tit {
  position: relative;
}
</style>

