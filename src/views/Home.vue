<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '../components/Navbar.vue';
import Feed from '../components/Feed.vue';
import Channel from '../components/Channel.vue';
import Message from '../components/Message.vue';
import axios from 'axios';
import router from '../router';

export default defineComponent({
  name: 'Home', 
  data() {
    return {
      email: ''
    };
  },
  mounted() {
    this.email = this.$route.params.email;
    console.log(this.email);
  },
  methods: {
     
  },
  components: {
    Navbar,
    Feed,
    Channel,
    Message
  }
});

</script>

<template>
    <Navbar />
    <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-9">
            <Message :email="email" />
            <Feed />
        </div>
        <div class="col-sm-12 col-md-6 col-lg-3 right">
            <Channel />
        </div>

    </div>
</template>

<style scoped>
    .right{
        background-color: rgb(226, 226, 226, 0.2);
    }
</style>
