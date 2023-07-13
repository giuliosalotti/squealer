<template>
    <div class="container">
        <h2 style="margin-bottom:30px;">Andamento popolarità</h2>
        <p>Un post Popolare è segnato con un punteggio di 10, un post Controverso con un punteggio 0, un post Normale con punteggio 1 e un post Impopolare con punteggio -10</p>
        <Line :data="data" :options="options" :key="graphKey" />
    </div>
    <div class="container">
        <h2 style="margin-bottom:30px;">Numero risposte</h2>
        <Line :data="data2" :options="options" :key="graphKey" />
    </div>
    <div class="container">
        <h2 style="margin-bottom:30px;">Frequenza post</h2>
        <Bar :data="data3" :options="options" :key="graphKey" />
    </div>
</template>

<style scoped>
    .container{
        padding: 30px;
    }
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import router from '../router';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar } from 'vue-chartjs';
import { Line } from 'vue-chartjs'


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default {
  props: ['messaggi'],
  name: 'Graph',
  components: {
    Line, Bar,
  }, 
  data() {
    return {
      data: {
        labels: [],
        datasets: [
          {
            label: 'Punteggio',
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },
      data2: {
        labels: [],
        datasets: [
          {
            label: 'N° risposte',
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },
      data3: {
        labels: [],
        datasets: [
          {
            label: 'Post x mese',
            backgroundColor: '#f87979',
            data: []
          }
        ]
      },
      options: {
        responsive: true
      },
      graphKey: 0,
    };
  },
  
  computed: {
    isMessaggiLoaded() {
      return this.messaggi.length > 0;
    }
  },
  mounted() {
    if (this.isMessaggiLoaded) {
      this.formatChartData();
      this.getRisposteScore();
      this.getMonth();
    }
  },
  watch: {
    messaggi() {
        this.formatChartData();
        this.getRisposteScore();
        this.getMonth();
    }
  },

  methods: {  
    formatChartData() {
      this.data.labels = this.messaggi.map((messaggio, index) => index+1 + "° Messaggio");
      this.data.datasets[0].data = this.messaggi.map((messaggio) => this.calculateScore(messaggio));
      this.graphKey++;
    },

    calculateScore(messaggio) {
      if (messaggio.categoria.includes('Popolare')) {
        return 10;
      } else if (messaggio.categoria.includes('Impopolare')) {
        return -10;
      } else if (messaggio.categoria.includes('Controverso')) {
        return 0;
      } else {
        return 1;
      }
    },

    getRisposteScore() {
      this.data2.labels = this.messaggi.map((messaggio, index) => index + 1 + "° Messaggio");
      this.data2.datasets[0].data = this.messaggi.map((messaggio) => messaggio.risposte.length);
      this.graphKey++; 
    },

    getMonth() {
      const monthCounts = new Array(12).fill(0);
      this.messaggi.forEach((messaggio) => {
        const month = new Date(messaggio.dataOra).getMonth(); 
        monthCounts[month]++; 
      });
      this.data3.labels = Array.from({ length: 12 }, (_, i) => i + 1); 
      this.data3.datasets[0].data = monthCounts;
      this.graphKey++; 
    }

  },
  
};

</script>
