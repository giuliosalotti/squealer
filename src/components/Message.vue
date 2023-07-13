<template>
<form class="form" v-if="!isAllUppercase(destinatario)" @submit.prevent="inviaMessaggio">
    <h3 style="margin-bottom:30px;">Scrivi qualcosa...</h3>
    
    <div class="input-group">
        <textarea class="form-control messaggio" placeholder="Voglio scrivere..." :maxlength="!pubblico ? undefined : quotaM" v-model="messaggio" @input.once="getQuota" @input="countQuota" @keydown="cancelcheck"></textarea>
         <span v-if="pubblico" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{{quotadisposizione}}</span>
    </div>
    <div class="input-group">
        <select class="form-select input-group-text" v-model="simbolo">
          <option v-if="privato" value="@">@</option>
          <option v-if="pubblico" value="§">§</option>
          <option v-if="pubblico" value="#">#</option>
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
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

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
      categoria: [],
      d: false,
      privato: true,
      pubblico: true,
    };
  },

watch: {
    destinatario(newValue) {
      this.dest = newValue;
    },
  },
 
  methods: {
    cancelcheck(event){
      const key = event.key;
      if (key === "Backspace" || key === "Delete") {
        this.d = true;
      }else{
        this.d = false;
      }
    },
    //controlla se il canale è gestito dalla redazione, non puoi scrivere messaggi
    isAllUppercase(text) {
      return text === text.toUpperCase();
    },
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
      if(this.pubblico){
        if(this.limitD==false){
          this.quotadisposizione = this.quotaD-this.messaggio.length;
          if(this.quotaD-this.messaggio.length<=0){
            if(!this.d){
              Toastify({
                    text: 'Sei passato alla quota settimanale. Se non vuoi utilizzarla, cancella qualche carattere!',
                    duration: 6000, 
                    gravity: "bottom"
                }).showToast();
            }
            this.limitD = true;
            this.limitW = false;
            this.quotadisposizione = this.quotaW-this.messaggio.length;
          }
        }
        if(this.limitW==false && this.limitD==true){
          this.quotadisposizione = this.quotaW-this.messaggio.length;
          if(this.quotaW-this.messaggio.length<=0){
            if(!this.d){
              Toastify({
                    text: 'Sei passato alla quota mensile. Se non vuoi utilizzarla, cancella qualche carattere!',
                    duration: 6000, 
                    gravity: "bottom"
                }).showToast();
            }
            this.limitW = true;
            this.limitM = false;
            this.quotadisposizione = this.quotaM-this.messaggio.length;
          }
        }
        
        if(this.limitM==false && this.limitD==true && this.limitW==true){
            this.quotadisposizione = this.quotaM-this.messaggio.length;
            if(this.quotaM-this.messaggio.length<=0){
              if(!this.d){
                Toastify({
                    text: 'Hai terminato tutti i tuoi caratteri. Se vuoi continuare a scrivere, cancella qualche carattere!',
                    duration: 6000, 
                    gravity: "bottom"
                }).showToast();
              }
              this.limitM = true;
          }
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
        console.log(this.quotaM);
        console.log(this.messaggio.length);
      }
    },

    //metodo per rimuovere un destinatario prima di aver inviato il messaggio
    rimuoviDestinatario(identificatore) {
      this.destinatari = this.destinatari.filter(destinatario => destinatario.destinatario !== identificatore);
      if(this.destinatari.length==0){
        this.privato = true;
        this.pubblico = true;
      }
    },
    addDestinatario(){
      //se il destinatario è privato non faccio inserire messaggi pubblici
      if(this.simbolo=='§' || this.simbolo=='#' && !this.destinatari.some(destinatario => destinatario.includes('@'))){
        this.pubblico = true;
        this.privato = false;
      }
      if(this.simbolo=='@' && !this.destinatari.some(destinatario => destinatario.includes('§')) && !this.destinatari.some(destinatario => destinatario.includes('#'))){
        this.privato = true;
        this.pubblico = false;
      }
      this.destinatari.push({simbolo: this.simbolo, destinatario: this.dest});
      this.dest = '';
    },

    inviaMessaggio() {
      if(this.messaggio.length>0 && this.destinatari.length>0){   
        this.destinatari.forEach(destinatario => {
          if(destinatario.simbolo == '§' || destinatario.simbolo == '#'){
            //this.riduzione = true;
            this.categoria.push("Pubblico");
          }else if(destinatario.simbolo == '@'){
            this.categoria.push("Privato");
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
      }else{
        this.toast("Errore pubblicazione! Devi inserire il testo del messaggio oppure qualche destinatario.");
      }
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
            categoria:this.categoria,
            reazioni: [],
            risposte: [], 
          };
          
          axios.post('http://localhost:3000/messaggi/', nuovoMessaggio)
            .then(response => {
              console.log('Messaggio inviato con successo:', response.data);
              this.$emit('update');
              //aggiorno quota
              if(this.pubblico && !this.privato){
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
                } catch (error) {
                  console.error('Error updating quotas:', error);
                }
                //
              }
              this.clean(); 
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
      this.pubblico = true;
      this.privato = true;
    },

    toast(testo){
      Toastify({
                  text: testo,
                  duration: 6000, 
                  gravity: "bottom"
      }).showToast();
    }

  }
};
</script>
