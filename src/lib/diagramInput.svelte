<script lang="ts">
  import {
    Textarea,
    Label,
    Button,
    Toolbar,
    ToolbarGroup,
    ToolbarButton,
    TimelineStepper,
  } from "flowbite-svelte";
  import { type Servo } from "$lib/store.svelte";
  import { RefreshOutline } from "flowbite-svelte-icons";
  let { websocket }: { websocket: Any } = $props();

  interface step {
    id: number;
    label: string;
    description: string;
    status: "completed" | "pending" | "current";
  }
  let body: string = $state("");
  let parsed: Arrary<string> = $state([]);
  let steps: Array<step> = $state([
    {
      id: 0,
      label: "Enter an ASC file to start",
      description: "",
      status: "pending",
    },
  ]);

  function parseASC(body: string): void {
    steps = [];
    let split: Array<string> = body.split("\n");
    let current: boolean = true;
    let wasPavilion: boolean = true;
    for (let i = 0; i < split.length; i++) {
      if (!split[i].includes(" ")) {
        continue;
      }
      let line: string = split[i];
      let start: string = line.split(" ")[0];
      switch (start) {
        case "GemCad":
          break;
        case "g":
          steps.push({
            id: i,
            label: "Gear Index",
            description: line.slice(2),
            status: "completed",
          });
          break;
        case "y":
          steps.push({
            id: i,
            label: "Axis of Symmetry",
            description: line.slice(2),
            status: "completed",
          });
          break;
        case "a":
          let status: "pending" | "current" = "pending";
          for (let i = 2; i < line.slice(2).split(" ").length - 1; i++) {
            if (current) {
              status = "current";
              current = false;
            }
            if (wasPavilion && line.slice(2).split(" ")[0][0] !== '-') {
              wasPavilion = false
            steps.push({
              id: i,
              label: "Flip stone",
              description: "Transition to crown/girdle",
              status: status,
            });
            }
            steps.push({
              id: i,
              label: "Cut Angle: " + line.slice(2).split(" ")[0].slice(1),
              description: "Rotation: " + line.slice(2).split(" ")[i],
              status: status,
            });
          }
          break;
      }
      parsed.push(split[i]);
    }
  }
</script>

<div
  class="border-1 border-gray-300 shadow-md shadow-gray-200 rounded-lg place-self-stretch p-4 grid grid-cols-2 gap-6"
>
  <div class="col-start-1">
    <Label for="diagramText" class="mb-2 text-xl w-full col-start-1"
      >Faceting Diagram</Label
    >
    <Textarea
      id="diagramText"
      placeholder="Enter ASC"
      rows={6}
      name="diagramMessage"
      bind:value={body}
      class="col-start-1"
    >
      {#snippet footer()}
        <div class="flex items-center justify-between">
          <Toolbar embedded>
            <Button
              name="Submit"
              onclick={() => {
                parseASC(body);
              }}>Parse</Button
            >
          </Toolbar>
        </div>
      {/snippet}
    </Textarea>
  </div>
  <div class="cols-start-2 h-96 pl-10 overflow-y-scroll">
    <Label for="diagramText" class="mb-2 text-xl w-full col-start-1"
      >Parsed ASC</Label
    >
    <TimelineStepper {steps} />
  </div>
</div>
