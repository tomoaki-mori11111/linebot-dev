'use strict';

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const Twitter = require('twitter');
const tw = new Twitter({
// 4つのキーの指定
  consumer_key: process.env.CONSUMER_KEY, // Consumer Key
  consumer_secret: process.env.CONSUMER_SECRET, // Consumer Secret
  access_token_key: process.env.ACCESS_TOKEN_KEY, // Access Token
  access_token_secret: process.env.ACCESS_TOKEN_SECRET // Access Token Secret
});
const TARGET_HASHTAG = '#TrainDelay';

const HOST = 'api.line.me';
const CH_SECRET = process.env.LINE_CH_SECRET; // Channel Secret
const CH_ACCESS_TOKEN = process.env.LINE_CH_ACCESS_TOKEN; // Channel Access Token
const USER_ID = process.env.LINE_USER_ID;// Your userId
const PUSH_PATH = '/v2/bot/message/multicast';
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = process.env.PORT || 3000; // ||で条件分岐

const pushClient = (userId, SendMessageObject) => {
    let postDataStr = JSON.stringify({ to: userId, messages: SendMessageObject });
    let options = {
        host: HOST,
        port: 443,
        path: PUSH_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Line-Signature': SIGNATURE,
            'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
            'Content-Length': Buffer.byteLength(postDataStr)
        }
    };

    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
                    let body = '';
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        body += chunk;
                    });
                    res.on('end', () => {
                        resolve(body);
                    });
        });

        req.on('error', (e) => {
            reject(e);
        });
        req.write(postDataStr);
        req.end();
    });
};

tw.stream('statuses/filter', {'track': TARGET_HASHTAG}, (stream) => {
  stream.on('data', (data) => {
    if (data.text.indexOf('TrainDelay') !== -1) {
        let PushSendMessageObject = [{
          type: 'text',
          text: data.text
        }];

        pushClient([USER_ID], PushSendMessageObject)
          .then((body) => {
            console.log(body);
          }, (e) => {console.log(e)});

        console.log(data.text);
    }
  });
});
