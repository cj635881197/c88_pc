<<template>
    <div class="lottery-main" >
        <bet-header headRight='one' :cha="cha" @onGetData="getData"></bet-header>
        <div>
            <bet-select-play :play="ssc" :firstDefault="stairCodeNo" :secondDefault="defaultCodeNo"></bet-select-play>
            <div class="bet-area">
                <bet-tips></bet-tips>
                <div class="bet-main">
                    <betSelect-number></betSelect-number>
                    <bet-tools ></bet-tools>
                </div>
                <div class="bet-result">
                    <bet-result></bet-result>
                </div>
                <div class="chase-number">
                    <bet-chase-number></bet-chase-number>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import betHeader from "../betComponents/bet_head";
import betSelectPlay from "../betComponents/bet_selectPlay";
import betTips from "../betComponents/bet_tips";
import betSelectNumber from "../betComponents/bet_selectNumber";
import betTools from "../betComponents/bet_tools";
import betResult from "../betComponents/bet_result";
import betChaseNumber from "../betComponents/bet_chasenumber";
import tools from 'tools/tools.js';
import { AllPlay } from 'commonData/AllPlay.js'
export default {
  data() {
    return {
      ssc: AllPlay[21],
      defaultCodeNo: null, // 三级玩法编号
      stairCodeNo: null, // 一级玩法编号
      cha: null
    };
  },
  methods: {
    getData() {
      this.$store
        .dispatch("getLotteryData", {
          this: this,
          data: { lotteryNo: "22",memberId: tools.store.getData("user").id }
        })
        .then(res => {
          this.cha = this.$store.state.runLotteryTime-this.$store.state.sysDate;
          this.stairCodeNo = Number(res.stairCodeNo)
          this.defaultCodeNo = Number(res.defaultCodeNo)
        });
      /* 向vuex中发送彩种编号 */
      this.$store.commit("changeLotteryCode", { a: "22" });
    }
  },
  created() {
    this.getData();
  },
  components: {
    betHeader,
    betSelectPlay,
    betTips,
    betSelectNumber,
    betTools,
    betResult,
    betChaseNumber
  },
  destroyed(){
    this.$store.commit('initLotteryData');
  }
};
</script>
<style scoped>

</style>
