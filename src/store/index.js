import { createStore } from 'vuex'

const allModules = import.meta.globEager('./modules/*.js')
const modules = {}
for (const path in allModules) {
    modules[path.replace(/\.\/\modules\/|\.js/g, '')] = allModules[path].default
}

export default createStore({
  modules,
})