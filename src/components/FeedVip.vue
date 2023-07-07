<template>
    <div class="messaggibox">
        <h2 class="titolo">Le tue attività</h2>
        <div class="messaggio" v-for="(messaggio, i) in messaggi" :key="messaggio._id">
            <div class="d-flex boxautore">
            <img class="avatar" :src="messaggio.fotoutente" alt="">
            <p class="email">{{messaggio.emailutente}}</p>
            </div>
            <p class="testo">{{ messaggio.testo }} </p>
            <div class="row footerbox">
                <div class="statistiche">
                    <div class="row">
                        <div class="col-2 feature">
                            <i class="bi bi-eye"></i>
                            <p class="punteggio">{{messaggio.views}}</p>
                        </div>
                        <div class="col-2 feature">
                            <i class="bi bi-emoji-heart-eyes"></i>
                            <p class="punteggio">{{messaggio.like}}</p>
                        </div>
                        <div class="col-2 feature">
                            <i class="bi bi-emoji-angry"></i>
                            <p class="punteggio">{{messaggio.dislike}}</p>
                        </div>
                    </div>
                    <p class="categoria">{{messaggio.categoria}}</p>
                    <p class="date">{{getdatebyindex(i).toLocaleDateString()}} - {{getdatebyindex(i).toLocaleTimeString()}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .punteggio{
        font-weight: bold;
    }
    .feature{
        background-color: rgb(236 236 236);
        padding: 20px;
        margin: 20px;
        border-radius: 20px;
        text-align: center;
    }
    .titolo{
        margin: 10px 0px 50px 0px;
    }
    .messaggio{
        background-color: rgb(242 102 102 / 20%);;
        padding: 30px 30px 5px 30px;
        border-radius: 20px;
        margin: 30px 0px;
    }
    .messaggibox{
        padding: 50px 30px 50px 30px;
    }

    .testo{
        color: rgb(10, 10, 10);
    }
    .avatar{
        width: 40px;
        height: 40px;
        border-radius: 40px;
        margin-right: 20px;
    }
    .boxautore{
        margin-bottom: 20px;
    }
    .email{
        margin-bottom:0px !important;
        font-weight: bold;           
    }
    .reaction{
        height: 30px;
        padding: 0px;        
        margin-left: 20px;
   }
  
   .footerbox{
    margin-top: 30px;
    margin-bottom: 10px;
   }
   .date{
    display: inline-block;
    margin-left: 10px;
   }
   .bi{
    font-size: 25px;
   }
   .categoria{
    display:inline-block;
    font-weight: bold;
    color: green;
   }
   .statistiche{
    background-color: white;
    border-radius: 20px;
    padding: 20px 30px;
   }
</style>

<script>
import axios from 'axios';
import router from '../router';

export default {
    props: ['messaggi'],
  data() {
    return {
    };
  },
  methods: {
    getdatebyindex(i){
        const d = new Date(this.messaggi[i].dataOra);
        return d;
    },
    
    

  }
};
</script>