const paths = {
    src: {
        html: './src/html/*.html',
        img: './src/img/*.{jpg,png,gif,svg}',
        js: './src/js/*.js',
        css: './src/css/style-*.less',
        favicon: './src/favicon.ico'
    },
    dev: {
        html: './dev/html/*.html',
        img: './dev/img/*.{jpg,png,gif,svg}',
        js: './dev/js/*.js',
        css: './dev/css/style-*.css',
        favicon: './dev/favicon.ico',
        _path: './dev',
        _html: './dev/html',
        _img: './dev/img',
        _js: './dev/js',
        _css: './dev/css'
    },
    dist: {
        _path: '../server/public',
        _html: '../server/views',
        _img: '../server/public/img',
        _js: '../server/public/js',
        _css: '../server/public/css'
    }
};

export {paths};