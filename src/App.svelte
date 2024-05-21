<script lang="ts">
  // import Greet from "./lib/Greet.svelte";
  import TaskTimer from "./TaskTimer.svelte";
  // import { invoke } from "@tauri-apps/api/tauri";
  // import { onMount } from "svelte";

  // async function saveTime() {
    
  //   let projects: string[] = [];
  //   const data = JSON.stringify(projects);
  //   await invoke("save_time_data", { data });
  // }

  // async function loadTime() {
  //   try {
  //     const data = await invoke<string>("load_time_data");
  //     const parsed = JSON.parse(data);
  //     console.log('parsed data', parsed);
  //   } catch (e) {
  //     console.error("Failed to load time data", e);
  //   }
  // }

  // onMount(() => {
  //   loadTime();
  // });
</script>

<main class="container">
  <TaskTimer />
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
