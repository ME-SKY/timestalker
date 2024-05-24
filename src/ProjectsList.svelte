<script lang="ts">
    import { projects, timer } from './stores';
    import PlayButton from '@assets/play-button.svg?raw';
    import PauseButton from '@assets/pause-button.svg?raw';
    import Check from '@assets/Check.svelte';
    export let items;
</script>

<div class="projects-list">
    <!-- <ul> -->
    {#each items as [name, timeSpent]}
        <div class="project-list__item">
            <span class="name">{name}</span>
            <span class="time-spent">{timeSpent.stringRepresentation}</span>
            <button
                class="continue-project"
                on:click={() => projects.resumeProject(name)}
            >
                {#if $timer.timerName === name && $timer.state === 'running'}
                    {@html PauseButton}
                {:else}
                    {@html PlayButton}
                {/if}
                <!-- <Check/> -->
                <!-- <img class="continue-project__icon" src={PlayButton} alt="play button" /> -->
            </button>
        </div>
    {/each}
    <!-- </ul> -->
</div>

<style lang="scss">
    .projects-list {
        width: 100%;
        margin-top: 10px;
        // .projects-list {
        //     width: 100%;
        //     // list-style: none;
        //     padding: 0;
        // border-collapse: collapse;

        .project-list__item {
            // border-collapse: collapse;
            padding: 0 20px;
            // margin: 0 20px;
            min-height: 48px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid black;
            border-right: none;
            border-left: none;
            border-top: 1px solid transparent;

            // &:first-child {
            //     border-top: 1px solid black;
            // }

            button.continue-project {
                margin: 0;
                padding: 0;
                border: none;
                background: none;
                cursor: pointer;
                outline: none;

                // max-width: 42px;
                // max-height: 42px;
            }

            // ::las
        }

        // li + li {
        //     border-top: none;
        // }
        // }
    }
</style>
