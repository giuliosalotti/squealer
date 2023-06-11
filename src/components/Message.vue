<template>
<form class="form" @submit="inviaMessaggio">
    <h3 style="margin-bottom:30px;">Scrivi qualcosa...</h3>
    <div class="input-group">
        <textarea class="form-control" aria-label="With textarea" placeholder="Voglio scrivere..." v-model="messaggio"></textarea>
    </div>
    <div class="input-group">
        <span class="input-group-text" id="basic-addon1">@</span>
        <input type="text" class="form-control" placeholder="public" aria-label="Username" aria-describedby="basic-addon1" v-model="destinatario">
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
</style>


<script>
import axios from 'axios';

export default {
    props: ['email'],
  data() {
    return {
      destinatario: 'public',
      messaggio: ''
    };
  },
  methods: {
    inviaMessaggio() {
        event.preventDefault();
      const nuovoMessaggio = {
        destinazione: this.destinatario,
        testo: this.messaggio,
        emailutente: this.email
      };

      axios.post('http://localhost:3000/messaggi/', nuovoMessaggio)
        .then(response => {
          console.log('Messaggio inviato con successo:', response.data);
        })
        .catch(error => {
          console.error('Errore durante l\'invio del messaggio:', error);
        });
    }
  }
};
</script>
