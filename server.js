'use strict';

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const Twitter = require('twitter');
const tw = new Twitter({
<<<<<<< HEAD
// Twitter��4�̃L�[���w��
  consumer_key: 'dR3eWhizC9aloijwMF8WwpIv7', // Consumer Key���L�q
  consumer_secret: 'WhkCcinF8HIvZEZfymTRplZ231usgHhpxUHMwg6KMp1cTYKuOX', // Consumer Secret���L�q
  access_token_key: '542173666-krGq8D6LROv6mWfrIUOy3J6dUiG4Ll8Cb9MhhJuN', // Access Token���L�q
  access_token_secret: 'QmZAx5VPEJT709IlEAE6gy6KYqEmW0tL3nWoIBw3MiJZc' // Access Token Secret���L�q
=======
// 4つのキーの指定
  consumer_key: process.env.CONSUMER_KEY, // Consumer Key
  consumer_secret: process.env.CONSUMER_SECRET, // Consumer Secret
  access_token_key: process.env.ACCESS_TOKEN_KEY, // Access Token
  access_token_secret: process.env.ACCESS_TOKEN_SECRET // Access Token Secret
>>>>>>> 4475602ada86a054fbfa1ec6a2aec739f2b238b5
});
const TARGET_HASHTAG = '#TrainDelay';

const HOST = 'api.line.me';
const CH_SECRET = 'c092cd24c7204931d2e0409dd57926f1'; // Channel Secret���L�q
const CH_ACCESS_TOKEN = 'sT+g87Zf9no4a9MRMs6jgozryK412Rz3ghoj25cxAXxVioRtcsnJrOeGarlPUR/iyutFMjxLKsXFqKPsEqVWXP9tpO8SD6wbo4s8pEng9gnVwTIJqAix/xXcoLI/mfJVryspaXS+ObudeNVlhQ8G4AdB04t89/1O/w1cDnyilFU='; // Channel Access Token���L�q
const USER_ID = 'U21a4f0968fb4fcb6d9a8741316b45537'; // Your userId���L�q
const PUSH_PATH = '/v2/bot/message/multicast';
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
<<<<<<< HEAD
const PORT = 3000;
=======
const PORT = process.env.PORT || 3000; // ||で条件分岐
>>>>>>> 4475602ada86a054fbfa1ec6a2aec739f2b238b5

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
<<<<<<< HEAD
    if (data.text.indexOf('�앐��' || '���{���' || '�Ó�V�h���C��' || '������' || '�ڍ���') !== -1) {
=======
    if (data.text.indexOf('TrainDelay') !== -1) {
>>>>>>> 4475602ada86a054fbfa1ec6a2aec739f2b238b5
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
