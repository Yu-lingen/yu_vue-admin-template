<template>
  <!-- 容器 -->
  <div class="barChart" ref="barChart"></div>
</template>

<script>
//引入echarts
import echarts from "echarts";

export default {
  name: "barChart",
  props: ["payTrend"],
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    resizeListener() {
      this.chart.resize();
    },
  },
  mounted() {
    this.chart = echarts.init(this.$refs.barChart);
    this.chart.setOption({
      xAxis: {
        type: "category",
        //隐藏x轴
        show: false,
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      //grid 布局
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      //鼠标移入的提示信息
      tooltip: {},
      series: [
        {
          type: "bar",
          data: [],
          color: "#4079eb",
        },
      ],
    });
    //窗口自适应操作
    window.addEventListener("resize", this.resizeListener);
  },
  watch: {
    payTrend() {
      this.chart.setOption({
        series: [
          {
            type: "bar",
            data: this.payTrend,
            color: "#4079eb",
          },
        ],
      });
    },
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeListener);
  },
};
</script>

<style>
.barChart {
  width: 100%;
  height: 100%;
}
</style>