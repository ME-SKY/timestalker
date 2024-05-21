<script lang="ts">
    export let items;
</script>

<div class="project-list">
    <ul>
        {#each items as [name, timeSpent]}
            <li class="project-list__item">{name}, {timeSpent.stringRepresentation}</li>
        {/each}
    </ul>
</div>

<style lang="scss">
    .project-list {
        ul {
            list-style: none;
            padding: 0;

            li {
                padding: 0.5rem;
            }
        }
    }
</style>
