import React from "react";
import {AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceDot} from 'recharts';



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

    <div>
        <ResponsiveContainer>
            <AreaChart 
            data={allData} 
            onClick={handleChartClick}
            margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
            }}>

            <XAxis 
                dataKey="window_start" 
            />         

            <Area 
                type="monotone"
                dataKey="message_count" // alldata looks like { window_start: 0, message_count: 5 }, area is message_count
                stroke="#9147ff" 
                fillOpacity={1} 
                fill="url(#colorHype)" 
                isAnimationActive={false}
            />
            </AreaChart>
        </ResponsiveContainer>
    </div>
}

export default HypeChart;