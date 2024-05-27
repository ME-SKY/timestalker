<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import PlayButton from '@assets/play-button.svg?raw';
  import PauseButton from '@assets/pause-button.svg?raw';
  export let name: string;
  export let timeSpent: string;
  export let projectState: ProjectState;

  const dispatch = createEventDispatcher();
</script>

<div class="project-item">
  <span class="name">{name}</span>
  <span class="time-spent">{timeSpent}</span>
  <button class="toggle-project" on:click={() => dispatch('state-button-click', {name: name})}>
    {#if projectState === 'running'}
      {@html PauseButton}
    {:else}
      {@html PlayButton}
    {/if}
  </button>
</div>

<style lang="scss">
  .project-item {
    padding: 12px;
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
