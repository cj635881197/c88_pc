<template>
  <MemberCommon>
    <div slot="nav">
      <li :class="{hover:safe==1}" @click="changeSafe(1)">
        <a href="javascript:;">充值</a>
      </li>
      <li :class="{hover:safe==2}" @click="changeSafe(2)">
        <a href="javascript:;">提现</a>
      </li>
      <li :class="{hover:safe==3}" @click="changeSafe(3)">
        <a href="javascript:;">充值记录</a>
      </li>
      <li :class="{hover:safe==4}" @click="changeSafe(4)">
        <a href="javascript:;">提现记录</a>
      </li>
    </div>
    <div slot="body">
      <!-- 充值部分 -->
      <div v-if="safe==1" class="user_body">
        <component :is="chargingPage" @onNext="next" @gotoNewPage="toNewPage" :subPageData="subPageData" :money='money' :id="id"></component>
      </div>
      <!-- 提现部分 -->
      <div v-if="safe==2" class="user_body">
        <div class="topup_main">
          <div class="main_header">
            <div class="user">
              <em>可提金额:</em>
              <span class="large">¥{{withdrawData.desirableAmount}}</span>
            </div>
            <div class="money">
              <label for="">
                <em class="red">＊</em>提现金额:</label>
              <div class="form">
                <div class="form_group">
                  <input type="text" placeholder="请输入提现金额" @blur="checkTixianVal" autocomplete="off" value="" v-model="InputDesirableAmount">
                  <!-- onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]|^0{1,}\d{1,}|[\,,\.]{1,}/g,'')" -->
                </div>
              </div>
              <span class="remark">单笔限额为:{{withdrawData.perWithdrawMin}}～{{withdrawData.perWithdrawMax}}</span>
            </div>
            <span class="shouxufei" v-if="poundage">手续费：{{poundage}}</span>
          </div>
          <div class="pay_type">
            <h2 class="left">提现至:</h2>
            <div class="pay_main" id="withdraw_type_main" style="margin-top:26px;">
              <ul style="width:auto">
                <li class="tixian hover"  v-if="bankCard.bankCard">
                  <span class="bank_logo">
                    <img :src="bankCard.bankCard.pcImg" alt="logo">
                  </span>
                  <span class="bank_number">
                    {{bankCard.bankCard.bankNo}} </span>
                  <span class="account_name">
                    {{bankCard.bankCard.cardholder.substring(0,1)}}
                    <em>**</em>
                  </span>
                </li>
              </ul>
            </div>
            <input type="hidden" style="display: none" name="user_bank_id" value="0" id="withdraw_type_value">
          </div>
          <div class="pay_password">
            <label for="">
              <em class="red">＊</em>资金密码:</label>
            <div class="form">
              <div class="form_group">
                <input type="password" placeholder="请输入资金密码" autocomplete="off" v-model="moneyPSW">
              </div>
            </div>
          </div>
          <el-button size="large" type="primary" class="btn2" @click="confirmTiXian">下一步</el-button>
          <div class="account_b">
            <table class="table">
              <tbody>
                <tr>
                  <td width="140">账户余额</td>
                  <td width="250">{{withdrawData.balance}}元</td>
                  <td width="140">单笔限额</td>
                  <td width="250">{{withdrawData.perWithdrawMin}}～{{withdrawData.perWithdrawMax}}元</td>
                </tr>
                <tr>
                  <td>可提金额</td>
                  <td>{{withdrawData.desirableAmount}}元</td>
                  <td>今日已提次数</td>
                  <td>{{withdrawData.countDay}}次</td>
                </tr>
                <tr>
                  <td>取款时间</td>
                  <td>00:00~24:00</td>
                  <td>每日限制次数</td>
                  <td>{{withdrawData.dailyWithdrawals}}次</td>
                </tr>
                <tr>
                  <td>今日已提金额</td>
                  <td>{{withdrawData.sumWithdraws|filtersumWithdraws}}元</td>

                  <td>每日限制金额</td>
                  <td>{{withdrawData.dailyWithdrawFee}}元</td>
                </tr>
                <tr>
                  <td>手续费说明</td>
                  <td colspan="3">
                    <div class="left">
                      每日免手续费次数：{{withdrawData.withdrawFreePundageCount}}次。 超出次数按 提款金额＊{{withdrawData.withdrawPundageRate}}%收取
                    </div>
                    <!-- <div class="right">
                      <el-button type="primary" size="small" style="margin-right:15px;">查看稽核详情</el-button>
                    </div> -->
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- 充值记录部分 -->
      <div v-if="safe==3">
        <div class="info_select">
          <el-select v-model="chargingRecordType" placeholder="请选择" size="small">
            <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="chargingRecordStatus" placeholder="请选择" size="small">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <span class="b_search_name"> 时间：</span>
          <el-date-picker size="small" type="date" placeholder="选择日期" v-model="dateStart1" :clearable="false">
          </el-date-picker>
          <span class="b_search_name"> 至</span>
          <el-date-picker size="small" type="date" placeholder="选择日期" v-model="dateEnd1" :clearable="false">
          </el-date-picker>
          <el-button size="small" type="primary" style="width: 105px;float: right;" @click="getRechargeList(1)">查询</el-button>

        </div>
        <div-table style="margin-top:15px;">
          <div slot="head" class="thead">
            <div style="flex:3">订单号</div>
            <div style="flex:1.5">充值方式</div>
            <div style="flex:1.5">充值金额</div>
            <div style="flex:1.5">充值优惠</div>
            <div style="flex:3">存款日期</div>
            <div style="flex:1">状态</div>
          </div>
          <div slot="body" class="tbody" v-if="rechargeList.length==0">
            <div class="empty_data">暂无记录</div>
          </div>
          <div slot="body" class="tbody" v-else v-for="item in rechargeList" :key="item.index">
            <div style="flex:3">{{item.orderId}}</div>
            <div style="flex:1.5">{{item.settingType|filterSettingType}}</div>
            <div style="flex:1.5">{{item.amount|filterNumber}}</div>
            <div style="flex:1.5">{{item.discountAmount}}</div>
            <div style="flex:3">{{item.createTime|filterCreateTime}}</div>
            <div style="flex:1">{{item.status|filterStatus}}</div>
          </div>
        </div-table>
        <el-pagination  @current-change="changePage1"  layout="prev, pager, next"  :page-count="pages"></el-pagination>
      </div>
      <!-- 提现记录部分 -->
      <div v-if="safe==4">
        <div class="info_select">
          <span class="b_search_name"> 时间：</span>
          <el-date-picker size="small" type="date" placeholder="选择日期" v-model="dateStart1" :clearable="false">
          </el-date-picker>
          <span class="b_search_name"> 至</span>
          <el-date-picker size="small" type="date" placeholder="选择日期" v-model="dateEnd1" :clearable="false">
          </el-date-picker>
          <el-button size="small" type="primary" style="width: 105px;float: right;" @click="gatheringRecord(1)">查询</el-button>
        </div>
        <div-table style="margin-top:15px;">
          <div slot="head" class="thead">
            <div style="flex:1">提款金额</div>
            <div style="flex:0.8">手续费</div>
            <div style="flex:0.8">出款金额</div>
            <div style="flex:1">账户余额</div>
            <div style="flex:1.4">提款日期</div>
            <div style="flex:0.6">提款状态</div>
          </div>
          <div slot="body" class="tbody" v-if="gatheringRecordData.length==0">
            <div class="empty_data">暂无记录</div>
          </div>
          <div slot="body" class="tbody" v-for="item in gatheringRecordData" :key="item.index" v-else>
            <div style="flex:1">{{item.amount|filtersumWithdraws}}</div>
            <div style="flex:0.8">{{item.discountAmount|filtersumWithdraws}}</div>
            <div style="flex:0.8">{{item.status|filterStatus2(item.amount)}}</div>
            <div style="flex:1">{{item.balance}}</div>
            <div style="flex:1.4">{{item.createTime|filterCreateTime}}</div>
            <div style="flex:0.6">
              <span v-if="item.status==1">待处理</span>
              <span v-if="item.status==-1">已取消</span>
              <span v-if="item.status==2">已锁定</span>
              <span v-if="item.status==-2">已拒绝</span>
              <span @click="showReason(item.repulseReason)" v-if="item.status==-2">理由
              </span>
              <span v-if="item.status==0">已完成</span>
            </div>
          </div>
        </div-table>
        <el-pagination  @current-change="changePage2"  layout="prev, pager, next"  :page-count="pages"></el-pagination>
      </div>
    </div>
  </MemberCommon>
</template>
<script>
import MemberCommon from "components/common/memberCommon";
import DivTable from "components/common/divTable";
import tools from "tools/tools.js";
import chargingIndex from "./charging/chargingIndex";
import downLineBankCard from "./charging/downLineBankCard";
import onlineBank from "./charging/onlineBank";
import QrPay from "./charging/QrPay";
export default {
  created() {
    this.fetchGethering();
    this.getBankcardList();
    /* this.gatheringRecord(); */
  },
  data() {
    return {
      /* 宏观数据开始 */
      safe: this.$route.params.id, //切换大选项卡的数据
      /* 宏观数据结束 */
      /* 充值记录部分数据开始 */
      chargingRecordType: "", //充值记录类型数据
      chargingRecordStatus: "", //充值记录状态数据
      options1: [
        {
          value: "",
          label: "全部类型"
        },
        {
          value: "1",
          label: "线上充值"
        },
        {
          value: "0",
          label: "线下充值"
        },
        {
          value: "2",
          label: "人工充值"
        }
      ],
      options2: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "1",
          label: "待处理"
        },
        {
          value: "0",
          label: "充值成功"
        },
        {
          value: "-1",
          label: "充值失败"
        }
      ],
      dateStart1: null,
      dateEnd1: new Date(),
      id:null, // 充值id
      chargingPage: chargingIndex, //控制充值部分哪个页面显示
      subPageData: null, //分3步走的银行卡类的二级页面数据
      money: null, //从财务首页传过来的充值金额
      rechargeList: [], //充值记录列表数据
      withdrawData: {}, //从接口请求回来的提现数据
      poundage: null, //提款手续费
      InputDesirableAmount: null, //输入框输入的提现金额
      moneyPSW: null, //资金密码
      bankCard: {}, //接口请求回来的用于提现的银行卡数据
      gatheringRecordData: [], //提现记录数据
      pages:null, // 一共多少页
    };
  },
  components: {
    MemberCommon,
    DivTable,
    chargingIndex,
    downLineBankCard,
    onlineBank,
    QrPay
  },
  methods: {
    changePage1(a){
      this.getRechargeList(a);
    },
    changePage2(a){
      this.gatheringRecord(a)
    },
    //显示后台拒绝提现的理由
    showReason(a) {
      if (a) {
        this.$alert(a, "拒绝理由", {
          confirmButtonText: "关闭",
          center: true
        });
      } else {
        this.$message("暂无拒绝理由");
      }
    },
    //获取用户绑定的银行卡数据，用于提现
    getBankcardList() {
      this.$http
        .post("/member/getBankcardList", {
          memberId: tools.store.getData("user").id
        })
        .then(res => {
          if (res.data.status == 200) {
            // console.log(res.data);
            this.bankCard = res.data;
          }
        });
    },
    //确认提现操作
    confirmTiXian() {
      let obj = {};
      //验证所填数据是否为空
      if (!this.InputDesirableAmount) {
        this.$message.error("请输入提现金额");
      } else if (!this.moneyPSW) {
        this.$message.error("请输入资金密码");
      } else if (this.withdrawData.countDay >= 10) {
        this.$message.error("今日提现次数已达上限");
      } else {
        let obj2={};
        obj2.userBankId = this.bankCard.bankCard.userBankId;
        obj2.bankNo = this.bankCard.bankCard.bankNo;
        obj2.bankName = this.bankCard.bankCard.bankName;
        obj2.cardholder = this.bankCard.bankCard.cardholder;
        obj.memberId = tools.store.getData("user").id;
        obj.amount = this.InputDesirableAmount;
        obj.discountAmount = this.poundage ? this.poundage : 0.000;
        obj.description = JSON.stringify(obj2);
        obj.moneyPSW = this.md5(this.moneyPSW);
        obj.goodsName = this.bankCard.bankCard.bankName;
        obj.settingId = this.bankCard.bankCard.bankNo;
        console.log(obj);
        this.$http.post("/order/gathering/create", obj).then(res => {
          console.log(res.data);
          if (res.data.status == 200) {
            this.moneyPSW = null;
            this.InputDesirableAmount = null;
            this.poundage = null;
            this.safe = 4;
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    //失去焦点时验证输入的值并且计算是否有手续费
    checkTixianVal() {
      if(!this.InputDesirableAmount){
        return
      }
      //验证输入格式
      let reg = /^((?:-?0)|(?:-?[1-9]\d*))(?:\.\d{1,2})?$/g;
      if (this.InputDesirableAmount) {
        if (!reg.test(this.InputDesirableAmount)) {
          this.$message.error("请输入正确的格式");
          this.InputDesirableAmount = null;
        } else if (
          this.InputDesirableAmount < this.withdrawData.perWithdrawMin ||
          this.InputDesirableAmount > this.withdrawData.perWithdrawMax
        ) {
          //验证输入范围
          this.$message.error("请注意提现金额范围");
          this.InputDesirableAmount = null;
        } else if (this.withdrawData.countDay >= this.withdrawData.withdrawFreePundageCount) {
          //计算是否有手续费和够不够提现
          let poundage = tools.accMul(
            this.InputDesirableAmount,
            this.withdrawData.withdrawPundageRate.div(100)
          );
          this.poundage = (Math.floor(poundage*1000))/1000
        }else if (this.InputDesirableAmount > this.withdrawData.desirableAmount) {
            this.$message.error("可提金额不足");
            this.InputDesirableAmount = null;
          }
      }
    },
    //响应子组件点击下一步后的的操作
    next(obj) {
      console.log(obj)
      this.subPageData = obj.data;
      this.money = obj.money;
      this.chargingPage = obj.page;
      this.id = obj.id
    },
    toNewPage(a) {
      this[Object.keys(a)[0]] = a[Object.keys(a)[0]];
    },
    changeSafe(a) {
      if (a == 1) {
        this.chargingPage = chargingIndex;
        this.safe = a;
      } else if (a == 2) {
        if (!this.bankCard.isBank) {
          //console.log(this.bankCard)
          this.$message({
            message: "请添加银行卡",
            type: "warning"
          });
        } else {
          this.safe = a;
        }
      } else {
        this.safe = a;
      }
    },
    //充值记录查询
    getRechargeList(a) {
      this.rechargeList = [];
      let obj = {};
      obj.memberId = tools.store.getData("user").id;
      obj.timeType = 1;
      obj.beginTime = tools.getDate(this.dateStart1.getTime());
      obj.endTime = tools.getDate(this.dateEnd1.getTime());
      obj.settingType = this.chargingRecordType;
      obj.status = this.chargingRecordStatus;
      obj.pageNum = a
      // console.log(obj);
      this.$http
        .post("/recharge/order/list", obj)
        .then(res => {
          if (res.data.status == 200) {
            console.log(res.data);
            this.rechargeList = res.data.result.list;
            this.pages = res.data.result.pages;
          } else {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    //切换选项卡时初始化数据
    initDate() {
      //初始化开始时间为每月一号0点
      let currentDate = new Date();
      currentDate.setDate(1);
      currentDate.setHours(0);
      currentDate.setMinutes(0);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);
      this.dateStart1 = currentDate;
      //初始化结束时间为当前时间
      this.dateEnd1 = new Date();
      this.pages = null
    },
    //进入提现页面获取可提金额相关信息
    fetchGethering() {
      this.$http
        .post("/order/gathering/open", {
          memberId: tools.store.getData("user").id
        })
        .then(res => {
          if (res.data.status == 200) {
            //console.log(res.data);
            this.withdrawData = res.data.result;
          }
        });
    },
    //提现记录查询
    gatheringRecord(a) {
      let obj = {};
      obj.beginTime = tools.getDate(this.dateStart1.getTime());
      obj.endTime = tools.getDate(this.dateEnd1.getTime());
      obj.memberId = tools.store.getData("user").id;
      obj.timeType = 1;
      obj.pageNum = a
      //console.log(obj);
      this.$http.post("/order/gathering/list", obj).then(res => {
        if (res.data.status == 200) {
          // console.log(res.data);
          this.gatheringRecordData = res.data.result.list;
          this.pages = res.data.result.pages;
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  },
  watch: {
    safe(val) {
      if (val == 3) {
        this.initDate();
        this.changePage1(1)
      } else if (val == 4) {
        this.initDate();
        this.changePage2(1)
      } else if (val == 2) {
        this.fetchGethering();
        this.getBankcardList();
      }
    }
  },
  filters: {
    filterSettingType(a) {
      switch (a) {
        case 0:
          return "线下充值";
          break;
        case 1:
          return "线上充值";
          break;
        case 2:
          return "人工充值";
          break;
      }
    },
    filterNumber(a) {
      return Number(a).toFixed(2);
    },
    filterCreateTime(a) {
      return tools.getDate(a);
    },
    filterStatus(a) {
      switch (a) {
        case 0:
          return "充值成功";
          break;
        case 1:
          return "待处理";
          break;
        case -1:
          return "充值失败";
          break;
      }
    },
    filtersumWithdraws(a) {
      if (a) {
        return Math.abs(a);
      } else {
        return 0;
      }
    },
    filterStatus2(a, b) {
      if (a == 0) {
        return b;
      } else {
        return 0;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "./charging/charging.less";
.el-select {
  width: 100px;
}

.el-date-editor.el-input {
  width: 136px;
}

.empty_data {
  background-image: url("../../assets/image/lion.png");
  background-size: 40px 46px;
  background-repeat: no-repeat;
  line-height: 50px;
  background-position: 42%;
  color: #999 !important;
}

.info_select {
  padding-left: 15px;
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 15px;
}

.btn1 {
  width: 240px;
  display: block;
  margin: 0 auto;
}

.btn2 {
  width: 240px;
  display: block;
  margin-left: 90px;
  margin-top: 20px;
}

.user_body {
  padding: 15px;
  overflow: hidden;
}

.right {
  overflow: hidden;
  float: right;
}

.left {
  overflow: hidden;
  float: left;
}

.red {
  color: red !important;
}
.shouxufei {
  margin-left: 87px;
  color: red;
}
</style>
