<script lang="ts">
	export let title = '';
	let isHovered = false;
	let x: number;
	let y: number;

	function mouseOver(event: any) {
		isHovered = true;
		x = event.pageX + 10;
		y = event.pageY + 10;
	}
	function mouseMove(event: any) {
		x = event.pageX + 10;
		y = event.pageY + 10;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<div
	on:mouseover={mouseOver}
	on:mouseleave={mouseLeave}
	on:mousemove={mouseMove}
	on:focus={function () {}}
	aria-hidden="true"
>
	<slot />
</div>

{#if isHovered}
	<div style="top: {y}px; left: {x}px;" class="tooltip">{title}</div>
{/if}

<style>
	@import './../styles/fonts.css';
	.tooltip {
		font-family: Roboto-Regular;
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 4px;
		padding: 4px;
		position: absolute;
	}
</style>
