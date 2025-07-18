<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    Toggle,
    Button,
    ButtonGroup,
    Input,
    Label,
    P,
    Banner,
  } from "flowbite-svelte";
  import { type Servo } from "$lib/store.svelte";
  import { RefreshOutline } from "flowbite-svelte-icons";
  let { servo, websocket }: { servo: Servo; websocket: any } = $props();

  let posValue = $state(0);
  let rawValue = $state(false);
  let torqueEnabled = $state(false);
  let showBanner = $state(false);

  if (!servo.raw) {
    rawValue = true;
  }

  function setPos(key: string, pos: number, raw: boolean): void {
    if (!torqueEnabled) {
      showBanner = true;
    } else {
      websocket.setPositionMessage(key, pos, raw);
    }
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

<div
  class="border-1 border-gray-300 dark:border-gray-500 shadow-md shadow-gray-200 dark:shadow-gray-700 rounded-lg p-4 opacity-100 bg-white dark:bg-gray-800 m-4"
>
  {#if showBanner}
    <Banner
      onclick={() => {
        showBanner = false;
      }}
    >
      <span>Torque not enabled</span>
    </Banner>
  {/if}
  <Label for={servo.id} class="mb-2 text-md">{servo.name}</Label>
  <div class="flex justify-between">
    <ButtonGroup class="w-full">
      <Input
        type="number"
        bind:value={posValue}
        size="sm"
        onkeydown={(event) => {
          if (event.key === "Enter") {
            setPos(servo.id, posValue, rawValue);
          }
        }}
      />
      <Button
        onclick={() => setPos(servo.id, posValue, rawValue)}
        size="sm"
        class="text-nowrap"
        color="primary"
      >
        Set Pos
      </Button>
    </ButtonGroup>
  </div>
  {#if servo.raw}
    <label class="flex justify-between cursor-pointer pt-3">
      <span class="text-gray-900 dark:text-gray-300">Send raw values: </span>
      <Toggle bind:checked={rawValue} />
    </label>
  {/if}
  {#if servo.presets.length > 0}
    <div class="col-span-3 pt-5 pb-5">
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
    <div class="col-span-3 pt-5 pb-5">
      <Label for="bg">Increments</Label>
      <ButtonGroup id="bg">
        {#each servo.increments as increment}
          <Button
            onclick={() =>
              setPos(
                servo.id,
                websocket.latestStatus.range + increment,
                rawValue,
              )}>{increment}</Button
          >
        {/each}
      </ButtonGroup>
    </div>
  {/if}
  <Accordion class="col-span-4 w-full">
    <AccordionItem>
      {#snippet header()}Motor Controls{/snippet}
      <label class="flex justify-between cursor-pointer p-3">
        <span class="text-gray-900 dark:text-gray-300">Torque Enabled: </span>
        <Toggle
          bind:checked={torqueEnabled}
          onchange={() => {
            websocket.setTorqueMessage(servo.id, torqueEnabled);
          }}
        ></Toggle>
      </label>
      <div class="flex justify-between cursor-pointer p-3">
        <span class="text-gray-900 dark:text-gray-300">Moving: </span>
        <P class="ms-3 pr-2 capitalize text-gray-900 dark:text-gray-300"
          >{websocket.latestStatus.servoStatus.get(servo.id).moving}</P
        >
      </div>
      <label class="flex justify-between cursor-pointer p-3">
        <span class="text-gray-900 dark:text-gray-300">Reboot: </span>
        <Button onclick={() => websocket.rebootMessage(servo.id)}>
          <RefreshOutline class="text-red-100" size="md" />
        </Button>
      </label>
    </AccordionItem>
  </Accordion>
</div>
