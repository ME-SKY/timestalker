<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import PlayButton from '@assets/play-button.svg?raw';
  import PauseButton from '@assets/pause-button.svg?raw';
  export let name: string;
  export let timeSpent: string;
  export let projectState: TimerState;

  const dispatch = createEventDispatcher();
</script>

<div class="project-item" class:active={projectState === 'running'}>
  <span class="name">{name}</span>
  <span class="time-spent">{timeSpent}</span>
  <button
    class="toggle-project"
    on:click={() => dispatch('state-button-click', { name: name })}
  >
    {#if projectState === 'running'}
      {@html PauseButton}
    {:else}
      {@html PlayButton}
    {/if}
  </button>
</div>

<style lang="scss">
  @keyframes blink { //TODO: add blink one time animation for active project, - when he become active
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
    padding: 18px 12px;
    display: flex;
    align-items: center;
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

  button.toggle-project {
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
