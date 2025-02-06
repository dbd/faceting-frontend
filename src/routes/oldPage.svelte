<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  // $lib auto-resolves to ./src/lib in Svelte.
  import { state, connect } from '$lib/state';

  onMount(async () => {
    connect();
  });
</script>

<script lang="ts">
  import Header from "./header.svelte";
  import WS from "./index.svelte";
  let formState = $state({
    answers: {},
    step: 0,
    error: "",
  });
  const QUESTIONS = [
    {
      question: "What is your name",
      id: "name",
      type: "text",
    },
    {
      question: "What is your birthday",
      id: "birthday",
      type: "date",
    },
    {
      question: "What is your favorite colo",
      id: "color",
      type: "color",
    },
  ];

  function nextStep(id: string) {
    if (formState.answers[id]) {
      formState.step += 1;
      formState.error = "";
    } else {
      formState.error = "Please fill out the form";
    }
  }

  // runs on mount by default
  $effect(() => {
    console.log("on mounted");
    // runs unmounted or destroyed
    // before effect re-runs
    return () => {
      console.log("on unmount");
    };
  });

  $effect( ()=> {
    // will re-run when formState.step has changed
    console.log("formState", formState.step)
    // don't create state based off other state
    return () => {
    console.log("formState on unmount", formState.step)
    };
  })
</script>

<WS />
<Header name={formState.answers.name}></Header>
<main>
  {#if formState.step >= QUESTIONS.length}
    <p>Thank you!</p>
  {:else}
    <p>Step: {formState.step + 1}</p>
  {/if}

  {#each QUESTIONS as question, index (question.id)}
    {#if formState.step === index}
      {@render formStep(question)}
    {/if}
  {/each}
  {#if formState.error}
    <p class="error">{formState.error}</p>
  {/if}
</main>

{#snippet formStep({
  question,
  id,
  type,
}: {
  type: string;
  id: string;
  question: string;
})}
  <article>
    <div>
      <label for={id}>{question}</label>
      <input {type} {id} bind:value={formState.answers[id]} />
    </div>
    <button onclick={() => nextStep(id)}>Next</button>
  </article>
{/snippet}

<style>
  .error {
    color: red;
  }
</style>
