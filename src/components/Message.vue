<template>
<form class="form" @submit="inviaMessaggio">
    <h3 style="margin-bottom:30px;">Scrivi qualcosa...</h3>
    <div class="input-group">
        <textarea class="form-control" aria-label="With textarea" placeholder="Voglio scrivere..." v-model="messaggio"></textarea>
    </div>
    <div class="input-group">
        <select class="form-select input-group-text">
          <option value="@" selected>@</option>
          <option value="§">§</option>
          <option value="#">#</option>
        </select>
        <input id="inputtype" type="text" class="form-control" placeholder="public" aria-label="Username" aria-describedby="basic-addon1" v-model="destinatario">
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
    props: ['user'],
  data() {
    return {
      destinatario: 'public',
      messaggio: ''
    };
  },
  methods: {
    inviaMessaggio() {
      
      const nuovoMessaggio = {
        destinazione: this.destinatario,
        testo: this.messaggio,
        emailutente: this.user.email,
        fotoutente: this.user.foto,
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
