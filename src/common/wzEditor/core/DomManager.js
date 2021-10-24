/**
* @Description: 编辑器绑定dom管理器
* @Author: wanggang
* @Date: 2021-10-24 20:36:25
* */
export default class DomManager {
    constructor(parent) {
        this.app = parent;
        this.node = null; // dom节点
        this.size = { // 节点大小
            width: 0,
            height: 0,
        };
        this.init();
    }

    init() {
        this.node = document.getElementById('wz-editor');
        this.size = {
            width: this.node.clientWidth,
            height: this.node.clientHeight,
        };
    }
}
