'use strict'
const line = require('node-line-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// need raw buffer for signature validation
app.use(bodyParser.json({
    verify(req, res, buf) {
        req.rawBody = buf
    }
}));

// init with auth
line.init({
    accessToken: 'AVYqydGIbyL+Q24L0jVopcKfTjNKWPqxIPv5Fm19Qlm6oTB8txFIF9Ej1dE9g8+Rc0aqkg1Cx3Q5kkPCsCGb9k0VgsQTbB1QCRI2PdoLfILoYX3zxckp8b9+WOjSjV4guS5VMJY1PTiIabalmY0IKAdB04t89/1O/w1cDnyilFU=',
    // (Optional) for webhook signature validation
    channelSecret: 'de20c397672b8fee5e3dee63b82a3bdb'
});

const $eval = (text) => {
    try {
        return eval(text);
    } catch (e) {
        return e;
    }
};




const clamp = (val, min, max) => Math.min(Math.max(min, val), max);


const dice = (n) => {

    const vv = [];

    for (let i = 0; i < n; ++i) {
        const r = Math.floor(Math.random() * 10) + 1;
        vv.push(r);
    }


    return vv;
};

const t = (text) => {


    if (text.match(/\d+dx@\d+/)) {

        const [d, v] = text.split('dx@');

        const critical = clamp(v, 1, 10);

        let result = '';


        result += `🐧 ${d}D10 CT: ${v}\n`;


        const vv = [];

        const cc = [];

        let n = d;


        let sum = 0;



        while (n > 0) {

            var v1 = dice(n, critical);

            n = v1.filter((v) => v >= critical).length;

            const max = Math.max(...v1);
            sum += max;

            result += '[ ' + v1.join(', ') + ' ]';

            result += `\n😎 最大値: ${max}\n`;

            if (n) result += `🎲 ${n} critical!!\n`;


        }

        result += `🍣 合計: ${sum}`;


        return result;


    } else return null;


}





app.post('/webhook/', line.validator.validateSignature(), (req, res, next) => {


    //

    const event = req.body.events[0];

    let result = '';

    try {
        result = eval(event.text);
    } catch (e) {
        result = e;
    }




    line.client
        .replyMessage({
            replyToken: event.replyToken,
            messages: [{
                type: 'text',
                text: result
            }]
        }).then((r) => {


                res.json({
                    success: true
                });


        });


    return;

    /*


    // get content from request body
    const promises = req.body.events.map(event => {
        // reply message
        return line.client
            .replyMessage({
                replyToken: event.replyToken,
                messages: [{
                    type: 'text',
                    text: eval(event.text);
                }]
            });



    });

    Promise
        .all(promises)
        .then(() => res.json({
            success: true
        }));


*/

});



app.listen(process.env.PORT || 3000, () => {
    console.log('Example app listening on port 3000!')
});
