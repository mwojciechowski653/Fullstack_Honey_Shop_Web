const {getAdminStats} = require('../services/statsService');


async function getStats(req, res) {
    try {
        const stats = await getAdminStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error getting stats:', error.message);
        res.status(500).json({error: 'Internal server error'});
    }
}

module.exports = { getStats };