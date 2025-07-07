<script lang="ts">
  import {
    Heading,
    Button,
    DarkMode,
    Footer,
  } from "flowbite-svelte";
  import { websocketStore, type Servo } from "$lib/store.svelte";
  import TableComponent from "$lib/tableComponent.svelte";
  import ServoCard from "$lib/controlsComponent.svelte";
  import DiagramInput from "$lib/diagramInput.svelte";
  import Background from "$lib/background.svelte";
  import {
    ExclamationCircleOutline,
    BadgeCheckOutline,
  } from "flowbite-svelte-icons";

  const websocket = websocketStore("ws://10.0.0.163:8080/ws");
  //const websocket = websocketStore("ws://localhost:8080");

  const PosSettings: Servo[] = [
    {
      id: "height",
      name: "Height",
      presets: [],
      increments: [-10, -5, -1, 1, 5, 10],
      raw: true,
    },
    {
      id: "tilt",
      name: "Pitch",
      presets: [0, 32.5, 45, 60, 90],
      increments: [],
      raw: true,
    },
    {
      id: "rotation",
      name: "Rotation",
      presets: [0, 15, 30, 45, 60, 90, 120, 135, 180, 270, 360],
      increments: [],
      raw: false,
    },
  ];
</script>

<div>
  <Background />
  <div
    class="grid grid-cols-2 justify-items-stretch p-5 max-h-500px h-full relative z-20"
  >
    <div class="col-start-1">
      <Heading tag="h3" class="text-center">Controls</Heading>
      {#each PosSettings as servo}
        <ServoCard {servo} {websocket} />
      {/each}
    </div>

    <div class="col-start-2 pr-10 max-h-[calc(45vh)] flex flex-col">
      <div class="flex-none">
        <Heading tag="h3" class="text-center">Diagram</Heading>
        <DiagramInput {websocket} />
      </div>
      <div class="h-full flex flex-col">
        <Heading tag="h3" class="text-center p-4">Positioning</Heading>
        <TableComponent messages={websocket.statusMessages} />
      </div>
    </div>
  </div>

  <Footer class="absolute bottom-0 grid grid-cols-2 w-full h-10 bg-gray-100">
    <DarkMode class="col-span-1" />
    <div class="text-right grid col-span-1 justify-items-end">
      {#if websocket.connected}
        <BadgeCheckOutline class="text-green-400" size="md" />
      {:else}
        <Button onclick={() => websocket.reconnect()}>
          <ExclamationCircleOutline class="text-red-100" size="md" />
        </Button>
      {/if}
    </div>
  </Footer>
</div>
