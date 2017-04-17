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


app.post('/webhook/', line.validator.validateSignature(), (req, res, next) => {
    // get content from request body
    const promises = req.body.events.map(event => {

        const { text } = event.message;

        // reply message
        return line.client
            .replyMessage({
                replyToken: event.replyToken,
                messages: [{
                    type: 'text',
                    text: eval(text)
                }]
            });
    });

    Promise
        .all(promises)
        .then(() => res.json({
            success: true
        }));
});



app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!')
});
