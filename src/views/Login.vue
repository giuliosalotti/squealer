<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';
import router from '../router';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export default defineComponent({
  name: 'Login', 
  data() {
    return {
      email: '',
      password: '',
      users: []
    };
  },
  methods: {
    async login() {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await axios.post('http://localhost:3000/login/login', {
        email: this.email,
        password: this.password,
      });
      if(response.status == 200){
        const user = response.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        router.push({ name: 'Home' });
      }
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
    <h1>Login</h1>

    <form>
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Email address</label>
            <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input v-model="password" type="password" class="form-control" id="exampleInputPassword1">
        </div>
    
        <button @click="login()" type="submit" class="btn btn-primary">Login</button>
    </form>
</main>
</template>

<style scoped>

main{
    padding: 10%;
}

</style>