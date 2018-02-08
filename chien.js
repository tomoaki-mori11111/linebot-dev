'use strict';

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const Twitter = require('twitter');

const URL = 'https://rti-giken.jp/fhc/api/train_tetsudo/delay.json';
const TARGET_LINE1 = '南武線';
const TARGET_LINE2 = '横須賀線';




const HOST = 'api.line.me';
const CH_SECRET = 'c092cd24c7204931d2e0409dd57926f1'; // Channel Secretを記述
const CH_ACCESS_TOKEN = 'sT+g87Zf9no4a9MRMs6jgozryK412Rz3ghoj25cxAXxVioRtcsnJrOeGarlPUR/iyutFMjxLKsXFqKPsEqVWXP9tpO8SD6wbo4s8pEng9gnVwTIJqAix/xXcoLI/mfJVryspaXS+ObudeNVlhQ8G4AdB04t89/1O/w1cDnyilFU='; // Channel Access Tokenを記述
const USER_ID = 'U21a4f0968fb4fcb6d9a8741316b45537'; // Your userIdを記述
const PUSH_PATH = '/v2/bot/message/multicast';
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = 3000;

var moment = require('moment');
var mJst = moment('2014-10-08T19:50:59+09:00'); //ISO8601 形式で JST の指定
var s3 = moment().format('MM月DD日 HH:mm');

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


https.get(URL, (res) => {
  let body = '';
  res.setEncoding('utf8');

  res.on('data', (chunk) => {
      body += chunk;
  });

  res.on('end', (res) => {
      res = JSON.parse(body); 
	  //遅延確認: 南武線
	　　if (body.indexOf(TARGET_LINE1) !== -1) {
     　　   let PushSendMessageObject = [{
     　　     type: 'text',
     　　     text: '【遅延情報】\n'+ s3　+'\n'+ TARGET_LINE1　+ ' が遅延しています'
     　　   }];

     　　   pushClient([USER_ID], PushSendMessageObject)
     　　     .then((body) => {
     　　       console.log(body);
        }, (e) => {console.log(e)});

        console.log(body);
    　　}
	
	  //遅延確認: 横須賀線
	　　if (body.indexOf(TARGET_LINE2) !== -1) {
     　　   let PushSendMessageObject = [{
     　　     type: 'text',
     　　     text: '【遅延情報】\n'+ s3　+'\n'+ TARGET_LINE2　+ ' が遅延しています'
     　　   }];

     　　   pushClient([USER_ID], PushSendMessageObject)
     　　     .then((body) => {
     　　       console.log(body);
        }, (e) => {console.log(e)});

        console.log(body);
    　　}
	
	
  });
}).on('error', (e) => {
  console.log(e.message); //エラー時
});



