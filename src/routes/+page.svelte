<script lang="ts">
  import {
    Heading,
    Button,
    ButtonGroup,
    Input,
    DarkMode,
    Label,
    Card,
    P,
    Footer,
    BottomNavItem,
  } from "flowbite-svelte";
  import { websocketStore, type Servo } from "$lib/store.svelte";
  import TableComponent from "$lib/tableComponent.svelte";
  import ServoCard from "$lib/controlsComponent.svelte";
  import DiagramInput from "$lib/diagramInput.svelte";
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
      presets: [0, 50, 100, 500],
      increments: [-250, -100, -50, -25, -10, 10, 25, 50, 100, 250],
      raw: true,
    },
    {
      id: "tilt",
      name: "Pitch",
      presets: [0, 32.5, 45, 60, 90],
      increments: [-45, -20, -15, -10, -5, 5, 10, 15, 20, 45],
      raw: true,
    },
    {
      id: "rotation",
      name: "Rotation",
      presets: [0, 15, 30, 45, 60, 90, 120, 135],
      increments: [-60, -45, -30, -15, -5, 5, 15, 30, 45, 60],
      raw: false,
    },
  ];
</script>

<div class="grid grid-cols-2 place-items-center gap-2">
  <Heading
    tag="h2"
    class="text-center p-4 mt-10 col-start-1"
  >
    Controls
  </Heading>
  <div
    class="inline-grid gap-4 justify-items-center col-span-1 row-span-5 col-start-1"
  >
    {#each PosSettings as servo}
      <ServoCard {servo} {websocket} />
    {/each}
  </div>

  <Heading
    tag="h2"
    class="text-center p-4 mt-10 col-span-1 col-start-2 row-start-1 "
  >
    Diagram
  </Heading>
  <div class="pr-10 col-span-1 flex">
    <DiagramInput  websocket={websocket} />
  </div>
  <Heading
    tag="h2"
    class="text-center p-4 mt-10 col-span-1 col-start-2"
  >
    Positioning
  </Heading>
  <div class="row-span-3 pr-10 w-full ">
    <TableComponent messages={websocket.statusMessages} />
  </div>

  <Footer class="absolute bottom-0 grid grid-cols-2 w-full">
    <DarkMode class="col-span-1" />
    <div class="text-right grid col-span-1 justify-items-end">
      {#if websocket.connected}
        <BadgeCheckOutline class="text-green-400" size="xl" />
      {:else}
        <Button onclick={() => websocket.reconnect()}>
          <ExclamationCircleOutline class="text-red-100" size="xl" />
        </Button>
      {/if}
    </div>
  </Footer>
</div>
