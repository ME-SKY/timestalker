<script lang="ts">
  import ActivityHistory from './ActivityHistory.svelte';
  import TaskTimer from './TaskTimer.svelte';
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
