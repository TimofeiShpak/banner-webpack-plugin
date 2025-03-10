"use strict";

var ConcatSource;
try {
    ConcatSource = require("webpack-core/lib/ConcatSource");
} catch(e) {
    ConcatSource = require("webpack-sources").ConcatSource;
}

function BannerWebpackPlugin(options) {
    this.options = options || {};
    this.chunks = this.options.chunks || {};
}
 
BannerWebpackPlugin.prototype.apply = function(compiler) {
    compiler.hooks.emit.tap(
        'BannerWebpackPlugin',
        (compilation) => {
          let chunkKey = Object.keys(this.chunks);
          chunkKey.map((chunk, key) => {
              let distChunk = this.findAsset(compilation, chunk),
                  beforeContent = this.chunks[chunk].beforeContent || '',
                  afterContent = this.chunks[chunk].afterContent || '',
                  removeBefore = this.chunks[chunk].removeBefore || '',
                  removeAfter = this.chunks[chunk].removeAfter || '';

              let source = compilation.assets[distChunk].source();
              source = (removeBefore) ? source.replace(new RegExp('^' + removeBefore), "") : source;
              source = (removeAfter) ? source.replace(new RegExp(removeAfter + '$'), "") : source;
  
              compilation.assets[distChunk].source = () => {
                  return source;
              };
  
              compilation.assets[distChunk] = new ConcatSource(beforeContent, compilation.assets[distChunk], afterContent);
          });
        }
      );
};

BannerWebpackPlugin.prototype.findAsset = function(compilation, chunk) {
    let chunks = compilation.chunks;

    for (let item of chunks) {
        if (item.name === chunk) {
            return [...item.files][1];
        }
    }

    return null;
};

module.exports = BannerWebpackPlugin;
