<script lang="ts">
  import { Textarea, Label, Button, Card } from "flowbite-svelte";
  import { type Servo } from "$lib/store.svelte";
  import { RefreshOutline } from "flowbite-svelte-icons";
  let { websocket }: { websocket: Any } = $props();

  let posValue = $state(0);
  let rawValue = $state(false);
  let torqueEnabled = $state(false);
</script>

<Card class="grow">
  <Label for="diagramText">Faceting Diagram</Label>
  <Textarea
    id="diagramText"
    placeholder="Enter ASC"
    rows=6
    name="diagramMessage"
  ></Textarea>
</Card>
