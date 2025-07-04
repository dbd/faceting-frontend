<script lang="ts">
  import {
    Textarea,
    Label,
    Button,
    Toolbar,
    ButtonGroup,
    TimelineStepper,
    Toggle,
  } from "flowbite-svelte";
  import {
    ArrowRightAltSolid,
    BackwardStepSolid,
    CloseCircleSolid,
    ForwardStepSolid,
    PlaySolid,
  } from "flowbite-svelte-icons";
  import type { Component } from "svelte";
  let { websocket }: { websocket: any } = $props();

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
  let skipAngle: boolean = $state(false);
  let prevRunStep: step = $state({} as step);
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
      let torqueEnabled = websocket.latestStatus["height"].torqueEnabled
      websocket.setTorqueMessage("height", true)
      websocket.setPositionMessage("height", websocket.latestStatus.range, false)
      if (!skipAngle) {
        websocket.setPositionMessage("tilt", currentStep.angle);
      } else if (prevRunStep.angle !== currentStep.angle) {
        websocket.setPositionMessage("tilt", currentStep.angle);
      }
      let adjustedRotation: number = (currentStep.rotation / index) * 360;
      websocket.setPositionMessage("rotation", adjustedRotation, true);
      prevRunStep = currentStep;
      websocket.setTorqueMessage("height", torqueEnabled)
    }
  }
</script>

<div
  class="border-1 border-gray-300 dark:border-gray-500 shadow-md shadow-gray-200 dark:shadow-gray-700 rounded-lg p-4 opacity-100 bg-white dark:bg-gray-800 place-self-stretch grid grid-cols-2 gap-6 m-2"
>
  <div class="col-start-1">
    <Label for="diagramText" class="mb-2 text-xl w-full col-start-1 flex-none"
      >Faceting Diagram</Label
    >
    <Textarea
      id="diagramText"
      placeholder="Enter ASC"
      name="diagramMessage"
      bind:value={body}
      rows={14}
      class="h-96 flex flex-col"
      innerClass="grow"
    >
      {#snippet footer()}
        <div class="">
          <Button
            name="Submit"
            onclick={() => {
              parseASC(body);
            }}>Parse</Button
          >
        </div>
      {/snippet}
    </Textarea>
  </div>
  <div class="cols-start-2 relative flex flex-col">
    <Label for="diagramText" class="text-xl">Parsed ASC</Label>
    <div
      class="pl-10 grow max-h-80 overflow-auto border-2 border-gray-100 dark:border-gray-500 rounded-lg m-2 p-2"
    >
      <TimelineStepper {steps} />
    </div>
    <div class="flex justify-between">
      <ButtonGroup id="bg">
        <Button
          name="Previous"
          onclick={() => {
            previousStep();
          }}><BackwardStepSolid class="h-6 w-6" /></Button
        >
        <Button
          name="Play"
          onclick={() => {
            runStep();
          }}><PlaySolid class="h-6 w-6" /></Button
        >
        <Button
          name="Next"
          onclick={() => {
            nextStep();
          }}><ForwardStepSolid class="h-6 w-6" /></Button
        >
      </ButtonGroup>
      <Toggle bind:checked={skipAngle}>Skip sending angle</Toggle>
    </div>
  </div>
</div>
