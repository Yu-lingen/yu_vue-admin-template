<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <i class="el-icon-warning-outline"></i>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["title", "count", "footer"],
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #adabab;
}
.card-content {
  font-size: 24px;
  padding-top: 5px;
}
.card-charts {
  height: 50px;
  padding-top: 10px;
}
.card-footer {
  border-top: 1px solid #c7c5c5;
  padding-top: 10px;
}
/* icon */
.el-icon-caret-top {
  color: red;
}
</style>