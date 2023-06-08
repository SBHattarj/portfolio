<script>
    import {Meta, Template, Story} from "@storybook/addon-svelte-csf"
    import Logo from "./Logo.svelte"
</script>

<Meta title="Logo" component={Logo} />

<Template let:args>
    <Logo {...args} />
</Template>

<Story name="normal" args={{
    width: "30vw",
    top: "1rem",
    left: "1rem",
    position: "relative",
    scale: 1,
    animateOnEnter: true
}} />
