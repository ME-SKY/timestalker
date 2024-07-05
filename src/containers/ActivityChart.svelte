<script lang="ts">
  import type { ChartConfiguration, ChartData } from 'chart.js';
  import { Chart, registerables } from 'chart.js';
  import { dayWithMonth } from '../helpers';
  import { activityHistory } from '../stores/activity-history';


  let chartCanvas: HTMLCanvasElement;
  let activityChartContainer: HTMLDivElement;
  let chart: Chart | undefined;

  function initChart() {
    // debugger;
    if (chartCanvas) {
      Chart.register(...registerables);
      
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

      chart = new Chart(chartCanvas, {
        type: 'bar',
        data,
        options,
      });
    }
  }

  $: {
    if (!chart && $activityHistory.histories.length > 0) {
      initChart();
    }

    if(chart && $activityHistory.histories.length > 0) {
      chart?.update();
    }
  }

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
