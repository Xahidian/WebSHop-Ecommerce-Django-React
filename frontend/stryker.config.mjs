/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
export default {
  mutate: [
    "src/components/Cart.jsx",
    "src/components/Checkout.jsx",
    "src/components/AddItem.jsx",
    "src/components/EditableItemCard.jsx",
    "src/components/MyItems.jsx",
    "src/components/Login.jsx",
   
  ],
  testRunner: "command",
  commandRunner: {
    //npx playwright test tests/metamorphic --workers=1
    command: "npx playwright test tests/functional --workers=1"
  },
  reporters: ["clear-text", "progress", "html"],
  timeoutMS: 120000,
  concurrency: 2,
  coverageAnalysis: "off" // Must be off for command runner
};
