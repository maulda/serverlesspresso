<template>
<va-modal
      v-model="showConfirmModal"
      size="medium"
      title="Bestätigung"
      message="Wollen Sie Ihre Bestellung wirklich stornieren"
      okText="Ja"
      cancelText="Nein"
      class="modal"
      @ok="cancelOrderOKclick"
    />

    <div class="row">
        <div class="flex  xs12">
            <va-card class="status-card">
                <va-card-content>
                  
                    <div  v-if="CurrentOrder.drink">
                    </div>

                    <div  v-if="CurrentOrder.status =='waiting' ">
                        <h2 >Ihre Bestellung ist in der Warteschlange </h2>
                         <img class="staus animation" src="https://assets.serverlesscoffee.com/images/639-line-queue-outline.gif">
                    </div>
                    

                     <div  v-if=" CurrentOrder.status =='OrderManager.WaitingCompletion' || CurrentOrder.status =='OrderProcessor.WaitingCompletion'  ">
                        <h1>Bestellung #{{CurrentOrder.orderNumber}}</h1>
                        <h2>Ihre Bestellung ist nun sichtbar auf dem großen Bildschirm </h2>
                        <img class="staus animation" src="https://assets.serverlesscoffee.com/images/1727-change-tv-screen-widescreen-outline.gif">
                        
                        <va-button :loading="loading" color="#690080" icon="block" @click="cancelOrderClick(CurrentOrder)"> Bestellung stornieren </va-button>

                    </div>

                    <div  v-if=" CurrentOrder.status =='OrderManager.MakeOrder'  ">
                        <h1>Bestellung #{{CurrentOrder.orderNumber}}</h1>
                        <h2>Ihre Bestellung wird nun zubereitet </h2>
                        <img class="staus animation" src="https://assets.serverlesscoffee.com/images/615-coffee-machine-outline.gif">
                        
                        <va-button :loading="loading" color="#690080" icon="block" @click="cancelOrderClick(CurrentOrder)">  Bestellung stornieren </va-button>

                    </div>


                    <div  v-if="CurrentOrder.status =='OrderManager.OrderCompleted'">
                        <h1>Bestellung #{{CurrentOrder.orderNumber}}</h1>
                        <h2>Ihre Bestellung ist abholbereit</h2>
                         <img class="staus animation" src="https://assets.serverlesscoffee.com/images/238-coffee-take-away-outline.gif">
                    </div>


                    <div  v-if="CurrentOrder.status =='OrderManager.OrderCancelled' ">
                        <h1>Bestellung #{{CurrentOrder.orderNumber}}</h1>
                        <h2>Ihre Bestellung wurde storniert</h2>
                        <img class="staus animation" src="https://assets.serverlesscoffee.com/images/680-it-developer-outline.gif">
                        
                    </div>


                    <div  v-if="CurrentOrder.status =='OrderProcessor.OrderTimeOut' ">
                        <div v-if="CurrentOrder.statusinfo=='Customer timedout'" >
                            <h2>Unsicher was Sie bestellen wollen?</h2>
                            <img class="staus animation" src="https://assets.serverlesscoffee.com/images/680-it-developer-outline.gif">
                        </div>
                        <div v-else>
                            <h2>Ihre Bestellung ist leider untergegangen, bestellen Sie bitte noch einmal.</h2>
                            <img class="staus animation" src="https://assets.serverlesscoffee.com/images/680-it-developer-outline.gif">
                        </div>
                    </div>
                </va-card-content>
            </va-card> 
        </div>
    </div>
</template>


<script>


import axios from 'axios'
import Auth from '@aws-amplify/auth'


    export default {
      name: "Status",
      props:['order'],
      data(){
        return{  
        CurrentOrder:this.order,
        countDown : 300,
        percent: 0,
        timeRemaining:0,
        showConfirmModal: false,
        orderIDtoCancel: undefined,
        loading:false
        }
      },
      methods: {


            // Cancel button pressed
            cancelOrderClick (order) {
            this.loading=true
            console.log('cancelOrderClick:', order)
            this.orderIDtoCancel = order.orderId
            this.showConfirmModal = true
            },
            async cancelOrderOKclick () {
            console.log('cancelOrderOKclick:', this.orderIDtoCancel)
            await this.orderCancel(this.orderIDtoCancel)
            this.showConfirmModal = false
            this.orderIDtoCancel = undefined
            },


            
            async orderCancel(){
            const session = await Auth.currentSession()
            const jwtToken = session.getAccessToken().jwtToken
            const that=this

              var data ={ 
                      "stats":"CANCELLED"
                  }

              let config = {
                method: 'PUT',
                url: that.$orderManagerEndpoint+'/orders/'+that.CurrentOrder.id + '?action=cancel',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization':'Bearer '+jwtToken
                },
                data : JSON.stringify(data)
              };
              axios(config)
              .then(function (response) {   
               //that.$emit('clicked', {"status":"Sent","orderNumber" : response.data})          
                console.log('cancelled',response);
              })
              .catch(function (error) {
                console.log(error);
              });
            },

                next(){
                this.$emit('completed')
                }

            
        }

    }
</script>


<style scoped>
h1{font-size: 40px !important;}

.status-card{
  
    width:100%;
    z-index:9;
}

h2{font-size:20px !important;}


.staus.animation{
    width:100%
}

.va-modal__container{z-index:9999999999 !important; position: fixed; top: 0px !important;}
</style>