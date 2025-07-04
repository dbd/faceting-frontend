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
    if (!x) {
      return null;
    }
    const gravity = 9.80665;
    x *= -1;
    if (x >= gravity) {
      x -= gravity;
    }
    let val = Math.asin(x / gravity) * (180 / Math.PI);
    val = 90 + val;
    return val.toFixed(2);
  }

  function getPosition(key: string, msg: StatusMessage) {
    if (!msg.servoStatus) {
      return null;
    }
    if (msg.servoStatus.has(key)) {
      return msg.servoStatus.get(key).position;
    }
    return null;
  }
</script>

<div
  class="h-full border-1 border-gray-300 shadow-md shadow-gray-200 rounded-lg place-self-stretch p-4"
>
  <Table shadow={true} class="table-fixed">
    <TableHead>
      <TableHeadCell>Height Position (mm)</TableHeadCell>
      <TableHeadCell>Height Raw</TableHeadCell>
      <TableHeadCell>Rotation Raw</TableHeadCell>
      <TableHeadCell>Pitch Angle</TableHeadCell>
      <TableHeadCell>Pitch Raw</TableHeadCell>
    </TableHead>
  </Table>
  <div class="h-full overflow-y-auto">
    <Table class="table-fixed" striped={true} shadow={true}>
      <TableBody class="">
        {#each [...messages].reverse() as msg}
          <TableBodyRow class="">
            <TableBodyCell>{msg.range}</TableBodyCell>
            <TableBodyCell>{getPosition("height", msg)}</TableBodyCell>
            <TableBodyCell>{getPosition("rotation", msg)}</TableBodyCell>
            <TableBodyCell>{arcSin(msg.gyroYAccel)}</TableBodyCell>
            <TableBodyCell>{getPosition("tilt", msg)}</TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    </Table>
  </div>
</div>
