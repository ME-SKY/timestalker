<script lang="ts">
  import TaskTimer from "./TaskTimer.svelte";
  import ProjectsList from "./ProjectsList.svelte";
  import { projects } from "./stores/projects";

  const toggleTimer = (event: any) => {
    if (event.repeat) { return }
    console.log('works')
    if (event.key === 'Enter') {
      // Handle the enter key event here
      console.log('Enter key pressed');
    }
  }
</script>

<svelte:window on:keydown={toggleTimer} on:keyup={toggleTimer} />
<main class="container" >
  <TaskTimer />
  <ProjectsList items={$projects} />
</main>

<style lang="scss">
  .container {
    height: 100vh;
  }

  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }
</style>
