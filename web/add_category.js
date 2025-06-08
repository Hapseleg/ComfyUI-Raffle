import { api } from "../../scripts/api.js";
import { app } from "../../scripts/app.js";

app.registerExtension({
    name: "raffle.widgets",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "Raffle") {
            
            console.log(nodeType)
            console.log(nodeData)

            const onNodeCreated = nodeType.prototype.onNodeCreated;
            nodeType.prototype.onNodeCreated = function () {
                const r = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;

                const categoryDropdown = this.widgets.find(w => w.name === "exclude_tag_category_names");
                const excludedCategories = this.widgets.find(w => w.name === "exclude_tag_categories");
                // const apiLoginWidget = this.widgets.find(w => w.name === "API_LOGIN");
                // const apiKeyWidget = this.widgets.find(w => w.name === "API_KEY");

                // if (!siteWidget || !apiLoginWidget) {
                //     console.warn("E621 Booru Toolkit: Could not find 'site' or 'API' widget for GetRandomBooruPost.");
                //     return r;
                // }

                // Function to toggle API widget visibility
                const addCategory = () => {
                    let a = categoryDropdown.value
                    excludedCategories.value += a + ', '
                    // if (siteWidget.value !== "danbooru") {
                    //     apiLoginWidget.hidden = true;
                    //     apiKeyWidget.hidden = true;
                    // } else {
                    //     apiLoginWidget.hidden = false;
                    //     apiKeyWidget.hidden = false;
                    // }
                    // Trigger a resize to ensure the node UI updates correctly
                    this.computeSize();
                    app.graph.setDirtyCanvas(true, true);
                };

                // Store original onchange and wrap it
                const originalSiteOnchange = categoryDropdown.callback;
                categoryDropdown.callback = (value, ...args) => {
                    if (originalSiteOnchange) {
                        originalSiteOnchange.call(this, value, ...args);
                    }
                    addCategory();
                };

                // Initial check
                addCategory();

                return r;
            };
        }
    }
});