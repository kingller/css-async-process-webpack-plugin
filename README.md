# css-async-process-webpack-plugin

[![NPM version](https://img.shields.io/npm/v/css-async-process-webpack-plugin)](https://www.npmjs.com/package/css-async-process-webpack-plugin)
[![Build Status](https://travis-ci.org/kingller/css-async-process-webpack-plugin.svg?branch=master)](https://travis-ci.org/kingller/css-async-process-webpack-plugin)


A webpack plugin for change the insert position of async loading style which is generated by mini-css-extract-plugin


## Install

```bash
npm i -D css-async-process-webpack-plugin
``` 

>   __NOTE__: Should add after `mini-css-extract-plugin`



## Usage

In your webpack configuration (`webpack.config.js`):

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssAsyncProcessWebpackPlugin = require('css-async-process-webpack-plugin');

module.exports = {
    //...
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[hash:8].css",
            chunkFilename: "[id].[hash:8].css"
        }),
        new CssAsyncProcessWebpackPlugin(),
    ]
}
```


## Options

### process

`Function`.   
Change the async loading style insert before `document.getElementById("less:theme:color")` by default. 
You can change the logic by setting `process`.


```javascript
new CssAsyncProcessWebpackPlugin({
    process: (source) => {
        return source.replace(/head.appendChild\(linkTag\)/, 'head.insertBefore(linkTag, document.getElementById("less:theme:color"))');
    }
}),
```
