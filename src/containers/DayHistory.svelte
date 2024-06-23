<script lang="ts">
  import { timer } from '@/stores/timer';
  import { projects as projectsStore } from '@/stores/projects';
  import ProjectItem from '../components/ProjectItem.svelte';
    import { onMount, onDestroy } from 'svelte';

  export let dayHistory: DayHistory;
  // export let toggleProject: (e: any) => void;

  let opened = false;
  let scrollX = 0;
  const projectsTagsClass = new Set();
  // let tagsNeedScroll = false;

  let projectsTagsRef: HTMLDivElement;
  let leftSideTransparent = '';
  let rightSideTransparent = '';

  const { date, score, projects } = dayHistory;

  function onScroll() {
    if(projectsTagsRef.scrollLeft > 5){
      leftSideTransparent = 'left-side-transparent';
      projectsTagsClass.add('left-side-transparent');
      // projectsTagsRef.classList.add('left-side-transparent');

    } else {
      leftSideTransparent = '';
      projectsTagsClass.delete('left-side-transparent');
      // projectsTagsRef.classList.remove('left-side-transparent');
    }

    if(projectsTagsRef.scrollLeft + projectsTagsRef.clientWidth < projectsTagsRef.scrollWidth - 5){
      projectsTagsClass.add('right-side-transparent');
      rightSideTransparent = 'right-side-transparent';
      // projectsTagsRef.classList.add('right-side-transparent');
    } else {
      rightSideTransparent = '';
      projectsTagsClass.delete('right-side-transparent');
      // projectsTagsRef.classList.remove('right-side-transparent');
    }

  }

  onMount(() => {
    if(projectsTagsRef.clientWidth < projectsTagsRef.scrollWidth){
      // projectsTagsRef.classList.add('right-side-transparent');
      // tagsNeedScroll = true;
      rightSideTransparent = 'right-side-transparent';

      projectsTagsRef.addEventListener('scroll', onScroll);
    }
  });

  onDestroy(() => {
    projectsTagsRef.removeEventListener('scroll', onScroll);
  });

  

  

  // $: leftSideTransparent = projectsTagsRef?.scrollLeft > 5 ? 'left-side-transparent' : '';
  // $: rightSideTransparent = projectsTagsRef?.scrollLeft + projectsTagsRef?.clientWidth < projectsTagsRef?.scrollWidth - 5 ? 'right-side-transparent' : '';

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

  <!-- svelte-ignore typecheck -->
  <!-- svelte-ignore duplicate-attribute -->
  <div  bind:this={projectsTagsRef} class={`projects-tags 
  ${leftSideTransparent} ${rightSideTransparent}`}>
    {#each projects as project (project.name)}
      <div class="project-tag">
        {project.name}
      </div>
    {/each}
  </div>

  <!-- <div class="projects">
      {#each projects as project (project.name)}
        <div
          class="project-block"
          class:active={project.name === $timer.timerName && $timer.state === 'running'}
        >
          <ProjectItem
            on:state-button-click={() => projectsStore.toggleProject(project.name || '')}
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
    </div> -->
</div>

<style lang="scss">
  .day-history {
    position: relative;
    border: 1px solid transparent;
    border-radius: 6px;
    // position: absolute;
    background: whitesmoke;
    // background: linear-gradient(90deg,#f5f5f5,rgba(241, 241, 241, 0.001), transparent);
    padding: 0px 20px;
    width: 100%;
    height: 60px;

    &:hover {
      border-color: rgb(25, 25, 25);
      // transform: scale(1.05);
    }

    .date-and-score {
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2rem;
      padding-bottom: 22px;
    }

    // .projects-tags.left-side-transparent {
    //   background: red;
    // }

    .projects-tags {
      background: whitesmoke;
      bottom: 22px;
      position: relative;
      display: flex;
      flex-flow: row nowrap;
      gap: 8px;
      overflow-x: auto;

      // &.left-side-transparent {
      //   background: blue;
      // }

      &.left-side-transparent, &.right-side-transparent {
        // background-color: whitesmoke;
        position: relative;

        &:before, &:after {
          // display: block;
          // background-color: ;
          content: '';
          position: sticky;
          // top: 0;
          // bottom: 0;
          width: 8px;
          height: 22px;
          z-index: 1;
          
          // background: ;
        }

        // &:before {
// 
        // }
      }

      &.left-side-transparent {
        &:before {
          // left:22px;
          background: linear-gradient(90deg,#f5f5f5,rgba(241, 241, 241, 0.001) 95%, transparent);
        }
      }

      &.right-side-transparent {
        &:after {
          // float: right;
          // margin-left: auto;
          // display: none;
          right:22px;
          background: linear-gradient(90deg,transparent,rgba(241, 241, 241, 0.001), #f5f5f5);
        }
      }
      
      // &.l

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
      // height: 68%;

      &::-webkit-scrollbar {
        display: none;
        // width: 8px;
      }

      // &::-webkit-scrollbar-track {
      //   background: #f1f1f1;
      // }

      // &::-webkit-scrollbar-thumb {
      //   background: #888;
      // }

      // &::-webkit-scrollbar-thumb:hover {
      //   background: #555;
      // }
    }
    // max-height: calc(88% - 12px);
  }
</style>
