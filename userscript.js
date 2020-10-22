// ==UserScript==
// @name         ioihw2020 做题工具
// @namespace    https://ioihw2020.duck-ac.cn
// @version      0.5.7
// @description  我啥时候也进个集训队啊
// @author       memset0
// @match        https://ioihw20.duck-ac.cn/
// @match        https://ioihw20.duck-ac.cn/*
// @updateURL    https://cdn.jsdelivr.net/gh/memset0/ioihw20-helper@master/userscript.js
// @downloadURL  https://cdn.jsdelivr.net/gh/memset0/ioihw20-helper@master/userscript.js
// @supportURL   https://github.com/memset0/ioihw20-helper/issues
// @homepage     https://github.com/memset0/ioihw20-helper
// @grant        none
// ==/UserScript==

const config = {
    url: {
        codeforces: 'https://www.codeforces.com',
    },
};

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

const problemShortcutList = [
    'UC', 'DG', 'RB',
    'HC', 'IB', 'FJ',
    'GK', 'UH', 'QH',
    'EE', 'DJ', 'IH',
    'HL', 'MI', 'EJ',
    'MB', 'UI', 'ED',
    'AA', 'BG', 'ML',
    'CF', 'TE', 'QG',
    'PH', 'UJ', 'BB',
    'CI', 'SD', 'NG',
    'DK', 'LD', 'IJ',
    'NC', 'BJ', 'FK',
    'CH', 'NJ', 'RH',
    'QF', 'BE', 'KI',
    'AC', 'PG', 'HM',
    'PJ', 'ID', 'EG',
    'SI', 'KC', 'GI',
    'OG', 'CK', 'DB',
    'QE', 'GH', 'NI',
    'OL', 'KA', 'MG',
    'SG', 'NL', 'KH',
    'QJ', 'KG', 'AB',
    'KD', 'IL', 'NF',
    'CM', 'NE', 'HD',
    'DH', 'EC', 'BM',
    'LC', 'CD', 'JI',
    'DL', 'ME', 'PE',
    'LI', 'AI', 'RJ',
    'SF', 'II', 'HG',
    'RE', 'LL', 'OA',
    'FB', 'QD', 'DA',
    'TC', 'AE', 'CB',
    'GF', 'AG', 'JC',
    'PA', 'TH', 'EH',
    'AJ', 'TK', 'EI',
    'UL', 'AF', 'SK',
    'BH', 'RD', 'OK',
    'FC', 'JD', 'OE',
    'TF', 'FF', 'DD',
    'CJ', 'HK', 'MJ',
    'FG', 'GL', 'AL',
    'FI', 'IC', 'QC',
    'MD', 'OJ', 'HI',
    'KK', 'JH', 'OB',
    'BK', 'GJ', 'KE',
    'CA', 'IK', 'LE',
    'RI', 'LK', 'PD',
    'JE', 'LB', 'HB',
    'BL', 'RG', 'AH',
    'AK', 'GG', 'JG',
];

const problemSourceIdList = [
    101221, 101239, 101242, 101471, 102482, 102511, 101630,
    101190, 100851, 100553, 100307, 101620, 101173, 101480,
    100543, 100299, 101612, 101142, 100801, 100531, 100269
];

const colors = [
    'black',
    'green',
    'yellow',
    'red',
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

function getProblemInfo(problemId) {
    let problemType = problemId == 1 ? '测试题' : (problemId < 300 && problemId % 4 ? '作业题' : '自选题');

    let shortcut, shortcutId, contestId
    if (problemId >= 101) {
        shortcutId = problemId - 101 - ((problemId - 101) >> 2);
        shortcut = problemShortcutList[shortcutId];
        contestId = problemType == '作业题' ? problemSourceIdList[shortcut.charCodeAt(0) - 65] : -1;
    }

    let authorId, authorName;
    if (problemId == 1) authorName = 'root';
    else {
        authorId = (problemId - 101) >> 2;
        authorName = 'ioi2021_' + (authorId < 10 ? '0' : '') + String(authorId);
    }

    return {
        problemType,
        authorId,
        authorName,
        shortcut,
        shortcutId,
        contestId
    };
}

function getUserInfo(id) {
    function strMatch(source, reg_exp, default_value) {
        let match_result = source.match(reg_exp);
        if (match_result) {
            return match_result[1];
        } else {
            console.log("[Warning] string doesn't match!");
            return default_value;
        }
    }
    id = id < 10 ? '0' + String(id) : String(id);
    return $.get({
        url: `https://ioihw20.duck-ac.cn/user/profile/ioi2021_${id}`,
    }).then((res) => {
        let motto = strMatch(res, /<h4 class="list-group-item-heading">格言<\/h4>\s+<p class="list-group-item-text">(.*?)<\/p>/s, "<error>");

        let regex = /"\/problem\/(\d+)"/g, match, count = 0;
        while (match = regex.exec(res)) {
            let problemId = parseInt(match[1]);
            let { problemType } = getProblemInfo(problemId);
            count += problemType == '作业题';
        }

        return {
            id,
            motto,
            count,
        };
    });
}

async function render() {
    $('*').each(function () {
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
        document.title = document.title.replace('比赛排行榜', '排行榜');

        let userListPromised = [];
        $('.pagination').remove();
        $('.table tbody tr').remove();
        for (let userId = 0; userId < 81; userId++) {
            userListPromised.push(getUserInfo(userId));
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
            $tr.append(`<td>${user.motto}</td>`);
            $tr.append(`<td>${user.count}</td>`);
            $('.table tbody').append($tr);
        }
    }

    if (location.pathname == '/problems' || location.pathname.startsWith('/problems/')) {
        $('.table thead tr th:last-child').css('width', '170px');
        $('.table thead tr').eq(0).append('<th class="text-center" style="width: 110px;">来源</th>');
        $('.table tbody tr').each(function(index, element) {
            let $element = $(element);
            let problemId = $element.children('td').eq(0).text().slice(1);
            let { problemType, shortcut, contestId } = getProblemInfo(problemId);

            let extraContent = '';
            if (problemType == '作业题') {
                extraContent = `
                    <a target="_blank" rel="noopener noreferrer" href="${config.url.codeforces}/gym/${contestId}/problem/${shortcut[1]}">
                        ${shortcut}
                    </a>
                    <a target="_blank" rel="noopener noreferrer" href="${config.url.codeforces}/gym/${contestId}">
                        (${contestId})
                    </a>
                `;
            }

            $element.append('<td>' + extraContent + '</td>');
        });
    }

    if (location.pathname.startsWith('/problem/')) {
        let problemId = parseInt(location.href.substr(location.href.lastIndexOf("problem/") + 8, 3), 10);
        let { problemType, authorName, shortcut, shortcutId, contestId } = getProblemInfo(problemId);

        $(".nav-tabs").eq(0).append(`<li>
            <span style="display:block;padding:10px 15px;font-weight:bold;">
                ${problemType}
                <span style="font-weight:normal">by</span>
                <a class="uoj-username" target="_blank" href="https://ioihw20.duck-ac.cn/user/profile/${authorName}" style="color:rgb(75,175,178)">
                    <span style="font-weight: normal">${authorName}</span>
                </a>
            </span>
        </li>`);

        if (problemType == '作业题') {
            $(".nav-tabs").eq(0).append(`<li>
                <span style="display:block;padding:10px 15px;">
                    Source:&nbsp;&nbsp;
                    <a target="_blank" rel="noopener noreferrer" href="${config.url.codeforces}/gym/${contestId}/problem/${shortcut[1]}">
                        ${shortcut}
                    </a>
                    <a target="_blank" rel="noopener noreferrer" href="${config.url.codeforces}/gym/${contestId}">
                        (${contestId})
                    </a>
                </span>
            </li>`);
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
