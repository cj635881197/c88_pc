<template>
    <div>
        <headlottery style="margin-top:10px;" @upLoadLotterySeries='getLotterySeries'></headlottery>
        <div class="zoushi_data">
            <h1>
                <i class="iconfont icon-wujiaoxing"></i> 最新彩票开奖结果
            </h1>
            <div class="data">
                <table class="table">
                    <thead>
                        <tr style="background-color: rgb(234, 234, 234);">
                            <th>彩种</th>
                            <th>期号</th>
                            <th>开奖时间</th>
                            <th>开奖号码</th>
                            <th>期数（每天）</th>
                            <th>开奖频率</th>
                            <th>详情</th>
                            <th>走势</th>
                            <th>购买彩票</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in runLotteryData" :key='item.index'>
                            <td>{{item.lotteryName}}</td>
                            <td>{{item.issue}}</td>
                            <td>
                                {{item.resultDate|filterTime}}
                            </td>
                            <td>
                                <div class="ballDivMain">
                                    <div class="ballDiv">
                                        <div class="number_ball" v-for="(item1,index) in item.lotteryResult" :key="index">
                                            <span>{{item1}}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>{{item.dayIssue}}</td>
                            <td>{{item.runFrequency}}</td>
                            <td>
                                <router-link class="xq" :to="{ name: 'detail', params: { lotteryId: item.lotteryNo, lotteryLogo:item.lotteryLogo}}">
                                    <i class="iconfont icon-xiangqing"></i>
                                </router-link>
                            </td>
                            <td>
                                <a class="zs" target="_blank">
                                    <i class="iconfont icon-zoushi"></i>
                                </a>
                            </td>
                            <td>
                                <a class="btn btn-radius btn-default" @click="openLotteryWin(item.lotteryNo)">投注</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import url from 'static/url.js';
import ccaa from 'tools/tools.js';
import headlottery from 'components/common/headlottery';
export default {
    data() {
        return {
            runLotteryData: null,
        }
    },
    created() {
        this.getLotterySeries(0)
    },
    methods: {
        getLotterySeries(a) {
            this.$http.post('/openLotteryHall/result', { "showCatId": a })
                .then(res => {
                    //console.log(res.data);
                    if (res.data.status == 200) {
                        this.runLotteryData = res.data.lotteryList
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: 'warning'
                        });
                    }
                })
                .catch((err) => { console.log(err) });
        },
        openLotteryWin(lotteryNo) {
            window.open(url + "/buyLottery/bet" + lotteryNo, "lottery", "width=1300, height=950,left=10,top=10,")
        }
    },
    components: {
        headlottery,
    },
    filters: {
        filterTime(a) {
            return ccaa.getDate(a);
        }
    }
}
</script>
<style scoped>
.zoushi .zoushi_data {
    margin-top: 10px;
    margin-bottom: 10px;
    overflow: hidden
}

.zoushi .zoushi_data h1 {
    color: #333333;
    font-size: 16px;
    font-weight: 200;
    overflow: hidden;
    margin-bottom: 10px;
    margin-top: 10px
}

.zoushi .zoushi_data h1 i {
    overflow: hidden;
    color: #D51910;
    font-size: 22px;
    vertical-align: middle
}

.zoushi .zoushi_data .data {
    overflow: hidden
}

.zoushi .zoushi_data .data table {
    overflow: hidden
}

.zoushi .zoushi_data .data table .ballDivLhc {
    height: 40px !important
}

.zoushi .zoushi_data .data table .ballDivMain {
    display: flex;
    justify-content: center
}

.zoushi .zoushi_data .data table .ballDiv {
    display: flex;
    flex-wrap: wrap;
    max-height: 50px;
    max-width: 290px
}

.zoushi .zoushi_data .data table .ballDiv .number_add {
    width: 15px;
    height: 25px;
    line-height: 25px;
    margin-left: 1px;
    margin-bottom: 2px;
    color: #333;
    font-weight: 400
}

.zoushi .zoushi_data .data table .ballDiv .number_add i {
    color: #666;
    vertical-align: middle
}

.zoushi .zoushi_data .data table .ballDiv .number_ball {
    border-radius: 50%;
    background-color: #E94335;
    width: 25px;
    height: 25px;
    margin-left: 3px;
    margin-bottom: 2px
}

.zoushi .zoushi_data .data table .ballDiv .number_ball span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    color: #fff;
    font-weight: 400
}

.zoushi .zoushi_data .data table .ballDiv .number_ball .ball_sub {
    width: 25px;
    height: 26px;
    text-align: center
}

.zoushi .zoushi_data .data table.table {
    overflow: hidden
}

.zoushi .zoushi_data .data table.table thead {
    overflow: hidden;
    background: #FFF2C9
}

.zoushi .zoushi_data .data table.table thead tr {
    overflow: hidden
}

.zoushi .zoushi_data .data table.table thead tr th {
    overflow: hidden;
    color: #673300;
    font-weight: bold;
    text-align: center;
    font-size: 14px;
    line-height: 20px !important
}

.zoushi .zoushi_data .data table.table tbody {
    overflow: hidden
}

.zoushi .zoushi_data .data table.table tbody tr {
    background: #fff;
    color: #333333;
    overflow: hidden
}

.zoushi .zoushi_data .data table.table tbody tr.neq {
    background: #F8F8F8;
    color: #333333
}

.zoushi .zoushi_data .data table.table tbody tr td {
    overflow: hidden;
    font-size: 14px;
    text-align: center
}

.zoushi .zoushi_data .data table.table tbody tr td a {
    text-decoration: none;
    overflow: hidden;
    height: 25px;
    line-height: 20px
}

.zoushi .zoushi_data .data table.table tbody tr td a i {
    overflow: hidden;
    height: 20px
}

.zoushi .zoushi_data .data table.table tbody tr td a.xq {
    overflow: hidden
}

.zoushi .zoushi_data .data table.table tbody tr td a.xq i {
    overflow: hidden;
    text-align: center;
    color: #78B931;
    text-decoration: none;
    font-size: 21px
}

.zoushi .zoushi_data .data table.table tbody tr td a.zs {
    overflow: hidden
}

.zoushi .zoushi_data .data table.table tbody tr td a.zs i {
    overflow: hidden;
    text-align: center;
    color: #4990E2;
    text-decoration: none;
    font-size: 26px
}

.zoushi .zoushi_data .data table.table tbody tr td a.btn {
    overflow: hidden;
    width: 50px;
    height: 24px;
    padding: 0px;
    font-size: 13px;
    line-height: 24px
}

.table {
    width: 100%;
    margin-bottom: 20px;
}

.table th,
.table td {
    padding: 8px;
}

.table tbody td {
    height: 38px;
}

.table tbody tr:nth-child(even) {
    background-color: rgb(234, 234, 234) !important;
}

a.btn-default,
button.btn-default,
input.btn-default,
.btn-default {
    background: #E94335;
    color: #fff;
}

.btn-radius {
    border-radius: 4px;
}

.btn {
    display: inline-block;
    padding: 10px;
    border: 0px;
    font-size: 1.0625rem;
    color: #fff;
    text-align: center;
    border-radius: 4px;
}
</style>
