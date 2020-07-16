import Vue from 'vue'
import Vuex from 'vuex'

if (document.querySelectorAll(`head link[rel='manifest']`).length === 0) {
    let manifestLink = document.createElement('link');
    manifestLink.setAttribute('rel', 'manifest');
    manifestLink.setAttribute('href', './manifest.json');
    document.querySelector('head').appendChild(manifestLink);
}

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        url: localStorage.getItem('url') === null ? 'http://localhost:5000' : localStorage.url,
    },
    mutations: {
        url(state, newUrl) {
            state.url = newUrl;
            localStorage.url = newUrl;
        }
    },
    actions: {},
    modules: {}
})
