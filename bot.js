require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const COMMUNITY_CHANNEL_ID = -1002298227994;

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const username = (msg.from.first_name || msg.from.last_name)
    ? `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim()
    : `@${msg.from.username}`;

  if (chatId === COMMUNITY_CHANNEL_ID || msg.chat.type === 'private') {
    bot.sendMessage(
      chatId,
      `Welcome ${username}!\n\nMatcha Bot is a community-engaging chatbot focused on meme coins that interacts with MatchaAI token holders, answering questions on trending topics, providing market analysis, and notifying users about market shifts based on sentiment scores.\n\nStay cool, stay ahead, stay $MATCHA 🍵`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Trending 🏄‍♂️', callback_data: 'trending' },
              { text: 'Sentiment 🍀', callback_data: 'sentiment' }
            ]
          ]
        }
      }
    );
  } else {
    console.log(`Received /start in a disallowed group chat: ${chatId}`);
  }
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text.trim().toLowerCase();

  if (userMessage === '/trending' || userMessage === '/sentiment') {
    bot.sendMessage(chatId, '🚧 This feature is coming soon!')
      .then((sentMsg) => {
        setTimeout(() => {
          bot.deleteMessage(chatId, sentMsg.message_id).catch(console.error);
        }, 5000);
      })
      .catch(console.error);
  } else if (userMessage !== '/start') {
    bot.sendMessage(chatId, '⚠️ Invalid command. Only /start is available for the moment.')
      .then((sentMsg) => {
        setTimeout(() => {
          bot.deleteMessage(chatId, msg.message_id).catch(console.error);
          bot.deleteMessage(chatId, sentMsg.message_id).catch(console.error);
        }, 8000);
      })
      .catch(console.error);
  }
});

bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;

  bot.answerCallbackQuery(callbackQuery.id, { text: '🚧 This feature is coming soon!' });

  bot.sendMessage(chatId, '🚧 This feature is coming soon!')
    .then((sentMsg) => {
      setTimeout(() => {
        bot.deleteMessage(chatId, sentMsg.message_id).catch(console.error);
      }, 5000);
    })
    .catch(console.error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

console.log("Bot is running...");
