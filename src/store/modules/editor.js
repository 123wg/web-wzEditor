/**
* @Description: 编辑器状态管理
* @Author: wg
* @Date: 2021-10-15 13:19:58
* */

const editor = {
    state: {
        show_editor_plugin: false,
    },
    mutations: {
        set_show_editor_plugin(state, value) {
            state.show_editor_plugin = value;
        },
    },
    actions: {},
};
export default editor;
