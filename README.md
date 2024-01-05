# Worm Eater
A discord bot made to get people to lose bad vocabulary through positive reinforcement.
## What it does
When a user who is set to be watched sends a message, it will be checked to see if it contains any bad words. If it does, the user will be told off with a custom message. They bot will also tell them the amount of times they've sent a message with a bad word on that day.\
Each day at 6am the bot checks if a user to watch has had a streak of 1 day or longer without saying a bad word. If they do, it will them their streak with a positive message, encouraging them to keep it up.
## Setup
1. Clone this repository: `git clone https://github.com/like4schnitzel/worm-eater`
2. Create a file called `config.json`
3. Write the following content to the config file and adjust the fields:
    ```json
    {
        "token": "your-token-here",
        "worms": [
            "list",
            "of",
            "bad",
            "words"
        ],
        "wormedPeople": [
            {
                "id": "012345678901234567",
                "badResponse": "Bad! Don't say that!",
            },
            {
                "id": "123456789012345678",
                "badResponse": "Don't say that word! It's bad for you!",
            }
        ],
        "successMessage": "Good job, {ping}, you've spent {time} days without saying a bad word!",
        "successMessageChannels": [
            "0123456789012345678",
            "1234567890123456789"
        ]
    }
    ```
    Field explanations:
    - token: The token of your discord bot account.
    - worms: Bad words you want to watch out for.
    - wormedPeople: People you want to watch.
        - id: The user ID of the person.
        - badResponse: The message the user will be told off with if they say a bad word.
    - successMessage: The message that gets sent when someone hasn't said a bad word for a day or longer. `{ping}` is replaced with a ping to the person. `{time}` is replaced with the amount of days they have abstained.
    - successMessageChannels: Channel IDs you want to send encouraging messages to at 6am.
4. Install node packages: `npm install`
5. Run the thing `node index.js`
