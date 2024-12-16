window.onload = function () {
    let state = 0;
    // 获取音频
    let audioMean = document.getElementById("audioMean");
    let audioStart = document.getElementById("audioStart");
    let audioDefeat = document.getElementById("audioDefeat");
    let audioWin = document.getElementById("audioWin");
    let audioBombTime = document.getElementById("audioBombTime");
    let audioBomb = document.getElementById("audioBomb");
    let audioCapital = document.getElementById("audioCapital");
    let audioCapitalaf1 = document.getElementById("audioCapitalaf1");
    let audioCapitalaf2 = document.getElementById("audioCapitalaf2");
    audioMean.play();

    function music(muattribute) {
        if(muattribute == "capital"){
            const audioFiles = [audioCapital, audioCapitalaf1, audioCapitalaf2];
            const randomIndex = Math.floor(Math.random() * audioFiles.length);
            audioFiles[randomIndex].play();
            state = randomIndex;
            return;
        }
        if (muattribute == "bomb!") {
            audioBombTime.pause();
            audioBomb.play();
            return;
        }

        if (muattribute == "countdownIn") {
            audioBombTime.play();
            return;
        }

        if (muattribute == "countdownOut") {
            audioBombTime.pause();
            audioBombTime.currentTime = 0;
            return;
        }

        if (muattribute == "defeat") {
            writeToConsole("music():失败音乐重置中");
            audioMean.currentTime = 0;
            audioStart.currentTime = 0;
            audioMean.pause();
            audioStart.pause();
            audioDefeat.play();
            return;
        }

        if (muattribute == "win") {
            writeToConsole("music():胜利音乐重置中");
            audioMean.currentTime = 0;
            audioStart.currentTime = 0;
            audioMean.pause();
            audioStart.pause();
            audioWin.play();
            return;
        }

        if (muattribute == "restart") {
            writeToConsole("music():音乐重置中");
            audioMean.currentTime = 0;
            audioMean.play();
            audioStart.currentTime = 0;
            audioStart.pause();
            audioDefeat.currentTime = 0;
            audioWin.currentTime = 0;
            audioBomb.currentTime = 0;
            audioDefeat.pause();
            audioWin.pause();
            audioBomb.pause();
            return;
        }
        //如果菜单音乐正在播放，则暂停，并将重置播放进度，然后播放战斗音乐
        if (audioMean.currentTime > 0) {
            writeToConsole("music():菜单音乐已暂停");
            writeToConsole("music():正在播放FC <魂斗罗> Base");
            audioMean.pause();
            audioMean.currentTime = 0;
            audioStart.play();
        } else {
            writeToConsole("music():战斗音乐已暂停");
            writeToConsole("music():正在播放FC <功夫> 主题曲");
            audioStart.pause();
            audioStart.currentTime = 0;
            audioMean.play();
        }
    }

    function randBomb() {
        bombcnt = parseInt(Math.random()*50+1);
    }


    // 获取笑脸元素
    const ingameImg = document.getElementById("ingame");
    ingameImg.onmousedown = function () {
        ingameImg.src = "img/pressingame.jpg";
    }
    ingameImg.onmouseup = function () {
        ingameImg.src = "img/ingame.jpg";
        restart();
    }

    // 参数列表
    const rows = 16; // 行数
    const columns = 16; // 列数
    let bombcnt = parseInt(Math.random()*50+1); // 预定的炸弹数

    // 铺设地雷
    const bomb = {}; // 将炸弹的分布存入bomb中
    let minecnt = 0; // 实际检测到的炸弹数

    function redefault() {//先设置为无雷区
        writeToConsole("redefault():清空炸弹中");
        minecnt = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                bomb[i + '-' + j] = false;
            }
        }
        // writeToConsole(bomb);
    }

    redefault();

    function setbomb() {
        writeToConsole("setbomb():生成炸弹中")
        while (minecnt < bombcnt) {
            const i = Math.floor(Math.random() * rows);
            const j = Math.floor(Math.random() * columns);
            if (!bomb[i + '-' + j]) {
                bomb[i + '-' + j] = true;
                minecnt++;
            }
        }
        // writeToConsole(bomb);
    }

    // 创建地图
    const box = document.querySelector('.body'); // 获取元素body
    const map = []; // 将地图存入map中
    const size = 19.92; // 小方块的尺寸

    function countbombs(i, j) {
        // 获取当前各自3*3范围内的炸弹数,并使用filter函数获取值为true的总数
        const dict = [
            `${i - 1}-${j - 1}`,
            `${i - 1}-${j}`,
            `${i - 1}-${j + 1}`,
            `${i}-${j - 1}`,
            `${i}-${j + 1}`,
            `${i + 1}-${j - 1}`,
            `${i + 1}-${j}`,
            `${i + 1}-${j + 1}`
        ].filter(pos => bomb[pos]);
        return dict.length;
    }

    function createMap(rows, columns, size) {
        writeToConsole(`createMap(${rows},${columns},${size}):创建地图中`);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const isBomb = bomb[i + '-' + j];
                const number = countbombs(i, j);
                // 判断当前格子是否为炸弹，若是则替换为爆炸动画
                map.push(`
                    <div class="item hide" index="${i}-${j}" style="width:${size}px;height:${size}px">
                        ${isBomb ? `<img id="bomb" src="img/爆炸动画.gif">` : `<div class="number">${number ? number : ''}</div>`}
                    </div>
                `);
            }
        }
        box.innerHTML = map.join(''); // 将map添加到box中
        map.length = 0; // 清空map数组
        bindEvents(); // 重新绑定事件
    }

    function restart() {
        writeToConsole("restart():重置游戏中");
        randBomb();
        music("restart");
        isfirst = true;
        ingameImg.src = "img/ingame.jpg";
        redefault();
        setbomb();
        createMap(rows, columns, size);
        // writeToConsole(minecnt);
        leftboadr();
        clearTimeout(interval);
        oSpan2.innerHTML = `<img src="img/0.png" class="timeimg" alt="0"><img src="img/0.png" class="timeimg" alt="0"><img src="img/0.png" class="timeimg" alt="0">`;
        time = "000";
    }

    //事件设置
    let isfirst = true;

    //地雷数量补零函数
    function addzero(n) {
        if (n < 100 && n >= 10) {
            return "0" + n; //返回10到100的
        }
        if (n < 10) {
            return "00" + n; //返回小于10的
        }
        return n.toString(); //返回大于100的
    }

    //左边地雷数量
    const oSpan1 = document.getElementById('img_mine');
    // writeToConsole(addzero(bombcnt).length)
    // let imgstr1 = "";
    function leftboadr() {
        imgstr1 = "";
        oSpan1.innerHTML = "";
        for (let i = 0; i < addzero(minecnt).length; i++) {
            // writeToConsole(addzero(bombcnt)[i]);
            imgstr1 += `<img src="img/${addzero(minecnt)[i]}.png" class="mineimg" alt="${addzero(minecnt)[i]}" />`;
        }
        oSpan1.innerHTML = imgstr1;
        // writeToConsole(imgstr1, minecnt)
    }

    function countMine(a) {
        // 更新数组
        let bombcntStr = addzero(minecnt);
        let lastDigit = parseInt(bombcntStr[bombcntStr.length - 1]);
        let secondLastDigit = parseInt(bombcntStr[bombcntStr.length - 2]);
        let thirdLastDigit = parseInt(bombcntStr[bombcntStr.length - 3]);
        let bombcntArr = bombcntStr.split('');
        if (a == 0) {
            if (lastDigit > 0) {
                bombcntArr[bombcntArr.length - 1] = (lastDigit - 1).toString(); // 更新最后一位数字
                minecnt--;
            } else {
                if (secondLastDigit > 0) {
                    bombcntArr[bombcntArr.length - 1] = '9';
                    bombcntArr[bombcntArr.length - 2] = (secondLastDigit - 1).toString(); // 更新倒数第二位数字
                    minecnt--;
                } else {
                    if (thirdLastDigit > 0) {
                        bombcntArr[bombcntArr.length - 2] = '9';
                        bombcntArr[bombcntArr.length - 3] = (thirdLastDigit - 1).toString(); // 更新倒数第三位数字
                        minecnt--;
                    } else {
                        writeToConsole("已经没有地雷了");
                    }
                }
            }
        } else {
            if (lastDigit < 9) {
                bombcntArr[bombcntArr.length - 1] = (lastDigit + 1).toString(); // 更新最后一位数字
                minecnt++;
            } else {
                bombcntArr[bombcntArr.length - 1] = '0'; // 最后一位变成 0
                if (secondLastDigit < 9) {
                    bombcntArr[bombcntArr.length - 2] = (secondLastDigit + 1).toString(); // 更新倒数第二位数字
                    minecnt++;
                } else {
                    bombcntArr[bombcntArr.length - 2] = '0'; // 倒数第二位变成 0
                    if (thirdLastDigit < 9) {
                        bombcntArr[bombcntArr.length - 3] = (thirdLastDigit + 1).toString(); // 更新倒数第三位数字
                        minecnt++;
                    } else {
                        writeToConsole("已经是最多的地雷了");
                    }
                }
            }
        }

        // 将数组转换回字符串
        bombcntStr = bombcntArr.join('');
        // writeToConsole(bombcntStr);

        // 更新页面内容

        leftboadr();
    }

    //右边计时器
    let time = "000";
    let interval;
    const oSpan2 = document.getElementById('img_time');
    let c;
    // 盒子被点击了开始执行计时器
    function countTime() {
        let second = parseInt(time[time.length - 1]); // 获取最后一位数字
        second++;
        if (second === 10) {
            second = 0;
            let tens = parseInt(time[time.length - 2]);
            tens++;
            if (tens === 10) {
                tens = 0;
                let hundreds = parseInt(time[time.length - 3]);
                hundreds++;
                if (hundreds === 10) {
                    alert("您超时了，请重新开始");
                    oSpan2.innerHTML = "";
                    clearTimeout(interval);
                    time = "000";
                    restart();
                    return;
                }
                time = hundreds.toString() + tens.toString() + second.toString();
            } else {
                time = time.slice(0, time.length - 2) + tens.toString() + second.toString();
            }
        } else {
            // 如果秒数没有达到 10，直接更新最后一位
            time = time.slice(0, time.length - 1) + second.toString();
        }
        // writeToConsole(time); 
        //生成时间图片
        let imgstr = "";
        for (let i = 0; i < time.length; i++) {
            c = time[i];
            imgstr += `<img src="img/${c}.png" class="timeimg" alt="${c}" />`;
        }
        oSpan2.innerHTML = imgstr;
        interval = setTimeout(countTime, 1000);
    }

    function bindEvents() {
        let death = false;
        let win = false;
        const items = box.getElementsByClassName('item');
        for (let i = 0; i < items.length; i++) {

            // 当鼠标进入有盒子的item时，播放炸弹倒计时
            items[i].onmouseover = function () {
                if (items[i].querySelector('#bomb') && !isfirst) {
                    music("countdownIn");
                    writeToConsole("来自僵尸>>炸弹就要爆炸咯~");
                }
            }
            // 反之，当鼠标离开时则停止播放
            items[i].onmouseout = function () {
                if (!items[i].querySelector('#bomb') && !isfirst && items[i].classList.contains('hide')) {
                    music("countdownOut");
                    writeToConsole("来自比尔>>你安全了，暂时的...");
                }
            }


            // 当item被鼠标左键按下时
            items[i].onclick = function () {
                // writeToConsole(box.getElementsByClassName("hide").length);
                // writeToConsole(bombcnt);
                //将当前格子的左边以[x,y]的形式保存在index中
                const index = items[i].getAttribute('index').split('-').map(v => Number(v));

                // 如果是第一次点击
                if (isfirst) {
                    isfirst = false;
                    countTime(); //开始计时
                    //将大厅音乐暂停，播放战斗音乐
                    music();
                    // 如果第一次点击的位置是炸弹，则将其更改为非炸弹
                    if (bomb[`${index[0]}-${index[1]}`]) {
                        writeToConsole("来自慎>>你已经死了");
                        // 从头开始查找第一个非炸弹格子
                        for (let j = 0; j < rows; j++) {
                            for (let k = 0; k < columns; k++) {
                                if (!bomb[`${j}-${k}`]) {
                                    bomb[`${j}-${k}`] = true; // 将其更改为炸弹
                                    bomb[`${index[0]}-${index[1]}`] = false; // 移除原炸弹
                                    createMap(rows, columns, size); // 重新创建地图
                                    const text = ["来自佛耶戈>>复活吧！我的爱人！", "来自阿克尚>>亲爱的，请不要再死了"];
                                    const rdi = Math.floor(Math.random() * text.length);
                                    writeToConsole(text[rdi]);
                                    death = true;
                                    break;
                                }
                            }
                            if (death) {
                                break;
                            }
                        }
                    }
                }

                //如果当前格子已经被标记，则去除标记
                if (items[i].classList.contains('haveimg')) {
                    const ele = items[i].querySelector('.beforeopen');
                    items[i].removeChild(ele);
                    items[i].classList.remove("haveimg");
                }

                if(!win){
                    items[i].classList.remove('hide');
                }
                

                //失败规则
                if (items[i].querySelector('#bomb')) {
                    music("defeat");
                    clearTimeout(interval);
                    ingameImg.src = "img/gg.jpg";
                    writeToConsole("来自博士>>僵尸吃掉了你的脑子！");
                    //333ms后将爆炸动画变为开启的玩偶匣,并将高和宽变为225%
                    setTimeout(() => {
                        music("bomb!");
                        const e = items[i].querySelector('#bomb');
                        e.src = "img/开盒后.png";
                        e.style.height = "225%";
                        e.style.width = "225%";
                    }, 333);

                    //创建失败动画
                    const defeatimg = document.createElement('img');
                    defeatimg.src = 'img/僵尸吃掉的脑子.png';
                    defeatimg.classList.add('ohNo');
                    items[i].parentNode.appendChild(defeatimg);
                    setTimeout(() => {//播放0.5s的放大动画
                        defeatimg.style.opacity = '1';
                        defeatimg.style.width = '100%';
                    }, 500);

                    //当点击失败图片的时候，重置对局
                    defeatimg.addEventListener('click', e => {
                        restart();
                    })
                }
                //胜利规则
                else if (bombcnt == box.getElementsByClassName("hide").length && !win && items[i].classList.contains('hide')) {
                    win = true;
                    music("win");
                    clearTimeout(interval);
                    writeToConsole("来自???>>脑子属于戴夫！");
                    ingameImg.src = "img/victory.jpg";
                    const trophybox = document.createElement('div');
                    trophybox.classList.add('trophybox');
                    trophybox.innerHTML = `
                        <div class="trophy-background"></div>
                        <img class="trophy" src="img/trophy.png">`;
                    items[i].appendChild(trophybox);
                    //获取到奖杯.png元素
                    const trophyimgtmp = items[i].querySelector('.trophy');
                    // writeToConsole(trophyimgtmp);
                    //当奖杯被点击的时候，进行放大并移动到画面的中心
                    trophyimgtmp.addEventListener('click', e => {
                        writeToConsole('来自系统>>奖杯被点击');
                        restart();
                    })

                }
                else if (items[i].innerText.trim() === '' && !win) {
                    music('capital');
                    //使用递归向外扩散
                    const loop = (index) => {
                        //检查以点击盒子为中心的3*3区域
                        [
                            [index[0] - 1, index[1] - 1],
                            [index[0] - 1, index[1]],
                            [index[0] - 1, index[1] + 1],
                            [index[0], index[1] - 1],
                            [index[0], index[1] + 1],
                            [index[0] + 1, index[1] - 1],
                            [index[0] + 1, index[1]],
                            [index[0] + 1, index[1] + 1],
                        ].forEach(num => {//检测九宫格内是否有数字为0
                            const etmp = document.querySelector(`[index="${num.join('-')}"]`);
                            if (etmp) {
                                const isspace = etmp.querySelector('.number').innerText.trim();
                                if (etmp.className.indexOf('hide') >= 0 && isspace === '') {
                                    //被标记被雷的格子不受影响
                                    if (!etmp.classList.contains('haveimg')) {
                                        etmp.classList.remove('hide');
                                    }
                                    loop(num);
                                } else {
                                    if (!etmp.classList.contains('haveimg')) {
                                        etmp.classList.remove('hide');
                                    }
                                }
                                if(state == 0){
                                    writeToConsole("来自普朗克>>死亡轰炸！");
                                } else{
                                    writeToConsole("来自普朗克>>大笑!!!");
                                }
                            }
                        })
                    }
                    loop(index);
                    if (bombcnt == box.getElementsByClassName("hide").length && !win) {
                        win = true;
                        music("win");
                        clearTimeout(interval);
                        writeToConsole("来自???>>脑子属于戴夫！");
                        ingameImg.src = "img/victory.jpg";
                        const trophybox = document.createElement('div');
                        trophybox.classList.add('trophybox');
                        trophybox.innerHTML = `
                            <div class="trophy-background"></div>
                            <img class="trophy" src="img/trophy.png">`;
                        items[i].appendChild(trophybox);
                        //获取到奖杯.png元素
                        const trophyimgtmp = items[i].querySelector('.trophy');
                        // writeToConsole(trophyimgtmp);
                        //当奖杯被点击的时候，进行放大并移动到画面的中心
                        trophyimgtmp.addEventListener('click', e => {
                            writeToConsole('来自系统>>奖杯被点击');
                            restart();
                        })   
                    }
                }
            };
            // 当item被鼠标右键按下时
            items[i].addEventListener('contextmenu', e => {
                //阻止浏览器右键菜单跳出
                e.preventDefault();
                //如果当前格子未被点击
                if (items[i].classList.contains('hide')) {
                    //如果当前格子未被标记
                    if (!items[i].classList.contains('haveimg')) {
                        let a = 0;
                        const img = document.createElement('img');//创建img元素
                        img.src = "img/开盒前.png";
                        img.style.display = "inline";
                        img.style.height = "100%";
                        img.style.width = "100%";
                        img.classList.add('beforeopen');
                        items[i].appendChild(img);//添加到格子中
                        items[i].classList.add("haveimg");//当前格子以被标记,放置出现多个盒子
                        countMine(a);
                    } else {//再一次右键则取消盒子
                        let a = 1;
                        const ele = items[i].querySelector('.beforeopen');
                        items[i].removeChild(ele);
                        items[i].classList.remove("haveimg");
                        countMine(a);
                    }

                }
            })
        }
    }

    restart();

};