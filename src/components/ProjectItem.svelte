<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import PlayButton from '@assets/play-button.svg?raw';
  import PauseButton from '@assets/pause-button.svg?raw';
  export let name: string;
  export let timeSpent: string;
  export let projectState: TimerState;
  export let periods: Map<DateSpan, TimeData> = new Map();

  let showPeriods = false;


  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="project-item" class:active={projectState === 'running'} on:click={() => showPeriods = !showPeriods} role="button">
  <div class="project-main-info">
    <span class="name">{name}</span>
    <span class="time-spent">{timeSpent}</span>
    <button
      class="toggle-project-state"
      on:click|stopPropagation={() => dispatch('state-button-click', { name: name })}
    >
      {#if projectState === 'running'}
        {@html PauseButton}
      {:else}
        {@html PlayButton}
      {/if}
    </button>
  </div>
  <div class="project-periods" class:show={showPeriods}>
    {#each periods as [name, timeSpent] (name)}
      <div class="project-period">
        <span class="project-period-name">{name}</span>
        <span class="project-period-time-spent">{timeSpent.stringRepresentation}</span>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">

  .project-periods {
    overflow: hidden;
    padding: 0px 12px;
    height: 0px;
    display: flex;
    flex-direction: column;

    &.show {
     height: auto;
    }
  }
  @keyframes blink {
    //TODO: add blink one time animation for active project, - when he become active
    // 0% {
    // background: rgba(0,0,0,1);
    // left: -100%;
    // }
    50% {
      //     background:  linear-gradient(
      // 	45deg,
      // 	#fb0094,
      // 	#0000ff,
      // 	#00ff00,
      // 	#ffff00,
      // 	#ff0000,
      // 	#fb0094,
      // 	#0000ff,
      // 	#00ff00,
      // 	#ffff00,
      // 	#ff0000
      // );;
    }
    // 100% {
    // background: rgba(0,0,0,0.5);
    // left: 100%;
    // }
  }
  .project-item {
    font-size: 1.4rem;
    // padding: 18px 12px;
    // display: flex;
    // align-items: center;
    // transition: background-position 1s linear;

    &:hover {
      background: rgba(211, 211, 211, 0.5);
    }

    &.active {
      // background-color: rgba(0, 0, 0, 0.5);
      // background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
      animation: blink 0.3s ease forwards;
      background: lightgray;
    }
  }

  .project-main-info {
    padding: 18px 12px;
    display: flex;
    align-items: center;
  }

  .name,
  .time-spent {
    display: flex;
  }

  .name {
    flex: 0 0 70%;
  }

  .time-spent {
    flex: 0 0 auto;
    display: flex;
    justify-content: flex-end;
  }

  button.toggle-project-state {
    flex: 0 0 24px;

    margin: 0;
    margin-left: auto;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
    display: flex;
    justify-content: flex-end;
  }
</style>
