# Welcome to the Serverlesspresso workshop!

Serverlesspresso is a serverless coffee bar exhibit, as seen at AWS re:Invent 2021. This consists of three frontend applications and various backend microservices. This README explains the  process to completely install all the various components.

Important: this application uses various AWS services and there are costs associated with these services after the Free Tier usage - please see the [AWS Pricing page](https://aws.amazon.com/pricing/) for details. You are responsible for any AWS costs incurred. No warranty is implied in this example.

---
### Config Steps

1. Install dependency for `FillDatabasesCustomResource` and `create-auth-challenge` in `/files` via `npm install`.

2. Zip each folder in `/files` and upload the zipped folders (1 zip file for each function) and the `orderProcessorWorkflow.json` to the root directory of an S3 Bucket in us-east-1.

3. Deploy the cloudformation template in `us-east-1` and edit the necessary parameters, like `SESFromAddress` and `S3BucketName`

After the stack is successfully deployed: 

4. Update the field `<StateMachineArn>` in the list executions parameters of the `orderProcessorworkflow` state machine with the ARN of the `orderProcessorworkflow`

5. Update the frontend parameters in the `main.js` files of each app. *I advise to go to the vue-display-app and use your IDE to look for all appeareances of the respective paramter. This way you only have to update the parameters once and the vue-display-app is the only app that contains every parameter.* The `app.config.globalProperties.$OrderUrl` in the vue-display-app can of course only be updated after you deployed the vue-order-app and this parameter is used in the QR Code, so that users get send to the right URL when scanning the QR Code.  

6. Now either deploy locally with `npm run serve` or use `npm run build` for each app and upload the `dist folders` to Amplify (deploy without Git provider). You can also connect your repository to Amplify so it will directly run the build command, when you push to your repository. *Advise: Upload the vue-order-app first, because the main.js file in the vue-display-app requires the URL of the vue-order-app*

7. After deployment you can login with your email and should receive a OTP to this email. If you are an admin user and want to login to the barista or display app you have to go to `cognito` and add your user to the `admin` group. *If you enter your email for the first time, directly go to cognito and add the user and afterwards use the OTP to login. You should now have access to the admin apps. If you enter your email and then enter the OTP before adding the user as an admin the app will tell you that you do not have the required permissions, and the OTP will be unvalid, so you need to request a new one.*