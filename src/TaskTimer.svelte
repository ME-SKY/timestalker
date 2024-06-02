<script lang="ts">
    import { projects } from './stores/projects';
    import { timer, timerName } from './stores/timer';
    import { TIMER_ACTIONS_BASED_ON_STATE as TIMER_ACTIONS } from './consts';

    // let name: string = '';

    const startTimer = () => {
        if ($projects.has(name)) {
            projects.resumeProject(name);
        } else {
            projects.createProject(name);
        }
    };

    const toggleTimer = () => {
        if ($timer.state === 'running') {
            if ($timer.timerName) {
                const newTimeData = timer.pause();
                projects.updateProject($timer.timerName, newTimeData);
            }
        } else {
            startTimer();
        }
    };

    const enterToggleTimer = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            toggleTimer();
        }
    };

    const changeInputValue = (e: any) => {
        const newValue = e.target.value;
        name = newValue;

        if ($timer.state === 'running') {
            projects.updateProject($timer.timerName, timer.pause());
        }

        if ($timer.stringRepresentation !== '00:00:00') {
            timer.reset(false);
        }
    };

    $: name = $timerName;

    $: hours = $timer.h.toString().padStart(1, '0');
    $: minutes = $timer.m.toString().padStart(2, '0');
    $: seconds = $timer.s.toString().padStart(2, '0');
</script>

<svelte:window on:keyup={(e) => name !== '' && enterToggleTimer(e)} />

<div class="styles-wrapper">
    <div class="timer" data-timer-state={$timer.state}>
        <div class="task-name">
            <input
                type="text"
                placeholder="project you working on"
                value={name}
                on:input={changeInputValue}
                autocomplete="off"
            />
        </div>
        <div class="time-spended">
            <span class="time-value-hours">{hours}</span>
            <span class="delimeter">:</span>
            <span class="time-value-minutes">{minutes}</span>
            <span class="delimeter">:</span>
            <span class="time-value-seconds">{seconds}</span>
            <!-- {$timer.stringRepresentation} -->
        </div>
        <button
            class="timer-state-switcher"
            disabled={name === ''}
            on:click={toggleTimer}
            data-timer-action={TIMER_ACTIONS[$timer.state]}
            ><svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                ><rect
                    width="24"
                    height="24"
                    stroke="none"
                    fill="#000000"
                    opacity="0"
                />
                <g transform="matrix(0.43 0 0 0.43 12 12)">
                    <path
                        style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                        transform=" translate(-25, -25)"
                        d="M 43 2 L 25 2 C 22.242188 2 20 4.242188 20 7 L 20 20 L 7 20 C 4.242188 20 2 22.242188 2 25 L 2 43 C 2 45.757813 4.242188 48 7 48 L 43 48 C 45.757813 48 48 45.757813 48 43 L 48 7 C 48 4.242188 45.757813 2 43 2 Z M 35 28 C 35 31.859375 31.859375 35 28 35 L 13.414063 35 L 17.707031 39.292969 C 18.097656 39.683594 18.097656 40.316406 17.707031 40.707031 C 17.511719 40.902344 17.257813 41 17 41 C 16.742188 41 16.488281 40.902344 16.292969 40.707031 L 10.292969 34.707031 C 10.199219 34.617188 10.128906 34.503906 10.078125 34.382813 C 9.976563 34.136719 9.976563 33.863281 10.078125 33.617188 C 10.128906 33.496094 10.199219 33.386719 10.292969 33.292969 L 16.292969 27.292969 C 16.683594 26.902344 17.316406 26.902344 17.707031 27.292969 C 18.097656 27.683594 18.097656 28.316406 17.707031 28.707031 L 13.414063 33 L 28 33 C 30.757813 33 33 30.757813 33 28 L 33 16 C 33 15.449219 33.445313 15 34 15 C 34.554688 15 35 15.449219 35 16 Z"
                        stroke-linecap="round"
                    />
                </g>
            </svg>
        </button>
    </div>
</div>

<style lang="scss">
    .styles-wrapper {
        width: 100%;
        position: relative;
        height: calc(12% + 12px);
        filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.2)) drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3)) drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.5));
    }
    .timer {
        position: relative;
        background: whitesmoke;
        height: 100%;
        // height: calc(12% + 12px);
        padding: 8px 18px 20px 18px;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        clip-path: path(
            'M0, 0 L400, 0 L400,105 Q400,90 385,90 L15,90 Q0,90 0,105 L0,0 Z'
        );
        // gap: 1%;

        // &:before {
        //     content: '';
        //     position: absolute;
        //     top: -5px;
        //     left: 0;
        //     width: 100%;
        //     height: 100%;
        //     background-color: inherit;
        //     clip-path: inherit;
        //     box-shadow: 0 4px 8px 0px rgba(57, 3, 235, 0.5);
        //     z-index: -1; /* Place behind the main element */
        // }

        // &:after {
        //     content: '';
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     width: 100%;
        //     height: 100%;
        //     background-color: inherit;
        //     clip-path: inherit;
        //     box-shadow: 0 4px 8px 0px rgba(57, 3, 235, 0.5);

        // }

        // &:after {
        //     content: attr(data-timer-state);
        //     position: absolute;
        //     width: 100%;
        //     left: 0px;
        //     display: flex;
        //     justify-content: center;
        //     bottom: 0px;
        //     font-size: 0.8rem;
        //     color: rgba(0, 0, 0, 0.629);
        // }
    }

    .task-name {
        flex: 0 0 60%;

        input {
            width: 100%;
            height: 100%;
            margin: 0;
            outline: none;
            font-size: 1.7rem;
            padding: 0;
        }
    }

    .time-spended {
        flex: 0 0 28%;
        max-width: 28%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 1.8rem;

        span.time-value-hours {
            flex: 0 0 32%;
            display: flex;
            justify-content: flex-end;
        }

        span.time-value-minutes {
            flex: 0 0 auto;
            min-width: 20%;
            // margin: 0 2%;
            display: flex;
            justify-content: center;
        }

        span.time-value-seconds {
            flex: 0 0 32%;
            display: flex;
            justify-content: flex-start;
        }

        span.delimeter {
            margin: 0 2%;
            flex: 0 0 4%;
            // display: flex;
            // align-items: center;
            // justify-content: center;
        }
    }

    .task-name,
    .time-spended {
        height: 100%;
    }

    .timer-state-switcher {
        background: transparent;
        position: relative;
        padding: 0;
        margin: 0;
        display: block;
        flex: 0 0 12%;
        border: 0;

        &::after {
            position: absolute;
            width: 100%;
            left: 0px;
            display: flex;
            justify-content: center;
            bottom: -6px;
            color: rgba(0, 0, 0, 0.629);
            content: attr(data-timer-action);
        }
    }
</style>
