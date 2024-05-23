<script lang="ts">
    import {projects} from './stores'
    export let items;
</script>

<div class="projects-list">
    <ul>
        {#each items as [name, timeSpent]}
            <li class="project-list__item">
                <span class="name">{name}</span>
                <span class="time-spent">{timeSpent.stringRepresentation}</span>
                <button class="continue-project" on:click={() => projects.resumeProject(name)}>
                    <svg
                        fill="#000000"
                        height="42px"
                        width="42px"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 60 60"
                        xml:space="preserve"
                    >
                        <g>
                            <path
                                d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30
		c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15
		C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"
                            />
                            <path
                                d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30
		S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"
                            />
                        </g>
                    </svg>
                </button>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    .projects-list {
        width: 100%;
        ul {
            width: 100%;
            list-style: none;
            padding: 0;
            // border-collapse: collapse;

            li.project-list__item {
                border-collapse: collapse;
                padding: 0 20px;
                // margin: 0 20px;
                min-height: 48px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid black;

                &:first-child {
                    border-top: 1px solid black;
                }

                button.continue-project {
                    margin: 0;
                    padding: 0;
                    border: none;
                    background: none;
                    cursor: pointer;
                    outline: none;

                    max-width: 42px;
                    max-height: 42px;
                }

                // ::las
            }
        }
    }
</style>
