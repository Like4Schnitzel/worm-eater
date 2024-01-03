const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, worms, wormedPeople } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, (message) => {
    // see if the message needs to be checked
    for (const person of wormedPeople) {
        if (message.author.id === person.id) {
            // check if it contains any worms
            for (const worm of worms) {
                if (message.content.toUpperCase().includes(worm.toUpperCase())) {
                    message.reply(person.badResponse);
                    break;
                }
            }
            break;
        }
    }
})

client.login(token);
console.log("List of worms: " + worms);
