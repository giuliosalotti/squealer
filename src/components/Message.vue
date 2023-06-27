<template>
<form class="form" @submit.prevent="inviaMessaggio">
    <h3 style="margin-bottom:30px;">Scrivi qualcosa...</h3>
    <div class="input-group">
        <textarea class="form-control" aria-label="With textarea" placeholder="Voglio scrivere..." v-model="messaggio"></textarea>
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
    <button class="btn btn-success" type="submit" id="button-addon2">Pubblica</button>
</form>
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
    };
  },

watch: {
    destinatario(newValue) {
      this.dest = newValue;
    },
  },
  

  methods: {

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
       const nuovoMessaggio = {
          destinazione: this.destinatari,
          testo: this.messaggio,
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
          })
          .catch(error => {
            console.error('Errore durante l\'invio del messaggio:', error);
          });
    }

  }
};
</script>
