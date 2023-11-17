/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

import { createApp } from 'vue'
import App from './App.vue'

// Theming framework
import { VuesticPlugin } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'

// Global event bus
import mitt from 'mitt'
const emitter = mitt()

// Amplify imports
import Amplify from 'aws-amplify'



const app = createApp(App).use(  VuesticPlugin,{
  components: {
    VaChip: {
      outline: true,
      rounded: false,
      size: 'large',
      color: '#000'
    },
    VaCard:{
      stripe: false,
      stripeColor:"black",
      square: false
    },
    VaButton:{
      color:"#08c18a"
    },

    VaButtoGroup:{
      color:"#08c18a"
    }
  },
})

/* ===================================================
                      CONFIGURATION
    You must add your own values here! See the tutorial
    in the GitHub repo for more information. @jbesw
   =================================================== */

app.config.globalProperties.$appLogo = 'https://assets.serverlesscoffee.com/images/serverlesspresso-large.png'


// Get global vars from local cache
if (localStorage.UIstate) {
  const UIstate = JSON.parse(localStorage.UIstate)
  console.log('Mounted - Local storage: ', UIstate)

  // Hydrating state from local cache
  app.config.globalProperties.orderManagerEndpoint = UIstate.APIurl || ''
  app.config.globalProperties.$region = UIstate.region || ''

  app.config.globalProperties.$ordersAPIurl = UIstate.ordersAPIurl || ''
  app.config.globalProperties.$APIconfigURL = UIstate.APIconfigURL || ''
  app.config.globalProperties.$poolId = UIstate.$poolId || ''
  app.config.globalProperties.$ConfigEndpoint = UIstate.ConfigEndpoint || '',
  app.config.globalProperties.$host = UIstate.host || ''
}

// Are global vars initialized?
app.config.globalProperties.$init = true // set this to true,  to skip the inital config step


/* ===================================================
                      CONFIGURATION
  Enter the values from the Cloudformation Output here!
   =================================================== */

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    identityPoolRegion: 'us-east-1',
    userPoolId: 'us-east-1_012345678',
    userPoolWebClientId: '01234567890123456789012345',
    mandatorySignIn: false,
  }
})

// ** AWS_COGNITO_IDENTITY_POOL_ID **
app.config.globalProperties.$poolId = 'us-east-1:01234567-0123-0123-0123-012345678901'
// ** AWS_IOT_DATA_ENDPOINT **
app.config.globalProperties.$host = '01234567890123-ats.iot.us-east-1.amazonaws.com'
// ** AWS_REGION **
app.config.globalProperties.$region = 'us-east-1'      
// ** ORDERMANAGERRESTAPI **
app.config.globalProperties.$orderManagerEndpoint='https://ordermanager.execute-api.us-east-1.amazonaws.com/Prod/'
// ** ConfigServiceRESTAPI **
app.config.globalProperties.$ConfigEndpoint = 'https://configservice.execute-api.us-east-1.amazonaws.com/Prod/'
// ** QRApi **
app.config.globalProperties.$QRurl = 'https://qrapi.execute-api.us-east-1.amazonaws.com/Prod/'
// ** URL of the order app **
app.config.globalProperties.$OrderUrl = 'https://orderurl.d1n2f2z8vu0rgy.amplifyapp.com/'

app.config.globalProperties.emitter = emitter
app.config.globalProperties.$appName = 'Display'
app.config.globalProperties.$adminApp = true
app.mount('#app')

