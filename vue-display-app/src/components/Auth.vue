<template>
  <div class="row parent">
    <div class="flex md6 lg6">
      <va-inner-loading :loading="isLoading">
        <va-card :bordered="false" style="margin-top: 100px;">
          <va-card-title>Registrieren</va-card-title>
          <va-card-content>Gib deine Email Adresse ein und wir senden dir ein Einmalpasswort an diese Emailadresse.</va-card-content>

          <div class="row flex">
            <div v-show="!isCodeRequested">
              <input for="email" type="email" placeholder="Email" required v-model="email" @blur="validateEmail" >
            </div>
            <div class="row flex" style="margin: 20px;">
              <va-button
                :disabled="!isValid || isCodeRequested"
                :rounded="false"
                @click="getCode"
                class="mr-2">
                  Code erhalten
              </va-button>
              <va-button
                :disabled="isCodeRequested"
                :rounded="false"
                @click="resetForm"
                class="ml-2">
                  Reset
              </va-button>

            </div>
          </div>
          <div v-show="showCodeSubmit" class="row flex" style="margin: 20px;">
            <va-input
              style="font-size: 24px;"
              :mask="{blocks: [6]}"
              label="Code"
              type="number"
              ref="codeInput"
              v-model="code"
              :error="errorMessages!=''"
              :error-messages="errorMessages"
            />
            <va-button
              :rounded="false"
              @click="submitCode"
              class="mt-4 mb-4">
                Anmelden
            </va-button>
          </div>
        </va-card>
      </va-inner-loading>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
const SMS_DELAY = 30000

export default {
  name: 'Auth',
  data() {
    return {
      email: '',
      isValid: true,
      code: '',
      isCodeRequested: false,
      showCodeSubmit: false,
      cognitoUser: {},
      errorMessages: '',
      isLoading: false
    }
  },
  watch: {
    isCodeRequested (value) {
      if (value === true) {
        setTimeout(() => {
          this.isCodeRequested = false
          this.saveLocalStorage ()
        }, SMS_DELAY)
      }
    }
  },
  async mounted () {
    this.emitter.on('signOut', async () => (await this.signOut ()))

    if (!localStorage.UIstate) return
    const UIstate = JSON.parse(localStorage.UIstate)
    console.log('Mounted - Local storage: ', UIstate)

    this.email = UIstate.email
    await this.checkIfLoggedIn ()
    this.isLoading = false
  },
  methods: {
    validateEmail () {
      
    },
    resetForm () {
      this.email = ''
      this.code = ''
      this.isCodeRequested = false
      this.errorMessages = ''
      this.cognitoUser = {}
      this.showCodeSubmit = false
      this.saveLocalStorage ()
    },
    saveLocalStorage () {
      const UIstate = {
        email: this.email
      }
      console.log('Saving Local storage: ', UIstate)

      localStorage.UIstate = JSON.stringify(UIstate)
      console.log('Saving: ', UIstate)
    },
    async getCode () {
      this.isCodeRequested = true
      this.showCodeSubmit = true
      this.code = ''
      this.errorMessages = ''
      this.$nextTick(() => this.$refs.codeInput.$el.focus())

      console.log('Saving: ', this.email)
      this.saveLocalStorage ()

      // Request the code
      await this.signUp ()
    },

    // AUTH METHODS
    getRandomString (length) {
      return Array(length).fill().map(()=>"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.random()*62)).join("")
    },
    async signIn () {
      try {
        console.log('Signing in: ', this.email)
        this.cognitoUser = await Auth.signIn(this.email)
      } catch (err) {
        if (err) {
          console.log(err)
          if (err.code === 'InvalidParameterException') {
            console.error ('signIn error: ', err.message)
            return
          }

          if (err.code === 'NotAuthorizedException') {
            console.error ('signIn error: ', err.message)
            return
          }
        }
      }
      console.log(this.cognitoUser)
    },
    async signUp () {
      const params = {
        username: this.email,
        email: this.email,
        password: this.getRandomString(30),
        attributes: {
          name: this.email
        }
      }
      try {
        console.log('signUp: ', params)
        this.cognitoUser = await Auth.signUp(params)
        console.log(this.cognitoUser)
      } catch (err) {
        if (err) console.error(err)
      }
      await this.signIn ()
    },
    async submitCode () {
      const code = this.code
      console.log(code)
      try {
        const result = await Auth.sendCustomChallengeAnswer(this.cognitoUser, code)
        console.log('Result:', code, result)
      } catch (err) {
        console.error ('submitCode error: ', err)
        this.resetForm ()
      }
      await this.checkIfLoggedIn ()
    },
    async checkIfLoggedIn () {
      const loggedIn = await this.isAuthenticated()
      console.log("checkIfLoggedIn: ", loggedIn)

      if (loggedIn) {
        const session = await Auth.currentSession()
        console.log(session)

        // Check if admin requirements are met
        if (this.$adminApp) {
          const groups = session.getIdToken().payload['cognito:groups']
          console.log('Groups: ', groups)

          if (!groups || !groups.includes('admin')) {
              console.log('Not an admin - signing out')
              this.errorMessages = "Insufficient privileges"
              return
          }
        }
        this.emitter.emit('authStateChanged', { loggedIn: true, authData: session })
      } else {
        this.errorMessages = "Invalid code"
      }
    },
    async signOut() {
      await Auth.signOut()
      this.resetForm ()
      this.emitter.emit('authStateChanged', { loggedIn: false })
    },
    async isAuthenticated() {
      try {
        await Auth.currentSession()
        return true
      } catch {
        return false
      }
    }
  }

}
</script>
<style>
.parent {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.code {
  font-size: x-large !important;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 100px;
  padding-right: 100px;
}
</style>