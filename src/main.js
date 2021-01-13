import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import store from "./store/index.js";
import firebase from "firebase";
// import axios from "axios";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAA_EGlJ3zGySe4EouTxXSaWvlGILMTa1k",
  authDomain: "vuemaps-b3c35.firebaseapp.com",
  projectId: "vuemaps-b3c35",
  storageBucket: "vuemaps-b3c35.appspot.com",
  messagingSenderId: "651794246366",
  appId: "1:651794246366:web:bf5890dd09f642602cf04f",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase;

const app = createApp(App);

app.use(router);
app.use(store);
// app.use(axios);

app.mount("#app");

// createApp(App).mount('#app')
