## 学习过程中遇到的所有问题记录

### 计划实现的东西
1.物体拖拽
2.物体旋转
3.线条 实线、虚线
4.矩形
5.圆
6.椭圆
7.模板测试
8.B站视频
9.线性代数 基础直线曲线方程


1.拖拽箭头相关
- projectOnVector 使用方法
- 屏幕坐标转世界坐标
- Plane 
    - setFromNormalAndCoplanarPoint(normal,point) 通过法向和面上的点 设置平面
- Ray 
    - intersectPlane(plane,target) 射线与plane 相交 返回交点到target
- Camera
    - getWorldDirection(vec3) 获取摄像机的朝向 复制给vec3对象
- Vector3 
    - setFromMatrixPosition(matrix4) 从矩阵中获取坐标 赋值给vec3
    - copy(vec) 将vec复制给调用者
- Object 
    - .matrixWorld ->mat4 世界坐标 position为本地坐标加父position
- Matrix4
    - getInverse(m) 将矩阵设置为m的逆矩阵

2.逆矩阵的几何意义
