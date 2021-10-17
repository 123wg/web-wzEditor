<template>
    <div class="editor-material">
        <!-- 左侧一级菜单 -->
        <div class="material-first-level material-item">
            <div class="first-item" v-for="item in 18" :key="item">
                交互
            </div>
        </div>
        <!-- 右侧二级分类 -->
        <div class="material-two-level material-item">
            <div class="two-group">
                <!-- <div class="group-title"></div> -->
                <el-collapse accordion v-model="curActive">
                    <el-collapse-item name="1">
                        <template #title>
                            交互
                        </template>
                        <div class="group-item-list">
                            <div class="item" v-for="item in 6" :key="item" draggable="true" @dragstart="dragStart">
                                模型{{item}}
                            </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                        <template #title>
                            建筑
                        </template>
                        <div class="group-item-list">
                            <div class="item" v-for="item in 6" :key="item" draggable="true" @dragstart="dragStart">
                                模型{{item}}
                            </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item name="3">
                        <template #title>
                            风机
                        </template>
                        <div class="group-item-list">
                            <div class="item" v-for="item in 6" :key="item" draggable="true" @dragstart="dragStart">
                                模型{{item}}
                            </div>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item name="4">
                        <template #title>
                            水池
                        </template>
                        <div class="group-item-list">
                            <div class="item" v-for="item in 6" :key="item" draggable="true" @dragstart="dragStart">
                                模型{{item}}
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            curActive: '1',
        };
    },
    methods: {
        dragStart(evt) {
            const obj = {
                aa: 11,
            };
            evt.dataTransfer.setData('11', JSON.stringify(obj));
            console.log(JSON.parse(evt.dataTransfer.getData('11')));
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
                }
            }
        }
    }
}
</style>
