/**
* @Description: 画布核心区
* @Author: wanggang
* @Date: 2021-10-24 19:50:46
* */
import WzThing from '../WzClassRegister';

class Core {
    constructor(editor) {
        this.editor = editor;
        this.dom = new WzThing.DomManager(this);// dom元素管理器
        this.scene = new WzThing.SceneManager(this);// 场景
        this.camera = new WzThing.CameraManager(this);// 相机
        this.render = new WzThing.RenderManager(this);// 渲染器
        this.light = new WzThing.LightManager(this);// 光照
        this.bc = new WzThing.BcManager(this);// 背景
        this.level = new WzThing.LevelManager(this);// 层级
        this.event = new WzThing.EventManager(this);// 事件
    }
}
export default Core;
