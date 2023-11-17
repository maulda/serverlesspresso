"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const crypto_secure_random_digit_1 = require("crypto-secure-random-digit");
const aws_sdk_1 = require("aws-sdk");
const ses = new aws_sdk_1.SES();
const handler = async (event) => {
    let secretLoginCode;
    if (!event.request.session || !event.request.session.length) {
        // This is a new auth session
        // Generate a new secret login code and mail it to the user
        secretLoginCode = crypto_secure_random_digit_1.randomDigits(6).join('');
        await sendEmail(event.request.userAttributes.email, secretLoginCode);
    }
    else {
        // There's an existing session. Don't generate new digits but
        // re-use the code from the current session. This allows the user to
        // make a mistake when keying in the code and to then retry, rather
        // then needing to e-mail the user an all new code again.    
        const previousChallenge = event.request.session.slice(-1)[0];
        secretLoginCode = previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1];
    }
    // This is sent back to the client app
    event.response.publicChallengeParameters = { email: event.request.userAttributes.email };
    // Add the secret login code to the private challenge parameters
    // so it can be verified by the "Verify Auth Challenge Response" trigger
    event.response.privateChallengeParameters = { secretLoginCode };
    // Add the secret login code to the session so it is available
    // in a next invocation of the "Create Auth Challenge" trigger
    event.response.challengeMetadata = `CODE-${secretLoginCode}`;
    return event;
};
exports.handler = handler;
async function sendEmail(emailAddress, secretLoginCode) {
    const params = {
        Destination: { ToAddresses: [emailAddress] },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<html><body><p>Ihr Code zum anmelden:</p>
                           <h3>${secretLoginCode}</h3></body></html>`
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: `Ihr Code zum anmelden: ${secretLoginCode}`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Ihr Code zum anmelden'
            }
        },
        Source: process.env.SES_FROM_ADDRESS
    };
    await ses.sendEmail(params).promise();
}
