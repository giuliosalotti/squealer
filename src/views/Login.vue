<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';
import router from '../router';

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
      // Gestisci gli errori qui
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
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Check me out</label>
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