<script lang="ts">
  import ActivityHistory from './containers/ActivityHistory.svelte';
  import TaskTimer from './containers/TaskTimer.svelte';
</script>

<main class="container">
  <TaskTimer />
  <ActivityHistory />
</main>

<style lang="scss">
  .container {
    height: 100vh;
    background: lightgray;
  }
</style>
