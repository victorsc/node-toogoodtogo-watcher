const notifier = require('node-notifier');
const { config } = require('./config');
const telegramBot = require('./telegram-bot');
const cache = {};
const businessCache = {};
module.exports = {
    notifyIfChanged
};

function notifyIfChanged(businesses) {
    const options = config.get('notifications');
    businesses.map(business => {
        if (businessCache[business.id] !== business.todays_stock) {
            businessCache[business.id] = business.todays_stock;
            let message = createMessage(business, businessCache[business.id] < business.todays_stock);
            if (options.console.enabled) {
                notifyConsole(message, options.console);
            }
        
            if(options.desktop.enabled){
                notifyDesktop(message)
            }
            if(options.telegram.enabled){
                telegramBot.notify(message);
            }
        }
        
    });
}

function notifyConsole(message, options){
    if(options.clear){
        console.clear();
    }
    console.log(message + '\n');
}

function notifyDesktop(message){
    notifier.notify({ title: 'TooGoodToGo', message });
}

function createMessage(business, restock) {
    return ` ${restock ? '[RESTOCK]' : ''} ${business.business_name} - ${business.todays_stock}`;
}