<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';
import router from '../router';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export default defineComponent({
  name: 'Signin', 
  data() {
    return {
      email: '',
      password: '',
      foto: ''
    };
  },
  methods: {
    async signin() {
      event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login/signin', {
        email: this.email,
        password: this.password,
        foto: this.foto,
        quotaD: 500,
        quotaW: 3500,
        quotaM: 14000,
      });
      Toastify({
                    text: 'Registrazione effettuata con successo!',
                    duration: 6000, 
                    gravity: "bottom"
                }).showToast();
      router.push({ name: 'Login' });
    } catch (error) {
      Toastify({
                    text: 'Qualcosa non va:' + error,
                    duration: 6000, 
                    gravity: "bottom"
                }).showToast();
    }
  },
  },
  components: {
    Navbar,
  }
});

</script>

<template>
<main>
    <h1>Sign-in</h1>

    <form @submit="signin">
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Email address</label>
            <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" required>
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" required>
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Foto profilo</label>
            <input v-model="foto" type="text" placeholder="https://" class="form-control" id="urlfoto" required>
        </div>
        <button type="submit" class="btn btn-primary">Sign-in</button>
    </form>
</main>
</template>

<style scoped>

main{
    padding: 10%;
}

</style>