const fs = require('fs');
const cron = require('cron');
const configFileName = './config.json';
const configFile = require(configFileName);
const { Client, Events, GatewayIntentBits } = require('discord.js');
const unixDay = 86400;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

function updateConfig() {
    fs.writeFile(configFileName, JSON.stringify(configFile, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
    })
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
    // see if the message needs to be checked
    for (const person of configFile.wormedPeople) {
        if (message.author.id === person.id) {
            // check if it contains any worms
            for (const worm of configFile.worms) {
                if (message.content.toUpperCase().includes(worm.toUpperCase())) {
                    person.latestWorm = message.createdTimestamp;
                    person.wormsToday++;
                    message.reply(person.badResponse + " This is worm number " + person.wormsToday + " of the day.");
                    updateConfig();
                    break;
                }
            }
            break;
        }
    }
})

// send message giving an update on abstinence every day at 6am
// also resets daily worm count for everyone
const scheduledSuccessMessages = new cron.CronJob("0 6 * * *", () => {
    console.log("Called scheduledSuccessMessages.");
    // unix timestamp for right now
    const currentTime = Math.floor(Date.now() / 1000);

    for (const id of configFile.successMessageChannels) {
        const channel = client.channels.cache.get(id);
        for (const person of configFile.wormedPeople) {
            const daysWithoutWorms = Math.floor((currentTime - person.latestWorm) / unixDay);
            if (daysWithoutWorms >= 1) {
                channel.send(
                    "<@" +
                    person.id +
                    ">, you've spent " +
                    daysWithoutWorms + 
                    " whole days without brainworms! Good job, keep it up!! Be proud of yourself!!"
                );
            }
        }
    }

    for (const person of configFile.wormedPeople) {
        person.wormsToday = 0;
    }
    updateConfig();
});
scheduledSuccessMessages.start();

client.login(configFile.token);
