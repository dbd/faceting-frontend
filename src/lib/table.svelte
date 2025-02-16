<script lang="ts">
  import { type StatusMessage } from "$lib/store.svelte";
  let { messages }: { messages: Array<StatusMessage> } = $props();

    function arcSin(x: number) {
    const gravity = 9.80665
    x *= -1
    if (x >= gravity) {
      x -= gravity
    }
    let val = (Math.asin(x/gravity) * (180 / Math.PI))
    return val.toFixed(2)
  }
</script>

<table class="content-table buyside">
  <thead>
    <tr>
      <th>Height Position</th>
      <th>Rotation Angle</th>
      <th>Pitch Angle</th>
    </tr>
  </thead>
  <tbody>
    {#each [...messages].reverse() as msg}
      <tr>
        <td>{msg.heightPos}</td>
        <td>{msg.rotationPos}</td>
        <td>{arcSin(msg.gyroXAccel)}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  tbody {
    height: 250px;
    overflow: auto;
    display: block;
  }
  thead,
  tbody tr {
    display: table;
    width: 500px;
    table-layout: fixed;
  }
</style>
