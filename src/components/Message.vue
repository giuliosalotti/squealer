<template>
<form class="form" @submit.prevent="inviaMessaggio">
    <h3 style="margin-bottom:30px;">Scrivi qualcosa...</h3>
    
    <div class="input-group">
        <textarea class="form-control messaggio" placeholder="Voglio scrivere..." :maxlength="quotaM" v-model="messaggio" @input.once="getQuota" @input="countQuota"></textarea>
         <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{{quotadisposizione}}</span>
    </div>
    <div class="input-group">
        <select class="form-select input-group-text" v-model="simbolo">
          <option value="@">@</option>
          <option value="§">§</option>
          <option value="#">#</option>
        </select>
        <input id="inputtype" type="text" class="form-control" placeholder="public" aria-label="Username" aria-describedby="basic-addon1" v-model="dest">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="addDestinatario()">Add</button>
    </div>
    <div class="d-flex">    
      <span class="badge text-bg-dark" v-for="destinatario in destinatari" :key="destinatario">{{destinatario.simbolo}} {{destinatario.destinatario}}
          <button class="btn btn-sm btn-light ml-2 bbadge" @click="rimuoviDestinatario(destinatario.destinatario)">&times;</button>
      </span>
    </div>
    <button class="btn btn-dark" type="button" id="upload" data-bs-toggle="modal" data-bs-target="#media">Upload Media</button>
    <button class="btn btn-success" type="submit" id="button-addon2">Pubblica</button>
</form>

<!-- media upload -->
<div class="modal fade" id="media" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Inserisci media</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <select class="form-select" v-model="tipologia" style="margin-bottom:10px;">
          <option value="" selected>Seleziona tipologia</option>
          <option value="FOTO" selected>Foto</option>
          <option value="VIDEO">Video</option>
          <option value="MAPPA">Mappa</option>
        </select>
        <input id="inputtype" type="text" class="form-control" placeholder="url" v-model="url">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aggiungi</button>
      </div>
    </div>
  </div>
</div>

</template>

<style scoped>
    .input-group{
        margin-bottom: 20px;
    }
    .form{
        padding: 40px 10px 0px 30px
    }
    #inputtype{
      width: 70%;
    }
    .badge{
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 5px;
   }
   .bbadge{
    background-color: transparent;
    border: none;
    color: white;
   }
   .messaggio{
    z-index: 0 !important;
   }
   #upload{
    margin-right: 20px;
   }
    
</style>


<script>
import axios from 'axios';

export default {
  props: ['user','destinatario'],
  data() {
    return {
      messaggio: '',
      dest: this.destinatario,
      simbolo:'§',
      creatori: [],
      destinatari:[],
      quotaD:500,
      quotaW:3500,
      quotaM:14000,
      quotadisposizione:null,
      riduzione:false,
      limitD:false,
      limitW:null,
      limitM:null,
      url:"",
      tipologia:"",
    };
  },

watch: {
    destinatario(newValue) {
      this.dest = newValue;
    },
  },
 
  methods: {

    //metodo per ottenere la quota nel momento in cui inizi a scrivere il messaggio
    async getQuota(){
      event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/getuser', {
            email: this.user.email,
        });
            if(response.status == 200){
                const utente = response.data.user;
                this.quotaD = utente.quotaD;
                this.quotaW = utente.quotaW;
                this.quotaM = utente.quotaM;
                this.quotadisposizione = utente.quotaD;
            }
        } catch (error) {
          console.log(error);
        }
    },
    //metodo locale per l'aggiornamento della quota
    countQuota(){
      if(this.limitD==false){
        this.quotadisposizione = this.quotaD-this.messaggio.length;
      }
      if(this.quotaD-this.messaggio.length==0){
        alert("Vuoi passare alla quota settimanale?");
        this.limitD = true;
        this.limitW = false;
        this.quotadisposizione = this.quotaW-this.messaggio.length;
      }
      if(this.limitW==false){
        this.quotadisposizione = this.quotaW-this.messaggio.length;
      }
      if(this.quotaW-this.messaggio.length==0){
        alert("Vuoi passare alla quota mensile?");
        this.limitW = true;
        this.limitM = false;
        this.quotadisposizione = this.quotaM-this.messaggio.length;
      }
      if(this.limitM==false){
          this.quotadisposizione = this.quotaM-this.messaggio.length;
      }
      if(this.quotaM-this.messaggio.length==0){
          alert("Hai finito tutti i caratteri a disposizione");
          this.limitM = true;
      }
      //controllo se quando tutto è bloccato, l'utente sta cancellando caratteri
      if(this.quotaD-this.messaggio.length>0){
        this.limitM=null;
        this.limitW=null;
        this.limitD=false;
      }else if(this.quotaW-this.messaggio.length>0){
        this.limitM=null;
        this.limitW=false;
        this.limitD=true;
      }else if(this.quotaM-this.messaggio.length>0){
        this.limitM=false;
        this.limitW=true;
        this.limitD=true;
      }
      console.log(this.quotadisposizione);
    },

    //metodo per rimuovere un destinatario prima di aver inviato il messaggio
    rimuoviDestinatario(identificatore) {
      this.destinatari = this.destinatari.filter(destinatario => destinatario.destinatario !== identificatore);
    },
    addDestinatario(){
      this.destinatari.push({simbolo: this.simbolo, destinatario: this.dest});
      this.dest = '';
    },

    inviaMessaggio() {
      this.destinatari.forEach(destinatario => {
        if(destinatario.simbolo == '§' || destinatario.simbolo == '#'){
          this.riduzione = true;
        }
        if(destinatario.simbolo == '#'){
          //deve creare il canale estemporaneo
          this.creatori.push(this.user);
          axios.post('http://localhost:3000/canali', {
              nome: destinatario.destinatario,
              immagine: "https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm90aGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
              creatore: this.creatori
          }).then(response => {
              console.log('Canale aggiunto con successo:', response.data);
          }).catch(error => {
              console.error('Errore durante l\'aggiunta del canale:', error);
          });
        }
      });
      this.send();
    },

    send(){
        var dasottrarre = this.messaggio.length;
        var messaggio = this.messaggio;
        if(this.tipologia!=""){
          //se il file multimediale supera i limiti non lo inserisce
          if(dasottrarre+125 <= this.quotaD || dasottrarre+125 <= this.quotaW || dasottrarre+125 <= this.quotaM){
            dasottrarre += 125;
            messaggio = messaggio + " "+this.tipologia+":"+this.url;
          }else{
            alert("Non abbiamo incluso l'immagine perchè non avevi abbastanza caratteri a disposizione!");
          }
        }
        const nuovoMessaggio = {
            destinazione: this.destinatari,
            testo: messaggio,
            emailutente: this.user.email,
            fotoutente: this.user.foto,
            dataOra: new Date(),
            like: 0,
            dislike: 0,
            views: 0,
            categoria:"Pubblico"
          };
          
          axios.post('http://localhost:3000/messaggi/', nuovoMessaggio)
            .then(response => {
              console.log('Messaggio inviato con successo:', response.data);
              this.$emit('update');
              //aggiorno quota
              if(this.riduzione){
                if(this.limitD){
                  this.quotaD = 0;
                }else{
                  this.quotaD -= dasottrarre;
                }
                if(this.limitW){
                  this.quotaW = 0;
                }else{
                  this.quotaW -= dasottrarre;
                }
                if(this.limitM){
                  this.quotaM = 0;
                }else{
                  this.quotaM -= dasottrarre;
                }
                //chiamo il server per l'aggiornamento
                try {
                  const response = axios.put('http://localhost:3000/users', {
                    email: this.user.email,
                    quotaD: this.quotaD,
                    quotaW: this.quotaW,
                    quotaM: this.quotaM
                  });
                  console.log('Quotas updated successfully:', response.data);
                  this.clean(); //per svuotare il form html
                } catch (error) {
                  console.error('Error updating quotas:', error);
                }
                //
              }
            })
            .catch(error => {
              console.error('Errore durante l\'invio del messaggio:', error);
            });
      
    },

    clean(){
      this.messaggio="";
      this.destinatari=[];
      this.quotadisposizione=null;
      this.riduzione=false;
      this.limitD=false;
      this.limitW=null;
      this.limitM=null;
      this.url="";
      this.tipologia="";
    },


  }
};
</script>
