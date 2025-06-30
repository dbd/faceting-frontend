<script lang="ts">
  import {
    Button,
    ButtonGroup,
    Input,
    Label,
    Card,
    Accordion,
    AccordionItem,
    Heading,
  } from "flowbite-svelte";
  import { type Servo } from "$lib/store.svelte";
  let { servo, websocket }: { servo: Servo; websocket: Any } = $props();
  let posValue = $state(0)

  function sendPos(key: string, pos: number): void {
    websocket.sendPositionMessage(key, pos);
  }
</script>

<Card size="lg">
  <Label for={servo.id} class="mb-2 text-xl w-full">{servo.name}</Label>
  <div class="grid grid-cols-4 gap-4 grid-rows-4 justify-items-center w-full">
    <Input type="number" bind:value={posValue} class="col-span-3" />
    <Button onclick={() => sendPos(servo.id, posValue)}>
      Set Pos
    </Button>
    {#if servo.presets.length > 0}
      <div class="col-span-4">
        <Label for="bg">Presets</Label>
        <ButtonGroup id="bg">
          {#each servo.presets as preset}
            <Button onclick={() => sendPos(servo.id, preset)}>{preset}</Button>
          {/each}
        </ButtonGroup>
      </div>
    {/if}
    {#if servo.increments.length > 0}
      <div class="col-span-4">
        <Label for="bg">Increments</Label>
        <ButtonGroup id="bg">
          {#each servo.increments as increment}
            <Button onclick={() => sendPos(servo.id, increment)}>{increment}</Button>
          {/each}
        </ButtonGroup>
      </div>
    {/if}
  </div>
</Card>
