import auth from './modules/auth.js'
const store = Vuex.createStore({
    modules: {
        auth
    }
})

export default store