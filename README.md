<img src="/public/images/bumblebee-bot-transformers.jpg" width="200" title="BumblebeeBot Logo">

# bumblebee-bot
Generate realtime driver bot with random trips.

## Requirements

[Node.js](https://nodejs.org/en/), tested with version 7.0.0.
We recomand the utilisation of [nvm](https://github.com/creationix/nvm).

Install MongoDB

Install Redis

## Instalation

    npm install

## Configuration

add a .env files in root directory

```
GOOGLE_API_KEY=xxx
MONGODB_URI=mongodb://localhost/bumblebee
REDIS_URL=redis://127.0.0.1:6379/
PORT=3000
```

## Launch

    npm start
