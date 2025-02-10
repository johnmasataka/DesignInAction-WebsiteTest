import nlp from 'https://cdn.jsdelivr.net/npm/compromise@latest/builds/compromise.min.js';

// 形容词与参数的映射表
const adjectiveMapping = {
    "cozy": { "material": "wood" },
    "modern": { "style": "modern" },
    "spacious": { "size": "large" },
    "luxurious": { "style": "luxurious" }
};

// 名词与参数的映射表
const nounMapping = {
    "garden": { "outdoor_space": "garden" },
    "garage": { "features": "garage" },
    "balcony": { "outdoor_space": "balcony" },
    "yard": { "outdoor_space": "garden" },
    "house": { "building_type": "house" },
    "bedroom": { "room_type": "bedroom" }
};

// 同义词标准化函数
function normalizeWord(word) {
    const synonyms = {
        "big": "spacious",
        "yard": "garden",
        "luxury": "luxurious",
        "bedrooms": "bedroom",
        "room": "bedroom"
    };
    return synonyms[word.toLowerCase()] || word.toLowerCase();
}

// 分割名词短语为独立单词
function splitCompoundNouns(noun) {
    return noun
        .split(/(?<=[a-z])(?=[A-Z])|[\s,-]+|(?=[0-9])/g)
        .map(word => word.toLowerCase())
        .filter(word => word.length > 1 && !['a', 'an', 'the'].includes(word));
}

// 名词过滤函数
function filterValidNouns(nouns) {
    let processedNouns = [];
    nouns.forEach(noun => {
        processedNouns.push(...splitCompoundNouns(noun));
    });
    return processedNouns
        .map(noun => noun.replace(/[^a-zA-Z]/g, '').trim())
        .filter(noun => noun.length > 1 && !['i', 'and'].includes(noun));
}

// 参数解析函数
function parseTextToParameters(text) {
    let parameters = {};

    // 使用 compromise 提取名词和形容词
    let doc = nlp(text);
    let rawNouns = doc.nouns().out('array'); // 提取名词
    let rawAdjectives = doc.adjectives().out('array'); // 提取形容词

    // 标准化和过滤名词
    let nouns = filterValidNouns(rawNouns).map(normalizeWord);

    // 标准化形容词
    let adjectives = [...new Set(rawAdjectives.map(normalizeWord))]; // 去重后处理形容词

    // 动态映射形容词到参数
    adjectives.forEach((adj) => {
        if (adjectiveMapping[adj]) {
            Object.assign(parameters, adjectiveMapping[adj]);
        } else {
            console.log(`Unrecognized adjective: ${adj}`);
        }
    });

    // 动态映射名词到参数
    nouns.forEach((noun) => {
        if (nounMapping[noun]) {
            Object.assign(parameters, nounMapping[noun]);
        }
    });

    // 提取类似 "3 bedrooms" 的数值
    let roomsMatch = text.match(/(\d+) bedrooms?/);
    if (roomsMatch) {
        parameters["rooms"] = parseInt(roomsMatch[1]);
    }

    return parameters;
}

// 导出解析函数，供 script.js 调用
export { parseTextToParameters };
