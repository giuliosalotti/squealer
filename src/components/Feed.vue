<template>
    <div class="messaggibox">
        <h2 class="titolo">Feed</h2>
        <div class="messaggio" v-for="(messaggio, i) in messaggi" :key="messaggio._id">
            <div class="d-flex boxautore">
            <img class="avatar" :src="messaggio.fotoutente" alt="">
            <p class="email">{{messaggio.emailutente}}</p>
            </div>
            <p class="testo">{{ removeUrl(messaggio.testo) }} </p>
            <img v-if="messaggio.testo.includes('FOTO')" :src="getImageSrc(messaggio.testo)" class="media">
            <video class="media" v-if="messaggio.testo.includes('VIDEO')" :src="getVideoUrl(messaggio.testo)" controls></video>
            <iframe v-if="messaggio.testo.includes('MAPPA')" :src="getMapUrl(messaggio.testo)" class="media" frameborder="0" style="border:0" allowfullscreen></iframe>
            <div class="row footerbox">
                <div class="col-4">
                    <button v-if="log" class="btn reaction" @click="incrementaViews(messaggio._id)">{{messaggio.views}}  <i class="bi bi-emoji-sunglasses"></i></button>
                    <button v-if="log" class="btn reaction" @click="incrementaLike(messaggio._id)" >{{messaggio.like}}  <i class="bi bi-emoji-heart-eyes"></i></button>
                    <button v-if="log" class="btn reaction" @click="decrementaLike(messaggio._id)">{{messaggio.dislike}}  <i class="bi bi-emoji-angry"></i></button>
                </div>
                <div class="col-8 datebox" >
                    <p class="categoria">{{messaggio.categoria}}</p>
                    <p class="date">{{getdatebyindex(i).toLocaleDateString()}} - {{getdatebyindex(i).toLocaleTimeString()}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .titolo{
        margin: 10px 0px 30px 0px;
    }
    .messaggio{
        background-color: rgb(69, 93, 254, 0.2);
        padding: 30px 30px 5px 30px;
        border-radius: 20px;
        margin: 30px 0px;
    }
    .messaggibox{
        padding: 20px 30px 50px 30px;
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
   .datebox{
    display: flex;
    justify-content: flex-end;
   }
   .footerbox{
    margin-top: 30px;
    margin-bottom: 10px;
   }
   .date{
    margin-left: 10px;
   }
   .bi{
    font-size: 25px;
   }
   .categoria{
    font-weight: bold;
    color: green;
   }
   .media{
    max-width: 80%;
    max-height: 80%;
   }
</style>

<script>
import axios from 'axios';
import router from '../router';

export default {
    props: ['messaggi', 'log'],
  data() {
    return {
    };
  },
  methods: {
    removeUrl(testo) {
      const splitArray = testo.split("VIDEO:");
      if (splitArray.length > 1) {
        return splitArray[0].trim();
      }else{
        const splitArray = testo.split("FOTO:");
        if (splitArray.length > 1) {
          return splitArray[0].trim();
        }else{
          const splitArray = testo.split("MAPPA:");
          if (splitArray.length > 1) {
            return splitArray[0].trim();
          }else{
            return testo;
          }
        }
      }
    },
    getImageSrc(testo) {
      const splitArray = testo.split("FOTO:");
      if (splitArray.length > 1) {
        return splitArray[1].trim();
      }
      return ""; // Ritorna una stringa vuota se il formato non è corretto
    },
    getVideoUrl(testo) {
      const splitArray = testo.split("VIDEO:");
      if (splitArray.length > 1) {
        return splitArray[1].trim();
      }
      return ""; // Ritorna una stringa vuota se il formato non è corretto
    },
    getMapUrl(testo) {
      const splitArray = testo.split("MAPPA:");
      if (splitArray.length > 1) {
        return splitArray[1].trim();
      }
      return ""; // Ritorna una stringa vuota se il formato non è corretto
    },
    
    getdatebyindex(i){
        const d = new Date(this.messaggi[i].dataOra);
        return d;
    },
    incrementaLike(idMessaggio){
      const messaggio = this.messaggi.find(m => m._id === idMessaggio);
      messaggio.like++;
      this.update(idMessaggio, messaggio);
    },
    decrementaLike(idMessaggio){
      const messaggio = this.messaggi.find(m => m._id === idMessaggio);
      messaggio.dislike++;
      this.update(idMessaggio, messaggio);
    },
    incrementaViews(idMessaggio){
      const messaggio = this.messaggi.find(m => m._id === idMessaggio);
      messaggio.views++;
      this.update(idMessaggio, messaggio);
    },
    update(idMessaggio, messaggio) {
      axios.put(`http://localhost:3000/messaggi/${idMessaggio}`, messaggio)
        .then(response => {
          console.log('Messaggio aggiornato con successo:', response.data);
        })
        .catch(error => {
          console.error('Errore durante l\'aggiornamento del messaggio:', error);
        });
    },

  }
};
</script>