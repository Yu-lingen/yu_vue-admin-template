<template>
  <div>
    <Card></Card>
    <Sale></Sale>
    <Observer></Observer>
  </div>
</template>

<script>
//引入Card组件，引入Sale组件,Observer组件
import Card from './Card';
import Sale from './Sale';
import Observer from './Observe';


export default {
  name:'',
  components:{
    Card,
    Sale,
    Observer,
  },
  mounted(){
    this.$store.dispatch('getData');
  }
}
</script>

<style scoped>

</style>