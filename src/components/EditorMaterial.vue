<template>
    <div class="editor-material">
        <!-- 左侧一级菜单 -->
        <div class="material-first-level material-item">
            <div class="first-item" v-for="item in 18" :key="item">
                11
            </div>
        </div>
        <!-- 右侧二级分类 -->
        <div class="material-two-level material-item">
            <div class="two-group">
                <div class="group-title">第一个分组</div>
                <div class="group-item-list">
                    <div class="item" v-for="item in 18" :key="item">
                        模型{{item}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {

        };
    },
};
</script>
<style lang='scss' scoped>
// 物料区
.editor-material{
    display: flex;
    width: 300px;
    padding: 5px;
    color: white;
    background: #303131;

    .material-first-level{
        width: 50px;

        .first-item{
            height: 50px;
            line-height: 50px;
            text-align: center;
            border: 1px solid red;
        }
    }

    .material-two-level {
        width: calc(100% - 50px);

        .two-group{
            .group-title{
                height: 50px;
                line-height: 50px;
                text-align: center;
            }

            .group-item-list{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                .item{
                    width: 70px;
                    height: 60px;
                    margin-top: 5px;
                    line-height: 60px;
                    text-align: center;
                    border: 1px solid rgba(151,151,151,0.21);
                }
            }
        }
    }
}
</style>
