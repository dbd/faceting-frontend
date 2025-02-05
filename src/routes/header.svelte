<script lang="ts">
  import type { Snippet } from "svelte";
  let { name }: { name: string;  } = $props();
</script>

<div>
  <h1>
    {name ? name : "User"}'s form
  </h1>
</div>
