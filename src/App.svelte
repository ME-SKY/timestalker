<script lang="ts">
  import ActivityHistory from './containers/ActivityHistory.svelte';
  import TaskTimer from './containers/TaskTimer.svelte';
  import Settings from './containers/Settings.svelte';
</script>

<main class="container">
  <TaskTimer />
  <ActivityHistory />
  <Settings /> 
</main>

<style lang="scss">
  .container {
    height: 100vh;
    background: rgb(252, 122, 167);
  }
</style>
