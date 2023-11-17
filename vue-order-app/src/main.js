import { createApp } from 'vue'
import App from './App.vue'
import { VuesticPlugin } from 'vuestic-ui' 
import 'vuestic-ui/dist/vuestic-ui.css' 


// Global event bus
import mitt from 'mitt';
const emitter = mitt();


// Amplify imports
import Amplify from 'aws-amplify'


const app = createApp(App)
app.use(VuesticPlugin,{
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
    },
    VaProgressCircle:{
      color:'#08c18a'
    },
    VaButtonDropdown:{
      color:'#08c18a'
    }
    
  },
})

/* ===================================================
                      CONFIGURATION
  Enter the values from the Cloudformation Output here!
   =================================================== */

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    identityPoolRegion: 'us-east-1',
    userPoolId: 'us-east-012345678',
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
// ** QRApi **
app.config.globalProperties.$APIGWEndpointValidatorService = 'https://qrapi.execute-api.us-east-1.amazonaws.com/Prod/' 
// ** ConfigServiceRESTAPI **
app.config.globalProperties.$ConfigEndpoint = 'https://configservice.execute-api.us-east-1.amazonaws.com/Prod/'

app.config.globalProperties.emitter = emitter
app.config.globalProperties.$adminApp = false
app.mount('#app')

