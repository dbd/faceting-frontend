<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Input,
    Label,
    Card,
  } from "flowbite-svelte";
  import { type Servo } from "$lib/store.svelte";
  let { servo, websocket }: { servo: Servo; websocket: Any } = $props();
  let posValue = $state(0)

  function setPos(key: string, pos: number): void {
    websocket.setPositionMessage(key, pos);
  }
  function addPos(key: string, pos: number): void {
    websocket.addPositionMessage(key, pos);
  }
</script>

<Card size="lg">
  <Label for={servo.id} class="mb-2 text-xl w-full">{servo.name}</Label>
  <div class="grid grid-cols-4 gap-4 grid-rows-3 justify-items-center w-full">
    <Input type="number" bind:value={posValue} class="col-span-3" />
    <Button onclick={() => setPos(servo.id, posValue)}>
      Set Pos
    </Button>
    {#if servo.presets.length > 0}
      <div class="col-span-4">
        <Label for="bg">Presets</Label>
        <ButtonGroup id="bg">
          {#each servo.presets as preset}
            <Button onclick={() => setPos(servo.id, preset)}>{preset}</Button>
          {/each}
        </ButtonGroup>
      </div>
    {/if}
    {#if servo.increments.length > 0}
      <div class="col-span-4">
        <Label for="bg">Increments</Label>
        <ButtonGroup id="bg">
          {#each servo.increments as increment}
            <Button onclick={() => addPos(servo.id, increment)}>{increment}</Button>
          {/each}
        </ButtonGroup>
      </div>
    {/if}
  </div>
</Card>
