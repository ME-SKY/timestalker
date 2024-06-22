<script lang="ts">
  import { projects, projectsArray } from '../stores/projects';
  import { timer } from '../stores/timer';
  import { activityHistory } from '../stores/activity-history';
  import ProjectItem from '../components/ProjectItem.svelte';
    import { onMount } from 'svelte';

  let lastProjects = $activityHistory.lastProjects;

  onMount(() => {
    console.log('last projects', $activityHistory.lastProjects);
    
  });

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
  <div class="history">
    //TODO: add history by days
  </div>

  <div class="activity-сhart">
    //TODO add chart
  </div>
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
  .activity-history {
    position: absolute;
    background: transparent;

    padding: 0px 20px;
    width: 100%;
    height: calc(88% - 12px);
    max-height: calc(88% - 12px);
  }
  .project-block {
    overflow: hidden;
    border-width: 1px 0px 1px 0px;
    border-style: solid;
    border-color: transparent;
    margin-top: -1px;
    position: relative;
    z-index: 1;
    // border-bottom-color: transparent;
    // box-shadow:
    //   0px 0px 2px 0px rgba(0, 0, 0, 0.26),
    //   0px 0px 1px 0px rgba(0, 0, 0, 0.43);

    &:last-child {
      // border-bottom-color: transparent;
    }

    &.active {
      // border-color: black;
      // border-radius: 8px;
      z-index: 2;
    }
  }

  .last-activity-short-hours-score {
    min-height: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 100;
  }

  .last-activity-detailed {
    max-height: calc(100% - 18px);
    background: whitesmoke;
    overflow-y: hidden;
    border-radius: 16px;

    box-shadow:
      0px 0px 4px 2px rgba(0, 0, 0, 0.165),
      0px 0px 2px 0px rgba(0, 0, 0, 0.26),
      0px 0px 1px 0px rgba(0, 0, 0, 0.43);
  }

  .last-activity-date-and-score {
    display: flex;
    justify-content: left;
    margin: 0 0;
    padding: 10px 16px;
    box-shadow:
      0px 0px 2px 0px rgba(0, 0, 0, 0.26),
      0px 0px 1px 0px rgba(0, 0, 0, 0.43);

    .score {
      margin-left: auto;
    }

    .score,
    .date {
      font-size: 1.1rem;
    }
  }
</style>
