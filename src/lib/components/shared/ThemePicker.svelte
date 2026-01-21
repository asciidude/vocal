<script>
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  let themeValue = "light";
</script>

<RadioGroup.Root bind:value={themeValue}>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="light" id="light-id" />
    <Label for="light-id">Light</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="dark" id="dark-id" />
    <Label for="dark-id">Dark</Label>
  </div>
</RadioGroup.Root>