<template>
  <div class="container">
    <div id="map" style="width:100%; height: 100%;"></div>
    <div class="overlay">
      <el-button type="primary" @click="showBarChart">切换示图</el-button>
    </div>
    <el-dialog title="内容切换" :visible.sync="dialogVisible">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="条形统计图" name="bar-chart">
          <div id="bar-chart" style="width: 662px; height: 400px;"></div>
        </el-tab-pane>
        <el-tab-pane label="折线统计图" name="line-chart">
          <div id="line-chart" style="width: 662px; height: 400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat/dist/leaflet-heat.js";
import axios from "axios";
import * as echarts from "echarts";

export default {
  data() {
    return {
      mapData: [],
      dialogVisible: false,
      activeTab: "bar-chart",
    };
  },
  mounted() {
    this.getCityData();
    console.log('数据:', this.mapData);
  },
  methods: {
    async getCityData() {
      try {
        const response = await axios.post(`http://localhost:9093/Node/findAllCity`);
        if (Array.isArray(response.data.object)) {
          response.data.object.forEach(node => {
            const newNode = {
              address: node.name,
              value: node.count
            };
            this.mapData.push(newNode);
          });
          // 数据加载完成后再初始化地图和绘制热力图
          await this.initializeMapAndHeatMap();
        } else {
          console.error(`错误：响应数据.object不是数组`);
        }
      } catch (error) {
        console.error(`获取节点数据时出错:`, error);
      }
    },
    async initializeMapAndHeatMap() {
      // 初始化地图和绘制热力图
      await this.getHeatMapData();
    },
    async getHeatMapData() {
      const locations = await Promise.all(
          this.mapData.map(async item => {
            const url = `https://restapi.amap.com/v3/geocode/geo?key=283af546a3edafa4ee145d9bdd3691ef&address=${encodeURIComponent(
                item.address
            )}`;
            const response = await axios.get(url);
            const data = response.data;
            if (data.status === "1" && data.geocodes.length > 0) {
              const location = data.geocodes[0].location.split(",");
              return [
                parseFloat(location[1]),
                parseFloat(location[0]),
                item.value
              ];
            }
            return null;
          })
      );

      const map = L.map("map").setView([35.8617, 104.1954], 4);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18
      }).addTo(map);

      const heatData = locations.filter(location => location !== null);

      const heatOptions = {
        radius: 20,
        max: 1.0,
        gradient: {
          0: "blue",
          0.10: "green",
          0.15: "yellow",
          0.20: "red"
        }
      };

      L.heatLayer(heatData, heatOptions).addTo(map);
    },

    showBarChart() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        const barChartContainer = document.getElementById("bar-chart");
        const barChart = echarts.init(barChartContainer);

        const barOption = {
          title: {
            text: "迷路指数条形统计图"
          },
          tooltip: {},
          dataZoom: [
            {
              type: 'slider', // 设置为滑动条
              show: true,
              xAxisIndex: [0], // 仅对横坐标生效
              start: 0, // 初始的起始位置
              end: 20, // 初始的结束位置
              handleSize: 30, // 滑动条的大小
              filterMode: 'empty' // 拖动时值域过滤模式，'filter' 或 'empty'，此处设置为 'empty' 保证可以滑动整个图表
            },
            {
              type: 'inside', // 设置为内置型
              xAxisIndex: [0], // 仅对横坐标生效
              start: 0, // 初始的起始位置
              end: 20 // 初始的结束位置
            }
          ],
          xAxis: {
            type: "category",
            data: this.mapData.map(item => item.address), // 使用 mapData 的 address 数据作为横坐标
            axisLabel: {
              interval: 0, // 设置坐标轴标签全部显示，防止过多
              rotate: -45, // 设置标签旋转角度以防止重叠
            },
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "数据",
              type: "bar",
              data: this.mapData.map(item => item.value) // 使用 mapData 的 value 数据作为纵坐标
            }
          ],
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          }
        };

        barChart.setOption(barOption);

        const lineChartContainer = document.getElementById("line-chart");
        const lineChart = echarts.init(lineChartContainer);

        const lineOption = {
          title: {
            text: "迷路指数折线统计图"
          },
          tooltip: {},
          dataZoom: [
            {
              type: 'slider', // 设置为滑动条
              show: true,
              xAxisIndex: [0], // 仅对横坐标生效
              start: 0, // 初始的起始位置
              end: 20, // 初始的结束位置
              handleSize: 30, // 滑动条的大小
              filterMode: 'empty' // 拖动时值域过滤模式，'filter' 或 'empty'，此处设置为 'empty' 保证可以滑动整个图表
            },
            {
              type: 'inside', // 设置为内置型
              xAxisIndex: [0], // 仅对横坐标生效
              start: 0, // 初始的起始位置
              end: 20 // 初始的结束位置
            }
          ],
          xAxis: {
            type: "category",
            data: this.mapData.map(item => item.address), // 使用 mapData 的 address 数据作为横坐标
            axisLabel: {
              interval: 0, // 设置坐标轴标签全部显示，防止过多
              rotate: -45, // 设置标签旋转角度以防止重叠
            },
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "数据",
              type: "line",
              data: this.mapData.map(item => item.value) // 使用 mapData 的 value 数据作为纵坐标
            }
          ],
          grid: {
            left: '10%',
            right: '10%'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          }
        };

        lineChart.setOption(lineOption);
      });
    }
  }
};
</script>

<style>
/* 重置浏览器默认样式 */
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.container {
  height: 100%;
  width: 100%;
}

#map {
  height: 90%;
}

.overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

/* 调整滑动框的高度 */
.echarts[data-zr-dom-id="2"] .zr-element {
  height: 30px; /* 自定义高度 */
}
</style>