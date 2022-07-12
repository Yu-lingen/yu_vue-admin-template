<template>
  <div>
    <el-card class="box-card">
      <!-- 左侧表格区域 -->
      <div slot="header" class="clearfix">
        <!-- @tab-click="handleClick" -->
        <!-- 头部左侧内容 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <!-- v-model="value1" -->
          <el-date-picker
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="date"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </div>
      </div>
      <!-- 图标内容区域 -->
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <!-- 准备一个容器 -->
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <div v-if="activeName=='sale'" class="right_content">
              <h3>门店{{ title }}排名</h3>
              <ul>
                <li v-for="listData in listData.orderRank" :key="listData.no">
                  <span>{{listData.no}}</span>
                  <span>{{listData.name}}</span>
                  <span class="rvalue">{{listData.money}}</span>
                </li>
              </ul>
            </div>
            <div v-else class="right_content">
              <h3>门店{{ title }}排名</h3>
              <ul>
                <li v-for="listData in listData.userRank" :key="listData.no">
                  <span>{{listData.no}}</span>
                  <span>{{listData.name}}</span>
                  <span class="rvalue">{{listData.money}}</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
//引入echarts
import echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myChart: null,
      date: [],
    };
  },
  mounted() {
    this.myChart = echarts.init(this.$refs.charts);
    this.myChart.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          color: "#5470c6",
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [],
        },
      ],
    });
    //窗口自适应操作
    window.addEventListener('resize',this.resizeListener)
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({ listData: (state) => state.home.list }),
  },
  watch: {
    title() {
      this.myChart.setOption({
        title: {
          text: `${this.title}趋势`,
        },
        xAxis: {
          data:
            this.activeName == "sale"
              ? this.listData.userFullYearAxis
              : this.listData.orderFullYearAxis,
        },
        series: [
          {
            data:
              this.activeName == "sale"
                ? this.listData.userFullYear
                : this.listData.orderFullYear,
          },
        ],
      });
    },
    //通过监听listData数据，当服务器一返回数据，即一有数据，就马上配置图标的默认数据（一开始图标没有数据，mounted挂载的时候加载且只加载一次，一开始数据为空对象）
    listData() {
      this.myChart.setOption({
        title: {
          text: "销售额趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.listData.userFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            color: "#5470c6",
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data: this.listData.userFullYear,
          },
        ],
      });
    },
  },
  methods: {
    // 获取今日
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    //获取本周
    setWeek() {
      const start = dayjs().day(0).format("YYYY-MM-DD");
      const end = dayjs().day(6).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //获取本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //获取本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //定义addEventListener回调函数
    resizeListener(){
      this.myChart.resize();
    }
  },
  destroyed(){
    window.removeEventListener('resize',this.resizeListener);
  }
};
</script>

<style>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.clearfix .el-tabs {
  width: 100%;
}
.clearfix .right {
  position: absolute;
  right: 0px;
}
.right span {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
.right_content ul {
  list-style: none;
  padding: 0px;
  width: 100%;
  height: 300px;
}
.right_content ul li {
  margin: 5px 0px;
  height: 8%;
}
.right_content ul li span {
  margin: 0px 10px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  color: white;
  text-align: center;
}
.nindex {
  float: left;
  width: 20px;
  height: 20px;
  text-align: center;
}
.rvalue {
  float: right;
}
.box-card {
  margin: 10px 0;
}
</style>