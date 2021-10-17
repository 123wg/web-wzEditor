/**
* @Description: 编辑器管理器
* @Author: wg
* @Date: 2021-10-15 15:26:43
* */

import WzScene from './scene/WzScene';

export default class WzEditor {
    constructor() {
        this.scene = null;
        this.init_scene();// 场景初始化
        // TODO 工具初始化
        // TODO 物料初始化
    }

    // 加载中间画布
    init_scene() {
        this.scene = new WzScene();
    }
}
