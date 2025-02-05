<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { state, connect } from "../lib/state";

  onMount(async () => {
    connect("10.0.0.163:8080/ws");
  });
</script>


{JSON.stringify(state)}
<div>
  <p>{state.items}</p>
</div>
