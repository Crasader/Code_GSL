-- local ffi = require('ffi');

--牌型
local CT_SINGLE                     =   1                               --单牌类型 乌龙
local CT_ONE_DOUBLE                 =   2                               --只有一对
local CT_FIVE_TWO_DOUBLE            =   3                               --两对牌型
local CT_THREE                      =   4                               --三张牌型
local CT_FIVE_MIXED_FLUSH_NO_A      =   5                               --顺子
local CT_FIVE_FLUSH                 =   6                               --同花五牌
local CT_FIVE_THREE_DEOUBLE         =   7                               --三条一对
local CT_FIVE_FOUR_ONE              =   8                               --四带一张
local CT_FIVE_STRAIGHT_FLUSH_NO_A   =   9                               --同花顺
local CT_FIVE_FIVE_ONE              =  10                               --5同


--是否只比较点数
-- true  只比较牌大小,不比较花色
-- false 先比较牌大小,再比较花色
local bOnlyCompareNumber = false;    

--支持5人以上的牌型比较
-- 1 -新版本 0-老版本(4人)
local bFuncVersion =  1;

local function num2hex(arr)
    local newarr = {};

    for i,v in ipairs(arr) do
        table.insert(newarr, string.format("0x%x", v));
    end

    return newarr;
end

--[[ 按十三水的规则比较1-13的大小
    return 1: a > b
    return 0: a == b
    return -1: a < b
]]
local function singleCardCompare(a, b)
    if a ~= b and (a ~= 1 and b ~=1) then
        if a > b then
            return 1;
        else
            return -1;
        end
    elseif a ~= b and (a == 1 or b == 1) then
        if a == 1 then
            return 1;
        else
            return -1;
        end
    elseif a == b then
        return 0;
    end
end

--[[ 比较牌面值
    return false: a >= b
    return true:  a < b
]]
local function singleCardCompareValSmaller(a, b)
    local res = singleCardCompare(a%0x10, b%0x10);
    if res >= 0 then
        return false
    else
        return true;
    end
end

-- 拷贝数据
local function copy_array(arr)
    local newarr = {};
    for i,v in ipairs(arr) do
        if type(v) == type({}) and #v ~= 0 then
            table.insert(newarr, copy_array(v));
        else
            table.insert(newarr, v);
        end
    end
    return newarr;
end

-- 合并数据
local function merge_array(a1, a2)
    local new = {};
    for i,v in ipairs(a1 or {}) do
        table.insert(new, v);
    end
    for i,v in ipairs(a2 or {}) do
        table.insert(new, v);
    end
    return new;
end

-- 分隔数组
local function split_array(arr, st, en)
    local newarr = {};
    en = en or #arr;
    for i = en, st, -1 do
        table.insert(newarr, 1, arr[i]);
        table.remove(arr, i);
    end
    return newarr, arr;
end

-- 根据位置移除值
local function rm_arr_by_pos(arr, pos_arr)
    local rm_arr = {};
    table.sort(pos_arr, function (a1,a2) return a1 > a2; end);
    for i,pos in ipairs(pos_arr) do
        table.insert(rm_arr, arr[pos]);
        table.remove(arr, pos);
    end
    return rm_arr;
end

-- 根据位置获取值
local function get_arr_by_pos(arr, pos_arr)
    local new = {};
    for i,pos in ipairs(pos_arr) do
        table.insert(new, arr[pos]);
    end
    return new;
end

-- 获取花色的桶
-- 输入:get_hua_bucket({0x1, 0x02, 0x11, 0x21, 0x31, 0x32})
-- 输出:{[0] = {1, 2}, [0x10] = {3}, [0x20] = {4}, [0x30] = {5, 6}}
local function get_hua_bucket(cards)
    local bucket = {};
    for i = 1, 4, 1 do table.insert(bucket, {}); end

    for i = 1, #cards, 1 do
        local val = math.floor((cards[i]+0x10)/0x10);
        table.insert(bucket[val], i);
    end
    return bucket;
end

-- 根据位置获取值，再根据值获取位置，并形成桶
-- 例:get_pos_bucket({0x1, 0x11, 0x21, 0x33, 0x23, 0x15, 0x16}, {1,2,3,4,5})
-- 输出{[1] = {1,2,3}, [3] = {4,5}}
local function get_ppos_bucket(cards, pos_arr)
    local bucket = {};

    for i = 1, 13, 1 do table.insert(bucket, {}); end

    for i = 1, #pos_arr, 1 do
        local val = cards[pos_arr[i]]%0x10;
        table.insert(bucket[val], pos_arr[i]);
    end
    return bucket;
end

-- 获取同值的位置，并形成桶
-- 例:get_pos_bucket({0x1, 0x11, 0x21, 0x33, 0x23}, 5), 输出{[1] = {1,2,3}, [3] = {4,5}}
local function get_pos_bucket(cards, length)
    local bucket = {};

    for i = 1, 13, 1 do table.insert(bucket, {}); end

    for i = 1, #cards, 1 do
        local val = cards[i]%0x10;
        table.insert(bucket[val], i);
    end
    return bucket;
end

-- CN/M组合获取
-- 例:make_ranks({1,2,3},2), 输出{{1,2}, {2,3}, {1,3}}
-- 例:make_ranks({1,2,3},1), 输出{{1}, {2}, {3}}
local function make_ranks(cards, num)
    if #cards == num then
        return {cards};
    end
    local ranks = {};
    local count = #cards - num + 1;
    for i = 1, count, 1 do
        if num > 1 then
            local newcards = copy_array(cards);
            local rmcards, leftcards = split_array(newcards, 1, i);
            local child_ranks = make_ranks(leftcards, num-1);
            for ii,vv in ipairs(child_ranks) do
                table.insert(vv, 1, cards[i])
                table.insert(ranks, vv);
            end

        elseif num == 1 then
            local rank = {cards[i]};
            table.insert(ranks, rank);
        end
    end
    return ranks;
end

-- 判断是否同花
local function isTHua(cards, pos_arr)
    local newcards = get_arr_by_pos(cards, pos_arr);

    local bucket = get_hua_bucket(newcards);

    for i,v in ipairs(bucket) do
        if #v >= 5 then return true; end
    end
    return false;
end

-- 判断是否是顺子
local function isShunZi(cards, pos_arr)
    local newcards = get_arr_by_pos(cards, pos_arr);
    local bucket = get_pos_bucket(newcards);

    local cnt = 0;

    for i,v in ipairs(bucket) do
        if #v ~= 0 then
            cnt = cnt + 1;
            if cnt >= 5 then return true; end
        else
            cnt = 0;
        end
    end
    -- 最后还有4次连续说明是: 10,J,Q,K
    if cnt == 4 then
        -- 判断A存在则是顺子
        if #bucket[1] ~= 0 then
            return true;
        end
    end
    return false;
end

-- 识别5张，8人场，两副牌会有5张相同
local function regWTongFunc(cards)
    local bucket = get_pos_bucket(cards);

    local wtong_arr = {};
    for i,v in ipairs(bucket) do
        if #v > 5 then
            local wtongs = make_ranks(cards, 5);
            for ii,vv in ipairs(wtong_arr) do
                table.insert(wtong_arr, vv);
            end
        elseif #v == 5 then
            table.insert(wtong_arr, v);
        end
    end

    local ranks = {};
    for i,wtong in ipairs(wtong_arr) do
        local newcards = copy_array(cards);
        local rmcards = rm_arr_by_pos(newcards, wtong);
        table.insert(ranks, {cards = rmcards, next = newcards});
    end

    return ranks;
end

-- 识别同花顺，存在大于同花顺则失败
local function regTHShunFunc(cards)
    local bucket_hua = get_hua_bucket(cards);
    local thshun_arr = {};
    for i,v in ipairs(bucket_hua) do
        if #v >=5 then
            local bucket_pos = get_ppos_bucket(cards, v);
            local thshun_pos = {};

            for ii,vv in ipairs(bucket_pos) do
                if #vv ~= 0 then
                    table.insert(thshun_pos, vv[1]);
                    if #thshun_pos == 5 then
                        table.insert(thshun_arr, copy_array(thshun_pos));
                        table.remove(thshun_pos, 1);
                    end
                else
                    thshun_pos = {};
                end
            end

            -- 长度等于4说明有 10,J,Q,K
            if #thshun_pos == 4 then
                -- 如果有A 则是同花顺
                if #bucket_pos[1] ~= 0 then
                    table.insert(thshun_pos, bucket_pos[1][1]);
                    table.insert(thshun_arr, thshun_pos);
                end
            end
        end
    end

    local ranks = {};
    for i,thshun in ipairs(thshun_arr) do
        local newcards = copy_array(cards);
        local rmcards = rm_arr_by_pos(newcards, thshun);
        table.insert(ranks, {cards = rmcards, next = newcards});
    end

    return ranks;
end

-- 识别四张，铁支
local function regTZhiFunc(cards)
    local bucket = get_pos_bucket(cards);    
    local tzhi_arr = {};
    local wulong = {};

    for i,v in ipairs(bucket) do
        if #v > 4 then
            local tzhis = make_ranks(v, 4);
            for i,v in ipairs(tzhis) do
                table.insert(tzhi_arr, v);
            end
        elseif #v == 4 then
            table.insert(tzhi_arr, v);
        end
    end

    local ranks = {};
    for i,tzhi in ipairs(tzhi_arr) do
        local newcards = copy_array(cards);
        local rmcards = rm_arr_by_pos(newcards, tzhi);
        table.insert(ranks, {cards = rmcards, next = newcards});
    end

    return ranks;
end

-- 识别葫芦，三带二
local function regHLuFunc(cards)
    local bucket = get_pos_bucket(cards);

    local san_arr = {};
    local same_arr = {};
    local dui_arr = {};
    local tzhis = {};

    for i,v in ipairs(bucket) do
        if #v > 4 then
            return {};
        elseif #v == 4 then
            tzhis[i] = true;
            local sans = make_ranks(v, 3);
            for i,v in ipairs(sans) do
                sans.val = i;
                table.insert(san_arr, v);
            end
        elseif #v == 3 then
            v.val = i;
            table.insert(san_arr, v);
        elseif #v == 2 then
            table.insert(dui_arr, v);
        end
    end

    if #san_arr == 0 or #san_arr == 1 and #dui_arr == 0 then
        return {};
    end

    local ranks = {};
    for i,san in ipairs(san_arr) do
        for ii,dui in ipairs(dui_arr) do
            local newcards = copy_array(cards);
            local hlu = merge_array(dui, san);
            local rmcards = rm_arr_by_pos(newcards, hlu);
            table.insert(ranks, {cards = rmcards, next = newcards});
        end

        for ii,duis in ipairs(san_arr) do
            -- 判断三张的值相等不相等
            if duis.val ~= san.val and tzhis[duis.val] == nil then
                local dui_arr = make_ranks(duis, 2);
                for iii,dui in ipairs(dui_arr) do
                    local newcards = copy_array(cards);
                    local hlu = merge_array(dui, san);
                    local rmcards = rm_arr_by_pos(newcards, hlu);
                    table.insert(ranks, {cards = rmcards, next = newcards});
                end
            end
        end
    end

    return ranks;
end

-- 识别同花，存在大于同花则失败
local function regTHuaFunc(cards)
    -- 只要同花, 同花顺都不要
    local bucket = get_hua_bucket(cards);
    local ranks = {};

    for i,v in ipairs(bucket) do
        if #v >= 5 then
            -- 存在同花
            local thua_ranks = make_ranks(v, 5);
            for ii,thua in ipairs(thua_ranks) do
                if not isShunZi(cards, thua) then
                    local newcards = copy_array(cards);
                    local rmcards = rm_arr_by_pos(newcards, thua);
                    table.insert(ranks, {cards = rmcards, next = newcards});
                end
            end
        end
    end
    return ranks;
end

-- 识别顺子，存在大于顺子则失败
local function regShZiFunc(cards)
    local bucket = get_pos_bucket(cards)

    local cont_pos = {};
    local shunzi_arr = {};

    for i,v in ipairs(bucket) do
        if #v ~= 0 then
            table.insert(cont_pos, v[1]);
            -- 获取一个顺子
            if #cont_pos == 5 then
                -- 取出顺子
                local shunzi = copy_array(cont_pos);

                if not isTHua(cards, shunzi) then
                    table.insert(shunzi_arr, shunzi);
                end
                table.remove(cont_pos, 1);
            end
        else
            cont_pos = {};
        end
    end

    -- 如果最后还有连续4次相连说明是: 10 J Q K
    if #cont_pos == 4 then
        -- A存在
        if #bucket[1] ~= 0 then
            table.insert(cont_pos, bucket[1][1]);
            if not isTHua(cards, cont_pos) then
                table.insert(shunzi_arr, cont_pos);
            end
        end
    end

    local ranks = {};
    for i,shunzi in ipairs(shunzi_arr) do
        local newcards = copy_array(cards);
        local rmcards = rm_arr_by_pos(newcards, shunzi);
        table.insert(ranks, {cards = rmcards, next = newcards});
    end

    return ranks;
end

-- 识别三张，存在大于三张则失败
local function regSZhangFunc(cards, lv)
    local bucket = get_pos_bucket(cards);

    local max_val;
    local wulong = {};

    for i,v in ipairs(bucket) do
        -- 说三张就三张, 不是三张或大于三张我不要, 谢谢
        if #v > 3 then
            return {};
        elseif #v == 3 then
            if max_val ~= 1 then
                max_val = i;
            end
        elseif #v == 1 then
            table.insert(wulong, v[1]);
        end
    end

    local ranks = {};
    if max_val then
        -- 取两张最小的散牌
        local splitcards;

        if lv < 3 then
            -- 没有散牌就组不成5张的三张类型的牌组
            if #wulong < 2 then return {}; end
            -- 取出两张乌龙
            table.sort(wulong, function (a, b) return singleCardCompareValSmaller(cards[a]%0x10, cards[b]%0x10) end);
            splitcards = split_array(wulong, 1, 2);
        end

        local newcards = copy_array(cards);
        local szhang = merge_array(bucket[max_val], splitcards);
        local rmcards = rm_arr_by_pos(newcards, szhang);
        table.insert(ranks, {cards = rmcards, next = newcards});
    end
    return ranks;
end

-- 识别两对，存在待遇两对则失败
local function regDDuiFunc(cards, lv)
    -- 三张实在凑不出两对
    if lv == 3 then
        return {};
    end

    local bucket = get_pos_bucket(cards);
    local max_val;
    local min_val;
    local min_single;
    -- 取最大的一个对子 + 最小的对子
    for i,v in ipairs(bucket) do
        -- 说对子就对子, 不是对子, 不是对子或大于对子我不要, 谢谢
        if #v > 2 then
            return {};
        elseif #v == 2 then
            if max_val ~= 1 then
                max_val = i;
            end

            -- 取除1以外的最小牌
            if not min_val or min_val == 1 then
                min_val = i;
            end

        elseif #v == 1 then
            -- 取除1以外的最小牌
            if not min_single or min_single == 1 then
                min_single = i
            end
        end
    end

    local ranks = {};

    if min_val and max_val and min_val ~= max_val then
        local ddui_pos = merge_array(bucket[max_val], bucket[min_val]);
        local newcards = copy_array(cards);
        local rmcards = rm_arr_by_pos(newcards, ddui_pos);
        table.insert(ranks, {cards = rmcards, next = newcards});
    end

    return ranks;
end

-- 识别一对，存在大于一对则失败
local function regDuiFunc(cards, lv)
    local bucket = get_pos_bucket(cards);

    local max_val;
    local wulong = {};

    for i,v in ipairs(bucket) do
        -- 说对子就对子, 不是对子, 不是对子或大于对子我不要, 谢谢
        if #v > 2 then
            return {};
        elseif #v == 2 then
            -- 对A 最大
            if max_val ~= 1 then
                max_val = i;
            end
        elseif #v == 1 then
            table.insert(wulong, v[1]);
        end
    end

    local ranks = {};

    if max_val then
        -- 中道取三张最小的散牌
        -- 头道取一张最小的散牌
        local split_len = lv == 3 and 1 or 3;
        table.sort(wulong, function (a, b) return singleCardCompareValSmaller(cards[a]%0x10, cards[b]%0x10) end);
        local splitcards = split_array(wulong, 1, split_len);

        local newcards = copy_array(cards);
        local dui = merge_array(bucket[max_val], splitcards);
        local rmcards = rm_arr_by_pos(newcards, dui);
        table.insert(ranks, {cards = rmcards, next = newcards});
    end

    return ranks;
end

local function regWLongFunc(cards, lv)
    local bucket = get_pos_bucket(cards);

    for i,v in ipairs(bucket) do
        -- 说乌龙就乌龙, 不是乌龙我不要, 谢谢
        if #v > 1 then
            return {};
        end
    end

    local newcards = copy_array(cards);

    if lv == 3 then
        table.sort(newcards, singleCardCompareValSmaller);
        local three_cards, last_cards = split_array(newcards, #newcards-2, #newcards);

        return {{cards = three_cards, next = last_cards}};
    else
        table.sort(newcards, singleCardCompareValSmaller);

        local max_card = newcards[#newcards];
        table.remove(newcards, #newcards);

        local splitcards, leftcards = split_array(newcards, 1, 4);
        table.insert(splitcards, 1, max_card);

        return {{cards = splitcards, next = leftcards}};
    end
end
-- 类型排序
local regTypeList = {
    {get = regWLongFunc; tp = 1; weight=0;};
    {get = regDuiFunc; tp = 2; weight=2;};
    {get = regDDuiFunc; tp = 3; weight=3;};
    {get = regSZhangFunc; tp = 4; weight=4;};
    {get = regShZiFunc; tp = 5; weight=5;};
    {get = regTHuaFunc; tp = 6; weight=6;};
    {get = regHLuFunc; tp = 7; weight=7;};
    {get = regTZhiFunc; tp = 8; weight=8;};
    {get = regTHShunFunc; tp = 9; weight=9;};
    {get = regWTongFunc; tp = 10; weight=10;};
};
-- 递归识别
local function calcTypeRanks(cards, lv, tp)
    if not lv then lv = 1; end
    if not tp then tp = #regTypeList; end

    if lv > 3 then
        return cards;
    elseif lv == 3 and tp > 4 then
        tp = 4;
    end

    -- 尾道不获取乌龙类型的牌
    local bottom_tp = 1;
    if lv == 1 then bottom_tp = 2; end

    local ranks = {};
    for i = tp, bottom_tp, -1 do
        local regType = regTypeList[i];
        local tranks = regType.get(cards, lv);

        if #tranks ~= 0 then
            for ii, trank in ipairs(tranks) do
                local rank = {};
                -- debug
                rank.cards = trank.cards;
                rank.tp = i;
                rank.next = calcTypeRanks(trank.next, lv + 1, i);
                table.insert(ranks, rank);
            end
        end
    end

    return ranks;
end
--------------------------------------以上部分不依赖库---------------------------------------
--------------------------------------以上部分不依赖库---------------------------------------
--------------------------------------以上部分不依赖库---------------------------------------
--[[ 
    return 2: c1 > c2
    return 1: c1 < c2
    return 0: c1 == c2
]]
local function compareCard(c1, c2)
    local bc1 = ffi.new(string.format("BYTE[%d]", #c1), unpack(c1));
    local bc2 = ffi.new(string.format("BYTE[%d]", #c2), unpack(c2));
    local res = lib.CompareCard(bc1, bc2, #c1, #c2, bOnlyCompareNumber, bFuncVersion);
    return res
end

local function getAllRanks(cards)
    local all_ranks = calcTypeRanks(cards);
    local ranks = {};
    local special_ranks = {};

    for i,v in ipairs(all_ranks) do
        for ii,vv in ipairs(v.next) do
            for iii,vvv in ipairs(vv.next) do
                local leftcards = vvv.next;
                local rank = {
                    {cards = v.cards, tp = v.tp}, 
                    {cards = vv.cards, tp = vv.tp}, 
                    {cards = vvv.cards, tp = vvv.tp}
                };
                if #leftcards ~= 0 then
                    table.sort(leftcards, singleCardCompareValSmaller);
                    for x,y in ipairs(rank) do
                        local length = x == 3 and 3 or 5;
                        local leftlen = length-#y.cards;

                        if leftlen ~= 0 then
                            local wl = split_array(leftcards, 1, leftlen);
                            for xx,yy in ipairs(wl) do
                                table.insert(y.cards, yy);
                            end
                        end
                    end
                end
                -- 检测有没有倒水, 不同类型的绝对不会倒水, 同类型的可能倒水
                if compareCard(rank[1].cards, rank[2].cards) ~= 1 then
                    -- 特殊类型的加入到特殊类型组合当中
                    if rank[3].tp == CT_THREE or rank[2].tp >= CT_FIVE_THREE_DEOUBLE or rank[1].tp > CT_FIVE_THREE_DEOUBLE then
                        table.insert(special_ranks, rank);
                    else
                        table.insert(ranks, rank);
                    end
                end
            end
        end
    end
    -- 有特殊牌型，优先返回特殊牌型
    if #special_ranks ~= 0 then
        return special_ranks;
    end
    return ranks;
end

--获得牌型信息
--return  配型,[特殊牌型数据]
local function getCardType(data, cnt, spmydata, ver)
    if type(data) == 'table' then    
        data = ffi.new('BYTE[13]', unpack(data));
    end
    lib.SortCardList(data,  cnt, ffi.C.enDescend);
    local n = lib.GetCardType(data,  cnt, spmydata or spcard, ver or bFuncVersion);
    return n, spmydata or spcard;
end

--[[ 取特殊牌型的排列组合
]]
local function getSpecialType(cards)
    local specialcards = ffi.new("BYTE[13]");
    local tp = getCardType(cards, #cards, specialcards);
    -- 返回不为0则为特殊牌型
    if tp ~= 0 then
        local str = ffi.string(specialcards, ffi.sizeof(specialcards));
        local first = {string.byte(str, 1, 3)};
        local second = {string.byte(str, 4, 8)};
        local third = {string.byte(str, 9, 13)};
        return first, second, third, tp; 
    end
end

local function chooseXdaoMax(allranks, level)
    local len = #allranks;
    local xdao = allranks[1];
    local ranks = {allranks[1]};
    if xdao then
        for i=2, len, 1 do
            -- 如果为头道,类型则应该比绝对大小
            if level == 3 then
                if compareCard(xdao[level].cards, allranks[i][level].cards) == 1 then
                    xdao = allranks[i];
                    ranks = {allranks[i]};
                end
            elseif xdao[level].tp < allranks[i][level].tp then
                xdao = allranks[i];
                ranks = {allranks[i]};
            elseif xdao[level].tp == allranks[i][level].tp then
                table.insert(ranks, allranks[i]);
            end
        end
    end
    return ranks;
end

local function getMaxWeightRanks(allranks)
    local weight_sum = 0;
    local ranks = {allranks[1]};

    for i,v in ipairs(allranks) do

        local sum = 0;
        for ii,vv in ipairs(v) do
            sum = regTypeList[vv.tp].weight + sum;
        end

        if sum > weight_sum then
            ranks = {v};
            weight_sum = sum;
        elseif sum == weight_sum then
            table.insert(ranks, v);
        end
    end
    return ranks;
end

local function getBestRank(cards, expect, filter_priority)
    if not filter_priority then filter_priority = {2,3,1}; end

    -- 有特殊牌型直接返回
    local first, second, last, tp = getSpecialType(cards);
    if first then
        return first, second, last, tp;
    end
    -- 遍历所有牌型
    local allranks = getAllRanks(cards);

    -- 取权重值最高的组合
    local maxranks = getMaxWeightRanks(allranks);

    -- 按大中小的方式过滤,头道取卡牌值最大的,其余两道取类型最大值
    maxranks = chooseXdaoMax(maxranks, filter_priority[1]);
    maxranks = chooseXdaoMax(maxranks, filter_priority[2]);
    maxranks = chooseXdaoMax(maxranks, filter_priority[3]);

    -- 过滤重复选项, 或者不过滤，随机选取一项
    --local outrank = filterSameCards(maxrank);
    local outrank = maxranks[math.random(#maxranks)];
    first = outrank[3].cards;
    second = outrank[2].cards;
    last = outrank[1].cards;

    table.sort(first, singleCardCompareValSmaller);
    table.sort(second, singleCardCompareValSmaller);
    table.sort(last, singleCardCompareValSmaller);
    return first, second, last;
end

local function getRank(cards, expect, filter_priority)
    if not filter_priority then filter_priority = {2,3,1}; end

    -- 有特殊牌型直接返回
    local first, second, last, tp = getSpecialType(cards);
    if first then
        return first, second, last, tp;
    end
    -- 遍历所有牌型
    local allranks = getAllRanks(cards);

    local maxranks = allranks;
    -- 按大中小的方式过滤,头道取卡牌值最大的,其余两道取类型最大值
    maxranks = chooseXdaoMax(maxranks, filter_priority[1]);
    maxranks = chooseXdaoMax(maxranks, filter_priority[2]);
    maxranks = chooseXdaoMax(maxranks, filter_priority[3]);

    -- 过滤重复选项, 或者不过滤，随机选取一项
    --local outrank = filterSameCards(maxrank);
    local outrank = maxranks[math.random(#maxranks)];
    first = outrank[3].cards;
    second = outrank[2].cards;
    last = outrank[1].cards;

    table.sort(first, singleCardCompareValSmaller);
    table.sort(second, singleCardCompareValSmaller);
    table.sort(last, singleCardCompareValSmaller);
    return first, second, last;
end

return {
    getAllRanks = getAllRanks;
    getRank = getRank;
    getBestRank = getBestRank;
    make_ranks = make_ranks;
}
--------------------- 
