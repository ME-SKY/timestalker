<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { draw, slide, fade } from 'svelte/transition';
  import PlayButton from '@assets/play-button.svg?raw';
  import PauseButton from '@assets/pause-button.svg?raw';

  export let name: string = '';
  export let timeSpent: string = '';
  export let projectState: TimerState = 'stopped';
  export let periods: Map<DateSpan, TimeData> = new Map();

  let height: number;

  const dispatch = createEventDispatcher();

  let showPeriods = false;
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="project-item"
  class:active={projectState === 'running'}
  on:click={() => (showPeriods = !showPeriods)}
  bind:clientHeight={height}
>
  <div class="project-main-info">
    <span class="name">{name}</span>
    <span class="time-spent">{timeSpent}</span>
    <button
      class="toggle-project-state"
      on:click|stopPropagation={() =>
        dispatch('state-button-click', { name: name })}
    >
      {#if projectState === 'running'}
        {@html PauseButton}
      {:else}
        {@html PlayButton}
      {/if}
    </button>
  </div>

  <!-- {#if showPeriods}
      <div class="project-periods" transition:slide={{ duration: 180 }}>
        {#each periods as [name, timeSpent] (name)}
          <div class="project-period" >
            <span class="project-period-name">{name}</span>
            <span class="project-period-time-spent"
              >{timeSpent.stringRepresentation}</span
            >
          </div>
        {/each}
      </div>
  {/if} -->
</div>

<style lang="scss">
  .project-periods {
    border-radius: 0 0 6px 6px;
    position: relative;
    margin: 0 auto 0 auto;
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid transparent;
    padding: 12px 12px 12px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: height 0.3s ease;
    gap: 8px;
    .project-period {
      width: 60%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
    }
  }

  .project-item {
    &:hover {
      background: rgba(211, 211, 211, 0.5);
    }

    &.active {
      animation: blink 0.3s ease forwards;
      background: lightgray;
    }
  }

  .project-main-info {
    padding: 18px 12px;
    display: flex;
    align-items: center;

    .name {
      font-family: 'Roboto-Medium', monospace;
      font-size: 1.2rem;
    }
    .time-spent {
      font-size: 1.1rem;
      font-family: 'Roboto-Regular', monospace;
    }
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
