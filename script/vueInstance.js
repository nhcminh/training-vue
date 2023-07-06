import { validation } from "./validations.js";
import { axiosCaller } from "./services.js";
import { store } from "./store.js";

// EventBus
const eventBus = new Vue();

// Gen Vue instance
const appInstance = new Vue({
    el: '#app',
    store,
    vuetify: new Vuetify(),
    template: `
    <v-app>
        <div v-if="isLoading" class="loading-container">
            <div class="loading"></div>
        </div>
        <div class="app__wrapper">
        <div class="nav-bar">
            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-avatar
                        color="primary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                    >
                        <img
                        src="https://cdn.vuetifyjs.com/images/john.jpg"
                        alt="Trung">
                    </v-avatar>
                </template>
                <v-list>
                    <v-list-item> </v-list-item>
                    <v-list-item
                        v-for="(item, index) in menu"
                        :key="index"
                        @click="handle_function_call(item.action)"
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
            <div class="title">Welcome to the VUE Page</div>
            <button>Browse the content</button>
        </div>
        <!-- Overlay -->
        <div class="overlay__wrapper" v-show="overlayStatus">
            <v-overlay contained class="align-center justify-center">
                <div class="overlay__outside" @click="overlay = false"></div>
                <div class="overlay__content"> 
                    <v-alert v-if="showAlert.message" border="top" :color="showAlert.type + ' lighten-2'" dark>
                        {{showAlert.message}}
                    </v-alert>
                    <!-- Sign In Form  -->
                    <div id="login-form"></div>
                    <!-- Sign Up Form  -->
                    <div id="signup-form"></div>
                </div>
            </v-overlay>
        </div>
    </v-app>
    `,
    data: {
        overlay: false,
        isLoading: false,
        menu: [
            { title: 'Sign In', action: 'handleOpenSignIn' },
            { title: 'Sign Up', action: 'handleOpenSignUp' },
        ],
        alert: {
            message: '',
            type: 'red',
        },
    },
    computed: {
        overlayStatus() {
            return this.overlay;
        },
        showAlert() {
            if (this.alert.message) {
                //Hide alert
                setTimeout(() => {
                    this.alert.message = ""
                }, 2000);
            }
            const newAlert = {
                message: this.alert.message,
                type: this.alert.type
            }
            return newAlert;
        },
        userInfo() {
            console.log(this.$store.getters.userInfo)
            return this.$store.getters.userInfo
        }
    },
    methods: {
        //UI methods
        handleToggleOverlay(status) {
            this.overlay = status;
        },
        handleShowAlert(alertMessage, alertType) {
            this.alert = {
                message: alertMessage,
                type: alertType
            }
        },
        handleOpenSignIn() {
            this.handleToggleOverlay(true)
            eventBus.$emit('toggle-sign-in', true)
            eventBus.$emit('toggle-sign-up', false)
        },
        handleOpenSignUp() {
            this.handleToggleOverlay(true)
            eventBus.$emit('toggle-sign-up', true)
            eventBus.$emit('toggle-sign-in', false)
        },
        handle_function_call(function_name) {
            this[function_name]()
        },
        //Auth methods
        handleAuth(method, path, data, errorMessage, handleSuccess) {
            this.isLoading = true;
            return axiosCaller(method, path, data, (result) => {
                handleSuccess(result);
                this.handleShowAlert(result?.message, 'green');
                this.isLoading = false
            }, () => { this.handleShowAlert(errorMessage, 'red'); this.isLoading = false });
        },
    },
    //life cycle
    created() {
        eventBus.$on('toggle-overlay', (status) => {
            this.handleToggleOverlay(status);
        });
        eventBus.$on('handle-auth', (method, path, data, errorMessage, handleSuccess = () => { }) => {
            this.handleAuth(method, path, data, errorMessage, handleSuccess)
        })
    }
})

//Login Instance
const loginInstance = new Vue({
    el: '#login-form',
    vuetify: new Vuetify(),
    template: `
        <v-form v-if="isShow" class="sign-in__wrapper" ref="form" v-model="valid" lazy-validation>
            <div class="sign-in__title">Sign In</div>
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
            <v-text-field v-model="password" :rules="passwordRules" label="Password"
                type="password"></v-text-field>
            <v-btn :disabled="isButtonDisable" color="primary" class="submit__button mr-4"
                @click="handleSignIn">
                Submit
            </v-btn>
            <p>Don't have an account?<span class="hight__light" @click="handleOpenSignUp()"> Sign up
                    here </span> </p>
            <p class="hight__light">Forgot your password? </p>
        </v-form>
    `,
    data: {
        valid: false,
        isShow: false,
        email: '',
        password: '',
        emailRules: validation.email,
        passwordRules: validation.password,
    },
    computed: {
        isButtonDisable() {
            if (!this.password || !this.email) return true;
            return !this.valid;
        }
    },
    methods: {
        //UI methods
        validate() {
            this.$refs.form.validate();
        },
        //Auth methods
        handleInitUser(result) {
            const { user } = result?.data;
            this.$store.dispatch('handleLogin', user);
        },
        handleSignIn() {
            this.validate();
            if (!this.valid) return;
            const data = { email: this.email, password: this.password }
            eventBus.$emit('handle-auth', 'POST', '/login', data, 'Sign In fail!', this.handleInitUser);
        },
        handleOpenSignUp() {
            this.isShow = false;
            eventBus.$emit('toggle-sign-up', true);
        },
    },
    //life cycle
    created() {
        this.$store = store;
        eventBus.$on('toggle-sign-in', (status) => {
            this.isShow = status;
        });
    }
})

//Sign Up Instance
const signUpInstance = new Vue({
    el: '#signup-form',
    vuetify: new Vuetify(),
    template: `
    <v-form v-if="isShow" class="sign-in__wrapper" ref="form" v-model="valid" lazy-validation>
        <div class="sign-in__title">Sign Up</div>
        <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
        <v-text-field v-model="password" :rules="passwordRules" label="Password"
            type="password"></v-text-field>
        <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules"
            label="Confirm Password" type="password"></v-text-field>
        <v-btn :disabled="isButtonDisable" color="primary" class="submit__button mr-4"
            @click="handleSignUp">
            Submit
        </v-btn>
        <p @click="handleOpenSignUp()">Already have an account?<span class="hight__light"
                @click="handleOpenSignIn()"> Sign in here </span> </p>
    </v-form>
    `,
    data: {
        isShow: false,
        valid: false,
        email: '',
        password: '',
        confirmPassword: '',
        emailRules: validation.email,
        passwordRules: validation.password,
    },
    computed: {
        isButtonDisable() {
            if (!this.password || !this.email || !this.confirmPassword) return true;
            return !this.valid;
        },
        confirmPasswordRules() {
            return validation.confirmPassword(this.password)
        },
    },
    methods: {
        //UI methods
        validate() {
            this.$refs.form.validate();
        },
        //Auth methods

        handleSignUp() {
            this.validate();
            if (!this.valid) return;
            const data = { email: this.email, password: this.password }
            eventBus.$emit('handle-auth', 'POST', '/register', data, 'Sign Up fail!');
        },
        handleOpenSignIn() {
            this.isShow = false
            eventBus.$emit('toggle-sign-in', true)
        },
    },
    //life cycle
    created() {
        eventBus.$on('toggle-sign-up', (status) => {
            this.isShow = status;
        });
    }
})