<script lang="ts">
  import SettingsIcon from '@assets/settings.svg?raw';
  import { settings, currentTime } from '@/stores/settings';


</script>

<div class="settings-section">
  <div class="settings">
    <button>{@html SettingsIcon}</button>
    <div class="current-time">
      <div class="main-time">{$currentTime.mainTime}</div>
      <div class="sub-time">{$currentTime.additionalTime}</div>
    </div>
    <div class="weather"></div>
  </div>
</div>

<style lang="scss">
  .settings-section {
    width: 100%;
    height: 10%;
    background: transparent;
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.2))
      drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3))
      drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));
  }

  .settings {
    padding: 15px 20px 0 20px;
    background: whitesmoke;
    height: 100%;
    clip-path: path(
      'M0, 0 Q0,15 15,15 L385,15 Q400,15 400,0 L400,77, L0,77, L0,0 Z'
    );
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;


    button {
      background: transparent;
      outline: 0;
      box-shadow: none;
      border: none;
      width: 44px;
      height: 44px;
      padding: 0;
      margin:0;
    }
  }

  .current-time {
    font-size: 1.2rem;
  }

  .weather {
    font-size: 1.2rem;
  }

</style>