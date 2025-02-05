<script>
  import { onMount } from "svelte";
  import store from "../lib/store.js";
  import Message from "./message.svelte";
  let message;
  let messages = [];

  let valueState = {
    values: [],
  };

  const PosSettings = [
    {
      value: "Height",
      id: "height_value",
      type: "number",
    },
    {
      value: "Tilt",
      id: "tilt_value",
      type: "number",
    },
    {
      value: "Rotation",
      id: "rotation_value",
      type: "number",
    },
  ];

  onMount(() => {
    store.subscribe((currentMessage) => {
      messages = [...messages, currentMessage];
    });
  });

  function onSendMessage(key, pos) {
      let msg = '{"action": "rotate", "args":["' + key +'",' + pos +']}'
      store.sendMessage(msg);
      //message = "";
  }
</script>

<h1>Bot Controller</h1>

{#each PosSettings as setting}
<div>
<p>{setting.value}</p>
  <input type="setting.type" bind:value={valueState.values[setting.id]} />
  <button
    onclick={() =>
      onSendMessage(setting.id, valueState.values[setting.id])}
  >
  Set Pos
  </button>
</div>
{/each}

<table class="content-table buyside">
  <thead>
    <tr>
      <th>heightPos</th>
      <th>rotationPos</th>
      <th>tiltPos</th>
      <th>gyroXPos</th>
      <th>gyroYPos</th>
      <th>gyroZPos</th>
    </tr>
  </thead>
  <tbody>
    {#each [...messages].reverse() as message}
      <tr>
        <td>{message.heightPos}</td>
        <td>{message.rotationPos}</td>
        <td>{message.tiltPos}</td>
        <td>{message.gyroXPos}</td>
        <td>{message.gyroYPos}</td>
        <td>{message.gyroZPos}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  :global(tbody) {
    height: 250px;
    overflow: auto;
    display: block;
  }
  :global(thead, tbody tr) {
    display: table;
    width: 500px;
    table-layout: fixed;
  }
</style>
