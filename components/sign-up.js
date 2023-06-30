export default {
  template: `
    <v-container>
        <h1 class="font-weight-bold">Sign In</h1>
        <v-form ref="userForm">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Email"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="passWordRules"
            label="Password"
            type="password"
            required
          ></v-text-field>

          <v-text-field
            v-model="rePassword"
            :rules="[rePassWordRules]"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>

          <v-btn
            color="primary"
            @click.prevent="submitForm"
          >
          Submit
          </v-btn>

          <p class="mt-4">Already have a account? <router-link to="/sign-in">Sign in here</router-link></p>
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
    rePassword: "",
    
  }),
  methods: {
    rePassWordRules(value) {
        if (value === this.password) return true;
        return 'Passwords do not match'
      },

    submitForm() {
      const userForm = this.$refs.userForm;
      if (userForm.validate()) {
        localStorage.setItem("isLogin", true);
        this.$router.push("/");
      }
    },
  },
};
