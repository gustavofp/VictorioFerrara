const config = require('./config.js')
const request = require('request')
const translate = require('google-translate-api');
require('dotenv').config()

const twitterAPI = require('node-twitter-api');

const twitter = new twitterAPI({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callback: 'http://yoururl.tld/something'
});

const TOKEN = process.env.TOKEN
const TOKEN_SECRET = process.env.TOKEN_SECRET

const tweets = {}

const postStatus = status => {
    twitter.statuses("update", {
            status
        },
        TOKEN,
        TOKEN_SECRET,
        (error, data, response) => {
            if (error) {
              console.log('error:', error)
            } else {
                console.log('status posted')
            }
        }
    );
}

const verifyTweet = tweet => {
    if(tweet == tweets.last){
        return false
    }else {
        return true
    }
}

const verifyReply = tweet => {
    if(tweet.indexOf("@")){
        return false
    } else {
        return true
    }
}

const translateTweet = tweet => {
    return translate(tweet, {from: 'pt', to: 'it'})
    .then(res => res.text)
    .catch(err => err);
}

const getTimeline = () => {
    let isNewTweet = false
    let isReply = false
    let tweet

    twitter.getTimeline("user_timeline", {
            screen_name: 'victorlfc_',
            include_entities: true,
            include_rt: false,
            count: 1
        },
        TOKEN,
        TOKEN_SECRET,
        (error, data, response) => {
                //isNewTweet = verifyTweet(data[0].text)
                isReply = verifyReply(data[0].text)

                if(!isReply){
                    translateTweet(data[0].text).then(res => {
                         postStatus(res)
                         tweets.last = data[0].text
                    })
                }
        }
    );

}
setInterval(() => { 
    getTimeline()
}, 60000)