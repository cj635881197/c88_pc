<template>
    <!-- 开奖公告头部带选项卡部分 -->
    <div class="zoushi_header_nav">
        <!--彩种分类-->
        <div class="lotteryNav">
            <ul>
                <li class="liHead liDiv" @click="changeLotterySeries(0)" :class="{active:lotterySeries==0}">
                    <div class="headTitle ">全部</div>
                </li>
                <li class="liDiv" v-for="(item,index) in data" :key="index" @click="changeLotterySeries(item.catId)" :class="{active:lotterySeries==item.catId}">
                    <div class="navTitle">
                        <i>
                            <img :src="item.showImg" alt="logo">
                        </i>
                        <span>
                            <a> {{item.catName}} </a>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="hideNav">
            <ul>
                <li v-for="(item,index) in filterLotteryData" :key="index">
                    <router-link :to="{ name: 'detail', params: { lotteryId: item.id}}">{{item.lotteryName}}</router-link>
                    <em v-if="index!=(filterLotteryData.length-1)">|</em>
                </li>
            </ul>
        </div>
    </div>
    <!-- 开奖公告头部带选项卡部分结束 -->
</template>
<script>
export default {
    data() {
        return {
            data: [],
            lotterySeries: 0,//记录当前彩种系列是哪个
        }
    },
    methods: {
        changeLotterySeries(a) {
            this.lotterySeries = a;
            this.$emit('upLoadLotterySeries', a)
        },
        getlist(){
            this.$http.post("/api/show/cat/list")
            .then(res=>{
                if(res.data.status==200){
                    this.data=res.data.result;
                }
            })
        }
    },
    created(){
        this.getlist();
    },
    computed: {
        lotteryData(){
            if(this.data.length!=0){
                let arr=[];
                this.data.forEach(res=>{
                    res.lotteryList.forEach(res2=>{
                        let obj={};
                        obj.lotteryName=res2.lotteryName;
                        obj.series=res2.showCatId;
                        obj.id=res2.id;
                        arr.push(obj);
                    })
                });
                return arr;
            }
        },
        filterLotteryData() {
            if (this.lotterySeries == 0) {
                return this.lotteryData;
            } else {
                let arr = [];
                for (let item of this.lotteryData) {
                    if (item.series == this.lotterySeries) {
                        arr.push(item);
                    }
                }
                return arr;
            }
        }
    },
}
</script>
<style scoped>
/* @import './hideNav/gonggao.css'; */

.zoushi .zoushi_main {
    overflow: hidden;
    margin-top: 10px
}

.zoushi_header_nav {
    position: relative;
    background-color: #fff7f0;
    width: 1000px;
}

.zoushi_header_nav:after,
.lotteryNav:after,
.hideNav:after {
    content: '';
    display: block;
    clear: both;
    height: 0;
}

.zoushi_header_nav .lotteryNav .active {
    background-color: #ffcd9b
}

.zoushi_header_nav .liHead {
    width: 100px !important;
    height: 40px
}

.zoushi_header_nav .liHead .headTitle {
    width: 60px;
    height: 20px;
    text-align: center;
    margin-top: 12px;
    margin-left: 20px;
    border-radius: 10px;
    background-color: #bd10e0;
    line-height: 20px;
    color: #fff;
    cursor: pointer
}

.zoushi_header_nav .liDiv {
    width: 128.5px;
    float: left;
    line-height: 40px;
    color: #333;
    font-size: 14px;
    font-weight: 400
}

.zoushi_header_nav .liDiv img {
    margin-left: 20px;
    margin-right: 12px;
    height: 26px;
    width: 26px;
    vertical-align: middle
}

.zoushi_header_nav .liDiv .navTitle {
    cursor: pointer
}

.zoushi_header_nav .liDiv a {
    color: #333
}

.zoushi_header_nav .liDiv a:hover {
    color: #E94335
}

.zoushi_header_nav .blackDiv {
    height: 75px
}

.hideNav {
    background-color: #fff;
    top: 40px;
    left: 0;
    border: 1px solid #ffcd9b;
    width: 974px;
    color: #666;
    font-size: 14px;
    font-weight: 500;
    padding: 12px
}

.zoushi_header_nav .hideNav .active {
    color: #E94335
}

.hideNav li {
    float: left;
    line-height: 27px
}

.zoushi_header_nav .hideNav em {
    margin-left: 11px;
    margin-right: 11px
}

.zoushi_header_nav .hideNav a {
    color: #666
}

.zoushi_header_nav .hideNav a:hover {
    color: #E94335
}

.zoushi_header_nav .hideNav a:active {
    color: #666
}
</style>
