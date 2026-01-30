/**
 * 小鸭看看 - drpyS/CatVod格式源
 * 
 * 使用方式:
 * 1. drpyS服务器: 将此文件放入 data/sites 目录
 * 2. ZyPlayer/PeekPili: 直接导入GitHub raw链接
 * 
 * 搜索说明: 网站有Cloudflare保护，搜索通过本地遍历实现
 */

var rule = {
    title: '小鸭看看',
    host: 'https://xiaoyakankan.com',
    // 搜索URL (网站实际搜索接口，但有CF保护)
    searchUrl: '/index.php/vod/search.html?wd=**',
    searchable: 2,  // 1=支持搜索, 2=聚合搜索, 0=不支持
    quickSearch: 0,
    filterable: 1,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Referer': 'https://xiaoyakankan.com/'
    },

    class_name: '电影&连续剧&综艺&动漫&福利',
    class_url: '10&11&12&13&15',

    filter: {
        '10': [{
            key: 'cateId', name: '分类', value: [
                { n: '全部', v: '10' }, { n: '动作片', v: '1001' }, { n: '喜剧片', v: '1002' },
                { n: '爱情片', v: '1003' }, { n: '科幻片', v: '1004' }, { n: '恐怖片', v: '1005' },
                { n: '剧情片', v: '1006' }, { n: '战争片', v: '1007' }, { n: '纪录片', v: '1008' },
                { n: '悬疑片', v: '1016' }, { n: '4K电影', v: '1027' }
            ]
        }],
        '11': [{
            key: 'cateId', name: '分类', value: [
                { n: '全部', v: '11' }, { n: '国产剧', v: '1101' }, { n: '香港剧', v: '1102' },
                { n: '韩国剧', v: '1103' }, { n: '欧美剧', v: '1104' }, { n: '台湾剧', v: '1105' },
                { n: '日本剧', v: '1106' }, { n: '泰国剧', v: '1108' }
            ]
        }],
        '12': [{
            key: 'cateId', name: '分类', value: [
                { n: '全部', v: '12' }, { n: '内地综艺', v: '1201' }, { n: '港台综艺', v: '1202' },
                { n: '日韩综艺', v: '1203' }, { n: '欧美综艺', v: '1204' }
            ]
        }],
        '13': [{
            key: 'cateId', name: '分类', value: [
                { n: '全部', v: '13' }, { n: '国产动漫', v: '1301' }, { n: '日韩动漫', v: '1302' },
                { n: '欧美动漫', v: '1303' }
            ]
        }],
        '15': []
    },

    // 解析视频卡片的通用函数
    parseItem: function ($, item) {
        let $item = $(item);
        let href = $item.find('a.link').attr('href') || $item.find('a').first().attr('href') || '';
        let vodId = '';
        let match = href.match(/\/post\/([^.\/]+)/);
        if (match) vodId = match[1];
        if (!vodId) return null;

        let pic = $item.find('img').attr('data-src') || $item.find('img').attr('src') || '';
        if (pic && pic.startsWith('//')) pic = 'https:' + pic;

        return {
            vod_id: vodId,
            vod_name: ($item.find('a.title').text() || $item.find('.info a').first().text() || '').trim(),
            vod_pic: pic,
            vod_remarks: ($item.find('.tag1').text() || $item.find('.tag2').text() || '').trim()
        };
    },

    // 推荐/首页
    homeVod: async function () {
        let html = await this.request(this.host);
        let $ = this.cheerio.load(html);
        let list = [];
        let self = this;
        $('div.item').each(function () {
            let item = self.parseItem($, this);
            if (item && item.vod_id) list.push(item);
        });
        return list.slice(0, 24);
    },

    // 分类列表
    category: async function (tid, pg, filter, extend) {
        let cateId = extend.cateId || tid;
        let page = pg || 1;
        let url = this.host + '/cat/' + cateId + '.html';
        if (page > 1) url = this.host + '/cat/' + cateId + '/' + page + '.html';

        let html = await this.request(url);
        let $ = this.cheerio.load(html);
        let list = [];
        let self = this;
        $('div.item').each(function () {
            let item = self.parseItem($, this);
            if (item && item.vod_id) list.push(item);
        });
        return { list: list, page: page, pagecount: 0, limit: 36, total: 0 };
    },

    // 详情页
    detail: async function (id) {
        let url = this.host + '/post/' + id + '.html';
        let html = await this.request(url);
        let $ = this.cheerio.load(html);

        let title = $('title').text().replace(/ - 小鸭看看$/, '').trim();
        let desc = $('meta[name="description"]').attr('content') || '';
        let typeName = $('div.m4-bread ol li').eq(2).find('a').text().trim();

        let pic = $('div.m4-detail img').attr('data-src') || $('div.m4-detail img').attr('src') || '';
        if (pic && pic.startsWith('//')) pic = 'https:' + pic;

        let playFromArr = [];
        let playUrlArr = [];

        $('div.source').each(function (i) {
            let $source = $(this);
            let dataVod = $source.attr('data-vod') || '';
            let sourceName = $source.find('span.name').text().trim();
            let quality = $source.find('span.res').text().trim();

            let fromName = sourceName.split('：')[0] || ('线路' + (i + 1));
            if (quality) fromName += '[' + quality + ']';

            let episodes = [];
            $source.find('div.list a').each(function (j) {
                let epName = $(this).text().trim();
                let epIdx = $(this).attr('data-sou_idx') || j;
                // 播放ID: dataVod + 剧集索引
                episodes.push(epName + '$' + dataVod + '_' + epIdx);
            });

            if (episodes.length > 0) {
                playFromArr.push(fromName);
                playUrlArr.push(episodes.join('#'));
            }
        });

        return {
            vod_id: id,
            vod_name: title,
            vod_pic: pic,
            vod_content: desc,
            type_name: typeName,
            vod_play_from: playFromArr.join('$$$'),
            vod_play_url: playUrlArr.join('$$$')
        };
    },

    // 搜索 - 通过遍历首页和分类页实现
    search: async function (wd, quick, pg) {
        let keyword = wd.toLowerCase();
        let list = [];
        let self = this;

        // 先尝试从首页搜索
        try {
            let html = await this.request(this.host);
            let $ = this.cheerio.load(html);
            $('div.item').each(function () {
                let item = self.parseItem($, this);
                if (item && item.vod_name && item.vod_name.toLowerCase().indexOf(keyword) >= 0) {
                    list.push(item);
                }
            });
        } catch (e) { }

        // 如果首页没找到足够的结果，遍历前3个分类
        if (list.length < 5) {
            let categories = ['10', '11', '13'];
            for (let cat of categories) {
                try {
                    let catUrl = this.host + '/cat/' + cat + '.html';
                    let html = await this.request(catUrl);
                    let $ = this.cheerio.load(html);
                    $('div.item').each(function () {
                        let item = self.parseItem($, this);
                        if (item && item.vod_name && item.vod_name.toLowerCase().indexOf(keyword) >= 0) {
                            // 避免重复
                            if (!list.find(v => v.vod_id === item.vod_id)) {
                                list.push(item);
                            }
                        }
                    });
                    if (list.length >= 10) break;
                } catch (e) { }
            }
        }

        return { list: list, page: 1, pagecount: 1, limit: 20, total: list.length };
    },

    // 播放解析
    play: async function (flag, id, flags) {
        // id格式: 线路ID_视频ID_剧集索引
        // 由于网站播放需要JS解析，返回需要解析的标记
        if (id.startsWith('http')) {
            return { parse: 0, url: id };
        }

        // 返回需要解析
        return { parse: 1, url: id };
    }
};

// 兼容CatVod格式导出
var __spider__ = {
    init: function (cfg) {
        // 初始化配置
    },
    home: async function (filter) {
        let classes = [];
        let names = rule.class_name.split('&');
        let urls = rule.class_url.split('&');
        for (let i = 0; i < names.length; i++) {
            classes.push({ type_id: urls[i], type_name: names[i] });
        }
        let list = await rule.homeVod.call(rule);
        return JSON.stringify({ class: classes, filters: rule.filter, list: list });
    },
    homeVod: async function () {
        let list = await rule.homeVod.call(rule);
        return JSON.stringify({ list: list });
    },
    category: async function (tid, pg, filter, extend) {
        let result = await rule.category.call(rule, tid, pg, filter, extend);
        return JSON.stringify(result);
    },
    detail: async function (id) {
        let vod = await rule.detail.call(rule, id);
        return JSON.stringify({ list: [vod] });
    },
    search: async function (wd, quick, pg) {
        let result = await rule.search.call(rule, wd, quick, pg);
        return JSON.stringify(result);
    },
    play: async function (flag, id, flags) {
        let result = await rule.play.call(rule, flag, id, flags);
        return JSON.stringify(result);
    }
};
