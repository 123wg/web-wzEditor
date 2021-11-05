/**
* @Description: 编辑器管理器
* @Author: wg
* @Date: 2021-10-15 15:26:43
* */
import SceneManager from './scene/SceneManager';
import LevelManager from './scene/LevelManager';
import EventManager from './scene/EventManager';
import CommandManager from './scene/CommandManager';
import MaterialManager from './scene/MaterialManager';
import AttrManager from './scene/AttrManager';

export default class WzEditor {
    constructor() {
        this.scene_manager = new SceneManager(this);
        this.level_manager = new LevelManager(this);
        this.event_manager = new EventManager(this);
        this.command_manager = new CommandManager(this);
        this.material_manager = new MaterialManager(this);
        this.attr_manager = new AttrManager(this);
    }

    // 编辑器初始化
    init() {
        this.scene_manager._init({
            container: 'editor-main',
            skyUrl: '/static/img/skybox/Night/',
        });
    }
}
