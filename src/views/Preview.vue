<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import Feed from '../components/Feed.vue';
import Channel from '../components/Channel.vue';
import Message from '../components/Message.vue';
import axios from 'axios';
import router from '../router';



export default defineComponent({
  name: 'Preview', 
  data() {
    return {
      messaggi:[],
      destinatario:"public",
      canali:["public","TRENDING", "NEWS", "TOP_1000", "RANDOM_1000", "RANDOM_ITALY", "RANDOM_BOLOGNA"],
    };
  },
  
  created() {
    this.caricaMessaggi(this.destinatario);
  },
 
 
  methods: {
    caricaMessaggi(destinatario) {
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
    choose(nomecanale) {
      this.caricaMessaggi(nomecanale);
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
 <nav class="navbar navbar-expand-lg bg-body-tertiary navbar-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Squeeler</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
        </li>
        <li class="nav-item">
        </li>
        <li class="nav-item" v-if="showVipButton">
        </li>
      </ul>
      <form class="d-flex" role="search">
        <router-link to="/login"><button class="btn btn-outline-success" id="log" type="submit" @click="openlogin">Login</button></router-link>
        <router-link to="/signin"><button class="btn btn-outline-success" id="log" type="submit" @click="opensignin">Signin</button></router-link>
      </form>

    </div>
  </div>
</nav>
    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-9">
            <Feed :messaggi="messaggi" :log="false" />
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 right">
                <div class="channelbox">
                    <h2 class="me-5 titolo">Channels</h2>
                    <div class="canale d-flex" v-for="canale in canali" :key="canale" @click="choose(canale)">
                        <p class="channelname">{{canale}}</p>
                    </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
    .right{
        background-color: rgb(226, 226, 226, 0.2);
    }
    nav{
        background-color: black !important;
    }
    #log{
        margin-left: 10px;
    }
    .channelbox{
        padding: 50px 30px;
    }
    .canale{
        margin: 20px 0px;
        border-radius: 20px;
        padding: 15px;
        background-color: white;
    }   
   .channelname{
    width: 50%;
    margin: 0px !important;
   }
</style>
