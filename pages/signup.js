export default {
  template: `
  <v-container>
    <v-card>
      <v-card-title class="text-center">Sign Up</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Email"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            :rules="passwordRules"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            label="Confirm Password"
            v-model="confirmPassword"
            :rules="confirmPasswordRules"
            type="password"
            required
          ></v-text-field>
          <p>Already have account? <a @click="navigate">Sign in here</a></p>
          <v-spacer></v-spacer>
          <v-btn color="primary" block @click="signup">Sign Up</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
`,
data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      emailRules: [
        value => !!value || 'Email is required',
        value => /.+@.+\..+/.test(value) || 'Invalid email address',
      ],
      passwordRules: [
        value => !!value || 'Password is required',
        value => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value) || 'Password must be at least 8 characters, one letter, one number and one special character',
      ],
      confirmPasswordRules: [
        value => !!value || 'Confirm password is required',
        value => value === this.password || 'Passwords do not match',
      ],
    }
  },

  methods: {
    signup() {
      if (this.$refs.form.validate()) {
        let accounts = JSON.parse(localStorage.getItem("accounts")) || [];
        accounts.push({ email: this.email, password: this.password });
        localStorage.setItem("accounts", JSON.stringify(accounts));
        // this.$router.push("/sign-in");
        this.$emit('update', 'signin')
      }
    },
    navigate() {
      this.$emit('update', 'signin');
    }
  }
};
