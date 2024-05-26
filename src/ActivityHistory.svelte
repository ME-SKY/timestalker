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
    <h6 class="this-day-hours-score"></h6>
    <h6 class="this-week-hours-score"></h6>
  </div>

  <div class="last-activity-detailed">
    <div class="last-activity-date-and-score">
      <h5>Today or Yeasterday with date if it exists</h5>
      ,
      <h5>Date like 3 Nov, or 3 Nov 2022 if not in current year</h5>
      <h5>Score in hourse for this 3.43.21</h5>
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
    padding: 0 20px;
    width: 100%;
    height: 100%;
  }

  .project-block {
    border-bottom: 1px solid black;

    &:last-child {
      border-bottom: none;
    }
  }

</style>
