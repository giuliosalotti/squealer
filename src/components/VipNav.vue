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
            <RouterLink class="nav-link active" to="/home">Home</RouterLink>
        </li>
      
      </ul>
      <form class="d-flex" role="search">
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
    background-color: rgb(242, 102, 102) !important;
 }
 .avatar{
  width: 40px;
  height: 40px;
  border-radius: 40px;
  margin-left: 20px;
 }
 #logout{
    background-color: white;
    border-color: white;
    border: 0px;
    color:  rgb(242, 102, 102);
 }
</style>

<script>
import router from '../router';

export default {
    props: ['user'],
  data() {
    return {
    };
  },
  methods:{
    logout(){
      localStorage.removeItem('user');
      router.push({ name: 'Preview' });
    }
  },
  
};
</script>