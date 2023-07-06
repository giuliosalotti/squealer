<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import FeedVip from '../components/FeedVip.vue';
import Channel from '../components/Channel.vue';
import Message from '../components/Message.vue';
import axios from 'axios';
import router from '../router';



export default defineComponent({
  name: 'Vip', 
  data() {
    return {
      messaggi:[],
      email:'',
      user: null,
      destinatario:"public",
    };
  },
  
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.email = this.user.email;
    this.caricaMessaggi(this.email);
  },
 
 
  methods: {
    caricaMessaggi(email) {
        axios.get(`http://localhost:3000/messaggi/vip/${email}`)
            .then(response => {
                this.messaggi = response.data;
            })
            .catch(error => {
            console.error('Errore durante il recupero dei messaggi:', error);
            });
    },

  },
  components: {
    Navbar,
    FeedVip,
    Channel,
    Message
  }
});

</script>

<template>
    <Navbar :user="user" />
    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-9">
            <FeedVip :messaggi="messaggi" />
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 right">
        </div>

    </div>
</template>

<style scoped>
    .right{
        background-color: rgb(226, 226, 226, 0.2);
    }
    nav{
        background-color: rgb(242, 102, 102) !important;
    }
   
    
</style>
