<template>
  <div id="mapContainer" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'MapComponent',
  data() {
    return {
      china: [
        {name: '河北', value: 151},
        {name: '山西', value: 79},
        {name: '上海', value: 317},
        {name: '广西', value: 93},
        {name: '广东', value: 433},
        {name: '浙江', value: 291},
        {name: '陕西', value: 162},
        {name: '湖北', value: 242},
        {name: '江西', value: 65},
        {name: '甘肃', value: 40},
        {name: '江苏', value: 325},
        {name: '辽宁', value: 81},
        {name: '安徽', value: 277},
        {name: '海南', value: 41},
        {name: '河南', value: 278},
        {name: '山东', value: 311},
        {name: '福建', value: 148},
        {name: '四川', value: 236},
        {name: '重庆', value: 313},
        {name: '吉林', value: 54},
        {name: '云南', value: 110},
        {name: '北京', value: 301},
        {name: '新疆', value: 51},
        {name: '宁夏', value: 27},
        {name: '香港', value: 32},
        {name: '天津', value: 45},
        {name: '湖南', value: 193},
        {name: '黑龙江', value: 40},
        {name: '内蒙古', value: 40},
        {name: '贵州', value: 104},
        {name: '青海', value: 8},
        {name: '西藏', value: 6},
        {name: '台湾', value: 9},
        {name: '澳门', value: 17}
      ]
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const chart = echarts.init(document.getElementById('mapContainer'));
      echarts.registerMap('china', require('@/assets/china.json'));
      const option = {
        tooltip: {},
        visualMap: {
          min: 0,
          max: 440,
          splitNumber: 5,
          inRange: {
            color: ['#d94e5d', '#eac736', '#50a3ba'].reverse()
          },
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '中国省市微博迷路信息地图',
            type: 'map',
            map: 'china',
            roam: true,
            itemStyle: {
              emphasis: {
                areaColor: "grey"
              }
            },
            label: {
              show: true
            },
            data: this.china
          }
        ]
      };
      chart.setOption(option);
    }
  }
};
</script>