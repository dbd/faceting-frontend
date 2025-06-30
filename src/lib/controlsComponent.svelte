<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    P,
    Button,
    ButtonGroup,
    Input,
    Label,
    Card,
    Checkbox,
  } from "flowbite-svelte";
  import { type Servo } from "$lib/store.svelte";
  let { servo, websocket }: { servo: Servo; websocket: Any } = $props();
  let posValue = $state(0);
  let rawValue = $state(false);
  let torqueEnable = $state(false)

  function setPos(key: string, pos: number, raw: boolean): void {
    websocket.setPositionMessage(key, pos, raw);
  }
  function addPos(key: string, pos: number): void {
    websocket.addPositionMessage(key, pos);
  }
</script>

<Card size="lg">
  <Label for={servo.id} class="mb-2 text-xl w-full">{servo.name}</Label>
  <div class="grid grid-cols-4 gap-4 grid-rows-3 justify-items-center w-full">
    <Input type="number" bind:value={posValue} class="col-span-3" />
    {#if servo.raw}
      <Checkbox bind:checked={rawValue}>Use Raw Values</Checkbox>
    {/if}
    <Button
      onclick={() => setPos(servo.id, posValue, rawValue)}
      class="col-span-4 w-full"
    >
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
            <Button onclick={() => addPos(servo.id, increment)}
              >{increment}</Button
            >
          {/each}
        </ButtonGroup>
      </div>
    {/if}
    <Accordion class="col-span-4 w-full">
      <AccordionItem open>
        {#snippet header()}Motor Controls{/snippet}
          <label class="flex justify-between cursor-pointer">
            <span
              class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              >Torque Enabled:</span
            >
            <input type="checkbox" value={torqueEnable} class="sr-only peer" />
            <div
              class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"
            ></div>
          </label>
      </AccordionItem>
    </Accordion>
  </div>
</Card>
