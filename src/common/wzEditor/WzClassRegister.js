/**
* @Description: 类注册中心
* @Author: wanggang
* @Date: 2021-10-24 19:52:20
* */
import Core from '@/common/WzEditor/core';
import Menu from '@/common/WzEditor/menu';
import Material from '@/common/WzEditor/material';
import SceneManager from './core/SceneManager';
import CameraManager from './core/CameraManager';
import RenderManager from './core/RenderManager';
import LightManager from './core/LightManager';
import LevelManager from './core/LevelManager';
import BcManager from './core/BcManager';
import EventManager from './core/EventManager';
import DomManager from './core/DomManager';

const WzThing = {
    Menu, // 菜单区
    Core, // 核心区
    Material, // 物料区

    SceneManager, // 场景管理器
    CameraManager, // 相机管理器
    RenderManager, // 渲染管理器
    LightManager, // 灯光管理器
    LevelManager, // 层级管理器
    BcManager, // 背景管理器
    EventManager, // 事件管理器
    DomManager, // dom元素管理器

};
export default WzThing;
