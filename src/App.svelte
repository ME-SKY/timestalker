<script lang="ts">
  import TaskTimer from "./TaskTimer.svelte";
  import ProjectsList from "./ProjectsList.svelte";
  import { projects } from "./stores/projects";
  import ActivityHistory from "./ActivityHistory.svelte";

</script>


<main class="container" >
  <TaskTimer />
  <ActivityHistory /> 
</main>

<style lang="scss">
  .container {
    height: 100vh;
    background: lightgray;
  }

  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }
</style>
