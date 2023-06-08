<script>
    import {Meta, Template, Story} from "@storybook/addon-svelte-csf"
    import Keyboard from "./Keyboard.svelte";
    let typed = ""
</script>

<Meta title="Keyboard" component={Keyboard} />

<Template let:args>
    <p>{typed}</p>
    <Keyboard {...args} bind:typed />
</Template>

<Story
    name="normal"
    args={{
        toBeTyped: "Storybook test",
        typed: "",
        virtual: true,
        errorRate: 30,
        typingSpeed: 4,
        percentTypingConsistency: 70,
        noTyping: false,
        allowEmpty: false
    }}
/>