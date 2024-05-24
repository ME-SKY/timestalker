<script lang="ts">
    import { projects } from './stores/projects';
    import { timer } from './stores/timer';
    import PlayButton from '@assets/play-button.svg?raw';
    import PauseButton from '@assets/pause-button.svg?raw';

    export let items;

    const toggleProject = (name: string) => { 
        if ($timer.timerName === name) {
            if ($timer.state === 'running'){
                projects.updateProject($timer.timerName, timer.pause());
            } else {
                projects.resumeProject($timer.timerName);
            }
        } else {
            if($timer.timerName !== '') {
                if($projects.has($timer.timerName)) {
                    projects.updateProject($timer.timerName, timer.pause());
                }
            }
            
            projects.resumeProject(name);
        }
     }
</script>

<div class="projects-list">
    {#each items as [name, timeSpent]}
        <div class="project-list__item">
            <span class="name">{name}</span>
            <span class="time-spent">{timeSpent.stringRepresentation}</span>
            <button class="continue-project" on:click={() => toggleProject(name)}>
                {#if $timer.timerName === name && $timer.state === 'running'}
                    {@html PauseButton}
                {:else}
                    {@html PlayButton}
                {/if}
            </button>
        </div>
    {/each}
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
            height: 52px;
            display: flex;
            align-items: center;
            // justify-content: space-between;
            border-bottom: 1px solid black;
            border-right: none;
            border-left: none;
            // border-top: 1px solid transparent;

            .name {
                flex: 0 0 65%;
            }

            .time-spent {
                flex: 0 0 18%;
                display: flex;
                justify-content: flex-end;
            }



            // &:first-child {
            //     border-top: 1px solid black;
            // }

            button.continue-project {
                // flex: 0 0 15%;
                margin: 0;
                margin-left: auto;
                padding: 0;
                border: none;
                background: none;
                cursor: pointer;
                outline: none;
                display: flex;
                justify-content: flex-end;

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
