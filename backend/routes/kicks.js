const express = require('express');
const router = express.Router();
const { Kick } = require('../models');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// GET /kicks?date=YYYY-MM-DD
router.get('/', auth, async (req, res) => {
    try {
        const { date } = req.query;
        let whereClause = { UserId: req.user.id };

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            whereClause.timestamp = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        const kicks = await Kick.findAll({
            where: whereClause,
            order: [['timestamp', 'DESC']]
        });
        res.json(kicks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /kicks
router.post('/', auth, async (req, res) => {
    try {
        const { timestamp, note } = req.body;
        const kick = await Kick.create({
            timestamp: timestamp || new Date(),
            note,
            UserId: req.user.id
        });
        res.json(kick);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /kicks/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const kick = await Kick.findOne({
            where: { id: req.params.id, UserId: req.user.id }
        });
        if (!kick) return res.status(404).json({ message: 'Kick not found' });

        await kick.destroy();
        res.json({ message: 'Kick removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /kicks/stats (History of daily totals)
router.get('/stats', auth, async (req, res) => {
    try {
        const kicks = await Kick.findAll({
            where: { UserId: req.user.id },
            order: [['timestamp', 'ASC']]
        });

        const dailyStats = {};
        kicks.forEach(kick => {
            const date = kick.timestamp.toISOString().split('T')[0];
            dailyStats[date] = (dailyStats[date] || 0) + 1;
        });

        const result = Object.keys(dailyStats).map(date => ({
            date,
            count: dailyStats[date]
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
