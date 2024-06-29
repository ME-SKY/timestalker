<script lang="ts">
  import { activityHistory } from '../stores/activity-history';
  import { onMount } from 'svelte';
  import {dayWithMonth} from '../helpers';
  import { Chart, registerables } from 'chart.js';
  import type { ChartConfiguration, ChartData } from 'chart.js';


  export let height: number = 0;

  let chartCanvas: HTMLCanvasElement;
  let activityChartContainer: HTMLDivElement;
  // let chart: Chart | undefined;

  function initChart() {
    // debugger;
    if (chartCanvas) {
      console.log('chartCanvas', chartCanvas);
      Chart.register(...registerables);
      // const ctx = document.getElementById('activity-chart') as HTMLCanvasElement;
      const data: ChartData = {
        labels: $activityHistory.histories.map((day) => dayWithMonth(day.date)),
        datasets: [
          {
            label: 'Activity',
            data: Object.values($activityHistory.histories).map(
              (day) => day.score.h,
            ),
            fill: true,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            // tension: 2,
          },
        ],
      };

      const options: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: 12,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return value.toString();
              },
            },
          },
        },
      };

      new Chart(chartCanvas, {
        type: 'bar',
        data,
        options,
      });
    }
  }

  $: {
    if (chartCanvas && $activityHistory.histories.length > 0) {
      initChart();
    }
  }



  onMount(() => {
    // if(activityChartContainer){
    //   const parent = activityChartContainer.parentElement;
    //   console.log('parent height', parent?.clientHeight);
    // }
  })
</script>

<div class="activity-chart" >
  <canvas id="activity-chart" width="100%" height="100%" bind:this={chartCanvas}></canvas>
</div>

<style lang="scss">
  .activity-chart {
    height: 100%;
    // width: 100%;

    #activity-chart {
      width: 100%;
      height: 100%;
    }
  }
</style>
