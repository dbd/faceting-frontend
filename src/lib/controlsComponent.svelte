<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    Toggle,
    Button,
    ButtonGroup,
    Input,
    Label,
    Card,
    Checkbox,
    P,
  } from "flowbite-svelte";
  import { type Servo } from "$lib/store.svelte";
  import { RefreshOutline } from "flowbite-svelte-icons";
  let { servo, websocket }: { servo: Servo; websocket: Any } = $props();

  let posValue = $state(0);
  let rawValue = $state(false);
  let torqueEnabled = $state(false);

  function setPos(key: string, pos: number, raw: boolean): void {
    websocket.setPositionMessage(key, pos, raw);
  }
  function addPos(key: string, pos: number): void {
    websocket.addPositionMessage(key, pos);
  }

  $effect(() => {
    torqueEnabled = websocket.latestStatus.servoStatus.get(
      servo.id,
    ).torqueEnabled;
  });
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
            <Button onclick={() => setPos(servo.id, preset, rawValue)}
              >{preset}</Button
            >
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
      <AccordionItem>
        {#snippet header()}Motor Controls{/snippet}
        <label class="flex justify-between cursor-pointer p-3">
          <span
            class="ms-3 text-lg font-medium text-gray-900 dark:text-gray-300"
            >Torque Enabled:
          </span>
          <Toggle
            bind:checked={torqueEnabled}
            onchange={() => {
              websocket.setTorqueMessage(servo.id, torqueEnabled);
            }}
          ></Toggle>
        </label>
        <div class="flex justify-between cursor-pointer p-3">
          <span
            class="ms-3 text-lg font-medium text-gray-900 dark:text-gray-300"
            >Moving:
          </span>
          <P
            class="ms-3 pr-2 text-lg capitalize font-medium text-gray-900 dark:text-gray-300"
            >{websocket.latestStatus.servoStatus.get(servo.id).moving}</P
          >
        </div>
        <label class="flex justify-between cursor-pointer p-3">
          <span
            class="ms-3 text-lg font-medium text-gray-900 dark:text-gray-300"
            >Reboot:
          </span>
          <Button onclick={() => websocket.rebootMessage(servo.id)}>
            <RefreshOutline class="text-red-100" size="md" />
          </Button>
        </label>
      </AccordionItem>
    </Accordion>
  </div>
</Card>
