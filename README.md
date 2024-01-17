# Welcome to the Serverlesspresso workshop!

Serverlesspresso is a serverless coffee bar exhibit, as seen at AWS re:Invent 2021. This consists of three frontend applications and various backend microservices. This README explains the  process to completely install all the various components.

Important: this application uses various AWS services and there are costs associated with these services after the Free Tier usage - please see the [AWS Pricing page](https://aws.amazon.com/pricing/) for details. You are responsible for any AWS costs incurred. No warranty is implied in this example.

---
### Deployment Steps


1. Zip each `folder` in `/files`. There should now be 18 zipped folders in total.

2. Go the [Amazon S3](https://s3.console.aws.amazon.com) and upload the zipped folders together with the `orderProcessorWorkflow.json`, `02OrderManagerStateMachine.json`, `RESTApiConfigService.yml` and the `RESTApiConfigService.yml` to the `root` directory of an S3 Bucket in eu-central-1.

3. Go to [CloudFormation](https://eu-central-1.console.aws.amazon.com/cloudformation/home?region=eu-central-1) and deploy the cloudformation template `cf.yml` in `eu-central-1` and edit the necessary parameters, like `SESFromAddress` and `S3BucketName`. The `S3BucketName` is the name of the bucket where you uploaded the files to in Step 2. The `SESFromAddress` is the identity from which SES will send the email address. In order for this to work you should have a verified identity in [Amazon SES](https://eu-central-1.console.aws.amazon.com/ses/home?region=eu-central-1#/verified-identities)

After the stack is successfully deployed: 

4. Go to [AWS Step Functions Step Machines](https://eu-central-1.console.aws.amazon.com/states/home?region=eu-central-1#/statemachines), click on the `OrderProcessorWorkflow-XXXXXX` state machine and copy the `Amazon Resource Name (ARN)` of the state machine. Now on the same state machine, select `edit`, click on `code` at the top to view the code and then go to line 36 (States->ListExecutions->Parameters->StateMachineArn) and replace `<StateMachineArn>` with the ARN of this state machine.

5. In your IDE or TextEditor go to the `vue-order-app -> src` folder and open the `main.js` file. At the bottom of the file there is a `CONFIGURATION BANNER`, everything below should be updated with your values. You can find the correct values in the [CloudFormation](https://eu-central-1.console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks) Stack Outputs Tab. Once you updated every value (9 in total), run `npm run build`. Once the build has finished without errors continue. Now go to [AWS Amplify](https://eu-central-1.console.aws.amazon.com/amplify/home?region=eu-central-1#/home), scroll down and select `Get Started` for `Host your web app`. Then select `Deploy without Git provider` and click on next. Give the app a name and upload the `dist` folder of the vue-order-app and then click `Save and deploy`. Copy the `URL` of the order app for the next step.

6. Now open the `main.js` file in `vue-display-app -> src`. Also adjust every parameter, just like you did in the previous step with the help of the CloudFormation Stack Outputs Tab. For the `app.config.globalProperties.$OrderUrl` variable paste the URL that Amplify gave the order app. Now run `npm run build` and wait until it has finished. Then go to AWS Amplify, select `New app` and `Host web app`. Again `Deploy without Git provider` and give the app a name and upload the `dist` folder of the `vue-display-app`.

7. Complete the same process one last time for the `main.js` file in `vue-barista-app -> src` and upload it to a new web app in `AWS Amplify`.

7. After deployment you can login with your email and you will receive a OTP to this email. If you want to access the `vue-barista-app` or the `vue-display-app` you need to be an admin user. In order to fix this, go to [Amazon Cognito](https://eu-central-1.console.aws.amazon.com/cognito/v2/home?region=eu-central-1), open the `ServerlesspressoUserPool` Userpool, click on the user that should be an admin. Now at the bottom of the page select `Add user to group` and select the `admin` group.


# Images

## Barista App

![vue-barista-app](/img/vue-barista-app.png)

## Display App

![vue-display-app](/img/vue-display-app.png)

## Order App

![vue-order-app](/img/vue-order-app.png)
