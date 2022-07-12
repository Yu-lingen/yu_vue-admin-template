<template>
  <!-- 容器 -->
  <div class="progressChart" ref="progressChart"></div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "progressChart",
  props: ["activityRate"],
  data() {
    return {
      chart: null,
    };
  },
  methods:{
    resizeListener(){
      this.chart.resize();
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.progressChart);
    this.chart.setOption({
      xAxis: {
        show: false,
        //设置最大值和最小值
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      //grid布局
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      //鼠标移入的提示信息
      tooltip: {},
      series: {
        type: "bar",
        data: [],
        color: "#68c53a",
        //设置柱条的宽度
        barWidth: 10,
        //设置背景颜色
        showBackground: true,
        backgroundStyle: {
          color: "#eee",
        },
        //设置文本标签，右边的 |
        label: {
          //是否显示
          show: true,
          //文本内容
          formatter: " | ",
          //位置
          position: "right",
        },
      },
    });
    //窗口自适应操作
    window.addEventListener("resize",this.resizeListener);
  },
  watch: {
    activityRate() {
      this.chart.setOption({
        series: [
          {
            data: [this.activityRate],
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

<style>
.progressChart {
  width: 100%;
  height: 100%;
}
</style>