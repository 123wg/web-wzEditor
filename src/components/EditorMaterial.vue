<template>
    <div class="editor-material">
        <!-- 左侧一级菜单 -->
        <div class="material-first-level material-item">
            <div class="first-item" v-for="(item,index) in material_list" :key="index">
                {{item.label}}
            </div>
        </div>
        <!-- 右侧二级分类 -->
        <div class="material-two-level material-item">
            <div class="two-group">
                <el-collapse accordion v-model="curActive">
                    <el-collapse-item v-for="(item,index) in material_list[0].children" :name="index" :key="index">
                        <template #title>
                            {{item.group}}
                        </template>
                        <div class="group-item-list">
                            <div class="item" v-for="(items,indexs) in item.children" :key="indexs" @click="create_model(items)">
                                <img :src="items.img_url">
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<script>
// FIXME 暂时注释，不适用这种方式
// import bus from '@/common/EventBus';

export default {
    components: {},
    data() {
        return {
            curActive: 0,
            material_list: [
                {
                    label: '室外',
                    children: [
                        {
                            group: '绘制围栏',
                            children: [
                                {
                                    img_url: '/static/img/matilda.png',
                                    model_url: '/static/model/matilda/scene.gltf',
                                    name: '小大姐',
                                    mode: 'drag_drop', // 执行的方法 --枚举类管理 圈地(drag_drop) 点击摆放(click_display) 绘制围墙(draw_fence)
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        create_model(obj) {
            console.log('开始创建模型');
            wzEditor.create_model(obj);
            // console.log('开始创建模型');
            // console.log(bus);
            // bus.$emit('create_model', obj);
            // evt.dataTransfer.setData('model_info', JSON.stringify(obj));
            // console.log(JSON.parse(evt.dataTransfer.getData('model_info')));
        },
    },
};
</script>
<style lang="scss">
.editor-material {
    .el-collapse{
        --el-collapse-header-background-color: #303131;
        --el-collapse-content-background-color: #303131;
        --el-collapse-header-font-color: white;
        --el-collapse-content-font-color: white;
        --el-collapse-border-color: rgba(151,151,151,0.21);

        border-top: 1px solid rgba(151,151,151,0.21);
        border-bottom: 1px solid rgba(151,151,151,0.21);
    }
}
</style>
<style lang='scss' scoped>
// 物料区
.editor-material{
    display: flex;
    width: 370px;
    justify-content: space-between;
    padding: 5px;
    color: white;
    background: #303131;

    .material-first-level{
        width: 50px;

        .first-item{
            height: 50px;
            margin-bottom: 2px;
            line-height: 50px;
            text-align: center;
            border: 1px solid rgba(151,151,151,0.21);
        }
    }

    .material-two-level {
        width: calc(100% - 62px);

        .two-group{

            .group-item-list{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .item{
                    width: 90px;
                    height: 90px;
                    margin-top: 5px;
                    line-height: 90px;
                    text-align: center;
                    cursor: move;
                    border: 1px solid rgba(151,151,151,0.21);

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
}
</style>
