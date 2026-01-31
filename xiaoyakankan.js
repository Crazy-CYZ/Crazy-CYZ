/**
 * ═══════════════════════════════════════════════════════════════
 *                      小鸭看看 drpyS源
 * ═══════════════════════════════════════════════════════════════
 * 
 * 版本: 2.0.0
 * 更新: 2026-01-31
 * 作者: AI Assistant
 * 
 * 适用壳子:
 *   - drpy-node (推荐)
 *   - 皮卡丘 PeekPili
 *   - 酷9
 *   - 千寻
 * 
 * 使用方法:
 *   1. 将此文件放入 drpy-node 的 data/sites 目录
 *   2. 重启服务或刷新配置
 *   3. 在壳子中添加drpy源地址
 * 
 * ═══════════════════════════════════════════════════════════════
 */

var rule = {
    // ════════════════════════════════════════════════════════════
    //                        基础配置
    // ════════════════════════════════════════════════════════════

    类型: '影视',
    title: '小鸭看看',
    host: 'https://xiaoyakankan.com',
    desc: '免费在线影视网站，提供电影、电视剧、综艺、动漫等高清资源',
    homeUrl: '/',
    编码: 'utf-8',
    timeout: 15000,

    // ════════════════════════════════════════════════════════════
    //                        分类配置
    // ════════════════════════════════════════════════════════════

    // 静态分类
    class_name: '电影&连续剧&综艺&动漫&福利',
    class_url: '10&11&12&13&15',

    // 分类排除
    cate_exclude: '专题|推荐|热门',

    // 分页URL模板
    // fyclass = 分类ID, fypage = 页码
    url: '/cat/fyclass/fypage.html',

    // 每个分类的最大页数
    pagecount: {
        '10': 100,
        '11': 100,
        '12': 50,
        '13': 50,
        '15': 20
    },

    // ════════════════════════════════════════════════════════════
    //                        筛选配置
    // ════════════════════════════════════════════════════════════

    filterable: 1,

    filter: {
        '10': [
            {
                key: 'cateId',
                name: '分类',
                value: [
                    { n: '全部', v: '10' },
                    { n: '动作片', v: '1001' },
                    { n: '喜剧片', v: '1002' },
                    { n: '爱情片', v: '1003' },
                    { n: '科幻片', v: '1004' },
                    { n: '恐怖片', v: '1005' },
                    { n: '剧情片', v: '1006' },
                    { n: '战争片', v: '1007' },
                    { n: '纪录片', v: '1008' },
                    { n: '动漫电影', v: '1010' },
                    { n: '奇幻片', v: '1011' },
                    { n: '犯罪片', v: '1014' },
                    { n: '悬疑片', v: '1016' },
                    { n: '4K电影', v: '1027' }
                ]
            }
        ],
        '11': [
            {
                key: 'cateId',
                name: '分类',
                value: [
                    { n: '全部', v: '11' },
                    { n: '国产剧', v: '1101' },
                    { n: '香港剧', v: '1102' },
                    { n: '韩国剧', v: '1103' },
                    { n: '欧美剧', v: '1104' },
                    { n: '台湾剧', v: '1105' },
                    { n: '日本剧', v: '1106' },
                    { n: '海外剧', v: '1107' },
                    { n: '泰国剧', v: '1108' },
                    { n: '港台剧', v: '1110' },
                    { n: '日韩剧', v: '1111' }
                ]
            }
        ],
        '12': [
            {
                key: 'cateId',
                name: '分类',
                value: [
                    { n: '全部', v: '12' },
                    { n: '内地综艺', v: '1201' },
                    { n: '港台综艺', v: '1202' },
                    { n: '日韩综艺', v: '1203' },
                    { n: '欧美综艺', v: '1204' }
                ]
            }
        ],
        '13': [
            {
                key: 'cateId',
                name: '分类',
                value: [
                    { n: '全部', v: '13' },
                    { n: '国产动漫', v: '1301' },
                    { n: '日韩动漫', v: '1302' },
                    { n: '欧美动漫', v: '1303' },
                    { n: '海外动漫', v: '1305' }
                ]
            }
        ],
        '15': []
    },

    // 筛选URL模板 - 使用 {{fl.key}} 引用筛选值
    filter_url: '/cat/{{fl.cateId}}/fypage.html',

    // 默认筛选值
    filter_def: {},

    // ════════════════════════════════════════════════════════════
    //                        搜索配置
    // ════════════════════════════════════════════════════════════

    // 网站搜索被Cloudflare拦截，禁用原生搜索
    searchUrl: '',
    searchable: 0,
    quickSearch: 0,
    搜索编码: 'utf-8',

    // ════════════════════════════════════════════════════════════
    //                        请求配置
    // ════════════════════════════════════════════════════════════

    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 12; SM-G9880) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://xiaoyakankan.com/',
        'Upgrade-Insecure-Requests': '1'
    },

    // ════════════════════════════════════════════════════════════
    //                        播放配置
    // ════════════════════════════════════════════════════════════

    play_parse: true,

    // 嗅探配置
    sniffer: 1,
    isVideo: 'http((?!http).){26,}\\.(m3u8|mp4|flv|avi|mkv|wmv|ts)',

    // 线路管理
    tab_exclude: '',
    tab_remove: [],
    tab_order: [],
    tab_rename: {
        '线路': '播放线路'
    },

    // 播放解析配置
    play_json: [
        {
            re: '*',
            json: {
                jx: 1,
                parse: 1
            }
        }
    ],

    // ════════════════════════════════════════════════════════════
    //                        辅助函数
    // ════════════════════════════════════════════════════════════

    /**
     * 解析视频卡片
     */
    parseVideoCard: function ($, item) {
        let $item = $(item);

        // 获取链接
        let href = $item.find('a.link').attr('href')
            || $item.find('a').first().attr('href')
            || '';

        // 提取视频ID
        let match = href.match(/\/post\/([^.\/]+)/);
        if (!match) return null;

        // 获取封面图
        let pic = $item.find('img').attr('data-src')
            || $item.find('img').attr('src')
            || '';
        if (pic) {
            if (pic.startsWith('//')) pic = 'https:' + pic;
            else if (pic.startsWith('/')) pic = 'https://xiaoyakankan.com' + pic;
        }

        // 获取标题
        let title = $item.find('a.title').text().trim()
            || $item.find('.title').text().trim()
            || $item.find('h3').text().trim()
            || '';

        // 获取备注
        let remarks = $item.find('.tag1').text().trim()
            || $item.find('.tag2').text().trim()
            || '';

        return {
            vod_id: match[1],
            vod_name: title,
            vod_pic: pic,
            vod_remarks: remarks
        };
    },

    // ════════════════════════════════════════════════════════════
    //                        核心函数
    // ════════════════════════════════════════════════════════════

    /**
     * 预处理 - 源初始化时执行一次
     * 可用于动态获取cookie等
     */
    预处理: async function () {
        // 暂不需要预处理
        return;
    },

    /**
     * 动态获取域名 (可选)
     * 优先级最高，会影响后续相对链接
     */
    // hostJs: async function() {
    //     let { HOST } = this;
    //     return HOST;
    // },

    /**
     * 动态分类解析 (可选)
     * 返回 { class: [], filters: {} }
     */
    // class_parse: async function() {
    //     let { request, HOST, cheerio } = this;
    //     // 从网页动态获取分类...
    //     return { class: [], filters: {} };
    // },

    /**
     * 首页推荐
     * 返回视频列表数组
     */
    推荐: async function () {
        let { request, HOST, cheerio } = this;

        try {
            let html = await request(HOST);
            let $ = cheerio.load(html);
            let list = [];
            let self = this;

            $('div.item').each(function () {
                let video = rule.parseVideoCard($, this);
                if (video) {
                    list.push(video);
                }
            });

            return list.slice(0, 30);
        } catch (e) {
            console.log('推荐错误:', e.message);
            return [];
        }
    },

    /**
     * 分类列表 (一级)
     * this.input  - 完整URL (已替换fyclass和fypage)
     * this.MY_CATE - 当前分类ID
     * this.MY_FL  - 当前筛选条件 {cateId: '1001'}
     * 返回视频列表数组
     */
    一级: async function () {
        let { input, request, cheerio, MY_CATE, MY_FL } = this;

        try {
            // 处理URL
            let url = input;

            // 修正URL格式
            url = url.replace(/([^:])\/+/g, '$1/');

            // 第一页使用简化URL
            if (url.match(/\/1\.html$/)) {
                url = url.replace(/\/1\.html$/, '.html');
            }

            let html = await request(url);
            let $ = cheerio.load(html);
            let list = [];

            $('div.item').each(function () {
                let video = rule.parseVideoCard($, this);
                if (video) {
                    list.push(video);
                }
            });

            return list;
        } catch (e) {
            console.log('一级错误:', e.message);
            return [];
        }
    },

    /**
     * 视频详情 (二级)
     * this.input - 视频ID
     * 返回视频详情对象
     */
    二级: async function () {
        let { input, request, HOST, cheerio } = this;

        try {
            let url = HOST + '/post/' + input + '.html';
            let html = await request(url);
            let $ = cheerio.load(html);

            // 基本信息
            let title = $('title').text()
                .replace(/\s*-\s*小鸭看看.*$/, '')
                .trim();

            let desc = $('meta[name="description"]').attr('content') || '';

            // 分类
            let typeName = '';
            $('div.m4-bread ol li').each(function (i) {
                if (i === 2) {
                    typeName = $(this).find('a').text().trim();
                }
            });

            // 封面图
            let pic = $('div.m4-detail img').attr('data-src')
                || $('div.m4-detail img').attr('src')
                || $('img.poster').attr('src')
                || '';
            if (pic) {
                if (pic.startsWith('//')) pic = 'https:' + pic;
                else if (pic.startsWith('/')) pic = HOST + pic;
            }

            // 解析播放源
            let playFromArr = [];
            let playUrlArr = [];

            $('div.source').each(function (i) {
                let $source = $(this);
                let dataVod = $source.attr('data-vod') || '';

                // 线路名称
                let sourceName = $source.find('span.name').text().trim();
                let quality = $source.find('span.res').text().trim();

                let fromName = sourceName.split('：')[0] || ('线路' + (i + 1));
                if (quality) {
                    fromName += ' [' + quality + ']';
                }

                // 剧集列表
                let episodes = [];
                $source.find('div.list a').each(function (j) {
                    let $ep = $(this);
                    let epName = $ep.text().trim() || ('第' + (j + 1) + '集');
                    let epIdx = $ep.attr('data-sou_idx');
                    if (epIdx === undefined) epIdx = j;

                    // 播放ID格式: dataVod_剧集索引
                    let playId = dataVod + '_' + epIdx;
                    episodes.push(epName + '$' + playId);
                });

                if (episodes.length > 0) {
                    playFromArr.push(fromName);
                    playUrlArr.push(episodes.join('#'));
                }
            });

            // 如果没找到播放源，尝试其他选择器
            if (playFromArr.length === 0) {
                $('[data-vod]').each(function (i) {
                    let $source = $(this);
                    let dataVod = $source.attr('data-vod') || '';

                    playFromArr.push('线路' + (i + 1));
                    playUrlArr.push('播放$' + dataVod + '_0');
                });
            }

            return {
                vod_id: input,
                vod_name: title,
                vod_pic: pic,
                vod_year: '',
                vod_area: '',
                vod_actor: '',
                vod_director: '',
                vod_content: desc,
                type_name: typeName,
                vod_play_from: playFromArr.join('$$$'),
                vod_play_url: playUrlArr.join('$$$')
            };
        } catch (e) {
            console.log('二级错误:', e.message);
            return {
                vod_id: input,
                vod_name: '加载失败',
                vod_pic: '',
                vod_content: e.message,
                vod_play_from: '',
                vod_play_url: ''
            };
        }
    },

    /**
     * 搜索
     * this.input - 搜索关键词
     * 由于网站搜索被Cloudflare拦截，通过遍历页面实现本地匹配
     * 返回搜索结果数组
     */
    搜索: async function () {
        let { input, request, HOST, cheerio } = this;

        try {
            let keyword = input.toLowerCase();
            let list = [];
            let seenIds = new Set();

            // 搜索范围：首页 + 主要分类
            let urls = [
                HOST,
                HOST + '/cat/10.html',
                HOST + '/cat/11.html',
                HOST + '/cat/13.html'
            ];

            for (let url of urls) {
                if (list.length >= 20) break;

                try {
                    let html = await request(url);
                    let $ = cheerio.load(html);

                    $('div.item').each(function () {
                        let video = rule.parseVideoCard($, this);
                        if (!video) return;

                        // 匹配关键词
                        if (!video.vod_name.toLowerCase().includes(keyword)) return;

                        // 去重
                        if (seenIds.has(video.vod_id)) return;
                        seenIds.add(video.vod_id);

                        list.push(video);
                    });
                } catch (e) {
                    continue;
                }
            }

            return list.slice(0, 20);
        } catch (e) {
            console.log('搜索错误:', e.message);
            return [];
        }
    },

    /**
     * 播放解析 (免嗅/lazy)
     * this.input - 播放ID (格式: dataVod_episodeIndex)
     * 返回播放信息对象
     */
    lazy: async function () {
        let { input, request, HOST } = this;

        try {
            // 如果已经是完整URL
            if (input.startsWith('http')) {
                return {
                    url: input,
                    parse: 0,
                    jx: 0
                };
            }

            // 解析播放ID
            // 格式: lineId_vodId_episodeIdx 或 lineId_vodId
            let parts = input.split('_');

            if (parts.length >= 2) {
                let lineId = parts[0];
                let vodId = parts[1];
                let epIdx = parts[2] || '0';

                // 构造可能的播放API请求
                // 由于网站播放机制需要进一步分析，暂时返回需要解析

                // 尝试请求可能的播放接口
                // let playApiUrl = HOST + '/api/play/' + lineId + '/' + vodId + '/' + epIdx;
                // let data = await request(playApiUrl);

                // 返回需要客户端解析
                return {
                    url: input,
                    parse: 1,
                    jx: 1  // 需要嗅探
                };
            }

            // 无法解析
            return {
                url: input,
                parse: 1,
                jx: 1
            };
        } catch (e) {
            console.log('lazy错误:', e.message);
            return {
                url: '',
                parse: 1,
                jx: 1
            };
        }
    },

    // ════════════════════════════════════════════════════════════
    //                        本地代理 (可选)
    // ════════════════════════════════════════════════════════════

    // proxy_rule: `js:
    //     log(input);
    //     // input = [200, 'application/vnd.apple.mpegurl', m3u8Content];
    // `
};
