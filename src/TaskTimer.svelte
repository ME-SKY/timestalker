<script lang="ts">
    import { onDestroy } from "svelte";
    import { timer, projects } from "./stores";

    let name: string | undefined;

    const startTimer = () => {
        if (name !== undefined && name !== "") {
            projects.createProject(name);
        }
    };

    const toggleTimer = () => {
        if ($timer.state === "running") {
            if (name) {
                const newTimeData = timer.pause();
                console.log('newTimeData', newTimeData);
                projects.updateProject(name, newTimeData);
            }
        } else {
            console.log("it should starts");
            startTimer();
        }
    };

    onDestroy(() => {
        // if (timerId) {
        //     clearInterval(timerId);
        // }
    });

    // function startTimer() {
    //     timerId = setInterval(() => {
    //         if (time >= 60) {
    //             console.log("new minute!");
    //         }
    //         time += 1;
    //     }, 1000);
    // }
</script>

<div class="timer">
    <div class="task-name">
        <input
            type="text"
            placeholder="project/task you working on"
            bind:value={name}
        />
    </div>
    <div class="time-spended">
        <!-- TODO: move .toString().padStart(2, '0') to string representation in timer store -->
        <span>{$timer.h.toString().padStart(2, "0")}:</span>
        <span>{$timer.m.toString().padStart(2, "0")}:</span>
        <span>{$timer.s.toString().padStart(2, "0")}</span>
    </div>
    <button
        class="timer-state-swither"
        disabled={!name}
        on:click={toggleTimer}
        data-timer-state={$timer.state}
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

<style lang="scss">
    .timer {
        background: lightgray;
        height: 12%;
        padding: 8px;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: 1%;
    }

    .task-name {
        flex: 0 0 calc(65% - (2% / 3));

        input {
            width: 100%;
            height: 100%;
            margin: 0;
            outline: none;
            font-size: 1.2rem;
        }
    }

    .time-spended {
        flex: 0 0 calc(23% - (2% / 3));
        display: flex;
        align-items: center;
    }

    .task-name,
    .time-spended {
        height: 60%;
    }

    .timer-state-swither {
        background: transparent;
        position: relative;
        padding: 0;
        margin: 0;
        display: block;
        flex: 0 0 calc(12% - (2% / 3));
        border: 0;

        &::after {
            position: absolute;
            width: 100%;
            left: 0px;
            display: flex;
            justify-content: center;
            bottom: -6px;
            color: rgba(0, 0, 0, 0.629);
            // content: attr(data-timer-state); TODO: return it
            content: attr(data-timer-state);
        }
    }

    // .timer-state-swither[data-timer-state='running']::after {
    //     content: "STOP";
    // }

    // .timer-state-swither[data-timer-state='not-started-yet']::after {
    //     content: "START";
    // }

    // .timer-state-swither[data-timer-state='paused']::after {
    //     content: "CONTINUE";
    // }
</style>
