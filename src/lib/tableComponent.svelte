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
    val = 90 + val;
    return val.toFixed(2);
  }
</script>

<div class="">
  <Table shadow={true} class="table-fixed">
    <TableHead>
      <TableHeadCell>Height Position</TableHeadCell>
      <TableHeadCell>Rotation Angle</TableHeadCell>
      <TableHeadCell>Pitch Angle</TableHeadCell>
      <TableHeadCell>Pitch Angle</TableHeadCell>
    </TableHead>
  </Table>
  <div class="overflow-y-auto max-h-[_40vh]">
    <Table class="table-fixed" striped={true} shadow={true}>
      <TableBody class="">
        {#each [...messages].reverse() as msg}
          <TableBodyRow>
            <TableBodyCell>{msg.heightPos}</TableBodyCell>
            <TableBodyCell>{msg.rotationPos}</TableBodyCell>
            <TableBodyCell>{msg.tiltPos}</TableBodyCell>
            <TableBodyCell>{arcSin(msg.gyroYAccel)}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</div>
