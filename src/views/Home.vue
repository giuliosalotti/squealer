<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import Feed from '../components/Feed.vue';
import Channel from '../components/Channel.vue';
import Message from '../components/Message.vue';
import axios from 'axios';
import router from '../router';



export default defineComponent({
  name: 'Home', 
  data() {
    return {
      messaggi:[],
      email:'',
      user: null,
      destinatario:"public",
      reaction: true,
    };
  },
  
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.email = this.user.email;
    this.caricaMessaggi(this.destinatario);
  },
 
 
  methods: {
    caricaMessaggi(destinatario) {
        if(destinatario == this.email){
          this.reaction = false;
        }
        axios.get(`http://localhost:3000/messaggi/${destinatario}`)
            .then(response => {
            this.messaggi = response.data;
            })
            .catch(error => {
            console.error('Errore durante il recupero dei messaggi:', error);
            });
    },
    updateFeed(newValue) {
      this.destinatario = newValue;
      this.caricaMessaggi(newValue);
    },
  
  },
  components: {
    Navbar,
    Feed,
    Channel,
    Message
  }
});

</script>

<template>
    <Navbar  @pmessage="caricaMessaggi" :user="user" />
    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-9">
            <Message :user="user" :destinatario="destinatario" @update="caricaMessaggi(this.destinatario)"/>
            <Feed :messaggi="messaggi" :log="true" :reaction="reaction"/>
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 right">
            <Channel @feed-change="updateFeed" />
        </div>

    </div>
</template>

<style scoped>
    .right{
        background-color: rgb(226, 226, 226, 0.2);
    }
</style>
