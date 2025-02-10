// const nlp = require('compromise');

// const compromiseLibrary = require('compromise');
// console.log(compromiseLibrary);

console.log(nlp);

const colorMapping = {
    "red": 0xff0000,
    "green": 0x00ff00,
    "blue": 0x0000ff,
    "yellow": 0xffff00,
    "white": 0xffffff,
    "black": 0x000000,
    "grey": 0xA8A8A8
};

function parseTextToParameters(text) {
    let parameters = {};

    // Use 'compromise' to extract nouns and adjectives
    let doc = nlp(text);
    let rawNouns = doc.nouns().out('array'); 
    let rawAdjectives = doc.adjectives().out('array'); 

    // Standardized and filtered nouns
    let nouns = filterValidNouns(rawNouns).map(normalizeWord);

    // Standardized adjectives
    let adjectives = [...new Set(rawAdjectives.map(normalizeWord))]; 

    // Dynamically map adjectives to parameters
    adjectives.forEach((adj) => {
        if (adjectiveMapping[adj]) {
            Object.assign(parameters, adjectiveMapping[adj]);
        } else if (colorMapping[adj]) {
            parameters.color = colorMapping[adj]; // Identify colors
        } else {
            console.log(`Unrecognized adjective: ${adj}`);
        }
    });

    // Dynamically map nouns to parameters
    nouns.forEach((noun) => {
        if (nounMapping[noun]) {
            Object.assign(parameters, nounMapping[noun]);
        }
    });

    // Extract cubic dimensions like “10x10x10”.
    let sizeMatch = text.match(/(\d+)\s*x\s*(\d+)\s*x\s*(\d+)/i);
    if (sizeMatch) {
        parameters.width = parseInt(sizeMatch[1]);
        parameters.height = parseInt(sizeMatch[2]);
        parameters.depth = parseInt(sizeMatch[3]);
    }

    return parameters;
}

// Mapping table of adjectives to parameters
const adjectiveMapping = {
    "cozy": { "material": "wood" },
    "modern": { "style": "modern" },
    "spacious": { "size": "large" },
    "luxurious": { "style": "luxurious" },
    // "big": { "size": "large" },
    // "tiny": { "size": "small" },
    "endless": { "height": 100000000000, "width": 100000000000, "depth":100000000000 },
    "gigantic": { "height": 100, "width": 100, "depth":100  },
    "enormous": { "height": 50, "width": 50, "depth":50   },
    "large": { "height": 15, "width": 15, "depth":15   },
    "big": { "height": 10 },
    "small": { "height": 0.5, "width": 0.5, "depth":0.5 },
    "tiny": { "height": 0.1, "width": 0.1, "depth":0.1 },
    "medium": { "height": 3 },
    "average": { "height": 3 },
    "long": { "width": 20 },
    "extended": { "width": 20 },
    "short": { "width": 0.25 },
    "compact": { "width": 0.25 }
};

// Mapping table of nouns to parameters
const nounMapping = {
    "garden": { "outdoor_space": "garden" },
    "garage": { "features": "garage" },
    "balcony": { "outdoor_space": "balcony" },
    "yard": { "outdoor_space": "garden" },
    "house": { "building_type": "house" },
    "bedroom": { "room_type": "bedroom" }
};

// Function for Synonym Standardization
function normalizeWord(word) {
    const synonyms = {
        "big": "spacious",
        "yard": "garden",
        "luxury": "luxurious",
        "bedrooms": "bedroom",
        "room": "bedroom",
        // "small": "tiny", 
        // "small": "little",
        // "small": "mini-sized",
    };
    return synonyms[word.toLowerCase()] || word.toLowerCase();
}

// Split noun phrases into separate words
function splitCompoundNouns(noun) {
    return noun
        .split(/(?<=[a-z])(?=[A-Z])|[\s,-]+|(?=[0-9])/g)
        .map(word => word.toLowerCase())
        .filter(word => word.length > 1 && !['a', 'an', 'the'].includes(word));
}

// Noun Filter Function
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
// function parseTextToParameters(text) {
//     let parameters = {};

//     // 使用 compromise 提取名词和形容词
//     let doc = nlp(text);
//     let rawNouns = doc.nouns().out('array'); // 提取名词
//     let rawAdjectives = doc.adjectives().out('array'); // 提取形容词

//     // 标准化和过滤名词
//     let nouns = filterValidNouns(rawNouns).map(normalizeWord);

//     // 标准化形容词
//     let adjectives = [...new Set(rawAdjectives.map(normalizeWord))]; // 去重后处理形容词

//     // 动态映射形容词到参数
//     adjectives.forEach((adj) => {
//         if (adjectiveMapping[adj]) {
//             Object.assign(parameters, adjectiveMapping[adj]);
//         } else {
//             console.log(`Unrecognized adjective: ${adj}`);
//         }
//     });

//     // 动态映射名词到参数
//     nouns.forEach((noun) => {
//         if (nounMapping[noun]) {
//             Object.assign(parameters, nounMapping[noun]);
//         }
//     });

//     // 提取类似 "3 bedrooms" 的数值
//     let roomsMatch = text.match(/(\d+) bedrooms?/);
//     if (roomsMatch) {
//         parameters["rooms"] = parseInt(roomsMatch[1]);
//     }

//     return parameters;
// }

// Exporting parser functions for script.js calls
export { parseTextToParameters };
