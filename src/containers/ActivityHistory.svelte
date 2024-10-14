<script lang="ts">
  import { projects, projectsArray } from '../stores/projects';
  import { timer } from '../stores/timer';
  import { activityHistory } from '../stores/activity-history';
  import ProjectItem from '../components/ProjectItem.svelte';
  import DayHistory from './DayHistory.svelte';
  import { onMount } from 'svelte';
  import ActivityChart from './ActivityChart.svelte';

  let chartHeight: number;

  $: {
    console.log('history changed', $activityHistory.histories);
  }
</script>

<div class="activity-history">
  <div class="history">
    {#each $activityHistory.histories as dayHistory (dayHistory.date)}
      <DayHistory {dayHistory} />
    {/each}
  </div>

  <div class="chart" bind:clientHeight={chartHeight}>
    <ActivityChart />
  </div>
</div>

<style lang="scss">
  .activity-history {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    gap: 1%;
    padding: 0px 20px;
    width: 100%;
    height: calc(88% - 10% - 12px); //  - 10% for the Settings component
    max-height: calc(88% - 10% - 12px);
    .history {
      z-index: 1;
      box-shadow: 0px 0px 1px 1px rgba(122, 122, 122, 0.26);
      border-radius: 10px;
      display: flex;
      flex-flow: column nowrap;
      overflow: hidden;
      height: 60%;
    }

    .chart {
      background: whitesmoke;
      height: 39%;
      box-shadow: 0px 0px 1px 1px rgba(122, 122, 122, 0.26);
      border-radius: 10px;
    }
  }
</style>
