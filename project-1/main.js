import ValidationMessage from './constants/validationMessage.js'
import store from './store/index.js'
const { mapActions, mapState } = Vuex.createNamespacedHelpers('auth')
const { createVuetify } = Vuetify
const components = Vuetify.components
const directives = Vuetify.directives

const vuetify = createVuetify({
    components,
    directives
})

Vue.createApp({
    data(){
        return {
            isOpenModal: false,
            userLogin: {
                email: '',
                password: ''
            },
            userRegister: {
                email: '',
                password: '',
                confirmPassword: ''
            },
            tabs: ['SignIn', 'SignUp'],
            type: 'SignIn',
            rules: {
                email: [
                    (value) => !!value || ValidationMessage.EMAIL_REQUIRED,
                    function (value) {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return pattern.test(value) || ValidationMessage.EMAIL_INVALID
                    }
                ],
                password: [
                    (value) => !!value || ValidationMessage.PASSWORD_REQUIRED,
                    (value) => (value && value.length >= 6) || ValidationMessage.MIN_PASSWORD_LENGTH,
                ],
                confirmPassword: [
                    (value) => !!value || ValidationMessage.CONFIRM_PASSWORD_REQUIRED,
                    (value) => (value && value.length >= 6) || ValidationMessage.MIN_PASSWORD_LENGTH,
                    (value) => value === this.userRegister.password || ValidationMessage.INVALID_CONFIRM_PASSWORD
                ]
            }
        }
    },
    computed: {
        ...mapState({
            loading: state => state.loading
        })
    },
    methods: {
        ...mapActions({
            signIn: 'signInAction',
            signUp: 'signUpAction'
        }),
        handleShowModal() {
            this.isOpenModal = true
        },
        handleSubmitLogin(){
            this.signIn(this.userLogin)
        },
        handleSubmitRegister(){
            const requestBody = {
                email: this.userRegister.email,
                password: this.userRegister.password,
            }
            this.signUp(requestBody)
        },
        setType(type){
            this.type = type
        },
        handleCloseModal(){
            this.isOpenModal = false
            this.resetData()
        },
        checkPassword: function(invalid) {
             return invalid === true ? false : true
        },
        resetData() {
            this.userLogin = {
                email: '',
                password: ''
            }
            this.userRegister = {
                email: '',
                password: '',
                confirmPassword: ''
            }
            this.type = 'SignIn'
        }
    }
}).use(store).use(vuetify).mount('#app')
