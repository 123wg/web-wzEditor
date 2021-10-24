/**
* @Description: 编辑器管理器
* @Author: wg
* @Date: 2021-10-15 15:26:43
* */
import WzThing from './WzClassRegister';

export default class WzEditor {
    constructor() {
        this.menu = new WzThing.Menu();// 菜单
        this.core = new WzThing.Core();// 核心区
        this.material = new WzThing.Material();// 物料区
    }
}
