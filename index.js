const fs = require('fs');
const configFileName = './config.json';
const configFile = require(configFileName);
const { Client, Events, GatewayIntentBits } = require('discord.js');

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

client.login(configFile.token);
console.log("List of worms: " + configFile.worms);
