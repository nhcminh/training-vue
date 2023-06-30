import home from "./pages/home.js";
import signin from "./pages/signin.js";
import signup from "./pages/signup.js";
// import { requireAuth } from "./auth/middleware.js";
// const routes = [
//   { path: "/", component: home, meta: { requiresAuth: true } },
//   { path: "/home", component: home, meta: { requiresAuth: true } },
//   { path: "/sign-in", component: signin },
//   { path: "/sign-up", component: signup },
// ];
// const router = new VueRouter({ routes });
// router.beforeEach(requireAuth);
new Vue({
  el: "#app",
  // router: router,
  components: {
    home,
    signin,
    signup,
  },
  template: `
  <v-app>
  <!-- <router-view></router-view> -->
  <home v-if="view === 'home'" @update="updateView" :isLogin="isLogin">
  </home>
  <signin v-else-if="view === 'signin'" @update="updateView">
  </signin>
  <signup v-else @update="updateView">
  </signup>
  </v-app>
`,
  vuetify: new Vuetify(),
  data() {
    return {
      isLogin: false,
      view: "",
    };
  },
  methods: {
    checkLogin() {
      this.isLogin = localStorage.getItem("token") ? true : false;
      this.view = this.isLogin ? "home" : "signin";
      console.log(this.isLogin);
    },
    updateView(newView) {
      this.view = newView;
    }
  },
  mounted() {
    this.checkLogin();
  },
});
