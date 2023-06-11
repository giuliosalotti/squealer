<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';

export default defineComponent({
  name: 'Signin', 
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async signin() {
      event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login/signin', {
        email: this.email,
        password: this.password,
      });
      // Gestisci la risposta dal server qui
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
    <h1>Sign-in</h1>

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
        <button @click="signin()" type="submit" class="btn btn-primary">Sign-in</button>
    </form>
</main>
</template>

<style scoped>

main{
    padding: 10%;
}

</style>