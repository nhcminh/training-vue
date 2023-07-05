// Khởi tạo Vuex Store
export const store = new Vuex.Store({
    state: {
        userInfo: {}
    },
    mutations: {
        login(userInfo) {
            this.state.userInfo = userInfo;
        }
    },
    actions: {
        handleLogin(context, userInfo) {
            context.commit('login', userInfo);
        }
    }
});