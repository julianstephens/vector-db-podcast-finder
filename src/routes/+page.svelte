<script lang="ts">
  import { enhance } from "$app/forms";
  export let missingQuery: string | null = null;
  type Episode = {
    episodeName: string;
    episodeNo: number;
  };
  export let episodes: Episode[];
</script>

<h1 class="text-3xl">Weaviate + SveletKit Podcast Proximity Search Tool</h1>
<h3 class="mt-4 text-xl">Dataset: VOX Today Explained transcriptions</h3>

<form
  method="POST"
  class="mt-20 w-full flex justify-center items-start"
  use:enhance={({ form, data, action, cancel }) => {
    const query = data.get("query");
    missingQuery = query ? null : "Please provide a search parameter";
    if (missingQuery) cancel();
    return async ({ result }) => {
      if (result.type === "success") episodes = result.data?.data;
    };
  }}
>
  <div class="max-w-xl w-full flex flex-col justify-center items-center">
    <input
      type="text"
      name="query"
      class="w-full h-12 px-4 rounded-xl border border-sky-600"
      placeholder="Space-separated keyword search (e.g. voting america history)"
    />
    {#if missingQuery}<p class="self-start text-red-500">{missingQuery}</p>{/if}
    {#if episodes}
      <h3 class="mt-12 text-xl font-semibold">Results</h3>
      <ul>
        {#each episodes as ep}
          <li class="my-3 underline">{ep.episodeNo} - {ep.episodeName}</li>
        {/each}
      </ul>
    {/if}
  </div>
  <button
    class="ml-4 mt-1 w-10 h-10 flex items-center justify-center font-bold rounded-md transition-all duration-200 hover:bg-sky-600 hover:text-white hover:shadow-md hover:shadow-sky-600"
    >Go</button
  >
</form>
