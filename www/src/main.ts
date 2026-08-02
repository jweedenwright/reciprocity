import "mdb-vue-ui-kit/css/mdb.min.css";

import { createApp } from "vue";
import "./style.css";
import "./assets/github-markdown.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App)
app.use(router).mount("#app");

// Determine environment
app.config.globalProperties.$env = "dev";
app.config.globalProperties.$api = "http://localhost:5000/";
if (window.location.hostname.indexOf('weeden-wright') != -1) {
    app.config.globalProperties.$env = "prod";
    app.config.globalProperties.$api = "https://wwcookbook-64210040980.us-east1.run.app/";
}