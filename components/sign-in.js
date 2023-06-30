export default {
  template: `
    <v-container>
        <h1 class="font-weight-bold">Sign In</h1>
        <v-form ref="userForm">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Email"
            variant="outlined"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="passWordRules"
            label="Password"
            type="password"
            required
          ></v-text-field>

          <v-btn
            color="primary"
            @click.prevent="submitForm"
          >
          Submit
          </v-btn>

          <p class="mt-4">Don't have an account? <router-link to="/sign-up">Sign up here</router-link></p>
          <p><router-link to="#">Forgot your password?</router-link></p>
        </v-form>
    </v-container>
  `,
  data: () => ({
    email: "",
    emailRules: [
      (value) => {
        if (value) return true;
        return "Email is requred.";
      },
      (value) => {
        if (/.+@.+\..+/.test(value)) return true;
        return "Email must be valid.";
      },
    ],
    password: "",
    passWordRules: [
      (value) => {
        if (value) return true;
        return "Password is requred.";
      }
    ],
  }),

  methods: {
    submitForm() {
      const userForm = this.$refs.userForm;
      if (userForm.validate()) {
        localStorage.setItem("isLogin", true);
        this.$router.push("/");
      }
    },
  },
};
