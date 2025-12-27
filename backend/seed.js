const { User, Kick, sequelize } = require('./models');
const { v4: uuidv4 } = require('uuid');

async function seedData() {
    try {
        // 1. Find the first user (or create a test one if none exists)
        let user = await User.findOne();
        if (!user) {
            console.log('No user found. Creating a test user...');
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('test123', 10);
            user = await User.create({
                email: 'test@gmail.com',
                password: hashedPassword,
                name: 'Test Mama'
            });
            console.log('Test user created: test@gmail.com / test123');
        }

        console.log(`Seeding 9 months (270 days) of history for user: ${user.email}`);

        // 2. Clear existing kicks for this user to start fresh (optional)
        await Kick.destroy({ where: { UserId: user.id } });

        const kicksToCreate = [];
        const today = new Date();

        for (let i = 0; i < 270; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);

            // Random number of kicks between 5 and 15
            const numKicks = Math.floor(Math.random() * 11) + 5;

            for (let j = 0; j < numKicks; j++) {
                // Random time during the day
                const kickTime = new Date(date);
                kickTime.setHours(Math.floor(Math.random() * 14) + 8); // Kicks between 8 AM and 10 PM
                kickTime.setMinutes(Math.floor(Math.random() * 60));
                kickTime.setSeconds(Math.floor(Math.random() * 60));

                kicksToCreate.push({
                    id: uuidv4(),
                    timestamp: kickTime,
                    UserId: user.id
                });
            }
        }

        await Kick.bulkCreate(kicksToCreate);
        console.log(`Successfully added ${kicksToCreate.length} kicks over 270 days!`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}

seedData();
