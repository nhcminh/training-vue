Vue.use(Vuetify);

const eventBus = new Vue({
  data() {
    return {
      isLoggedIn: false,
      userInfo: {},
      users: []
    }
  }
});

const vuetify = new Vuetify();

const homeInstance = new Vue({
  el: "#home",
  template: `
    <div v-if="isShow">
      <v-app>
        <v-toolbar class="flex-grow-0 px-8 mt-3 mb-5">
          <v-toolbar-title>
            <h1>Vue</h1>
          </v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-btn height="40" min-width="84" class="btn btn--signin" @click="handleEventAuthBtn">{{ authBtn }}</v-btn>
        </v-toolbar>
    
        <v-card
          class="home--content pt-10"
          height="364px"
        >
          <v-card-title class="justify-center mb-15">
            <span class="align-self-center home-content--title">Welcome to the VUE Page</span>
          </v-card-title>

          <v-card-actions class="justify-center mt-10">
            <v-btn height="36" min-width="280" class="btn" capitalize>
              Browse the content
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-app>
    </div>
  `,
  created() {
    eventBus.$on("go-to-home", () => {
      this.isShow = true;
      loginInstance.isShow = false;
      registerInstance.isShow = false;

      eventBus.isLoggedIn ? this.authBtn = "Sign Out" : this.authBtn = "Sign In"
    });

    eventBus.$on("logged", () => {
      this.authBtn = "Sign Out"
    })
  },
  data() {
    return {
      isShow: true,
      authBtn: "Sign In"
    };
  },
  mounted() {
    eventBus.isLoggedIn ? this.authBtn = "Sign Out" : this.authBtn = "Sign In"
  },
  methods: {
    goToLoginPage: function (evt) {
      eventBus.$emit("go-to-login");
    },
    goToLogout: function() {
      eventBus.$set(eventBus, 'isLoggedIn', false);
      eventBus.$set(eventBus, 'userInfo', {});
      this.authBtn = "Sign In";
    }
  },
  computed: {
    handleEventAuthBtn: function() {
      if(this.authBtn === "Sign In") {
       return this.goToLoginPage;
      } else if (this.authBtn === "Sign Out") {
        return this.goToLogout;
      }
    }
  },
  vuetify,
});

const loginInstance = new Vue({
  el: "#login",
  template: `
    <div v-if="isShow">
      <v-app>
        <main>
          <v-container fluid fill-height class="loginOverlay">
            <v-layout flex align-center justify-center>
              <v-flex xs12 sm8 md6 >
                <v-card class="elevation-12">
                    <v-toolbar>
                      <v-toolbar-title class="mx-1">Sign In</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                      <v-form ref="form" lazy-validation>
                        <v-text-field 
                          class="mx-1" 
                          v-model="email" 
                          label="Email" 
                          type="email"
                          :rules="[rules.required]"
                        >
                        </v-text-field>
                        <v-text-field 
                          class="mx-1" 
                          v-model="password" 
                          label="Password" 
                          type="password"
                          :rules="[rules.required]"
                        >
                        </v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn class="mx-2" color="primary" @click="onSubmit">Submit</v-btn>
                    </v-card-actions>
                    <v-card-title class="pb-15">
                      <span class="mt-2">Don't have an account? <a @click="goToRegisterPage">Sign Up here!</a></span>
                    </v-card-title>
                  </v-card>
                </v-flex>
            </v-layout>
          </v-container>  
        </main>
      </v-app>      
    </div>
  `,
  created() {
    eventBus.$on("go-to-login", () => {
      this.isShow = true;
      homeInstance.isShow = false;
    });
  },
  data() {
    return {
      isShow: false,
      email: "",
      password: "",
      rules: {
        required: value => !!value || 'This field is required'
      }
    };
  },
  methods: {
    onSubmit() {
      const isValid = this.$refs.form.validate();

      if(!isValid) return;

      const users = JSON.parse(JSON.stringify(eventBus.users));

      const userInfo = users.find(user => user.email === this.email);

      if(!userInfo) {
        eventBus.$emit('show-toast', {
          message: "Email is not exist. Please try again.",
          color: "red accent-2"
        });
        return;
      }

      if(userInfo.password === this.password) {
        eventBus.$set(eventBus.userInfo, 'email', this.email);
        eventBus.$set(eventBus, 'isLoggedIn', true);
        this.$refs.form.reset();
        eventBus.$emit('show-toast', {
          message: "Login is successfully.",
          color: "success"
        });
        eventBus.$emit("go-to-home");
      }
    },
    goToRegisterPage: function () {
      eventBus.$emit("go-to-register");
    }
  },
  vuetify,
});

const registerInstance = new Vue({
  el: "#register",
  template: `
    <div v-if="isShow">
      <v-app>
        <main>
          <v-container fluid fill-height class="loginOverlay">
            <v-layout flex align-center justify-center>
              <v-flex xs12 sm8 md6 >
                <v-card class="elevation-12">
                    <v-toolbar>
                      <v-toolbar-title class="mx-1">Sign Up</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                      <v-form ref="form" lazy-validation>
                        <v-text-field 
                          class="mx-1" 
                          v-model="email" 
                          label="Email" 
                          type="email"
                          :rules="[rules.required]"
                        >
                        </v-text-field>
                        <v-text-field 
                          class="mx-1" 
                          v-model="password" 
                          label="Password" 
                          type="password"
                          :rules="[rules.required]"
                        >
                        </v-text-field>
                        <v-text-field 
                          class="mx-1" 
                          v-model="confirmPassword" 
                          label="Confirm Password" 
                          type="password"
                          :rules="[rules.required]"
                        >
                        </v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn class="mx-2" color="primary" :disabled="!isFormValid" @click="onSubmit">Submit</v-btn>
                    </v-card-actions>
                    <v-card-title class="pb-15">
                      <span class="mt-2" >Already have an account? <a @click="goToLoginPage">Sign In here!</a></span>
                    </v-card-title>
                  </v-card>
                </v-flex>
            </v-layout>
          </v-container>  
        </main>
      </v-app>  
    </div>
  `,
  created() {
    eventBus.$on("go-to-register", () => {
      this.isShow = true;
      homeInstance.isShow = false;
      loginInstance.isShow = false;
    });
  },
  data() {
    return {
      isShow: false,
      email: "",
      password: "",
      confirmPassword: "",
      rules: {
        required: value => !!value || 'This field is required'
      }
    };
  },
  computed: {
    isFormValid() {
      return !!this.email && !!this.password && !!this.confirmPassword;
    }
  },
  methods: {
    checkValid() {
      this.isDisabled = !this.$refs.form.validate();
    },
    onSubmit() {
      const userInfo = {
        email: this.email,
        password: this.password
      }

      if(this.password !== this.confirmPassword) {
        eventBus.$emit('show-toast', {
          message: "Passwords do not match, please try again.",
          color: "red accent-2"
        })
        return;
      }

      const users = JSON.parse(JSON.stringify(eventBus.users));

      console.log(users);

      if(users.length === 0) {
        eventBus.$set(eventBus.users, eventBus.users.length, userInfo);
        this.$refs.form.reset();
        eventBus.$emit('show-toast', {
          message: "Register is successfully.",
          color: "success"
        });
        eventBus.$emit("go-to-login");
        return;
      }

      const isEmailExist = users.some((user) => user.email === this.email);

      if(isEmailExist) {
        eventBus.$emit('show-toast', {
          message: "Email is exist. Please try with other Email.",
          color: "red accent-2"
        })
        return;
      } else {
        eventBus.$set(eventBus.users, eventBus.users.length, userInfo);
        this.$refs.form.reset()
        eventBus.$emit('show-toast', {
          message: "Register is successfully.",
          color: "success"
        });
        eventBus.$emit("go-to-login");
        return;
      }
    },
    goToLoginPage: function () {
      eventBus.$emit("go-to-login");
    }
  },
  vuetify,
});

const toastInstance = new Vue({
  el: "#toast",
  template: `
    <div v-if="isToastVisible">
      <v-app>
        <v-snackbar v-model="isToastVisible" :timeout="timeout" :color="color" :top="top" :bottom="bottom" :left="left" :right="right" 
        outlined>
          {{ message }}
        </v-snackbar>
      </v-app>
    </div>
  `,
  mounted() {
    eventBus.$on('show-toast', (data) => {
      this.message = data.message;
      this.color = data.color;
      this.isToastVisible = true;
    })
  },
  data() {
    return {
      isToastVisible: false,
      message: 'Hello, world!',
      timeout: 3000,
      color: 'success',
      top: false,
      bottom: true,
      left: false,
      right: true,
      showAction: false,
    }
  },
  vuetify,
})