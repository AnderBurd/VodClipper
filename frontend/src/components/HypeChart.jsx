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
      axisLabel: { formatter: (v) => formatTime(v) },
      splitLine: {show:false},
      splitNumber: 15
    },
    yAxis: { 
      type: "value", 
      splitLine: { show: false }, //Dont show the white lines (splitline) in the back
      axisLabel: { show: false }, // Next 3 lines just get rid of the y-axis
      axisLine: { show: false },
      axisTick: { show: false },
      min: 0,
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
        showSymbol: false,
      },
      {
        type: "scatter",
        z: 100, //Make the dots in front of everything
        symbolSize: 10,
        itemStyle: { color: "#fff", borderColor: "#9147ff", borderWidth: 2 },
        data: spikes.map((s) => [s.window_start, s.message_count]),
      },
    ],
  }), [allData, spikes]);

  if (!allData.length) return <div>No chart data</div>;

  return (
    <div className="chart-wrapper">
      <ReactECharts
        option={option}
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