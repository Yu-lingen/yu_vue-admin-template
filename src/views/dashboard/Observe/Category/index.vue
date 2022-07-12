<template>
  <div>
    <el-card class="box-card">
      <!-- 头部内容区域 -->
      <div slot="header">
        <div class="header-content">
          <span>销售额类别占比</span>
          <el-radio-group v-model="value" size="medium">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- 图标区域,图标容器 -->
      <div class="chart" ref="pieChart"></div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import echarts from "echarts";

export default {
  name: "Category",
  props: ["saleRank"],
  data() {
    return {
      value: "线上",
      mychart: null,
      saleRankData: {},
    };
  },
  methods:{
    resizeListener(){
      this.mychart.resize();
    }
  },
  computed: {
    onlineArr() {
      const nameArr = this.saleRankData.online.name;
      const valueArr = this.saleRankData.online.value;
      const pieChartArr = valueArr.map((value, i) => ({
        value,
        name: nameArr[i],
      }));
      return pieChartArr;
    },
    shopArr() {
      const nameArr = this.saleRankData.shop.name;
      const valueArr = this.saleRankData.shop.value;
      const pieChartArr = valueArr.map((value, i) => ({
        value,
        name: nameArr[i],
      }));
      return pieChartArr;
    },
  },
  mounted() {
    this.mychart = echarts.init(this.$refs.pieChart);
    this.mychart.setOption({
      title: {
        text: "",
        left: "center",
        top: "center",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: [],
        },
      ],
    });
    // 图标的鼠标移入事件
    this.mychart.on("mouseover", (params) => {
      const { value, name } = params.data;
      this.mychart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
    //窗口自适应操作
    window.addEventListener('resize',this.resizeListener)
  },
  watch: {
    saleRank(value) {
      this.saleRankData = value;
      this.mychart.setOption({
        series: [
          {
            data: this.onlineArr,
          },
        ],
      });
    },
    //通过监听value值，即标题的变化来重新设置图标内的数据
    value() {
      this.mychart.setOption({
        series: [
          {
            data: this.value == "线上" ? this.onlineArr : this.shopArr,
          },
        ],
      });
    },
  },
  destroyed(){
    window.removeEventListener('resize',this.resizeListener);
  }
};
</script>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart {
  width: 100%;
  height: 300px;
}
</style>