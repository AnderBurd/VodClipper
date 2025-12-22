import React from "react";



//The twitch embed expects time in something like 0h3m13s, rn we have total second so format it
const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds %3600) / 60);
    const s = totalSeconds % 60;

    return `h${h}${m}m${s}s`;
}