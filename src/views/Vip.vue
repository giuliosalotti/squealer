<script lang="ts">
import { defineComponent } from 'vue';
import VipNav from '../components/VipNav.vue';
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
      trends:[],
      email:'',
      user: null,
      destinatario:"public",
    };
  },
  
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.email = this.user.email;
    this.caricaMessaggi(this.email);
    this.caricatrend();
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
    caricatrend(){
        axios.get('http://localhost:3000/vip/trends')
        .then(response => {
            this.trends = response.data;
        })
        .catch(error => {
            console.error('Errore durante la richiesta dei messaggi:', error);
        });
    },

  },
  components: {
    VipNav,
    FeedVip,
    Channel,
    Message
  }
});

</script>

<template>
    <VipNav :user="user" />
    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-9">
            <FeedVip :messaggi="messaggi" />
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 right">
            <h2 style="margin: 10px 0px 40px 0px;">Top 10 Trends</h2>
            <ol class="list-group list-group-numbered">
                <li class="list-group-item d-flex justify-content-between align-items-start" v-for="trend in trends" :key="trend._id">
                    <div class="ms-2 me-auto">
                    <div class="fw-bold">{{trend.emailutente}}</div>
                    {{trend.testo}}
                    </div>
                    <span class="badge bg-danger rounded-pill">{{trend.views}}</span>
                </li>
            </ol>
        </div>

    </div>
</template>

<style scoped>
    .right{
        background-color: rgb(226, 226, 226, 0.2);
        padding: 30px 30px;
    }
    
   
    
</style>
