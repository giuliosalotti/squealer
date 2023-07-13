<template>
<!--

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
      -->
  <nav class="navbar navbar-expand-lg bg-body-tertiary navbar-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Squeeler</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
            <RouterLink class="nav-link active" to="/home" @click="home">Home</RouterLink>
        </li>
        <li class="nav-item" v-if="showVipButton">
          <RouterLink class="nav-link active" to="/vip">Vip Dashboard</RouterLink>
        </li>
      </ul>
      <form class="d-flex" role="search">
        <button class="btn btn-outline-success" id="pmessage" type="button" @click="mprivate(user.email)">Messaggi Privati</button>
        <button class="btn btn-outline-success" id="logout" type="submit" @click="logout">Logout</button>
      </form>
          <a href="/profile"><img class="avatar" :src="user.foto" alt=""></a>

    </div>
  </div>
</nav>
</template>

<style scoped>
 @media (max-width: 768px) {
    .avatar {
      display: none;
    }
  }
 nav{
  background-color: black !important;
 }
 .avatar{
  width: 40px;
  height: 40px;
  border-radius: 40px;
  margin-left: 20px;
 }
 #pmessage{
  margin-right: 10px;
 }
 
</style>

<script>
import router from '../router';
import axios from 'axios';

export default {
    props: ['user'],
  data() {
    return {
      showVipButton: false,
    };
  },
  created() {
    this.checkvip(this.user);
  },
  methods:{
    home(){
      if (this.$route.name === 'Home') {
        window.location.reload();
      } 
    },
    logout(){
      localStorage.removeItem('user');
      router.push({ name: 'Preview' });
    },
    checkvip(user){
      axios.get(`http://localhost:3000/vip/check/${user.email}`)
      .then(response => {
        const isVip = response.data.isVip;
        if (isVip) {
          this.showVipButton = true;
        } else {
          this.showVipButton = false;
        }
      })
      .catch(error => {
        console.error('Errore durante la verifica dell\'utente VIP:', error);
      });
    },
    mprivate(email){
      this.$emit('pmessage', email);
    }

  },
  
};
</script>