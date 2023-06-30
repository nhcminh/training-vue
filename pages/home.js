export default {
  props: ["isLogin"],
  template: `
  <div>
    <v-app-bar app>
        <v-spacer></v-spacer>
        <v-btn @click="handleEvent">
        {{this.isLogin ? 'Sign Out' : 'Sign In'}}
        </v-btn>
    </v-app-bar>
  
    <v-main>
      <v-container >
        <div id="home" class="d-flex flex-column justify-space-around pink lighten-5" style="min-height: 50vh">
            <h1 class="text-center">Welcome to Vue Page</h1>
            <v-btn class="w-50 align-self-center">
                Browse the content
            </v-btn>
        </div>
      </v-container>
    </v-main>
  </div>
    `,
  methods: {
    handleEvent() {
      this.$emit("update", "signin");
    },
  },
};
