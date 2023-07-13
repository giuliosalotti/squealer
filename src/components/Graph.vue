<template>
    <Line :data="data" :options="options" />
</template>

<style scoped>
    
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


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)


export default {
  props: ['messaggi'],
  name: 'Graph',
  components: {
    Line
  }, 
  data() {
    return {
      data: {
        labels: [],
        datasets: [
          {
            data: []
          }
        ]
      },
      options: {
        responsive: true
      }
    };
  },
  
  created() {
    this.formatChartData();
  },
  

  methods: {  
    formatChartData() {
      this.data.labels = this.messaggi.map((messaggio) => messaggio.dataOra);
      this.data.datasets[0].data = this.messaggi.map((messaggio) => this.calculateScore(messaggio));
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
    }
  },
  
};

</script>
