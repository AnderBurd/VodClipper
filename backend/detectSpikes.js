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

    // Calculate Mean, x bar
    const mean = counts.reduce((a, b) => a + b) / counts.length;

    //Calculate Variance
    const variance = counts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / counts.length;

    //Calculate Standard Deviation
    const stdDev = Math.sqrt(variance);

    //Filter for Spikes (z-score > threshold)
    const spikes = rawData.filter(d => {
        const zScore = (parseInt(d.message_count) - mean) / (stdDev || 1); 
        return zScore > thresholdZ;
    });

    return {
        stats: {
            mean: mean.toFixed(2),
            stdDev: stdDev.toFixed(2),
            totalWindows: rawData.length,
            spikeCount: spikes.length
        },
        spikes: spikes,     // Spikes moments
        allData: rawData   //Everything
    };
}


module.exports = { getStandardDeviationSpikes };