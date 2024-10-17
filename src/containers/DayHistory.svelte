<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  // export let dayHistory: DayHistory;
  export let date: string;
  export let score: TimeData;
  export let projects: Project[] = [];

  let opened = false;

  let projectsTagsRef: HTMLDivElement;
  let leftSideTransparent = '';
  let rightSideTransparent = '';

  // const { date, score, projects } = dayHistory;

  $: {
    // console.log('day history', dayHistory);
    console.log('day history. date', date);
    console.log('projects', projects);
  }

  function onScroll() {
    if (projectsTagsRef.scrollLeft > 5) {
      leftSideTransparent = 'left-side-transparent';
    } else {
      leftSideTransparent = '';
    }

    if (
      projectsTagsRef.scrollLeft + projectsTagsRef.clientWidth <
      projectsTagsRef.scrollWidth - 5
    ) {
      rightSideTransparent = 'right-side-transparent';
    } else {
      rightSideTransparent = '';
    }
  }

  onMount(() => {
    if (projectsTagsRef.clientWidth < projectsTagsRef.scrollWidth) {
      rightSideTransparent = 'right-side-transparent';
      projectsTagsRef.addEventListener('scroll', onScroll);
    }
  });

  onDestroy(() => {
    projectsTagsRef.removeEventListener('scroll', onScroll);
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="day-history" class:opened on:click={() => (opened = !opened)}>
  <div class="date-and-score">
    <h5 class="date">{date}</h5>
    <h5 class="score">
      {score.h > 0 ? `${score.h} h ` : ''}{score.m} m
    </h5>
  </div>

  <div
    class={`projects-tags 
  ${leftSideTransparent} ${rightSideTransparent}`}
  >
    <div
      class={`left-side-transparent ${leftSideTransparent ? 'active' : ''}`}
    ></div>
    <div bind:this={projectsTagsRef} class={`tags-container`}>
      {#each projects as project (project.name)}
        <div class="project-tag">
          {project.name}
        </div>
      {/each}
    </div>
    <div
      class={`right-side-transparent ${rightSideTransparent ? 'active' : ''}`}
    ></div>
  </div>
</div>

<style lang="scss">
  .day-history {
    position: relative;
    border-bottom: 1px solid rgba(74, 74, 74, 0.482);
    border-top: 1px solid rgba(74, 74, 74, 0.482);
    background: whitesmoke;
    padding: 0px 20px;
    width: 100%;
    height: 60px;
    z-index: 1;
    margin-top: -1px;

    &:first-child {
      border-top-color: transparent;

      &:hover {
        border-top-color: transparent;
        border-bottom-color: rgb(25, 25, 25);
        z-index: 2;
      }
    }

    &:last-child {
      border-bottom-color: transparent;
      &:hover {
        border-top-color: rgb(25, 25, 25);
        border-bottom-color: transparent;
        z-index: 2;
      }
    }

    &:hover {
      border-color: rgb(25, 25, 25);
      z-index: 2;
    }

    .date-and-score {
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2rem;
      padding-bottom: 22px;

      .score {
        font-weight: 100;
        font-size: 0.8rem;
      }
    }

    .projects-tags {
      background: whitesmoke;
      bottom: 22px;
      position: relative;
      gap: 8px;
      overflow-x: auto;

      .tags-container {
        display: flex;
        flex-flow: row nowrap;
        gap: 8px;
        overflow-x: auto;
        background: whitesmoke;

        &::-webkit-scrollbar {
          display: none;
        }
      }

      .left-side-transparent,
      .right-side-transparent {
        top: 0;
        position: absolute;
        width: 22px;
        height: 100%;
        background: transparent;
      }

      .left-side-transparent.active {
        left: 0;
        background: linear-gradient(
          90deg,
          #f5f5f5,
          rgba(241, 241, 241, 0.001) 95%,
          transparent
        );
      }

      .right-side-transparent.active {
        right: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(241, 241, 241, 0.001) 5%,
          #f5f5f5
        );
      }

      .project-tag {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
        font-size: 0.7rem;
        min-width: 90px;
        height: 20px;
        border-radius: 10px;
        border: 1px solid black;
      }

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
</style>
