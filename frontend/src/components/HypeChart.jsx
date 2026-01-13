import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import "../styles/HypeChart.css";


//The twitch embed expects time in something like 0h3m13s, rn we have total second so format it
const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds %3600) / 60);
    const s = totalSeconds % 60;

    return `${h}h${m}m${s}s`;
}



//Hypechart component
const HypeChart = ({ allData, spikes, onTimeSelect }) => {
  const option = useMemo(() => ({
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const p = params[0];
        return `Time: ${formatTime(p.data[0])}`;
      },
    },
    xAxis: {
      type: "value",
      min: allData.length > 0 ? allData[0].window_start : 0,
      max: allData.length > 0 ? allData[allData.length - 1].window_start : 100,
      axisLabel: { formatter: (v) => formatTime(v), interval: "auto"},
      splitLine: {show:false},
      boundaryGap: false,
    },
    yAxis: { 
      type: "value", 
      splitLine: { show: false }, //Dont show the white lines (splitline) in the back
      axisLabel: { show: false }, // Next 3 lines just get rid of the y-axis
      axisLine: { show: false },
      axisTick: { show: false },
      max: Math.max(...allData.map(d => d.message_count)) * 1.1,
    },
    dataZoom: [
      { type: "inside", filterMode: "none", show: false}, // Allow zooming
    ],
    series: [
      {
        type: "line",
        smooth: true,
        areaStyle: { color: "#9147ff44" },
        lineStyle: { color: "#9147ff", width: 1.3 },
        data: allData.map((d) => [d.window_start, d.message_count]),
        showSymbol: false, //Dont show dots for every datapoint..
      },
      {
        type: "scatter",
        z: 100, //Make the dots in front of everything
        symbolSize: 10,
        itemStyle: { color: "#fff", borderColor: "#9147ff", borderWidth: 3 },
        data: spikes.map((s) => [s.window_start, s.message_count]),
      },
    ],
  }), [allData, spikes]);

  if (!allData.length) return <div>No chart data</div>;

  return (
    <div className="chart-wrapper">
      <ReactECharts
        option={option}
        style={{ height: "280px", width: "100%" }}
        onEvents={{
          click: (e) => {
            if (e && e.value) onTimeSelect(e.value[0]);
          },
        }}
      />
    </div>
  );
};

export default HypeChart;