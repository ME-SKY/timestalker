<script lang="ts">
  import { timer } from '../stores/timer';
  import ProjectItem from './ProjectItem.svelte';

  export let dayHistory: any;
  export let toggleProject: (e: CustomEvent) => void;
  export let active: boolean; // in higher component it should checks that - {$timer.timerName === project.name &&
            // $timer.state === 'running'}

  const {date, score, projects} = dayHistory;

</script>

<div class="day-history">
  
    <div class="date-and-score">
      <h5 class="date">{date}</h5>
      <h5 class="score">
        {score.h > 0
          ? `${score.h} h `
          : ''}{score.m} m
      </h5>
    </div>

    <div class="projects">
      {#each projects as project (project.name)}
        <div
          class="project-block"
          class:active
        >
          <ProjectItem
            on:state-button-click={toggleProject}
            name={project.name || ''}
            timeSpent={project.stringRepresentation || ''}
            periods={project.periodsByDate}
            projectState={$timer.timerName === project.name &&
            $timer.state === 'running'
              ? 'running'
              : 'paused'}
          />
        </div>
      {/each}
    </div>
  
</div>

<style lang="scss">
  .day-history {
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

    &:last-child {
    
    }

    &.active {
      //TODO: think about visual effects
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
