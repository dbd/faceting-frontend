<script lang="ts">
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import { type StatusMessage } from "$lib/store.svelte";
  let { messages }: { messages: Array<StatusMessage> } = $props();

  function arcSin(x: number) {
    const gravity = 9.80665;
    x *= -1;
    if (x >= gravity) {
      x -= gravity;
    }
    let val = Math.asin(x / gravity) * (180 / Math.PI);
    return val.toFixed(2);
  }
</script>

<Table striped={true} shadow={true} class="h-1.5">
  <TableHead>
    <TableHeadCell>Height Position</TableHeadCell>
    <TableHeadCell>Rotation Angle</TableHeadCell>
    <TableHeadCell>Pitch Angle</TableHeadCell>
  </TableHead>
  <TableBody>
    {#each [...messages].reverse() as msg}
      <TableBodyRow>
        <TableBodyCell>{msg.heightPos}</TableBodyCell>
        <TableBodyCell>{msg.rotationPos}</TableBodyCell>
        <TableBodyCell>{arcSin(msg.gyroXAccel)}</TableBodyCell>
      </TableBodyRow>
    {/each}
  </TableBody>
</Table>
