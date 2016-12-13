// ignore
fis.set('project.ignore', [
    'output/**',
    'node_nodules/**',
    '.git/**',
    '.svn/**',
    'fis-conf.js',
    '**/bak/**',
    'README.txt'
]);
fis.match('_*.*', {
  release: false
})
// end ================================

/** 相对路径
 *  npm install -g fis3-hook-relative --registry http://registry.npm.taobao.org/
 */
fis.hook('relative');
fis.match('**', {
    relative:true
})

/** script-loader
 *  npm install -g fis3-hook-module --registry http://registry.npm.taobao.org/
 *  npm install -g fis3-postpackager-loader --registry http://registry.npm.taobao.org/
 */
// fis.hook('module', {
//     mode: 'amd',
//     forwardDeclaration: true
// });
// fis.match('**/mod_*.js', {
//     isMod: true, // 标记匹配文件为组件
//     release: '/static/$0'
// });
// fis.match('::package', {
//   // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
//     postpackager: fis.plugin('loader', {
//         // allInOne: true, // true 对散列的引用链接进行合并，而不需要进行配置 packTo 指定合并包名
//         resourceType: 'amd',
//         useInlineMap: true // 资源映射表内嵌
//     })
// });
// fis.media('dev').match('**/mod_*.js', {
//     packTo: '/static/pkg.js' // 打包合并命中的文件
// });
// end ================================

/** SASS
 *  npm install -g fis-parser-sass --registry http://registry.npm.taobao.org/
 */
fis.match('*.{sass,scss}', {
    isCssLike: true,
    parser: fis.plugin('sass'), // fis-parser-sass 插件进行解析
    rExt: '.css', // .sass, .scss 文件后缀构建后被改成 .css 文件
});
// end ================================

// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
})

// 对 CSS 进行图片合并
fis.match('*.{css,scss,sass}', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});

// 自动添加css前缀 autoprefixer  npm install fis-postprocessor-autoprefixer
fis.match('*.{css,sass,scss}', {
    postprocessor: fis.plugin('autoprefixer')
});

/** You need install it.
 *  npm install fis-optimizer-html-minifier -g
 */
// fis.match('*.html', {
    // optimizer: fis.plugin('html-minifier')
// });
// 压缩 end

// MD5
fis.match('*.{js,css,sass,scss,jpg,gif,png}', {
    useHash: true
});
// end ================================


// 压缩
// fis.match('*.js', {
//     optimizer: fis.plugin('uglify-js') // fis-optimizer-uglify-js 插件进行压缩，已内置
// });

fis.match('*.{css,sass,scss}', {
    optimizer: fis.plugin('clean-css') // fis-optimizer-clean-css 插件进行压缩，已内置
});

fis.match('*.png', {
    optimizer: fis.plugin('png-compressor') // fis-optimizer-png-compressor 插件进行压缩，已内置
});
// end ===============================


// 默认环境
fis.media('dev').match('*.{js,css,scss,sass,jpg,gif,png}', {
    //domain: '/dist', // 设置domain  可以使用.hack相对路径
    useHash: false,
    // useSprite: false,
    optimizer: null
});
fis.media('dist').match('*.{js,css,scss,sass,jpg,gif,png}', {
    //domain: '/dist', // 设置domain
    useHash: false,
    useSprite: true,
    // optimizer: null
});
// end ===============================

fis.media('dist').match('mobile/**/shell_*.html', {
    release : false
})
// 自定义环境
fis.media('dist').match('*', {
    deploy: fis.plugin('local-deliver', {
        to: '../dist' // 发布到本地目录
    })
});
// end ===============================