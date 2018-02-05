'use strict';

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const Twitter = require('twitter');
const tw = new Twitter({
// Twitterの4つのキーを指定
  consumer_key: 'dR3eWhizC9aloijwMF8WwpIv7', // Consumer Keyを記述
  consumer_secret: 'WhkCcinF8HIvZEZfymTRplZ231usgHhpxUHMwg6KMp1cTYKuOX', // Consumer Secretを記述
  access_token_key: '542173666-krGq8D6LROv6mWfrIUOy3J6dUiG4Ll8Cb9MhhJuN', // Access Tokenを記述
  access_token_secret: 'QmZAx5VPEJT709IlEAE6gy6KYqEmW0tL3nWoIBw3MiJZc' // Access Token Secretを記述
});
const TARGET_HASHTAG = '#xrp';

const HOST = 'api.line.me';
const CH_SECRET = 'c092cd24c7204931d2e0409dd57926f1'; // Channel Secretを記述
const CH_ACCESS_TOKEN = 'sT+g87Zf9no4a9MRMs6jgozryK412Rz3ghoj25cxAXxVioRtcsnJrOeGarlPUR/iyutFMjxLKsXFqKPsEqVWXP9tpO8SD6wbo4s8pEng9gnVwTIJqAix/xXcoLI/mfJVryspaXS+ObudeNVlhQ8G4AdB04t89/1O/w1cDnyilFU='; // Channel Access Tokenを記述
const USER_ID = 'U21a4f0968fb4fcb6d9a8741316b45537'; // Your userIdを記述
const PUSH_PATH = '/v2/bot/message/multicast';
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = 3000;

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
    if (data.text.indexOf('xrp') !== -1) {
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
