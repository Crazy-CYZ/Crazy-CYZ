<?php
/**
 * 小鸭看看 - PHP T4源
 * 
 * 适用于: 影视+、yt001本地服务
 * 
 * API参数:
 *   ?t=分类ID           - 获取分类列表
 *   ?t=分类ID&pg=页码   - 获取分类分页
 *   ?ids=视频ID         - 获取视频详情
 *   ?flag=线路&play=URL - 获取播放地址
 *   ?wd=关键词          - 搜索
 *   无参数              - 返回分类菜单
 */

header('Content-Type: application/json; charset=utf-8');

// ========== 配置 ==========
$host = 'https://xiaoyakankan.com';
$headers = [
    'User-Agent: Mozilla/5.0 (Linux; Android 12; SM-G9880) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8',
    'Referer: https://xiaoyakankan.com/'
];

// ========== 分类配置 ==========
$categories = [
    ['type_id' => '10', 'type_name' => '电影'],
    ['type_id' => '11', 'type_name' => '连续剧'],
    ['type_id' => '12', 'type_name' => '综艺'],
    ['type_id' => '13', 'type_name' => '动漫'],
    ['type_id' => '15', 'type_name' => '福利'],
    // 子分类
    ['type_id' => '1001', 'type_name' => '动作片'],
    ['type_id' => '1002', 'type_name' => '喜剧片'],
    ['type_id' => '1003', 'type_name' => '爱情片'],
    ['type_id' => '1004', 'type_name' => '科幻片'],
    ['type_id' => '1005', 'type_name' => '恐怖片'],
    ['type_id' => '1006', 'type_name' => '剧情片'],
    ['type_id' => '1007', 'type_name' => '战争片'],
    ['type_id' => '1016', 'type_name' => '悬疑片'],
    ['type_id' => '1027', 'type_name' => '4K电影'],
    ['type_id' => '1101', 'type_name' => '国产剧'],
    ['type_id' => '1102', 'type_name' => '香港剧'],
    ['type_id' => '1103', 'type_name' => '韩国剧'],
    ['type_id' => '1104', 'type_name' => '欧美剧'],
    ['type_id' => '1106', 'type_name' => '日本剧'],
    ['type_id' => '1108', 'type_name' => '泰国剧'],
    ['type_id' => '1301', 'type_name' => '国产动漫'],
    ['type_id' => '1302', 'type_name' => '日韩动漫'],
    ['type_id' => '1303', 'type_name' => '欧美动漫']
];

// ========== 获取参数 ==========
$t = $_GET['t'] ?? null;         // 分类ID
$pg = $_GET['pg'] ?? 1;          // 页码
$ids = $_GET['ids'] ?? null;     // 视频ID
$flag = $_GET['flag'] ?? null;   // 播放线路
$play = $_GET['play'] ?? null;   // 播放地址
$wd = $_GET['wd'] ?? null;       // 搜索关键词

// ========== HTTP请求函数 ==========
function httpGet($url, $headers = []) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_ENCODING, 'gzip, deflate');
    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

// ========== 解析视频卡片 ==========
function parseVideoCards($html, $host) {
    $videos = [];
    
    // 匹配视频卡片
    preg_match_all('/<div class="item"[^>]*>(.*?)<\/div>\s*<\/div>/s', $html, $items);
    
    if (empty($items[0])) {
        // 尝试另一种匹配方式
        preg_match_all('/<a[^>]*href="\/post\/([^"\.]+)\.html"[^>]*>.*?<img[^>]*(?:data-src|src)="([^"]+)"[^>]*>.*?<\/a>.*?class="title"[^>]*>([^<]+)/s', $html, $matches, PREG_SET_ORDER);
        
        foreach ($matches as $m) {
            $pic = $m[2];
            if (strpos($pic, '//') === 0) $pic = 'https:' . $pic;
            
            $videos[] = [
                'vod_id' => $m[1],
                'vod_name' => trim($m[3]),
                'vod_pic' => $pic,
                'vod_remarks' => ''
            ];
        }
    } else {
        foreach ($items[0] as $item) {
            // 提取链接和ID
            if (!preg_match('/href="\/post\/([^"\.]+)\.html"/', $item, $idMatch)) continue;
            $vodId = $idMatch[1];
            
            // 提取标题
            $title = '';
            if (preg_match('/class="title"[^>]*>([^<]+)/', $item, $titleMatch)) {
                $title = trim($titleMatch[1]);
            }
            
            // 提取封面图
            $pic = '';
            if (preg_match('/(?:data-src|src)="([^"]+)"/', $item, $picMatch)) {
                $pic = $picMatch[1];
                if (strpos($pic, '//') === 0) $pic = 'https:' . $pic;
                if (strpos($pic, '/') === 0) $pic = $host . $pic;
            }
            
            // 提取备注
            $remarks = '';
            if (preg_match('/class="tag1"[^>]*>([^<]+)/', $item, $remMatch)) {
                $remarks = trim($remMatch[1]);
            } elseif (preg_match('/class="tag2"[^>]*>([^<]+)/', $item, $remMatch)) {
                $remarks = trim($remMatch[1]);
            }
            
            $videos[] = [
                'vod_id' => $vodId,
                'vod_name' => $title,
                'vod_pic' => $pic,
                'vod_remarks' => $remarks
            ];
        }
    }
    
    return $videos;
}

// ========== 1. 播放解析 ==========
if ($flag !== null && $play !== null) {
    echo json_encode([
        'header' => [
            'User-Agent' => 'Mozilla/5.0 (Linux; Android 12; SM-G9880) AppleWebKit/537.36',
            'Referer' => $host . '/'
        ],
        'url' => $play,
        'parse' => 1,  // 需要解析
        'jx' => 1      // 需要嗅探
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// ========== 2. 搜索 ==========
if ($wd !== null) {
    $keyword = strtolower($wd);
    $videos = [];
    $seenIds = [];
    
    // 搜索范围：首页 + 主要分类
    $urls = [
        $host,
        $host . '/cat/10.html',
        $host . '/cat/11.html',
        $host . '/cat/13.html'
    ];
    
    foreach ($urls as $url) {
        if (count($videos) >= 20) break;
        
        $html = httpGet($url, $GLOBALS['headers']);
        if (!$html) continue;
        
        $pageVideos = parseVideoCards($html, $host);
        
        foreach ($pageVideos as $video) {
            // 匹配关键词
            if (strpos(strtolower($video['vod_name']), $keyword) === false) continue;
            
            // 去重
            if (in_array($video['vod_id'], $seenIds)) continue;
            $seenIds[] = $video['vod_id'];
            
            $videos[] = $video;
            
            if (count($videos) >= 20) break;
        }
    }
    
    echo json_encode(['list' => $videos], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// ========== 3. 视频详情 ==========
if ($ids !== null) {
    $detailUrl = $host . '/post/' . $ids . '.html';
    $html = httpGet($detailUrl, $headers);
    
    if (!$html) {
        echo json_encode(['list' => []], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // 标题
    $title = '';
    if (preg_match('/<title>([^<]+)<\/title>/', $html, $m)) {
        $title = preg_replace('/\s*-\s*小鸭看看.*$/', '', $m[1]);
    }
    
    // 封面图
    $pic = '';
    if (preg_match('/class="m4-detail"[^>]*>.*?<img[^>]*(?:data-src|src)="([^"]+)"/s', $html, $m)) {
        $pic = $m[1];
        if (strpos($pic, '//') === 0) $pic = 'https:' . $pic;
    }
    
    // 简介
    $desc = '';
    if (preg_match('/<meta name="description" content="([^"]+)"/', $html, $m)) {
        $desc = $m[1];
    }
    
    // 解析播放源
    $playFromArr = [];
    $playUrlArr = [];
    
    preg_match_all('/<div class="source"[^>]*data-vod="([^"]*)"[^>]*>(.*?)<\/div>\s*<\/div>/s', $html, $sources, PREG_SET_ORDER);
    
    foreach ($sources as $i => $source) {
        $dataVod = $source[1];
        $sourceHtml = $source[2];
        
        // 线路名称
        $fromName = '线路' . ($i + 1);
        if (preg_match('/class="name"[^>]*>([^<]+)/', $sourceHtml, $m)) {
            $fromName = trim(preg_replace('/[:：].*$/', '', $m[1]));
        }
        
        // 画质
        if (preg_match('/class="res"[^>]*>([^<]+)/', $sourceHtml, $m)) {
            $fromName .= ' [' . trim($m[1]) . ']';
        }
        
        // 剧集列表
        $episodes = [];
        preg_match_all('/<a[^>]*data-sou_idx="([^"]*)"[^>]*>([^<]+)<\/a>/', $sourceHtml, $eps, PREG_SET_ORDER);
        
        if (empty($eps)) {
            // 尝试另一种匹配
            preg_match_all('/<a[^>]*>([^<]+)<\/a>/', $sourceHtml, $eps2);
            foreach ($eps2[1] as $j => $epName) {
                $playId = $dataVod . '_' . $j;
                $episodes[] = trim($epName) . '$' . $playId;
            }
        } else {
            foreach ($eps as $ep) {
                $epIdx = $ep[1];
                $epName = trim($ep[2]);
                $playId = $dataVod . '_' . $epIdx;
                $episodes[] = $epName . '$' . $playId;
            }
        }
        
        if (!empty($episodes)) {
            $playFromArr[] = $fromName;
            $playUrlArr[] = implode('#', $episodes);
        }
    }
    
    // 如果没找到播放源
    if (empty($playFromArr)) {
        $playFromArr = ['默认线路'];
        $playUrlArr = ['播放$' . $ids . '_0'];
    }
    
    $result = [
        'vod_id' => $ids,
        'vod_name' => $title,
        'vod_pic' => $pic,
        'vod_year' => '',
        'vod_area' => '',
        'vod_remarks' => '',
        'vod_actor' => '',
        'vod_director' => '',
        'vod_content' => $desc,
        'type_name' => '',
        'vod_play_from' => implode('$$$', $playFromArr),
        'vod_play_url' => implode('$$$', $playUrlArr)
    ];
    
    echo json_encode(['list' => [$result]], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// ========== 4. 分类列表 ==========
if ($t !== null) {
    $pg = intval($pg);
    
    // 构造URL
    if ($pg == 1) {
        $url = $host . '/cat/' . $t . '.html';
    } else {
        $url = $host . '/cat/' . $t . '/' . $pg . '.html';
    }
    
    $html = httpGet($url, $headers);
    
    if (!$html) {
        echo json_encode(['list' => []], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $videos = parseVideoCards($html, $host);
    
    // 尝试获取总页数
    $pagecount = 999;
    if (preg_match_all('/\/cat\/' . $t . '\/(\d+)\.html/', $html, $pages)) {
        $pagecount = max(array_map('intval', $pages[1]));
    }
    
    echo json_encode([
        'list' => $videos,
        'page' => $pg,
        'pagecount' => $pagecount,
        'limit' => count($videos),
        'total' => $pagecount * count($videos)
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// ========== 5. 首页/分类菜单 ==========
// 同时返回分类和首页推荐视频
$homeHtml = httpGet($host, $headers);
$homeVideos = [];

if ($homeHtml) {
    $homeVideos = parseVideoCards($homeHtml, $host);
}

echo json_encode([
    'class' => $categories,
    'list' => array_slice($homeVideos, 0, 30)
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
