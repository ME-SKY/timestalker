<script lang="ts">
  import { projects, projectsArray } from './stores/projects';
  import { timer } from './stores/timer';
  import { activityHistory } from './stores/activity-history';
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
    <!-- <h6 class="this-day-hours-score">This day: 4 h 30 min</h6> -->
    <!-- <h6 class="this-week-hours-score">This week: 7 h 30 min</h6> -->
  </div>

  <div class="last-activity-detailed">
    <div class="last-activity-date-and-score">
      <!-- <h5 class="day">{''},&nbsp;</h5> -->
      <h5 class="date">{$activityHistory.date?.short}</h5>
      <h5 class="score">
        {$activityHistory.score.h > 0
          ? `${$activityHistory.score.h} h `
          : ''}{$activityHistory.score.m} m
      </h5>
    </div>

    <div class="last-activity-projects">
      {#each $projectsArray as project}
        <div class="project-block" class:active={$timer.timerName === project.name}>
          <ProjectItem
            on:state-button-click={toggleProject}
            name = {project.name || ''}
            timeSpent={project.stringRepresentation || ''}
            projectState={$timer.timerName === project.name &&
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
    position: absolute;
    background: transparent;
    // border-top-left-radius: 22px;
    // border-top-right-radius: 22px;
    padding: 0px 20px;
    width: 100%;
    height: calc(88% - 12px);
    max-height: calc(88% - 12px);
  }

  // .last-activity-projects{
    
  // }

  .project-block {
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-bottom-color: black;
    // border-top-color: transparent;
    // border-left-color: transparent;
    // border-right-color: transparent;

    &:last-child {
      border-bottom-color: transparent;
    }

    &.active {
      // border-top-color: transparent;
      // border-left-color: black;
      // border-right-color: black;
    }
  }

  .last-activity-short-hours-score {
    min-height: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin: 10px 0px;
    font-weight: 100;
  }

  .last-activity-detailed {
    max-height: calc(100% - 18px);
    background: whitesmoke;
    overflow-y: hidden;
    border-radius: 16px;
    // border: 1px solid transparent;

    // transition: box-shadow 0.3s ease-in-out;

    // &:hover {
    box-shadow:
      0px 0px 4px 2px rgba(0, 0, 0, 0.165),
      0px 0px 2px 0px rgba(0, 0, 0, 0.26),
      0px 0px 1px 0px rgba(0, 0, 0, 0.43);
    // }
  }

  .last-activity-date-and-score {
    display: flex;
    justify-content: left;
    margin: 10px 16px;

    .score {
      margin-left: auto;
    }

    .score,
    .date {
      font-size: 1.1rem;
    }
  }
</style>
