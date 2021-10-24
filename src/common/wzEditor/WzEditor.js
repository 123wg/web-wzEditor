/**
* @Description: 编辑器管理器
* @Author: wg
* @Date: 2021-10-15 15:26:43
* */
import Core from '@/common/WzEditor/core';
import Menu from '@/common/WzEditor/menu';
import Material from '@/common/WzEditor/material';

export default class WzEditor {
    constructor() {
        this.menu = new Menu(this);// 菜单
        this.core = new Core(this);// 核心区
        this.material = new Material(this);// 物料区
    }
}
