<template>
  <div>
    <va-navbar color="dark" v-if="authState === 'signedin'">
      <template #left>
        <va-navbar-item class="mr-4">
          <div>Barista</div>
        </va-navbar-item>
      </template>
      <template #center>
        <va-navbar-item class="mr-4">
          <va-button :rounded="false" :loading="isStoreChangingState" color="info" @click="storeSwitchChange" >
            {{ getStoreStateButtonLabel }}
          </va-button>
        </va-navbar-item>

      </template>
      <template #right>
        <va-navbar-item>
          <va-button color="primary" :rounded="false"  @click="signOut">Abmelden</va-button>
        </va-navbar-item>
      </template>
    </va-navbar>

    <!-- Only show if logged out -->
    <div v-if="authState != 'signedin'">
      <Authentication/>
    </div>
    <!-- Only show if logged in -->
    <div v-if="authState === 'signedin'">
      <OrderSelector />
    </div>
    <IoT />
  </div>
</template>

<script>
/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

'use strict'

import IoT from '@/components/IoT'
import OrderSelector from '@/components/OrderSelector'
import Authentication from '@/components/Auth'

import { Auth } from 'aws-amplify'

import axios from 'axios'


export default {
  name: 'App',
  components: {
    IoT,
    OrderSelector,
    Authentication
  },
  data() {
    return {
      // Auth
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,

      // Store open toggle
      isStoreOpen: true,
      isStoreChangingState: false,

      // Edit printer toggle
      isEditingPrinter: false,
      printerIPaddress: undefined,

      // Robot status
      robotEnabled: false,
      robotSpeed: 0,
      intervalref: undefined
    }
  },
  computed: {
    getStoreStateButtonLabel: function () {
      var label = this.isStoreOpen
      if (typeof this.isStoreOpen == "boolean") {
        label = this.isStoreOpen ? 'Geschäft schließen':'Geschäft öffnen'
      } else {
        label = this.isStoreOpen.BOOL ? 'Geschäft schließen':'Geschäft öffnen'
      }
      return label
    }
  },
  methods: {
    async storeSwitchChange () {

      this.isStoreChangingState = true
      this.robotEnabled = false


      // Refresh token
      const session = await Auth.currentSession()
      const jwtToken = session.getAccessToken().jwtToken
      var requestedStoreState = (this.isStoreOpen ? 'close': 'open')
      if (typeof this.isStoreOpen == "boolean") {
        requestedStoreState = (this.isStoreOpen ? 'close': 'open')
      } else {
        requestedStoreState = (this.isStoreOpen.BOOL ? 'close': 'open')
      }

      try {
        const { data } = await axios({
          method: 'PUT',
          url: `${this.$ConfigEndpoint}/store?state=${requestedStoreState}`,
          headers: {
            Authorization: 'Bearer ' + jwtToken
          }
        })
        console.log('storeSwitchChange: ', data)
      } catch (err) {
        console.error("Cannot change state: ", err)
        this.isStoreChangingState = false
      }
    },

    // Get application config
    async getConfig () {
      console.log('getConfig started')

      try {
        const { data } = await axios(`${this.$ConfigEndpoint}config`, {
          method: 'GET',
        })
        console.log('Config: ', data)
        
        data.map((item) => {
          if (item.PK.S === "config") {
            this.isStoreOpen = item.storeOpen
          }
        })
        this.menu = data.filter((item) => item.topic === "menu")[0]
      } catch (err) {
        console.log("Cannot load config: ", err)
      }
    },
    signOut () {
      this.emitter.emit('signOut')
    }
  },
  async mounted () {
    let that = this

    // Login/logout events
    this.emitter.on('authStateChanged', async function(detail) {
      console.log("mounted::authStateChanged: ", detail)
      if (detail.loggedIn) {
        that.authState = "signedin"
        that.user = detail.authData

        // Load store config
        await that.getConfig()
      } else {
        that.authState = ""
      }
      console.log("mounted::authStateChanged: ", that.authState)
    })

    // Store state changed event
    this.emitter.on('storeState', function (detail) {
      console.log('App.vue mounted storeState: ', detail, that.isStoreOpen)
      that.isStoreOpen = detail.NewImage.storeOpen.BOOL
      that.isStoreChangingState = false
    })

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
