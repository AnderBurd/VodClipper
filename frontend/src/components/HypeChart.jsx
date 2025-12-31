import React from "react";
import {AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceDot} from 'recharts';
import '../styles/HypeChart.css'


//The twitch embed expects time in something like 0h3m13s, rn we have total second so format it
const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds %3600) / 60);
    const s = totalSeconds % 60;

    return `${h}h${m}m${s}s`;
}

//Hypechart component
const HypeChart = ({allData, spikes, onTimeSelect}) => {
    // This function runs when someone clicks a spot on the chart, state is made by recharts when clicked
    const handleChartClick = (state) => {
        if (state && state.activeLabel) {
            // state.activeLabel is the 'window_start' value of the spot clicked
            onTimeSelect(state.activeLabel);
        }
    }
    if (!allData.length) return <div>No chart data</div>;

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={allData}
          onClick={handleChartClick}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {/*Shiny effect*/}
          <defs>
            <linearGradient id="colorHype" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9147ff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#9147ff" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/*x axis label, show formatted time*/}
          <XAxis dataKey="window_start" tickFormatter={formatTime} />
          {/*The tool tip that appears when you hover over the graph*/}
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div style={{
                    backgroundColor: "#18181b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "8px 12px"
                  }}>
                    Time: {formatTime(payload[0].payload.window_start)}
                  </div>
                );
              }
              return null;
            }}
          />

          {/*Draw the graph with the message counts*/}
          <Area
            type="monotone"
            dataKey="message_count"
            stroke="#9147ff"
            fillOpacity={1}
            fill="url(#colorHype)"
            isAnimationActive={false}
          />
          
          {/*Draw dots to show the spikes*/}
          {spikes.map((spike, idx) => (
            <ReferenceDot
              key={idx}
              x={spike.window_start}
              y={spike.message_count}
              r={6}
              fill="#fff"
              stroke="#9147ff"
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default HypeChart;