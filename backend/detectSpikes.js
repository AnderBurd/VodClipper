const knex = require('knex')(require('./knexfile').development);

//Returns list of objects with the timestamp and message count within that window
async function getSpikes(analysisId, windowSize = 10) {
    return knex('chat_message')
        .select(knex.raw(`(time_s / ?) * ? AS window_start`, [windowSize, windowSize]))
        .count('* as message_count')
        .where('vod_analysis_id', analysisId)
        .groupBy('window_start')
        .orderBy('window_start', 'asc');
}

//Do a z-test
async function getStandardDeviationSpikes(analysisId, thresholdZ = 2) {
    const rawData = await getSpikes(analysisId, 10); // Get our 10s buckets
    const counts = rawData.map(d => parseInt(d.message_count));

    if (counts.length === 0) return { stats: null, spikes: [], allData: [] };

    const spikes = [];
    //We'll compare against 30 buckets before and after, each bucket is 10s so 60*10 = (10 mins)
    const windowRadius = 30;

    //Check each 10s bucket
    for (let i = 0; i < rawData.length; i++) {
        // Grab this part of the time range
        const start = Math.max(0, i - windowRadius);
        const end = Math.min(rawData.length, i + windowRadius);
        const thisChunk = counts.slice(start, end);

        //Calculate Mean and StdDev
        const mean = thisChunk.reduce((a, b) => a + b, 0) / thisChunk.length;
        const variance = thisChunk.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / thisChunk.length;
        const std = Math.sqrt(variance) || 1;

        const currentCount = counts[i];
        //This is the z test (the x - mew over std formula)
        const zScore = (currentCount - mean) / std;

        if (zScore > thresholdZ && currentCount > mean) {
            spikes.push({
                ...rawData[i],
                zScore: zScore.toFixed(2),
                localMean: mean.toFixed(2)
            });
        }
    }
    return {
        stats: { method: "Sliding Window Z-Score", windowSize: "10m" },
        spikes: spikes,
        allData: rawData
    };
}


module.exports = { getStandardDeviationSpikes };