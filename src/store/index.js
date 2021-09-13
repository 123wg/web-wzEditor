import { createStore } from 'vuex';

const allModules = import.meta.globEager('./modules/*.js');
const modules = {};
Object.keys(allModules).forEach((path) => {
    modules[path.replace(/\.\/modules\/|\.js/g, '')] = allModules[path].default;
});

export default createStore({
    modules,
});
