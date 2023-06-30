// Api URL
const API_URL = 'https://api-ecom.duthanhduoc.com'
//Axios common
const axiosCaller = async (method, url, data, handleSuccess, handleError) => {
    try {
        const response = await axios({
            method: method,
            url: API_URL + url,
            data: data
        });
        handleSuccess(response.data);
    } catch (error) {
        handleError(error);
        throw error;
    }
};
//validation rules
const validation = {
    email: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters',
    ],
    confirmPassword: (password) => [
        v => !!v || 'Confirm Password is required',
        v => v === password || 'Password does not match',
    ]
}

// EventBus
const eventBus = new Vue();

// Gen Vue instance
const appIntance = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    template: `
    <v-app>
        <div v-if="isLoading" class="loading-container">
            <div class="loading"></div>
        </div>
        <div class="nav-bar">
            <button class="sign-in" @click="handleOpenSignIn()">Sign in</button>
        </div>
        <div class="app__wrapper">
            <div class="title">Welcome to the VUE Page</div>
            <button>Browse the content</button>
        </div>
        <!-- Overlay -->
        <div class="overlay__wrapper" v-show="overlayStatus">
            <v-overlay contained class="align-center justify-center">
                <v-alert v-if="showAlert.message" border="top" :color="showAlert.type + ' lighten-2'" dark>
                    {{showAlert.message}}
                </v-alert>
                <!-- Sign In Form  -->
                <div id="login-form"></div>
                <!-- Sign Up Form  -->
                <div id="signup-form"></div>
            </v-overlay>
        </div>
    </v-app>
    `,
    data: {
        overlay: false,
        isLoading: false,
        alert: {
            message: '',
            type: 'red'
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
            eventBus.$emit('show-sign-in')
        },
        //Auth methods
        handleAuth(method, path, data, errorMessage) {
            this.isLoading = true;
            axiosCaller(method, path, data, (result) => { this.handleShowAlert(result?.message, 'green'); this.isLoading = false }, () => { this.handleShowAlert(errorMessage, 'red'); this.isLoading = false });
        },
    },
    //life cycle
    created() {
        eventBus.$on('toggle-overlay', (status) => {
            this.handleToggleOverlay(status);
        });
        eventBus.$on('handle-auth', (method, path, data, errorMessage) => {
            this.handleAuth(method, path, data, errorMessage)
        })
    }
})

//Login Instance
const loginIntance = new Vue({
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
        handleSignIn() {
            this.validate();
            if (!this.valid) return;
            const data = { email: this.email, password: this.password }
            eventBus.$emit('handle-auth', 'POST', '/login', data, 'Sign In fail!');
        },
        handleOpenSignUp() {
            this.isShow = false;
            eventBus.$emit('show-sign-up');
        },
    },
    //life cycle
    created() {
        eventBus.$on('show-sign-in', () => {
            this.isShow = true;
        });
    }
})

//Sign Up Instance
const signUpIntance = new Vue({
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
            eventBus.$emit('show-sign-in')
        },
    },
    //life cycle
    created() {
        eventBus.$on('show-sign-up', () => {
            this.isShow = true;
        });
    }
})