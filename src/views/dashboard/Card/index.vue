<template>
  <div>
    <el-row :gutter="10">
      <!-- 第一个Card -->
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" :count="listData.salesTotal">
            <template slot="charts">
              <span>月同比{{ listData.salesGrowthLastMonth }}%</span>
              &nbsp;&nbsp;&nbsp;
              <i
                v-if="listData.salesGrowthLastMonth > 0"
                class="el-icon-caret-top"
              ></i>
              <i v-else class="el-icon-caret-bottom" style="color: #16d516"></i>
              &nbsp;&nbsp;&nbsp;
              <span>日同比 {{ listData.salesGrowthLastDay }}%</span>
              &nbsp;&nbsp;&nbsp;
              <i
                v-if="listData.salesGrowthLastDay > 0"
                class="el-icon-caret-top"
              ></i>
              <i v-else class="el-icon-caret-bottom" style="color: #16d516"></i>
            </template>
            <template slot="footer">
              <span>日销售额￥ {{ listData.salesToday }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第二个Card -->
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" :count="listData.visitTotal">
            <template slot="charts">
              <lineChart :visitTrend="listData.visitTrend"></lineChart>
            </template>
            <template slot="footer">
              <span>日均访问量 {{ listData.visitToday }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第三个Card -->
      <el-col :span="6">
        <el-card>
          <Detail title="支付额度" :count="listData.payTotal">
            <template slot="charts">
              <barChart :payTrend="listData.payTrend"></barChart>
            </template>
            <template slot="footer">
              <span>转换率 {{ listData.payRate }}%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第四个Card -->
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" :count="activityRate">
            <template slot="charts">
              <progressChart
                :activityRate="listData.activityRate"
              ></progressChart>
            </template>
            <template slot="footer">
              <span>月同比 {{ listData.activityGrowthLastMonth }}%</span>
              &nbsp;&nbsp;&nbsp;
              <i
                v-if="listData.activityGrowthLastMonth > 0"
                class="el-icon-caret-top"
              ></i>
              <i v-else class="el-icon-caret-bottom" style="color: #16d516"></i>
              &nbsp;&nbsp;&nbsp;
              <span>日同比 {{ listData.activityGrowthLastDay }}%</span>
              &nbsp;&nbsp;&nbsp;
              <i
                v-if="listData.activityGrowthLastDay > 0"
                class="el-icon-caret-top"
              ></i>
              <i v-else class="el-icon-caret-bottom" style="color: #16d516"></i>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import lineChart from "./lineChart";
import barChart from "./barChart";
import progressChart from "./progressChart";
import { mapState } from "vuex";

export default {
  name: "Card",
  computed: {
    activityRate() {
      return `${this.listData.activityRate}%`;
    },
    ...mapState({ listData: (state) => state.home.list }),
  },
  components: {
    Detail,
    lineChart,
    barChart,
    progressChart,
  },
};
</script>

<style>
</style>