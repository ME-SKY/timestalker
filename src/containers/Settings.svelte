<script lang="ts">

</script>

<div class="settings-section">
  <div class="settings">
    <button>Setting</button>
    <div class="current-time">Current time in two main timezones</div>
    <div class="weather"></div>
  </div>
</div>

<style lang="scss">
  .settings-section {
    width: 100%;
    height: 6%;
    background: transparent;
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.2))
      drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3))
      drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));
  }

  .settings {
    background: whitesmoke;
    height: 100%;
    clip-path: path(
      'M0, 0 Q0,15 15,15 L385,15 Q400,15 400,0 L400,46, L0,46, L0,0 Z'
    );
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }

  .current-time {
    font-size: 1.2rem;
  }

  .weather {
    font-size: 1.2rem;
  }

</style>