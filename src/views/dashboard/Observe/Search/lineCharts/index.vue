<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <i class="el-icon-warning-outline"></i>
    </div>
    <div class="main">
      <span class="search-main-text">12321</span>
      <span>{{ searchData }}</span>
      <i v-if="searchData > 0" class="el-icon-caret-top"></i>
      <i v-else class="el-icon-caret-bottom"></i>
    </div>
    <div class="footer">
      <!-- 折线图容器 -->
      <div class="charts" ref="lineChart"></div>
    </div>
  </div>
</template>

<script>
// 引入echarts
import echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      searchData: 17.1,
      charts: null
    };
  },
  methods:{
    resizeListener(){
      this.charts.resize();
    }
  },
  // 组件挂载完毕(真实dom生成)的时候
  mounted() {
    // 初始化echarts
    this.charts = echarts.init(this.$refs.lineChart);
    //echarts的配置项options
    this.charts.setOption({
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
          data: [5, 10, 8, 11, 15, 6, 15, 12, 2, 20],
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
    window.addEventListener("resize",this.resizeListener);
  },
  destroyed(){
    window.removeEventListener('resize',this.resizeListener);
  }
};
</script>

<style scoped>
.search-header {
  margin-right: 10px;
}
.main {
  margin: 10px 0px;
}
.search-main-text {
  font-size: 21px;
  margin-right: 20px;
}
.charts {
  width: 100%;
  height: 80px;
}

/* icon */
.el-icon-caret-bottom {
  color: red;
}
.el-icon-caret-top {
  color: green;
}
</style>