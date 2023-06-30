export default {
  template: `
      <div >
        <v-container class="d-flex justify-end">
          <v-btn class="fr" @click="movePage">
            Sign in
          </v-btn>
        </v-container>
        <div class="home d-flex flex-column align-center">
            <h1 class="text-center mt-5">Welcome to Vue Page</h1>
            <v-btn class="mt-16 w-25">
                Browse the content
            </v-btn>
        </div>
      </div>
    `,
  methods: {
    movePage() {
      this.$router.push("/sign-in");
    },
  },
};
