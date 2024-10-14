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
    // contain: layout paint;
    transform: translateZ(0);
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 10%;
    background: transparent;
    // drop shadow blinks here on button hover, i dont know why, the problem is in how the rendering works with tauri, or maybe something another, i have to change styles without using dropshadow to make design more consistent
    // filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.2))
    //   drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3))
    //   drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));
  }

  .settings {
    padding: 15px 20px 0 20px;
    background: whitesmoke;
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
    position: relative;

    button {
      z-index: 2;
      background: transparent;
      outline: 0;
      box-shadow: none;
      border: none;
      width: 44px;
      height: 44px;
      padding: 0;
      margin: 0;
      transition: transform 0.3s ease;
    }

    button:hover {
      transform: rotate(90deg);
    }

    .weather {
      z-index: 2;
      min-width: 44px;
    }
  }

  .current-time {
    font-size: 0.8rem;
    display: flex;
    flex-flow: column nowrap;
    gap: 2px;
    width: calc(100% - 40px); // 40px - padding of parant container 20x2(left and riggt)
    position: absolute; //to position element to actual center
    left: 20px;
    align-items: center;
    z-index: 1;

    .main-time,
    .additional-time {
      display: flex;
      flex-flow: row nowrap;
      gap: 4px;
    }
  }

  .weather {
    font-size: 1.2rem;
  }
</style>
