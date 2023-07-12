<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';
import router from '../router';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';



export default defineComponent({
  name: 'Profile', 
  data() {
    return {
      email:'',
      user: null,
      password:"",
      confirm:"",
    };
  },
  
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.email = this.user.email;
    this.updateValue();
  },
 
 
  methods: {
    acquista(tipo){
        this.updateValue();
        if(tipo=="D"){
             try {
                const email = this.email; 
                const quotaDIncrement = this.user.quotaD + 500;
                const response = axios.put(`http://localhost:3000/users`, { email, quotaD: quotaDIncrement });
                } catch (error) {
                    console.error('Errore durante l\'aggiornamento della quotaD:', error);
                }
        }else if(tipo=="W"){
            try {
                const email = this.email; 
                const quotaWIncrement = this.user.quotaW + 500;
                const response = axios.put(`http://localhost:3000/users`, { email, quotaW: quotaWIncrement });
                } catch (error) {
                    console.error('Errore durante l\'aggiornamento della quotaW:', error);
                }
        }else if(tipo=="M"){
            try {
                const email = this.email; 
                const quotaMIncrement = this.user.quotaM + 500;
                const response = axios.put(`http://localhost:3000/users`, { email, quotaM: quotaMIncrement });
                } catch (error) {
                    console.error('Errore durante l\'aggiornamento della quotaM:', error);
                }
        }
    },
   cambiapassword(){
    if (this.password !== this.confirm) {
    }else{
        console.log(this.email);
        try {
            const response = axios.put('http://localhost:3000/users/changepassword', {
            email: this.email,
            password: this.password
        });
            Toastify({
                text: 'Password cambiata',
                duration: 3000, 
                gravity: "bottom"
            }).showToast();
            this.password="";
            this.confirm="";
        } catch (error) {
            console.error('Error changing password:', error);
        }
    }
   },
   async updateValue(){
    try {
      const response = await axios.post('http://localhost:3000/login/login', {
        email: this.user.email,
        password: this.user.password,
      });
      if(response.status == 200){
        this.user = response.data.user;
      }
    } catch (error) {console.log(error);}
   }

  },
  components: {
    Navbar,
  }
});

</script>

<template>
    <Navbar :user="user" />
    <div class="container">
        <h1>I tuoi contatori</h1>
        <div class="row">
            <div class="col-2 feature">
                <h3 class="title">Giornaliera</h3>
                <p class="punteggio">{{user.quotaD}}</p>
            </div>
            <div class="col-2 feature">
                <h3 class="title">Settimanale</h3>
                <p class="punteggio">{{user.quotaW}}</p>
            </div>
            <div class="col-2 feature">
                <h3 class="title">Mensile</h3>
                <p class="punteggio">{{user.quotaM}}</p>
            </div>
        </div>
    </div>
    <div class="container">
        <h3>Acquista caratteri</h3>
        <div class="row">
            <div class="col-2 feature">
                <h3 class="title">Giornalieri</h3>
                <button class="btn btn-outline-success" type="button" data-bs-toggle="modal" data-bs-target="#acquistaG">Acquista</button>
            </div>
            <div class="col-2 feature">
                <h3 class="title">Settimanali</h3>
                <button class="btn btn-outline-success" type="button" data-bs-toggle="modal" data-bs-target="#acquistaS">Acquista</button>
            </div>
            <div class="col-2 feature">
                <h3 class="title">Mensili</h3>
                <button class="btn btn-outline-success" type="button" data-bs-toggle="modal" data-bs-target="#acquistaM">Acquista</button>
            </div>
        </div>
    </div>

    <div class="container changep">
        <h1>Change password</h1>
        <form @submit.prevent="cambiapassword">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Password</label>
                <input type="password" class="form-control" v-model="password">
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Conferma Password</label>
                <input type="password" class="form-control" v-model="confirm">
                <div class="invalid-feedback" v-if="password !== confirm">
                     Le password non corrispondono.
                </div>
            </div>
            <button type="submit" class="btn btn-primary btn-success">Cambia Password</button>
        </form>
    </div>

    <!--modal per l'acquisto-->
    <div class="modal fade" id="acquistaG" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Acquisto caratteri</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Stai per acquistare ulteriori 500 caratteri giornalieri. Vuoi confermare?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" @click="acquista('D')">Acquista</button>
            </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="acquistaS" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Acquisto caratteri</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Stai per acquistare ulteriori 500 caratteri settimanali. Vuoi confermare?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="acquista('W')">Acquista</button>
            </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="acquistaM" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Acquisto caratteri</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Stai per acquistare ulteriori 500 caratteri mensili. Vuoi confermare?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="acquista('M')">Acquista</button>
            </div>
            </div>
        </div>
    </div>

    <!--modal per l'acquisto-->
</template>

<style scoped>
    .container{
        padding-top: 50px;
    }
    .punteggio{
        font-weight: bold;
        font-size: 30px;
    }
    .feature{
        background-color: rgb(236 236 236);
        padding: 20px;
        margin: 20px;
        border-radius: 20px;
        text-align: center;
    }
    .title{
        font-size: 14px;
        font-weight: 800;
    }
    .changep{
        margin-bottom: 10%;
    }
</style>
