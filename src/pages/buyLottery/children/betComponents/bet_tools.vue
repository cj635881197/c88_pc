<template>
  <div class="bet-tools">
    <div class="opt">
      <span>
        共
        <span class="bet-num">{{betsCount}}</span>注，单注金额：
      </span>
      <input type="text" class="amount" autocomplete="off" v-model="price" maxlength="5" @input="checkValue">
      <div class=" unit" :class="{'unit_activity':unitNum==1}" @click="changeUnit(1)">元</div>
      <div class="unit" :class="{'unit_activity':unitNum==0.1}" @click="changeUnit(0.1)">角</div>
      <div class="unit" :class="{'unit_activity':unitNum==0.01}" @click="changeUnit(0.01)">分</div>
      <span>
        共
        <span class="total">{{allPrice}}</span>元
      </span>
      <div class="bonus-adjustment">
        <div class="bonus-rebate">
          <div class="bonus" v-if="odds.length<4">{{odds[0] | retainDigit(3)}}</div>
          <div class="bonus" v-else></div>
          <div class="rebate">
            {{rate}}%
          </div>
        </div>
        <div class="control">
          <div class="control-label">赔率</div>
          <el-slider v-model="rate1" :show-tooltip="false" style="width: 160px;padding: 0 8px;"></el-slider>
          <!-- @change="calculateFanli" -->
          <div class="control-label">返利</div>
        </div>
      </div>
    </div>
    <div class="operation-group">
      <button class="add" @click="addZhuDan">添加注单</button>
    </div>
  </div>
</template>
<script>
import tools from 'tools/tools.js'
export default {
  data() {
    return {
      price: 2, //页面上显示的单价
      unitNum: 1, //单位元，角，分
      rate1: 0, //input绑定的model值
      rate: 0.0, //页面上显示的返利数值
      odds: [] //页面上显示的赔率数据
    }
  },
  mounted() {
    this.$store.commit('sendDataAll', {
      unitNum: this.unitNum,
      rate: this.rate,
      odds: this.odds,
      price: this.price
    })
  },
  created() {
    if (this.$route.query.price) {
      this.price = this.$route.query.price
    }
  },
  computed: {
    betsCount() {
      return this.$store.state.bet_selectNumber.count
    },
    /* 从store拿到的数据 */
    lotteryCodeList() {
      return this.$store.state.lotteryCodeList
    },
    maxRebates() {
      return this.$store.state.maxRebates
    },
    lotteryCode() {
      return this.$store.state.lotteryCode
    },
    playCode() {
      return this.$store.state.bet_selectPlay.playCode
    },
    truePrice() {
      //加上单位后的真实价格
      return tools.accMul(this.price, this.unitNum)
    },
    allPrice() {
      //页面上显示的价格
      return tools.accMul(this.betsCount, this.truePrice)
    },
    odds1() {
      //根据玩法编码取出对应的odds数组,
      //console.log(this.lotteryCodeList)
      let odds
      /* console.log(this.lotteryCodeList)
      console.log(this.playCode) */
      if (this.playCode && this.lotteryCodeList.length) {
        for (let i = 0; i < this.lotteryCodeList.length; i++) {
          if (this.lotteryCodeList[i].codeNo == this.playCode) {
            odds = this.lotteryCodeList[i].odds
          }
        }
        if (odds == undefined) {
          return [0]
        } else {
          return odds
        }
      }
    },
    index() {
      return this.$store.state.bet_selectNumber.index
    }
  },
  watch: {
    odds1(val) {
      /* 当从接口请求回来数据后重新计算赔率 */
      /* this.reCountOdds(); */
      if (this.maxRebates) {
        this.rate1 = this.rate.div(this.maxRebates).Mul(100)
        this.odds = this.getOdds(this.rate)
        this.$store.commit('sendDataAll1', { odds: this.odds })
      }
    },
    /* 更改玩法code时重置赔率为0 */
    playCode(val, oval) {
      if (val && oval) {
        this.rate1 = 0
        this.unitNum = 1
        this.price = 2
      }
    },
    /* 此处动态计算赔率和返利 */
    rate1(val) {
      this.countOdds(val)
    },
    /* maxRebates(val){
      console.log(val)
    }, */
    unitNum(val) {
      this.$store.commit('sendDataAll3', { unitNum: val })
    },
    price(val) {
      this.$store.commit('sendDataAll4', { price: val })
    }
  },
  methods: {
    /* 当从接口请求回来数据后重新计算赔率 */
    /* reCountOdds(){
      this.rate1=((this.rate).div(this.maxRebates)).Mul(100);
      this.odds = this.getOdds(this.rate);
    }, */
    // 滑动滑块时计算赔率和返利
    countOdds(val) {
      this.rate = tools.accMul(this.maxRebates, val.div(100)) //滑动滑块时改变返利
      this.odds = this.getOdds(this.rate) //滑动滑块时改变赔率
      this.$store.commit('sendDataAll2', { rate: this.rate })
      this.$store.commit('sendDataAll1', { odds: this.odds })
    },
    checkValue() {
      this.price = this.price.replace(/\D/g, '') //验证只能输入正整数
    },
    changeUnit(a) {
      this.unitNum = a
    },
    //计算赔率
    getOdds(rate) {
      let oddsArr = []
      if (this.odds1.length < 2) {
        let oddss = tools.accMul(1 - rate.div(100), this.odds1[0])
        oddsArr.push(oddss)
      } else {
        for (let item of this.odds1) {
          let oddss = tools.accMul(1 - rate.div(100), item)
          oddsArr.push(oddss)
        }
      }
      return oddsArr
    },
    addZhuDan() {
      if (this.betsCount == 0) {
        this.$alert('您还没有选择号码或者选择号码不全', '温馨提示', {
          confirmButtonText: '确定'
        })
      } else {
        let odds = []
        if (
          (this.lotteryCode == 31 ||
            this.lotteryCode == 32 ||
            this.lotteryCode == 33) &&
          this.playCode == 1
        ) {
          this.index.forEach(item => {
            let obj = {}
            obj.num = Number(item) + 3
            obj.odds = this.odds[item]
            odds.push(obj)
          })
        } else {
          odds.push(this.odds[0])
        }
        var zhudan = {
          price1: this.price,
          unitNum: this.unitNum,
          rebates: this.rate,
          odds: odds
        }
        //将组建好的数据提交给vuex
        this.$store.commit('changeSumListObj3', zhudan)
        //初始化当前数据
        this.price = 2
        this.unitNum = 1
        this.rate1 = 0
        tools.clearStyle(this.$store.state.selectNumPan)
        this.$store.commit('clearIndex')
        //console.log(1);
      }
    }
  },
  filters: {
    retainDigit(num, digit) {
      return Number(num).toFixed(digit)
    }
  }
}
</script>
<style scoped>
* {
  box-sizing: border-box;
  color: #333;
  font-family: Microsoft YaHei, Arial, Helvetica, 'sans-serif';
  outline: none;
  cursor: inherit;
}
</style>
