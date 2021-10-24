/**
* @Description: 画布核心区
* @Author: wanggang
* @Date: 2021-10-24 19:50:46
* */
import SceneManager from './SceneManager';
import CameraManager from './CameraManager';
import RenderManager from './RenderManager';
import LightManager from './LightManager';
import LevelManager from './LevelManager';
import BcManager from './BcManager';
import EventManager from './EventManager';
import DomManager from './DomManager';

class Core {
    constructor(editor) {
        this.editor = editor;
        this.dom = new DomManager(this);// dom元素管理器
        this.scene = new SceneManager(this);// 场景
        this.camera = new CameraManager(this);// 相机
        this.render = new RenderManager(this);// 渲染器
        this.light = new LightManager(this);// 光照
        this.bc = new BcManager(this);// 背景
        this.level = new LevelManager(this);// 层级
        this.event = new EventManager(this);// 事件
    }
}
export default Core;
