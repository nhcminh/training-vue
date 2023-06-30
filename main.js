import Home from "./components/home.js";
import Signin from "./components/sign-in.js";
import Signup from "./components/sign-up.js";

const router = new VueRouter({
  routes: [
    { path: "/sign-in", name: "sign-in", component: Signin },
    { path: "/sign-up", name: "sign-up", component: Signup },
    { path: "/", name: "home", component: Home },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isLogin = localStorage.getItem("isLogin");

  if (requiresAuth && !isLogin) {
    next("/sign-in");
  } else {
    next();
  }
});

new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  router: router,
  template: `
    <v-app>
      <router-view></router-view>
    </v-app>
  `,
  data() {
    return {
      isLogin: false,
    };
  },
  methods: {
    checkIsLogin() {
      const isLogin = localStorage.getItem("isLogin") ? true : false;
      if (isLogin) {
        this.$router.push("/");
      } else {
        this.$router.push("/sign-in");
      }
    },
  },
  created() {
    this.checkIsLogin();
  },
});
