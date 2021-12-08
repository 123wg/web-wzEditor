/* eslint-disable */

import * as THREE from 'three'
// 生成唯一标识的方法
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0; const
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 点类
class Point {
    constructor(x, y) {
        this.id = uuid();
        this.x = x;
        this.y = y;
        this.vector = new THREE.Vector2(x, y); // 向量
        this.adj = []; // 邻接表
    }

    // 两点之间的距离
    distance_to(point) {
        return this.vector.distanceTo(point.vector);
    }
}

// 线条类
class Line {
    constructor(point1, point2) {
        this.start = point1;
        this.end = point2;
        this.s_vector = point1.vector;
        this.end_vector = point2.vector;
        // 原始线段中间的分割点
        this.middle = [];
    }

    // 获取当前线条和另外一条线条的交点
    intersection(line) {
        const from1 = this.start;
        const to1 = this.end;
        const from2 = line.start;
        const to2 = line.end;
        const dX = to1.x - from1.x;
        const dY = to1.y - from1.y;

        const determinant = dX * (to2.y - from2.y) - (to2.x - from2.x) * dY;
        if (determinant === 0) return undefined; // parallel lines

        const lambda = ((to2.y - from2.y) * (to2.x - from1.x) + (from2.x - to2.x) * (to2.y - from1.y)) / determinant;
        const gamma = ((from1.y - to1.y) * (to2.x - from1.x) + dX * (to2.y - from1.y)) / determinant;

        // check if there is an intersection
        if (!(lambda > 0 && lambda < 1) || !(gamma > 0 && gamma < 1)) return undefined;
        const point = new Point(from1.x + lambda * dX, from1.y + lambda * dY);
        return point;
    }
    // 根据middle 排序
    // 根据middle重新拆分线段
}

/**
*图 顶点和线段的管理类 封装了入参以后对于顶点和线段的基本操作
*/
export default class Graph {
    constructor(point_arr) {
        this._point_arr = point_arr; // 原始参数点

        this._points = []; // 所有的顶点
        this._lines = []; // 所有的线段
        this._adj = {}; // 根据顶点中的邻接表 生成图中的邻接表 需要考虑是否在每个顶点中存储邻接表

        // 所有的线段
        this.use_lines = [];
        // 查找封闭区域使用的顶点id
        this._point_index = [];
        // 所有的封闭区域
        this.closed_area = [];

        this.init(point_arr);
    }

    init() {
        // 初始化顶点列表
        this._init_points();
        // 初始化线段列表
        this._init_lines();
        // 线段求交
        this._line_intersec();
        // 线段拆分
        this._line_split();
        // 顶点去重 为什么放在这里顶点去重 怕影响构造边时候数据准确性
        this._point_remove();
        // console.log(this._points);
        // 获取顶点的邻接表 --这里不想用顶点索引了，全部换为标识吧
        this._init_edges();
        // 顶点排序处理 规则为左下角的在前面
        this._point_sort();
        // 查找封闭区
        this._find_closed();
        // 输出数据格式化
        this._data_format();
    }

    // 初始化顶点
    _init_points() {
        this._point_arr.forEach((item) => {
            const point = new Point(item.x, item.y);
            // 先找有没有相同的 有的话 放入之前有的
            const pre = this._points.find(item = (item) => item.vector.equals(point.vector));
            if (pre) this._points.push(pre);
            else this._points.push(point);
        });
    }

    // 初始化线段
    _init_lines() {
        for (let i = 0; i < this._points.length - 1; i += 1) {
            const line = new Line(this._points[i], this._points[i + 1]);
            this._lines.push(line);
        }
    }

    // 线段交点处理
    _line_intersec() {
        const line_arr = this._lines;
        for (let i = 0; i < line_arr.length - 1; i += 1) {
            const f = line_arr[i];
            for (let j = i + 1; j < line_arr.length; j += 1) {
                const t = line_arr[j];
                const join = f.intersection(t);
                if (join) {
                    f.middle.push({
                        data: join,
                        dis: f.start.distance_to(join),
                    });
                    t.middle.push({
                        data: join,
                        dis: t.start.distance_to(join),
                    });
                    // FIXME 考虑这里需不需要判重处理
                    this._points.push(join); // 分割出来的顶点
                }
            }
        }
    }

    // 线段重组
    _compare(key) {
        return (value1, value2) => {
            const val1 = value1[key];
            const val2 = value2[key];
            return val1 - val2;
        };
    }

    _line_split() {
        const new_line_arr = [];
        this._lines.forEach((line) => {
            // 处理完需要分割的点后 删除原始线段  重新放入新的线段
            let { middle } = line;
            if (middle.length > 0) {
                middle.sort(this._compare('dis')); // 对距离排序
                middle = middle.map((item) => item.data);
                middle.unshift(line.start);
                middle.push(line.end);
                for (let i = 0; i < middle.length - 1; i += 1) {
                    const tmp_line = new Line(middle[i], middle[i + 1]);
                    new_line_arr.push(tmp_line);
                }
            } else {
                new_line_arr.push(line);
            }
        });
        this._lines = new_line_arr;
    }

    _point_remove() {
        this._points = this._points.reduce((p_arr, item) => {
            if (!p_arr.find((items) => items.vector.equals(item.vector))) {
                p_arr.push(item);
                return p_arr;
            }
            return p_arr;
        }, []);
    }

    // 生成邻接表 点和线的关系
    _init_edges() {
        for (let i = 0; i < this._points.length; i += 1) {
            const { id } = this._points[i];
            this._adj[id] = [];
            for (let j = 0; j < this._lines.length; j += 1) {
                const obj = this._lines[j];
                const { start, end } = obj;
                if (start.id === id) this._adj[id].push(end.id);
                if (end.id === id) this._adj[id].push(start.id);
            }
        }
    }

    // 顶点属性排序
    _compare_point(key1, key2) {
        return function (obj1, obj2) {
            const val1 = obj1[key1];
            const val2 = obj2[key1];
            const val3 = obj1[key2];
            const val4 = obj2[key2];
            if (val1 !== val2) {
                return val1 - val2;
            }
            return val3 - val4;
        };
    }

    // 顶点排序
    _point_sort() {
        this._point_index = Object.assign([], this._points);
        this._point_index.sort(this._compare_point('y', 'x'));
        this._point_index = this._point_index.map((item) => item.id);
        this._point_index.reverse();
    }

    // 根据id查找顶点
    _find_point_by_id(id) {
        const point = this._points.find((item) => item.id === id);
        return point;
    }

    // 查找封闭区
    _find_closed() {
        const arr = this._point_index;
        for (let i = arr.length - 1; i > 0; i -= 1) {
            // 正旋转 找边
            const s_id = arr[i];
            const s_adj = this._adj[s_id]; // 邻接表
            if (s_adj.length === 1) continue; // 邻接表长度为1 直接退出

            // 封闭区域记录 记录点的索引还是 坐标位置 暂时先用索引 返回的时候 全部转化为对应的坐标
            const tmp_closed_arr = [s_id]; // 每轮结束的时候收集一次

            // 找出正旋转角度最小的一个
            const vers = [];
            s_adj.forEach((id) => {
                const start = this._find_point_by_id(s_id).vector;
                const end = this._find_point_by_id(id).vector;
                const tmp_ver = end.clone().sub(start.clone());
                const angle = tmp_ver.angle();
                vers.push({
                    id,
                    angle,
                });
            });

            vers.sort(this._compare('angle'));

            // 逆旋转 找吓一条边
            const next = vers[0] ? vers[0].id : undefined;
            if (!next) continue;

            const find_next_fun = (next) => {
                tmp_closed_arr.push(next);
                const next_adj = this._adj[next];
                // 找下一条边
                const next_ver = [];
                // debugger
                next_adj.forEach((id) => {
                    const start = this._find_point_by_id(next).vector;
                    const end = this._find_point_by_id(id).vector;
                    const tmp_next_ver = end.clone().sub(start.clone()).normalize();

                    // 基准向量
                    const base_start = this._find_point_by_id(tmp_closed_arr[tmp_closed_arr.length - 2]).vector;
                    const base_end = this._find_point_by_id(next).vector;
                    const top_ver = base_start.clone().sub(base_end.clone()).normalize();

                    let cos_angle = top_ver.clone().dot(tmp_next_ver.clone());
                    if (cos_angle > 1) cos_angle = 1;
                    if (cos_angle < -1) cos_angle = -1;

                    const clock_wise = top_ver.clone().cross(tmp_next_ver.clone());
                    // console.log(clock_wise);

                    const angle = clock_wise >= 0 ? 2 * Math.PI - Math.acos(cos_angle) : Math.acos(cos_angle);
                    next_ver.push({
                        id,
                        angle,
                    });
                });

                next_ver.sort(this._compare('angle'));

                const next_2 = next_ver[0].id;

                // 结束条件 1.找环过程中出现重复的点 且不是起点 删除邻边，退出
                // 结束条件 2.发现下一个点和起点相同 并且顶点数大于等于3
                // 结束条件 3.终点和起点相同，但是长度小于2 --这种情况可以预先处理，先删除邻接表长度为1的点和边
                if(tmp_closed_arr.includes(next_2) && next_2!==s_id) {
                    // 处理完成后 删除无用的线段
                    Object.keys(this._adj).forEach((key) => {
                        this._adj[key] = this._adj[key].filter((item) => item !== s_id);
                    });
                }else if (next_2 === tmp_closed_arr[0] && tmp_closed_arr.length >= 3) {
                    this.closed_area.push(tmp_closed_arr);
                    // 处理完成后 删除无用的线段
                    Object.keys(this._adj).forEach((key) => {
                        this._adj[key] = this._adj[key].filter((item) => item !== s_id);
                    });
                    return
                } else if (next_2 === tmp_closed_arr[0] && tmp_closed_arr.length < 3) {
                    return
                } else find_next_fun(next_2);
            };

            find_next_fun(next);
        }
    }

    // 输出数据格式化
    _data_format() {
        for (let i = 0; i < this.closed_area.length; i += 1) {
            const arr = this.closed_area[i];
            this.closed_area[i] = arr.map((items) => this._find_point_by_id(items).vector);
        }
        this._lines = this._lines.map((item) => ({
            start: item.start.vector,
            end: item.end.vector,
        }));
    }
}
