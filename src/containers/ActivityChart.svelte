<script lang="ts">
  import { activityHistory } from '../stores/activity-history';
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import type { ChartConfiguration, ChartData } from 'chart.js';

  let chart: Chart | undefined;

  onMount(() => {
    Chart.register(...registerables);
    const ctx = document.getElementById('activity-chart') as HTMLCanvasElement;
    const data: ChartData = {
      labels: $activityHistory.histories.map(day => day.date),
      datasets: [
        {
          label: 'Activity',
          data: Object.values($activityHistory.histories).map(day => day.score.h / 60 + day.score.m),
          fill: true,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.4,
        },
      ],
    };

    const options: ChartConfiguration['options'] = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          max: 24
        }
      }
    };

    chart = new Chart(ctx, {
      type: 'bar',
      data,
      options,
    });

  });
</script>

<div class="activity-chart">
  <canvas id="activity-chart" width="100%" ></canvas>
</div>

<style lang="scss">
  .activity-chart {
    height: inherit;
    // width: 100%;

    #activity-chart {
      width: 100%;
      height: inherit;
    }
  }
</style>
