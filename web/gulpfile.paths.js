const paths = {
    src: {
        html: './src/html/*.html',
        img: './src/img/*.{jpg,png,gif,svg}',
        js: './src/js/*.js',
        css: './src/css/style-*.less',
        fonts: './src/fonts/*.{eot,svg,ttf,woff,woff2}',
        favicon: './src/favicon.ico'
    },
    dev: {
        html: './dev/html/*.html',
        img: './dev/img/*.{jpg,png,gif,svg}',
        js: './dev/js/*.js',
        css: './dev/css/style-*.css',
        favicon: './dev/favicon.ico',
        fonts: './dev/fonts/*.{eot,svg,ttf,woff,woff2}',
        rev: './dev/rev/**/*.json',
        _path: './dev',
        _html: './dev/html',
        _img: './dev/img',
        _js: './dev/js',
        _css: './dev/css',
        _fonts: './dev/fonts',
        _rev: './dev/rev'
    },
    dist: {
        _path: '../server/public',
        _html: '../server/views',
        _img: '../server/public/img',
        _js: '../server/public/js',
        _css: '../server/public/css',
        _fonts: '../server/public/fonts'
    }
};

export {paths};