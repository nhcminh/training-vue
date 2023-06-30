import { authApi } from "../../apis/auth.api.js";

const state = () => ({
    userLogin: {},
    userRegister: {},
    loading: false
})

const mutations = {
    setUserLoginMutation (state, payload) {
        state.userLogin = payload
        localStorage.setItem('userLogin', JSON.stringify(payload.data.user))
    },
    setUserRegisterMutation (state, payload) {
        state.userRegister = payload
    },
    setLoading (state, payload) {
        state.loading = payload
    }
}

const actions = {
    signInAction: async ({ commit }, bodyRequest) => {
        commit('setLoading', true)
        try {
            const response = await authApi.login(bodyRequest)
            commit('setUserLoginMutation', response.data)
            commit('setLoading', false)
            alert(response.data.message)
        } catch (err) {
            alert(err.data.email || err.data.password)
            commit('setLoading', false)
        }
    },
    signUpAction: async ({ commit }, bodyRequest) => {
        commit('setLoading', true)
        try {
            const response = await authApi.registerAccount(bodyRequest)
            commit('setUserRegisterMutation', response.data)
            commit('setLoading', false)
            alert(response.data.message)
        } catch (err) {
            alert(err.data.email)
            commit('setLoading', false)
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
