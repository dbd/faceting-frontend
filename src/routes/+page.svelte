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
  import { BellRingOutline, BadgeCheckOutline } from "flowbite-svelte-icons";

  const websocket = websocketStore("ws://10.0.0.163:8080/ws");
  //const websocket = websocketStore("ws://localhost:8080");

  const PosSettings: Servo[] = [
    {
      id: "height",
      name: "Height",
      presets: [0, 50, 100, 500],
      increments: [-250, -100, -50, -25, -10, 10, 25, 50, 100, 250],
    },
    {
      id: "tilt",
      name: "Pitch",
      presets: [0, 32.5, 45, 60, 90],
      increments: [-45, -20, -15, -10, -5, 5, 10, 15, 20, 45],
    },
    {
      id: "rotation",
      name: "Rotation",
      presets: [0, 15, 30, 45, 60, 90, 120, 135],
      increments: [-60, -45, -30, -15, -5, 5, 15, 30, 45, 60],
    },
  ];
</script>

<div class="grid grid-cols-2 place-content-center grid-rows-[repeat(20,_5vh)]">
  <Heading tag="h1" class="text-center p-4 mt-10 col-span-2 row-span-1"
    >Bot Controller</Heading
  >
  <Heading
    tag="h2"
    class="text-center p-4 mt-10 col-span-1 col-start-1 row-span-1"
  >
    Controls
  </Heading>
  <div
    class="grid gap-4 justify-items-center col-span-1 row-span-5 col-start-1"
  >
    {#each PosSettings as servo}
      <ServoCard {servo} {websocket} />
    {/each}
  </div>
  <Heading
    tag="h2"
    class="text-center p-4 mt-10 col-span-1 col-start-2 row-start-2"
  >
    Positioning
  </Heading>
  <div class="row-span-5 pr-10 w-full">
    <TableComponent messages={websocket.statusMessages} />
  </div>
  <Footer class="absolute bottom-0 grid grid-cols-2 w-full pb-2 pl-4 pr-4">
    <DarkMode class="col-span-1" />
    <div class="text-right grid col-span-1 justify-items-end">
      {#if websocket.connected}
        <BadgeCheckOutline class="text-green-400" size="xl" />
      {:else}
        <Button onclick={() => websocket.reconnect()}>
          <BellRingOutline class="text-red-100" size="xl" />
        </Button>
      {/if}
    </div>
  </Footer>
</div>
