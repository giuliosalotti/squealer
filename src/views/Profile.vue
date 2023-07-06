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
  },
 
 
  methods: {
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
</template>

<style scoped>
    .container{
        padding-top: 50px;
    }
</style>
