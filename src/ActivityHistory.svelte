<script lang="ts">
  import { projects } from './stores/projects';
  import { timer } from './stores/timer';
  import ProjectItem from './components/ProjectItem.svelte';

  const toggleProject = (e: CustomEvent) => {
    if ($timer.timerName === e.detail.name) {
      if ($timer.state === 'running') {
        projects.updateProject($timer.timerName, timer.pause());
      } else {
        projects.resumeProject($timer.timerName);
      }
    } else {
      if ($timer.timerName !== '') {
        if ($projects.has($timer.timerName)) {
          projects.updateProject($timer.timerName, timer.pause());
        }
      }

      projects.resumeProject(e.detail.name);
    }
  };
</script>

<div class="activity-history">
  <div class="last-activity-short-hours-score">
    <h6 class="this-day-hours-score">This day: 4 h 30 min</h6>
    <h6 class="this-week-hours-score">This week: 7 h 30 min</h6>
  </div>

  <div class="last-activity-detailed">
    <div class="last-activity-date-and-score">
      <h5 class='day'>Yeasterday,&nbsp;</h5>
      <h5 class='date'>3 Nov 2022</h5>
      <h5 class='hours-score'>3 h 25 min</h5>
    </div>

    <div class="last-activity-projects">
      {#each $projects as [name, timeSpent]}
        <div class="project-block">
          <ProjectItem
            on:state-button-click={toggleProject}
            {name}
            timeSpent={timeSpent.stringRepresentation}
            projectState={$timer.timerName === name &&
            $timer.state === 'running'
              ? 'running'
              : 'paused'}
          />
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .activity-history {
    background: whitesmoke;
    border-top-left-radius: 22px;
    border-top-right-radius: 22px;
    padding: 1px 20px;
    width: 100%;
    height: 88%;
  }

  .project-block {
    border-bottom: 1px solid black;

    &:last-child {
      border-bottom: none;
    }
  }

  .last-activity-short-hours-score {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0px;
    font-weight: 100;
  }

  .last-activity-detailed {
    border-radius: 5px;
    border: 1px solid black;
  }

  .last-activity-date-and-score {
    display: flex;
    justify-content: left;
    margin: 10px 16px;


    .hours-score {
      margin-left: auto;
    }
  }

</style>
