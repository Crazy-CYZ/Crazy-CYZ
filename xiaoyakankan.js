/**
 * 小鸭看看 - drpyS格式源
 * 可直接通过GitHub raw链接导入TVBox/影视壳子
 * 使用方式: 
 *   drpyS服务器: http://你的drpyS地址/api/源名
 *   或直接配置raw链接
 */

var rule = {
    类型: '影视',
    title: '小鸭看看',
    host: 'https://xiaoyakankan.com',
    homeUrl: '/',
    url: '/cat/fyclass/fypage.html',
    searchUrl: '',  // 网站无原生搜索
    searchable: 0,
    quickSearch: 0,
    filterable: 1,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://xiaoyakankan.com/'
    },
    timeout: 10000,

    // 静态分类
    class_name: '电影&连续剧&综艺&动漫&福利',
    class_url: '10&11&12&13&15',

    // 筛选配置
    filter: {
        '10': [
            {
                key: 'class', name: '分类', value: [
                    { n: '全部', v: '10' }, { n: '动作片', v: '1001' }, { n: '喜剧片', v: '1002' },
                    { n: '爱情片', v: '1003' }, { n: '科幻片', v: '1004' }, { n: '恐怖片', v: '1005' },
                    { n: '剧情片', v: '1006' }, { n: '战争片', v: '1007' }, { n: '悬疑片', v: '1016' }
                ]
            }
        ],
        '11': [
            {
                key: 'class', name: '分类', value: [
                    { n: '全部', v: '11' }, { n: '国产剧', v: '1101' }, { n: '韩国剧', v: '1103' },
                    { n: '欧美剧', v: '1104' }, { n: '日本剧', v: '1106' }, { n: '港台剧', v: '1110' }
                ]
            }
        ],
        '12': [
            {
                key: 'class', name: '分类', value: [
                    { n: '全部', v: '12' }, { n: '内地综艺', v: '1201' }, { n: '港台综艺', v: '1202' },
                    { n: '日韩综艺', v: '1203' }, { n: '欧美综艺', v: '1204' }
                ]
            }
        ],
        '13': [
            {
                key: 'class', name: '分类', value: [
                    { n: '全部', v: '13' }, { n: '国产动漫', v: '1301' }, { n: '日韩动漫', v: '1302' },
                    { n: '欧美动漫', v: '1303' }
                ]
            }
        ],
        '15': []
    },
    filter_url: '/cat/{{fl.class}}/fypage.html',

    // 推荐列表
    推荐: async function () {
        let { HOST, request, cheerio } = this;
        let html = await request(HOST);
        let $ = cheerio.load(html);
        let videos = [];

        $('div.item').each(function () {
            let $item = $(this);
            let href = $item.find('a.link').attr('href') || '';
            let vodId = href.match(/\/post\/([^.]+)\.html/)?.[1] || '';
            if (!vodId) return;

            let pic = $item.find('img').attr('data-src') || $item.find('img').attr('src') || '';
            if (pic && !pic.startsWith('http')) pic = 'https:' + pic;

            videos.push({
                vod_id: vodId,
                vod_name: $item.find('a.title').text().trim(),
                vod_pic: pic,
                vod_remarks: $item.find('.tag1').text().trim() || $item.find('.tag2').text().trim()
            });
        });

        return videos.slice(0, 20);
    },

    // 一级分类列表
    一级: async function () {
        let { input, HOST, request, cheerio, MY_CATE, MY_FL } = this;

        // 构造URL
        let catId = MY_FL?.class || MY_CATE;
        let page = input.match(/\/(\d+)\.html$/)?.[1] || '1';
        let url = HOST + '/cat/' + catId + '.html';
        if (page !== '1') url = HOST + '/cat/' + catId + '/' + page + '.html';

        let html = await request(url);
        let $ = cheerio.load(html);
        let videos = [];

        $('div.item').each(function () {
            let $item = $(this);
            let href = $item.find('a.link').attr('href') || '';
            let vodId = href.match(/\/post\/([^.]+)\.html/)?.[1] || '';
            if (!vodId) return;

            let pic = $item.find('img').attr('data-src') || $item.find('img').attr('src') || '';
            if (pic && !pic.startsWith('http')) pic = 'https:' + pic;

            videos.push({
                vod_id: vodId,
                vod_name: $item.find('a.title').text().trim(),
                vod_pic: pic,
                vod_remarks: $item.find('.tag1').text().trim() || $item.find('.tag2').text().trim()
            });
        });

        return videos;
    },

    // 二级详情页
    二级: async function () {
        let { input, HOST, request, cheerio } = this;
        let url = HOST + '/post/' + input + '.html';
        let html = await request(url);
        let $ = cheerio.load(html);

        let title = $('title').text().replace(' - 小鸭看看', '').trim();
        let desc = $('meta[name="description"]').attr('content') || '';
        let typeName = $('div.m4-bread ol li:nth-child(3) a').text().trim();

        let pic = $('div.m4-detail img').attr('data-src') || $('div.m4-detail img').attr('src') || '';
        if (pic && !pic.startsWith('http')) pic = 'https:' + pic;

        // 解析播放源
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
                let $ep = $(this);
                let epName = $ep.text().trim();
                let epIdx = $ep.attr('data-sou_idx') || j;
                episodes.push(epName + '$' + dataVod + '_' + epIdx);
            });

            if (episodes.length > 0) {
                playFromArr.push(fromName);
                playUrlArr.push(episodes.join('#'));
            }
        });

        return {
            vod_id: input,
            vod_name: title,
            vod_pic: pic,
            vod_content: desc,
            type_name: typeName,
            vod_play_from: playFromArr.join('$$$'),
            vod_play_url: playUrlArr.join('$$$')
        };
    },

    // 搜索 (通过遍历分类实现基础搜索)
    搜索: async function () {
        let { input, HOST, request, cheerio } = this;
        let keyword = input.toLowerCase();
        let results = [];

        // 从首页搜索
        let html = await request(HOST);
        let $ = cheerio.load(html);

        $('div.item').each(function () {
            let $item = $(this);
            let name = $item.find('a.title').text().trim();
            if (!name.toLowerCase().includes(keyword)) return;

            let href = $item.find('a.link').attr('href') || '';
            let vodId = href.match(/\/post\/([^.]+)\.html/)?.[1] || '';
            if (!vodId) return;

            let pic = $item.find('img').attr('data-src') || $item.find('img').attr('src') || '';
            if (pic && !pic.startsWith('http')) pic = 'https:' + pic;

            results.push({
                vod_id: vodId,
                vod_name: name,
                vod_pic: pic,
                vod_remarks: $item.find('.tag1').text().trim()
            });
        });

        return results.slice(0, 20);
    },

    // 免嗅播放
    lazy: async function () {
        let { input, HOST, request } = this;

        // 如果是直接URL
        if (input.startsWith('http')) {
            return { url: input, parse: 0 };
        }

        // 播放ID格式: 线路ID_视频ID_剧集索引
        // 需要进一步分析网站播放机制
        // 当前返回需要解析标记
        return {
            url: input,
            parse: 1,
            jx: 1
        };
    }
};
