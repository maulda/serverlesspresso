<template>



    
<div v-if="extraItems.length>0" class="row">
    <div class="flex xs12">
      <va-card >
        <va-card-title><h2>Bestellung anpassen:</h2> </va-card-title>
        <va-card-content>
        <div class="tabed-content">
            <div id="drinks">
                <div class="row">
                <div>
  </div>
        
                    <div class="flex xs12" v-for="(item,index) in extraItems" :key="index">
                        
                         <h2 style="margin-bottom:20px; margin-top:20px;">{{item.M.Name.S}}</h2>
                          <div class="xs4  " >
                                  
                                    <va-button outline style="margin:5px; width:50%;" color="#08c18a" v-for="(option,oindex) in item.M.Options.SS" :key="oindex" @click="add({name:option},{name:item.M.Options.SS})"  ><span :class="selectedItems[item.M.Options][option]"> {{option}} </span></va-button>
                                 
                            </div>
                        
                    </div>
                </div>
            </div>
        </div><!-- /.tabed-content -->
                      <img style="width:50px;" src="https://assets.serverlesscoffee.com/images/395-scroll-down-7-auto.7c340762.gif"  alt="Scroll down" />

        </va-card-content><!-- /.va-card-content -->
        </va-card>
        </div><!-- /.row -->
    </div><!-- /.flex -->
</template>

<script>


    export default {
      name: "Extras",

      data(){
        return{
          selectedItems:{},
          currentOrder:null,
          currentMenu:null,
          extraItems:{},
          selected:undefined
        }
      },
      props:['mod'],
      watch:{
          mod: function(newVal, oldVal) { // watch it
            console.log('Prop changed: ', newVal, ' | was: ', oldVal)
            this.refreshExtras()
          }
        },
      methods:{

  
        add(extra,type){
           this.selectedItems[type.name] ={}
            if(!this.selectedItems[type.name][extra.name]){
               this.selectedItems[type.name][extra.name]="highlight"
                this.$emit('clicked', this.selectedItems )
            }

        },
        refreshExtras(){
            this.currentOrder = this.mod.order
              this.currentMenu = this.mod.menu
              console.log('selected: ',this.currentMenu[0].M.modifiers.L.length)
                for (let i = 0; i < this.currentMenu.length; i++) {
                  if(this.currentMenu[i].M.drink.S == this.currentOrder.drink){
                    this.extraItems = this.currentMenu[i].M.modifiers.L
                      for (let j = 0; j < this.currentMenu[i].M.modifiers.L.length; j++) {
                        this.selectedItems[this.currentMenu[i].M.modifiers.L[j]]={}
                      }
                  }
                }
            }
      },

      mounted() {
        this.refreshExtras()
      }

    }
</script>

<style scoped>
h2{font-size:20px;}
ul{text-align:center;}
ul li{
  margin-top:50px;
  margin-left:5px;
  margin-right:5px;
  list-style:none;
  display:inline-block;
}

.va-button span.highlight {
  color: black !important;
}
</style>
