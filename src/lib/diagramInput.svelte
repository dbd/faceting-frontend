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
  import {
    ArrowRightAltSolid,
    BackwardStepSolid,
    CloseCircleSolid,
    ForwardStepSolid,
    PlaySolid,
  } from "flowbite-svelte-icons";
  import type { Component } from "svelte";
  let { websocket }: { websocket: Any } = $props();

  interface step {
    id: number;
    label: string;
    description: string;
    runnable: boolean;
    status: "completed" | "pending" | "current";
    angle?: number;
    rotation?: number;
    icon?: Component | null;
    iconClass?: string | null;
  }
  let body: string = $state("");
  let parsed: Array<string> = $state([]);
  let steps: Array<step> = $state([
    {
      id: 0,
      label: "Enter an ASC file to start",
      description: "",
      runnable: false,
      status: "current",
      icon: ArrowRightAltSolid,
      iconClass: "text-yellow-500",
    },
  ]);
  let index: number = $state(0);

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
          index = +line.slice(2).split(" ")[0];
          steps.push({
            id: i,
            label: "Gear Index",
            description: index.toString(),
            status: "completed",
            runnable: false,
          });
          break;
        case "y":
          steps.push({
            id: i,
            label: "Axis of Symmetry",
            description: line.slice(2).split(" ")[0],
            status: "completed",
            runnable: false,
          });
          break;
        case "a":
          for (let i = 2; i < line.slice(2).split(" ").length - 1; i++) {
            let s: step = {} as step;
            s.id = i;
            s.status = current ? "current" : "pending";
            s.icon = current ? ArrowRightAltSolid : CloseCircleSolid;
            s.iconClass = current ? "text-yellow-500" : "text-red-400";
            if (wasPavilion && line.slice(2).split(" ")[0][0] !== "-") {
              wasPavilion = false;
              let p: step = { ...s };
              p.label = "Flip stone";
              p.description = "Transition to crown/girdle";
              p.runnable = false;
              steps.push(p);
            }
            s.angle = Math.abs(+line.slice(2).split(" ")[0]);
            s.rotation = +line.slice(2).split(" ")[i];
            s.label = "Cut Angle: " + s.angle.toString();
            s.description = "Rotation: " + s.rotation.toString();
            s.runnable = true;
            steps.push(s);
            if (current) {
              current = false;
            }
          }
          break;
      }
      parsed.push(split[i]);
    }
  }

  function nextStep(): void {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].status === "current") {
        let currentStep: step = steps[i];
        currentStep.status = "completed";
        currentStep.icon = null;
        currentStep.iconClass = null;
        steps[i] = currentStep;
        if (i + 1 >= steps.length) {
          break;
        }
        let next: step = steps[i + 1];
        next.status = "current";
        next.icon = ArrowRightAltSolid;
        next.iconClass = "text-yellow-500";
        steps[i + 1] = next;
        break;
      }
    }
  }

  function previousStep(): void {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].status === "current") {
        if (i <= 2) {
          break;
        }
        let currentStep: step = steps[i];
        currentStep.status = "pending";
        currentStep.icon = CloseCircleSolid;
        currentStep.iconClass = "text-red-200";
        steps[i] = currentStep;
        if (i - 1 <= 0) {
          break;
        }
        let prevStep: step = steps[i - 1];
        prevStep.status = "current";
        prevStep.icon = ArrowRightAltSolid;
        prevStep.iconClass = "text-yellow-500";
        steps[i - 1] = prevStep;
        break;
      }
      if (i === steps.length - 1) {
        let currentStep: step = steps[i];
        currentStep.status = "current";
        currentStep.icon = ArrowRightAltSolid;
        currentStep.iconClass = "text-yellow-500";
        steps[i] = currentStep;
      }
    }
  }

  function runStep(): void {
    let currentStep: step = {} as step;
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].status === "current") {
        currentStep = steps[i];
        break;
      }
    }
    if (
      currentStep &&
      currentStep.runnable &&
      currentStep.rotation &&
      currentStep.angle
    ) {
      websocket.setPositionMessage("tilt", currentStep.angle);
      console.log(currentStep.rotation);
      console.log(index);
      let adjustedRotation: number = (currentStep.rotation / index) * 360;
      websocket.setPositionMessage("rotation", adjustedRotation, true);
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
      rows={14}
      name="diagramMessage"
      bind:value={body}
      class="col-start-1 h-96"
    >
      {#snippet footer()}
        <div class="flex justify-between">
          <Button
            name="Submit"
            onclick={() => {
              parseASC(body);
            }}>Parse</Button
          >
          <Toolbar embedded>
            <ToolbarButton
              name="Previous"
              onclick={() => {
                previousStep();
              }}><BackwardStepSolid class="h-6 w-6" /></ToolbarButton
            >
            <ToolbarButton
              name="Play"
              onclick={() => {
                runStep();
              }}><PlaySolid class="h-6 w-6" /></ToolbarButton
            >
            <ToolbarButton
              name="Next"
              onclick={() => {
                nextStep(body);
              }}><ForwardStepSolid class="h-6 w-6" /></ToolbarButton
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
