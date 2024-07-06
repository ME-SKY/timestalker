<script lang="ts">
  import SettingsIcon from '@assets/settings.svg?raw';
  import {
    settings,
    currentTime,
    additionalTimeCity,
    mainTimeCity,
  } from '@/stores/settings';
</script>

<div class="settings-section">
  <div class="settings">
    <button>{@html SettingsIcon}</button>
    <div class="current-time">
      <div class="main-time">
        <div class="time-label">{$mainTimeCity}</div>
        <div class="time">{$currentTime.mainTime}</div>
      </div>
      <div class="additional-time">
        <div class="time-label">{$additionalTimeCity}</div>
        <div class="time">{$currentTime.additionalTime}</div>
      </div>
    </div>
    <div class="weather">weather</div>
  </div>
</div>

<style lang="scss">
  .settings-section {
    // transform: translateZ(0);
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 10%;
    background: transparent;
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.2))
      drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3))
      drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));
    //   will-change: filter;
    // transform: translateZ(0);
  }

  .settings {
    // transform: translateZ(0);
    // position: relative;
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
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    // filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.2))
    //   drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3))
    //   drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));
    // transform: translateZ(0);
    // will-change: clip-path;
    // position: relative; /* Creates a new stacking context */

    button {
      backface-visibility: hidden;
      // will-change: rotate;
      // position: relative;
      // transform: translateZ(0);
      background: transparent;
      outline: 0;
      box-shadow: none;
      border: none;
      width: 44px;
      height: 44px;
      padding: 0;
      margin: 0;
      transition: transform 0.3s ease;

      // &:hover {
        
      // }
    }

    button:hover {
      transform: rotate(90deg) ;
    }

    .weather {
      min-width: 44px;
    }
  }

  .current-time {
    font-size: 0.8rem;
    display: flex;
    flex-flow: column nowrap;
    gap: 2px;

    .main-time, .additional-time {
      display: flex;
      flex-flow: row nowrap;
      gap: 4px;
    }
  }

  .weather {
    font-size: 1.2rem;
  }
</style>
