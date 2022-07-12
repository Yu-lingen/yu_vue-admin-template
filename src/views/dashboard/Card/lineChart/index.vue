<template>
  <!-- 容器 -->
  <div class="lineChart" ref="lineChart"></div>
</template>

<script>
// 引入echarts
import echarts from "echarts";

export default {
  name: "lineChart",
  props: ["visitTrend"],
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
  // 组件挂载完毕(真实dom生成)的时候
  mounted() {
    // 初始化echarts
    this.chart = echarts.init(this.$refs.lineChart);
    //echarts的配置项options
    this.chart.setOption({
      //x轴
      xAxis: {
        type: "category",
        //隐藏x轴
        show: false,
      },
      //y轴
      yAxis: {
        //隐藏x轴
        show: false,
      },
      //grid 布局
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      series: [
        {
          data: [],
          type: "line",
          smooth: true,
          //拐点样式设置
          itemStyle: {
            opacity: 0,
          },
          //线条样式
          lineStyle: {
            color: "rgba(170, 53, 213, 1)",
          },
          //区域填充样式
          areaStyle: {
            color: {
              // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(170, 53, 213, 0.5)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(170, 53, 213, 0)", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
    //窗口自适应操作
    window.addEventListener('resize',this.resizeListener)
  },
  watch: {
    visitTrend() {
      this.chart.setOption({
        series: [
          {
            data: this.visitTrend,
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
.lineChart {
  width: 100%;
  height: 100%;
}
</style>