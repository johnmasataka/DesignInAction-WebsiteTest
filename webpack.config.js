// This file is for solving the issue when importing node.js 

const path = require('path');

module.exports = {
    entry: './text.js', // 你的入口文件
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // 输出到 dist 文件夹
    },
    mode: 'development',
};
