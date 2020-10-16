// ==UserScript==
// @name         ioihw2020 做题工具
// @namespace    https://ioihw2020.duck-ac.cn
// @version      0.4.1
// @description  我啥时候也进个集训队啊
// @author       memset0
// @match        https://ioihw20.duck-ac.cn/
// @match        https://ioihw20.duck-ac.cn/*
// @updateURL    https://raw.githubusercontent.com/memset0/ioihw20-helper/master/userscript.js
// @downloadURL  https://raw.githubusercontent.com/memset0/ioihw20-helper/master/userscript.js
// @supportURL   https://github.com/memset0/ioihw20-helper/issues
// @homepage     https://github.com/memset0/ioihw20-helper
// @grant        none
// ==/UserScript==

const colors = [
    'black',
    'green',
    'yellow',
    'red',
];

const userlist = [
    "虞皓翔",
    "马耀华",
    "彭博",
    "屠学畅",
    "黄子宽",
    "彭思进",
    "胡昊",
    "邓明扬",
    "周欣",
    "陈雨昕",
    "叶卓睿",
    "魏衍芃",
    "林昊翰",
    "李白天",
    "代晨昕",
    "张隽恺",
    "徐哲安",
    "郭城志",
    "徐舟子",
    "周镇东",
    "张好风",
    "袁浩天",
    "魏辰轩",
    "邱天异",
    "张博为",
    "陈峻宇",
    "孙诺舟",
    "蒋凌宇",
    "潘佳奇",
    "钱易",
    "张庭川",
    "丁晓漫",
    "左骏驰",
    "万天航",
    "施良致",
    "刘宇豪",
    "李泽清",
    "林立",
    "戴傅聪",
    "王泽远",
    "陈胤戬",
    "陆宏",
    "吕秋实",
    "欧阳宇鹏",
    "张记僖",
    "吴孟周",
    "曹原",
    "陈亮舟",
    "卢宸昊",
    "曾庆之",
    "万成章",
    "张景行",
    "戴江齐",
    "郑路明",
    "周航锐",
    "曹越",
    "冯施源",
    "罗恺",
    "冷滟泽",
    "杨珖",
    "陶立宇",
    "陈于思",
    "王相文",
    "孙嘉伟",
    "孙若凡",
    "宣毅鸣",
    "谢濡键",
    "孙从博",
    "许庭强",
    "周子衡",
    "苏焜",
    "管晏如",
    "陈永志",
    "蔡欣然",
    "韩豫葳",
    "张湫阳",
    "丁其安",
    "翁伟捷",
    "吴家庆",
    "潘逸飞",
    "谢琳涵",
];

const db = {
    load() {
        return JSON.parse(localStorage.getItem('hw') || '[]');
    },
    dump(data) {
        localStorage.setItem('hw', JSON.stringify(data || []));
    },
    update(pid, status) {
        let data = db.load();
        data[pid] = status;
        db.dump(data);
    },
    query(pid) {
        return db.load()[pid] || 0;
    },
};

const dbWinner = {
    update(winner) {
        localStorage.setItem('hw-winner', String(winner));
    },
    query() {
        let plain = localStorage.getItem('hw-winner');
        if (isNaN(parseInt(plain))) {
            return -1;
        } else {
            return parseInt(plain);
        }
    }
};

function getUserInfomation(id) {
    id = id < 10 ? '0' + String(id) : String(id);
    return $.get({
        url: `https://ioihw20.duck-ac.cn/user/profile/ioi2021_${id}`,
    }).then((res) => {
        let info = res.match(/<h4 class="list-group-item-heading">格言<\/h4>\s+<p class="list-group-item-text">(.*?)<\/p>/)[1];
        let count = parseInt(res.match(/AC 过的题目：共 (\d+) 道题/)[1]);
        if (res.match(/"\/problem\/1"/)) {
            // A + B Problem 不统计在内
            --count;
        }
        return {
            id: id,
            info: info,
            count: count,
        };
    });
}

async function render() {
    $('*').each(function() {
        if (this.innerHTML.match(/^ioi2021_[0-9]+$/g)) {
            let uid = parseInt(this.innerHTML.match(/ioi2021_[0-9]+/g)[0].slice(8));
            let name = userlist[uid];
            if (uid == dbWinner.query()) {
                name += '<sup><span style="color: red">卷王</span></sup>';
            }
            if (name) {
                console.log(uid, name);
                this.innerHTML = '<span style="font-weight: normal">' + name + '</span>';
            }
        }
    });

    if (location.pathname.startsWith('/problems')) {
        $(".table tr td:first-child").each(function () {
            let pid = this.innerHTML.slice(1);
            let status = db.query(pid);
            this.style.color = colors[status];
            if (status) {
                this.style['font-weight'] = 'bold';
            } else {
                this.style['font-weight'] = 'normal';
            }
            console.log(pid, status);
        });
    }
}

async function mainRender() {
    $('.navbar .navbar-nav').append('<li><a href="/ranklist">排行榜</a></li>')

    if (location.pathname == '/ranklist') {
        let userListPromised = [];
        $('.pagination').remove();
        $('.table tbody tr').remove();
        for (let userId = 0; userId < 81; userId++) {
            userListPromised.push(getUserInfomation(userId));
        }
        let userList = await Promise.all(userListPromised);
        userList.sort((firstUser, secondUser) => {
            console.log(firstUser, secondUser);
            if (firstUser.count == secondUser.count) {
                return parseInt(firstUser.id) - parseInt(secondUser.id);
            }
            return secondUser.count - firstUser.count;
        });
        if (userList.length) {
            dbWinner.update(userList[0].id);
        }
        console.log(userList);
        $('.table thead tr th:last-child').text('通过数');
        for (let user of userList) {
            console.log(user);
            let $tr = $('<tr></tr>');
            $tr.append(`<td>${user.id}</td>`);
            $tr.append(`<td><a class="uoj-username" href="https://ioihw20.duck-ac.cn/user/profile/ioi2021_${user.id}" style="color:rgb(75,175,178)">ioi2021_${user.id}</a></td>`);
            $tr.append(`<td>${user.info}</td>`);
            $tr.append(`<td>${user.count}</td>`);
            $('.table tbody').append($tr);
        }
    }

    render();
}

if (location.pathname.startsWith('/problems')) {
    $(".table tr td:first-child").click(function () {
        let pid = this.innerHTML.slice(1);
        let status = db.query(pid);
        status = (status + 1) % colors.length;
        db.update(pid, status);
        render();
    });
}

mainRender();
