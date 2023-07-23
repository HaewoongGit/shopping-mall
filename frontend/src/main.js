import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { store, apolloClient } from "./store.js";
import router from "./router";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faUserSecret, faCartShopping, faRightFromBracket, faTruckFast, faBagShopping, faStar, faPlus, faUser, faHeart, faMagnifyingGlass, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faUserSecret, faCartShopping, faRightFromBracket, faTruckFast, faBagShopping, faStar, faPlus, faUser, faHeart, faMagnifyingGlass, faArrowRight, faArrowLeft);

createApp(App).use(router).use(store).provide('apolloClient', apolloClient).component("font-awesome-icon", FontAwesomeIcon).mount("#app");