<template>
  <div>
    <headlottery style="margin-top:10px;"></headlottery>
    <div class="kaijiang_header">
      <div class="top">
        <h1>{{lotteryName}}开奖公告</h1>
        <span>{{"["+runFrequency+"一期]"}}</span>
        <li class="zs">
          <i class="iconfont icon-zoushi"></i>
          <a>号码走势</a>
        </li>
        <router-link class="gz" tag="li" :to="{path:'/rules',query:{'lotteryNumber':lotteryNumber}}">
          <i class="iconfont icon-xiangqing"></i>
          <a>玩法规则</a>
        </router-link>
      </div>
      <div class="bottom">
        <span>第</span>&nbsp;&nbsp;
        <el-select v-model="selectedValue" :clearable="false" @change="selectChange" size="mini">
          <el-option v-for="(item,index) in resultList" :key="index" :label="item.lotteryIssue" :value="index">
          </el-option>
        </el-select>
        &nbsp;&nbsp;
        <span>期</span>
        <span class="open">
          <em>开奖日期:</em>
          <span class="red">{{resultDate}}</span>
        </span>
        <div class="kjq">
          <div class="ballDiv">
            <div class="number_ball" v-for="item in lotteryResult" :key="item">
              <span>{{item}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 表格部分开始 -->
    <div class="day_list">
      <div class="day_title">
        <div class="title1">
          <span>{{yearMonthDay}}</span>开奖号码
        </div>
        <div class="title2">
        </div>
        <div class="title3">按日期查询
          <el-date-picker v-model="date" align="right" type="date" size="mini" placeholder="选择日期" :picker-options="pickerOptions1" :clearable="false" @change="dateChange" style="width:140px">
          </el-date-picker>
        </div>
      </div>
      <div class="day_con">
        <div class="detail-header">
          <div class="col" key="0">
            <div class="ssc-issue">期号</div>
            <div class="ssc-nums">开奖号码</div>
          </div>
          <div class="col" key="1">
            <div class="ssc-issue">期号</div>
            <div class="ssc-nums">开奖号码</div>
          </div>
          <div class="col" key="2">
            <div class="ssc-issue">期号</div>
            <div class="ssc-nums">开奖号码</div>
          </div>
        </div>
        <div class="day_con_main">
          <div class="colomu" v-for="(item,index) in resultList" :key="index">
            <div class="ssc-issue">{{item.lotteryIssue}}</div>
            <div class="ssc-nums red" v-if="item.lotteryResult">{{item.lotteryResult|filterResult}}</div>
            <div v-else></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 表格部分结束 -->
    <!-- 底部 -->
    <div class="main_foot">
      <div class="footMain">
        <div class="in">
          <i class="iconfont icon-home1 indexIcon"></i>
          <a @click='openWin("/buyLottery")'>购彩大厅</a>
        </div>
        <div class="tz">
          <img :src="lotteryLogo" width="32px" height="32px">
          <a @click='openWin("/buyLottery/bet"+lotteryNumber)'>投注{{lotteryName}}</a>
        </div>
        <div class="sc">
          <a @click="addCollection">收藏此页面，开奖即时查看</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import url from "static/url.js";
import headlottery from "components/common/headlottery";
import tools from "tools/tools.js";
export default {
  data() {
    return {
      lotteryLogo: this.$route.params.lotteryLogo,
      date: Date(),
      yearMonthDay: null,
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      lotteryName: null,
      resultList: [],
      selectedValue: 0, //下拉列表选中的结果的下标
      lotteryResult: null, //标题部分开奖结果
      resultDate: null, //标题部分开奖日期
      runFrequency: null
    };
  },
  created() {
    this.yearMonthDay = this.formatTime(new Date());
    this.getTableData(this.yearMonthDay);
    //console.log(this.bbeforeDay)
  },
  methods: {
    //根据彩种筛选
    selectLottery() {

    },
    //加入收藏功能
    addCollection(){
      alert("加入收藏失败，请使用Ctrl+D进行添加")
    },
    formatTime(t) {
      let d = new Date(t),
        y = d.getFullYear(),
        m = d.getMonth() + 1,
        dd = d.getDate();
      return y + "-" + tools.formatTima(m) + "-" + tools.formatTima(dd);
    },

    getTableData(d) {
      let obj = {
        lotteryNo: this.lotteryNumber + "",
        yearMonthDay: d
      };
      this.$http
        .post("/openLotteryHall/resultDetails", obj)
        .then(res => {
          if (res.data.status == 200) {
            console.log(res.data);
            this.lotteryLogo = res.data.lotteryLogo;
            this.lotteryName = res.data.lotteryName;
            this.resultList = res.data.resultList;
            this.lotteryResult = this.resultList[0].lotteryResult;
            this.resultDate = this.resultList[0].resultDate
              ? tools.getDate(this.resultList[0].resultDate)
              : "";
            this.runFrequency = res.data.runFrequency;
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    dateChange(val) {
      this.yearMonthDay = this.formatTime(val);
      this.getTableData(this.yearMonthDay);
    },
    selectChange() {
      let obj = this.resultList[this.selectedValue];
      this.lotteryResult = obj.lotteryResult;
      this.resultDate = obj.resultDate ? tools.getDate(obj.resultDate) : "";
    },
    openWin(a) {
      window.open(url + a, "lottery", "width=1300, height=950,left=10,top=10,");
    }
  },
  /* 此处结合watch和beforeCreate进行请求数据 */
  watch: {
    lotteryNumber() {
      this.date = new Date();
      this.yearMonthDay = this.formatTime(this.date);
      this.getTableData(this.yearMonthDay);
    }
  },
  computed: {
    lotteryNumber() {
      return this.$route.params.lotteryId;
    }
  },
  components: {
    headlottery
  },
  filters: {
    filterResult(a) {
      return a.join(" ");
    }
  }
};
</script>
<style lang="less" scoped>
.kaijiang_header {
  overflow: hidden;
  border: 1px solid #ffe3c7;
  background: #fef7f4;
  padding-left: 15px;
  margin-bottom: 10px;
  margin-top: 10px;
}

.top {
  overflow: hidden;
  margin-bottom: 10px;
  margin-top: 10px;
}

.bottom {
  overflow: hidden;
  margin-bottom: 20px;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 16px;
}

.top h1 {
  overflow: hidden;
  font-size: 20px;
  font-weight: 100;
  float: left;
  display: block;
}

.top span {
  overflow: hidden;
  display: block;
  color: #666;
  font-size: 14px;
  line-height: 26px;
  margin-left: 40px;
  float: left;
}

.top li {
  overflow: hidden;
  float: left;
  line-height: 27px;
  font-size: 12px;
  margin-left: 40px;
}

.top li.zs {
  overflow: hidden;
  color: #f84d4d;
}

.top li.gz {
  overflow: hidden;
  color: #60c78c;
}

.kaijiang_header .top li i {
  font-size: 20px;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.top li.zs a {
  overflow: hidden;
  color: #f84d4d;
  vertical-align: sub;
}

.top li.gz i {
  font-size: 17px;
}

.top li i {
  font-size: 20px;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.top li.gz a {
  overflow: hidden;
  color: #60c78c;
  vertical-align: sub;
}

.bottom span {
  overflow: hidden;
  color: #000;
  display: inline-block;
  vertical-align: middle;
}

.bottom select {
  vertical-align: middle;
  border: 1px solid #e94335;
  border-radius: 4px;
  padding: 0 3px;
  height: 26px;
  line-height: 26px;
}

select {
  background: #fff;
  border: 1px solid #ddd;
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
  outline: none;
}

.bottom span.open {
  overflow: hidden;
  margin-left: 20px;
}

.kaijiang_header .bottom span {
  overflow: hidden;
  color: #000;
  display: inline-block;
  vertical-align: middle;
}

.bottom span.open em {
  overflow: hidden;
  color: #666;
}

.bottom em {
  vertical-align: bottom;
}

.red {
  color: red !important;
}

.bottom .kjq {
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}

.ballDiv {
  display: inline-block;
}

.bottom .ballDiv .number_ball {
  float: left;
  border-radius: 50%;
  background-color: #e94335;
  width: 25px;
  height: 25px;
  margin-left: 1px;
}

.bottom .ballDiv .number_ball span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  color: #fff;
  font-weight: 400;
}
/* footer部分 */

.main_foot .footMain {
  padding: 20px 0px;
  background: #f8f8f8;
  font-size: 18px;
  color: #333;
  text-align: left;
  line-height: 40px;
}

.main_foot .footMain:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
}

.main_foot .footMain a {
  color: #333;
}

.main_foot .footMain a:hover {
  color: #e94335;
}

.main_foot .footMain .in {
  float: left;
  width: 290px;
  margin-left: 70px;
}

.main_foot .footMain .in i {
  font-size: 30px !important;
}

.main_foot .footMain .in a {
  padding-left: 15px;
}

.main_foot .footMain .tz {
  float: left;
  width: 280px;
}

.main_foot .footMain .tz img {
  vertical-align: top;
  width: 40px;
  height: 40px;
}

.main_foot .footMain .tz a {
  padding-left: 15px;
}

.main_foot .footMain .sc {
  float: left;
  width: 270px;
  padding-left: 50px;
  background: transparent
    url("https://cpweb.kosunmobile.com/c9/Public/static/images/shoucang.png")
    no-repeat;
  background-size: 40px 40px;
}

.main_foot .footMain .indexIcon {
  color: #ff8a00;
  vertical-align: top;
}

.main_foot .footMain img {
  height: 40px;
  line-height: 40px;
}
/* 表格部分样式 */

.day_list {
  box-sizing: border-box;
}

.day_list .day_title {
  padding: 2px 20px 0px 20px;
  height: 31px;
  border-bottom: 2px solid #ff9d00;
  line-height: 30px;
}

.day_list .day_title:after {
  content: "";
  height: 0;
  display: block;
  clear: both;
}

.day_list .day_title .title1 {
  float: left;
  width: 172px;
  font-size: 14px;
}

.day_list .day_title .title2 {
  width: 600px;
  float: left;
  font-size: 14px;
}

.day_list .day_title .title3 {
  width: 230px;
  float: left;
  font-size: 12px;
  color: #333;
}

.day_list .day_title .title2 .active {
  background-color: #ea721a;
  color: #fff;
  z-index: 100;
}

.day_list .day_title .title2 a {
  border: 1px solid #dedede;
  margin-left: -1px;
  text-align: center;
  padding: 0px 20px;
  color: #333;
  border-bottom: none;
  display: inline-block;
}

.day_list .day_title .title3 input {
  width: 100px;
  height: 20px;
  border: 1px solid #ccc;
  padding-left: 2px;
}

.day_con {
  line-height: 36px;
  font-size: 12px;
  color: #666;
}

.htmlDiv {
  width: 100%;
}

.detail-header {
  display: flex;
  border-left: 1px solid #d2d2d2;
  & > .col {
    flex-direction: row;
    flex: 1;
    display: flex;
    border: 1px solid #d2d2d2;
    margin-bottom: -1px;
    margin-left: -1px;
    & > div {
      flex: 1;
      text-align: center;
    }
    & > div:nth-child(2) {
      flex: 1.5;
    }
  }
}

.day_con_main {
  border-left: 1px solid #d2d2d2;
  overflow: hidden;
  .colomu {
    display: flex;
    flex-direction: row;
    float: left;
    width: 33.333333%;
    border: 1px solid #d2d2d2;
    border-left: none;
    border-top: none;
    margin-left: -1px;
    div {
      display: flex;
      flex: 1;
      justify-content: center;
    }
    & > div:nth-child(2) {
      flex: 1.5;
    }
  }
}
</style>
