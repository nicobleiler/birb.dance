<script lang="ts">
	import { SvelteComponent, onMount } from 'svelte';
    // @ts-ignore
	import { Screen } from 'svelte-preview-ui';
	import Convert from 'ansi-to-html';
	import Terminal from '$lib/Terminal.svelte';

	// var Terminal: Terminal;
	var terminal: SvelteComponent;
	var convert = new Convert({
        fg: '#FFF',
        bg: '#000',
        newline: false,
        escapeXML: false,
        stream: false
    });
	var frame: string = "";
	var activeTab: string = "Terminal";

	$: if(activeTab === "About") {
		activeTab = "Terminal";
		window.open("https://github.com/nicobleiler/birb.dance", "_blank")?.focus();
	}

	async function subscribe() {
		const pathName = (window.location.pathname == "/") ? "" : window.location.pathname;
		const search = window.location.search;
		const url = `${pathName}${search}`;
		const response = await fetch(url);
        if(response === null || response.body === null) return;
		const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
		while(true) {
			const { value, done } = await reader?.read();
			if (done) break;
			await terminal.write(value);
		}
	}

	onMount(subscribe);
</script>

<Screen class="screen" tabs={["Terminal", "About"]} bind:activeTab>
    {#if activeTab == "Terminal"}
		<div id="terminal">
			<Terminal bind:this={terminal}/>
		</div>
    {/if}
</Screen>

<style>
    #terminal {
        white-space: pre-wrap;
        font-family:'Lucida Console', monospace;
		text-align: left;
        font-size: 1.7vh;
		cursor: default;
    }

	:global(body) {
        background-color: #2e2e2e;
		padding: 0;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	:global(.screen) {
		min-width: 200px;
		height: 100%;
		margin: 1rem;
		text-align: center;
	}

    :global(button) {
        color: white;
    }
</style>