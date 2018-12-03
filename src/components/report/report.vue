<template>
  <el-card>
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <div id="main" style="width: 1200px;height:500px; margin-top:50px;"></div>
  </el-card>
</template>

<script>
var echarts = require('echarts');
export default {
data(){
  return{

  }
},
mounted(){
this.useEchart()
},
methods:{
  async useEchart(){
var myChart = echarts.init(document.getElementById('main'));
// 发送请求获取表格里面的数据，因为后台是有一些数据的
const res = await this.$http.get(`reports/type/1`);
console.log(res)
let option2 = res.data.data;

// 指定图标，官方文档上面的数据
let option1= {
    title: {
        text: '我设置写的第一个ECharts表格，开心'
    },
    tooltip: {
      trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    }
};
let option = {...option1,...option2}
myChart.setOption(option);
  }
}
}
</script>

<style>

</style>
