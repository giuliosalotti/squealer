<template>
    <div class="messaggibox">
        <h2 class="titolo">Feed</h2>
        <div class="messaggio" v-for="messaggio in messaggi" :key="messaggio._id">
            <div class="d-flex boxautore">
            <img class="avatar" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80" alt="">
            <p class="email">{{messaggio.emailutente}}</p>
            </div>
            <p class="testo">{{ messaggio.testo }} </p>
        </div>
    </div>
</template>

<style scoped>
    .titolo{
        margin: 10px 0px 30px 0px;
    }
    .messaggio{
        background-color: rgb(69, 93, 254, 0.2);
        padding: 30px;
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
</style>

<script>

export default {
    props: ['messaggi'],
  data() {
    return {
    };
  },
  methods: {

  }
};
</script>