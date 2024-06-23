<script lang="ts">
  import { projects, projectsArray } from '../stores/projects';
  import { timer } from '../stores/timer';
  import { activityHistory } from '../stores/activity-history';
  import ProjectItem from '../components/ProjectItem.svelte';
  import DayHistory from './DayHistory.svelte';
  import { onMount } from 'svelte';

  // let histories = $activityHistory.histories.length ? $activityHistory.histories : [];

  // onMount(() => {
  // console.log('last projects', $activityHistory.lastProjects);
  // });

  // const toggleProject = (projectName) => {
  //   if ($timer.timerName === projectName) {
  //     if ($timer.state === 'running') {
  //       projects.updateProject($timer.timerName, timer.pause());
  //     } else {
  //       projects.resumeProject($timer.timerName);
  //     }
  //   } else {
  //     if ($timer.timerName !== '') {
  //       if ($projects.has($timer.timerName)) {
  //         projects.updateProject($timer.timerName, timer.pause());
  //       }
  //     }

  //     projects.resumeProject(projectName);
  //   }
  // };
</script>

<div class="activity-history">
  <div class="history">
    {#each $activityHistory.histories as dayHistory (dayHistory.date)}
      <DayHistory {dayHistory} />
      <!-- {dayHistory.date} -->
    {/each}
  </div>

  <div class="chart-here">chart</div>
  <!-- <div class="last-activity-short-hours-score"> -->
  <!-- <h6 class="this-day-hours-score">This day: 4 h 30 min</h6> -->
  <!-- <h6 class="this-week-hours-score">This week: 7 h 30 min</h6> -->
  <!-- </div> -->

  <!-- <div class="last-activity-detailed">
    <div class="last-activity-date-and-score">
      <h5 class="date">{$activityHistory.date?.short}</h5>
      <h5 class="score">
        {$activityHistory.score.h > 0
          ? `${$activityHistory.score.h} h `
          : ''}{$activityHistory.score.m} m
      </h5>
    </div>

    <div class="last-activity-projects">
      {#each $activityHistory.lastProjects as project (project.name)}
        <div
          class="project-block"
          class:active={($timer.timerName === project.name && $timer.state === 'running')}
        >
          <ProjectItem
            on:state-button-click={toggleProject}
            name={project.name}
            timeSpent={project.stringRepresentation}
            periods={project.periodsByDate}
            projectState={$timer.timerName === project.name &&
            $timer.state === 'running'
              ? 'running'
              : 'paused'}
          />
        </div>
      {/each}
    </div>
  </div> -->
</div>

<style lang="scss">
  // .сhart-here {
  //   min-height: 30%;
  //   background: rgba(65, 89, 195, 0.26);
  // }
  
  .activity-history {
    // container: activityHistory / size;
    // position: absolute;
    background: rgba(195, 65, 65, 0.26);
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    gap:1%;
    padding: 0px 20px;
    width: 100%;
    height: calc(88% - 6% - 12px); //  - 6% for the Settings component
    max-height: calc(88% - 6% - 12px);
    .history {
      display: flex;
      flex-flow: column nowrap;
      gap: 5px;
      overflow: hidden;
      height: 68%;
    }

    .chart-here {
      height: 30%;
      background: rgba(65, 89, 195, 0.26);
    }
  }
  
</style>
