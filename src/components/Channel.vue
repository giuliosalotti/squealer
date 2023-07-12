<template>
    <div class="channelbox">
        <!--ricerca canali-->
        <h2 style="margin-bottom:30px;">Ricerca Canali</h2>
        <input @input="searchChannels" class="form-control search" type="text" v-model="searchQuery" placeholder="Cerca canale" />
        <div class="canale d-flex" v-for="canale in filteredCanali" :key="canale.id" @click="choose(canale.nome)">
            <img  class="me-2 avatar" :src="canale.immagine">
            <p class="channelname">{{canale.nome}}</p>
            <button class="btn info" @click="addiscrizione(canale)"><i class="bi bi-lg bi-heart"></i></button>
            <button class="btn info" @click="getCreatorEmails(canale)"><i class="bi bi-lg bi-info-circle"></i></button>
            <button class="btn info" @click="eliminaCanale(canale)" v-if="isCreator(canale)"><i class="bi bi-trash"></i></button>
        </div>
        <!--ricerca canali-->

        <!--canali a cui sei iscritto -->
        <div class="d-flex" style="margin-bottom:35px;">
            <h2 class="me-5 titolo" v-if="savedChannels.length > 0" >Iscrizioni</h2>
        </div>
        <div class="canale d-flex" v-for="canale in savedChannels" :key="canale.id" @click="choose(canale.nome)">
            <img  class="me-2 avatar" :src="canale.immagine">
            <p class="channelname">{{canale.nome}}</p>
            <button class="btn info" @click="removeiscrizione(canale)"><i class="bi bi-lg bi-heart-fill"></i></button>
            <button class="btn info" @click="getCreatorEmails(canale)"><i class="bi bi-lg bi-info-circle"></i></button>
            <button class="btn info" @click="eliminaCanale(canale)" v-if="isCreator(canale)"><i class="bi bi-trash"></i></button>
        </div>
        <!--canali a cui sei iscritto -->
        <div class="d-flex" style="margin-bottom:35px;">
            <h2 class="me-5 titolo">Channels</h2>
            <button type="button" class="btn btn-success btn-sm"  @click="show">{{tbtn1}}</button>
        </div>
         <form id="addchannel" v-if="addbox" @submit="aggiungiCanale">
                <div class="mb-3">
                    <input type="text" class="form-control" placeholder="Titolo canale" v-model="nomecanale" required>
                </div>
                <div class="mb-3">
                    <input type="text" class="form-control" placeholder="Url immagine copertina" v-model="immagine" required>
                </div>
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text" id="basic-addon1">@</span>
                        <input type="text" class="form-control" placeholder="aggiungi utenti creatori" aria-label="Username" aria-describedby="basic-addon1" v-model="nickcreatore">
                        <button class="btn btn-success"  @click="addcreatore">+</button>
                    </div>
                    <span class="badge text-bg-success" v-for="creatore in creatori" :key="creatore.id">{{creatore.email}}
                        <button class="btn btn-sm btn-light ml-2 bbadge" @click="rimuoviCreatore(creatore.email)">&times;</button>
                    </span>
                </div>
                <button type="submit" class="btn btn-success btn-sm">Crea canale</button>
            </form>

        <div class="canale d-flex" v-for="canale in canali" :key="canale.id" @click="choose(canale.nome)">
            <img  class="me-2 avatar" :src="canale.immagine">
            <p class="channelname">{{canale.nome}}</p>
            <button class="btn info" @click="addiscrizione(canale)"><i class="bi bi-lg bi-heart"></i></button>
            <button class="btn info" @click="getCreatorEmails(canale)"><i class="bi bi-lg bi-info-circle"></i></button>
            <button class="btn info" @click="eliminaCanale(canale)" v-if="isCreator(canale)"><i class="bi bi-trash"></i></button>
        </div>
        

    </div>
</template>

<style scoped>
    .titolo{
        margin-bottom: 0px !important;
    }
    .channelbox{
        padding: 50px 30px;
    }
    .avatar{
        width: 35px;
        height: 35px;
        border-radius: 30px;
        object-fit: cover;
    }
    .canale{
        margin: 20px 0px;
    }
   #addchannel{
    margin-bottom: 60px;
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
   .info{
    height: 30px;
    padding: 0px;
   }
   .bi{
    color: #4b4b4b;
    margin-left: 10px;
    font-size: 20px;
    font-weight: 800;
   }
   .channelname{
    width: 50%;
   }
   .search{
    margin-bottom: 40px;
   }
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import router from '../router';

export default {
  name: 'Channel', 
  data() {
    return {
      email:'',
      user: null,
      canali:[],
      addbox: false,
      tbtn1: "Aggiungi",
      nomecanale:"",
      creatori: [],
      nickcreatore:"",
      immagine: "",
      savedChannels: [],
      searchQuery: "",
      ricerca:[],
      filteredCanali:[],
    };
  },
  
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.email = this.user.email;
    this.caricaCanali();
    this.getSavedChannels();
  },

  
 
 
  methods: {  
    searchChannels(){
        if(this.searchQuery != ""){
            this.filteredCanali = this.canali.filter(canale => {
                return canale.nome.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        }
        
    },
    removeiscrizione(channel){
        const index = this.savedChannels.indexOf(channel);
        if (index !== -1) {
            this.savedChannels.splice(index, 1);
            localStorage.setItem('savedChannels', JSON.stringify(this.savedChannels));
        }
    },  
     //metodo per ottenere i canali salvati
     getSavedChannels() {
        const savedChannels = localStorage.getItem('savedChannels');
        this.savedChannels = JSON.parse(savedChannels);
    },
    addiscrizione(channel){
        this.getSavedChannels();
        this.savedChannels.push(channel);
        localStorage.setItem('savedChannels', JSON.stringify(this.savedChannels));
    },
     //metodo per caricare la lista di canali
    caricaCanali() {
        axios.get('http://localhost:3000/canali')
            .then(response => {
            this.canali = response.data;
            })
            .catch(error => {
            console.error('Errore durante il recupero dei messaggi:', error);
            });
    },

    //metodo per mostrare il box di creazione di un canale
    show(){
        if(this.addbox){
            this.tbtn1 = "Aggiungi";
            this.addbox=false;   
        }else{
            this.tbtn1 = "Annulla";
            this.addbox=true;  
        }      
    },

    //metodo per aggiungere un canale 
    aggiungiCanale(){
        this.creatori.push(this.user);
        axios.post('http://localhost:3000/canali', {
            nome: this.nomecanale,
            immagine: this.immagine,
            creatore: this.creatori
        }).then(response => {
            console.log('Canale aggiunto con successo:', response.data);
        }).catch(error => {
            console.error('Errore durante l\'aggiunta del canale:', error);
        });
    },

    //metodo per aggiungere un creatore prima di aver aggiunto il nuovo canale
    async addcreatore(){
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/getuser', {
            email: this.nickcreatore,
        });
            if(response.status == 200){
                const utente = response.data.user;
                //controlla se già non è stato inserito
                if (!this.creatori.some(item => item.email === utente.email) && utente.email != this.user.email) {
                    this.creatori.push(utente);
                    this.nickcreatore = "";
                }else{
                    alert("utente già inserito!");
                }
            }else{
                alert("Utente non trovato");
            }
        } catch (error) {

        }
    },

    //metodo per rimuovere un creatore prima di aver creato il canale
    rimuoviCreatore(email) {
        this.creatori = this.creatori.filter(creatore => creatore.email !== email);
    },

    //metodo che abilita il bottone cancella solo se l'utente è il creatore di quel canale
    isCreator(canale) {
      return canale.creatore.some(creatore => creatore.email === this.user.email);
    },

    //metodo per eliminare un canale creato
    eliminaCanale(canale) {
      axios.delete(`http://localhost:3000/canali/${canale._id}`)
        .then(response => {
          console.log('Canale eliminato con successo');
        })
        .catch(error => {
          console.error('Errore durante l\'eliminazione del canale:', error);
        });
    },

    //metodo per leggere i creatori di un canale
    getCreatorEmails(canale) {
      alert("Canale creato da:" + canale.creatore.map(creatore => creatore.email).join(', '));
    },

    //metodo per caricare il feed di quel canale
    choose(nomecanale) {
      this.$emit('feed-change', nomecanale);
    },


  },
  components: {
  }
};

</script>
