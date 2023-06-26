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
        <button class="btn btn-outline-secondary" type="submit" id="button-addon2">Pubblica</button>
    </div>
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
    };
  },

watch: {
    destinatario(newValue) {
      this.dest = newValue;
    },
  },
  

  methods: {
    inviaMessaggio() {
      if(this.simbolo == '§'){
       this.send();
      }else if(this.simbolo == '#'){
        //creazione canale estemporaneo
        this.creatori.push(this.user);
        axios.post('http://localhost:3000/canali', {
            nome: this.dest,
            immagine: "https://images.unsplash.com/photo-1499988921418-b7df40ff03f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bm90aGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            creatore: this.creatori
        }).then(response => {
            console.log('Canale aggiunto con successo:', response.data);
            this.send();
        }).catch(error => {
            console.error('Errore durante l\'aggiunta del canale:', error);
        });
      }else{
        //creazione di un messaggio privato, creare una collezione messaggiprivati da non chiamare messaggi perchè messaggi è la nomenclatura per il feed
      }
    },

    send(){
       const nuovoMessaggio = {
          destinazione: this.dest,
          testo: this.messaggio,
          emailutente: this.user.email,
          fotoutente: this.user.foto,
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
