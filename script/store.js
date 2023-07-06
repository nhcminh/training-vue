// Khởi tạo Vuex Store
export const store = new Vuex.Store({
    state: {
        userInfo: {}
    },
    mutations: {
        login(state, userInfo) {
            state.userInfo = userInfo;
        }
    },
    actions: {
        handleLogin(context, userInfo) {
            context.commit('login', userInfo);
        }
    },
    getters: {
        userInfo(state) {
            return state.userInfo;
        }
    }
});