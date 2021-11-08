<template>
    <div class="editor-tool">
        <div class="tool-left">
            <div class="left-item">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        文件<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item divided>导入</el-dropdown-item>
                            <el-dropdown-item divided>导出</el-dropdown-item>
                            <el-dropdown-item divided>另存为</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="left-item">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        工具<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item divided>导入</el-dropdown-item>
                            <el-dropdown-item divided>导出</el-dropdown-item>
                            <el-dropdown-item divided>另存为</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="left-item">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        光照<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item divided>导入</el-dropdown-item>
                            <el-dropdown-item divided>导出</el-dropdown-item>
                            <el-dropdown-item divided>另存为</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="left-item">
                <el-dropdown>
                    <span class="el-dropdown-link">
                        帮助<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item divided>导入</el-dropdown-item>
                            <el-dropdown-item divided>导出</el-dropdown-item>
                            <el-dropdown-item divided>另存为</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="tool-middle">
            <!-- 三维可视化编辑器 -->
            场景测试
        </div>
        <div class="tool-right"></div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'EditorTool',
    components: {},
    data() {
        return {

        };
    },
});
</script>
<style lang='scss' scoped>
// 工具区
.editor-tool {
    display: flex;
    align-items: center;
    height: 70px;
    font-size: 40px;
    color: white;
    background: #303131;
    border-bottom: 1px solid rgba(151,151,151,0.21);

    .tool-left{
        display: flex;
        width: 30%;

        .left-item {
            display: flex;
            padding: 0 12px;
            cursor: pointer;
            align-items: center;
        }
    }

    .tool-middle{
        width: 50%;
        text-align: center;
    }

    .tool-right{
        width: 20%;
    }

}
</style>
