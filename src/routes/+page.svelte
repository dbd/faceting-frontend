<script lang="ts">
  import { websocketStore } from "$lib/store.svelte";
  import Table from "$lib/table.svelte";

  //const websocket = websocketStore("ws://10.0.0.163:8080/ws");
  const websocket = websocketStore("ws://localhost:8080");

  interface Servo {
    id: string;
    name: string;
  }

  let valueState = new Map<string, number>()

  const PosSettings: Servo[] = [
    { id: "height", name: "Height" },
    { id: "tilt", name: "Pitch" },
    { id: "rotation", name: "Rotation" },
  ];

  function sendMessage(key: string, pos: number): void {
    let msg = '{"action": "rotate", "args":["' + key +'",' + pos +']}'
    websocket.send(msg);;
  };
</script>

<h1 class="font-sans">Bot Controller</h1>

<div>
{#each PosSettings as setting}
<p>{setting.name}</p>
  <input type="setting.type" bind:value={valueState[setting.id]} />
  <button
    onclick={() =>
      sendMessage(setting.id, valueState[setting.id])}
  >
  Set Pos
  </button>
{/each}
</div>

<Table messages={websocket.statusMessages} />
