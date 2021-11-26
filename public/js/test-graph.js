const points = [
    {
        x: -44.27454147194787,
        y: -100.46582449580728
    },
    {
        x: 236.2994446382105,
        y: -113.31227053162883
    },
    {
        x: -61.74227343764703,
        y: 93.12712778675007
    },
    {
        x: 187.1817027365604,
        y: 104.4394281548374
    },
    {
        x: 106.8160592500908,
        y: -607.8096163063344
    },
    {
        x: 24.53279104590547,
        y: 161.2772840463685
    },
    {
        x: -44.27454147194787,
        y: -100.46582449580728
    }
]

const lines = []
for(let i = 0;i<points.length-1;i+=1) {
    const start = points[i]
    const end = points[i+1]
    lines.push({
        start,
        end,
        middle:[]
    })
}


// 求两个线段交点的方法
function intersection(from1, to1, from2, to2) {
    const dX = to1.x - from1.x;
    const dY = to1.y - from1.y;

    const determinant = dX * (to2.y - from2.y) - (to2.x - from2.x) * dY;
    if (determinant === 0) return undefined; // parallel lines

    const lambda= ((to2.y - from2.y) * (to2.x - from1.x) + (from2.x - to2.x) * (to2.y - from1.y)) / determinant;
    const gamma = ((from1.y - to1.y) * (to2.x - from1.x) + dX * (to2.y - from1.y)) / determinant;

    // check if there is an intersection
    if (!(0 < lambda && lambda < 1) || !(0 < gamma && gamma < 1)) return undefined;

    return {
      x: from1.x + lambda * dX,
      y: from1.y + lambda * dY,
    };
  }

function line_split(lines) {
    // 获取线段交点 线段分割
    for(let i = 0;i<lines.length-1;i+=1){
        const first = lines[i]
        // 获取第一个线段
        for(let j = i+1;j<lines.length;j+=1) {
            const two = lines[j]
            const intersec = intersection(first.start,first.end,two.start,two.end)
            if(intersec) {
                // TODO 往中间数组塞值，这里需要增加判断，去重判断
                first.middle.push(intersec)
                two.middle.push(intersec)
                points.push(intersec)
            }
        }
    }
}

line_split(lines)

function compare(key){
    return function(value1,value2){
        var val1=value1[key];
        var val2=value2[key];
        return val1-val2;
    }
}

const new_lines = []
// 循环处理线上的分割点
lines.forEach(line=>{
    const start = line.start
    let middle = line.middle
    const end = line.end
    // 对middle数组按照距离排序
    const new_middle = []
    middle = middle.map(item=>{
        const dis =Math.sqrt(Math.pow((item.x - start.x),2)+Math.pow((item.y-start.y),2))
        return {
            dis,
            data:item
        }
    })
    middle.sort(compare('dis'));
    middle = middle.map(item=>item.data)
    middle.unshift(start)
    middle.push(end)
    for(let i = 0;i<middle.length-1;i+=1) {
        const line = {
            start:middle[i],
            end:middle[i+1]
        }
        new_lines.push(line)
    }
})

console.log('划分出来的线段');
console.log(new_lines);
console.log(new_lines.length);
console.log('顶点');
console.log(points);
console.log(points.length);
