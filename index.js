import fs from 'fs';
import cron from 'cron';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import configFile from './config.json' assert { type: 'json' };
const db = fs.existsSync('./db.json') ? JSON.parse(fs.readFileSync('./db.json', { encoding: 'utf8' })) : {};
const unixDay = 86400000;  // amount of miliseconds in a day

for (let i = 0; i < configFile.worms.length; i++) {
    configFile.worms[i] = configFile.worms[i].toUpperCase();
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

function updateDB() {
    fs.writeFile('./db.json', JSON.stringify(db, null, 4), function writeJSON(err) {
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
            if (message.content.toUpperCase().replace(/[^A-Z ]/g, '').split(' ').some((v) => configFile.worms.includes(v))) {
                // check if a db entry for this person already exists
                // if not, create one
                if (!db[person.id]) {
                    db[person.id] = {
                        latestWorm: 0,
                        wormsToday: 0
                    }
                }
                db[person.id].latestWorm = message.createdTimestamp;
                db[person.id].wormsToday++;
                message.reply(person.badResponse + " This is worm number " + db[person.id].wormsToday + " of the day.");
                updateDB();
                break;
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
    const currentTime = Date.now();

    for (const id of configFile.successMessageChannels) {
        const channel = client.channels.cache.get(id);
        for (const person of configFile.wormedPeople) {
            if (db[person.id]) {
                const daysWithoutWorms = Math.floor((currentTime - db[person.id].latestWorm) / unixDay);
                if (daysWithoutWorms >= 1) {
                    channel.send(
                        configFile.successMessage
                            .replace("{ping}", "<@" + person.id + ">")
                            .replace("{time}", daysWithoutWorms)
                    );
                }
            }
        }
    }

    for (const person of configFile.wormedPeople) {
        if (db[person.id])
            db[person.id].wormsToday = 0;
    }
    updateDB();
});
scheduledSuccessMessages.start();

client.login(configFile.token);
