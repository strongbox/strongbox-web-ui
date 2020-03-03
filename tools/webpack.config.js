const path = require('path');
const glob = require('glob');

const CompressionPlugin = require('compression-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const angularJson = require('../angular.json');
const packageJson = require('../package.json');


const appName = angularJson.defaultProject;
const buildOptions = angularJson.projects['strongbox-web-ui'].architect.build.options;

const projectRootPath = (...appendPaths) => {
    return path.resolve(__dirname, '../', appendPaths ? appendPaths.join('/') : '');
};

const appPath = projectRootPath('src', 'app');

const distPath = (...appendPaths) => {
    const rootPath = buildOptions.outputPath;
    const deployUrl = ('' + buildOptions.deployUrl).replace(/(^\/|\/+$)/mg, '');
    const count = (deployUrl.match(/\//g) || []).length;
    let traverse = '';

    for (let i = 0; i <= count; i++) {
        traverse += '../';
    }

    return path.resolve(rootPath, traverse, appendPaths ? appendPaths.join('/') : '');
};

const assetsPath = (...appendPaths) => {
    return distPath('static/assets', appendPaths);
};

console.log();
console.log(`
                   _____  _                              _                 
                  / ____|| |                            | |                
                 | (___  | |_  _ __  ___   _ __    __ _ | |__    ___ __  __
                  \\___ \\ | __|| '__|/ _ \\ | '_ \\  / _\` || '_ \\  / _ \\\\ \\/ /
                  ____) || |_ | |  | (_) || | | || (_| || |_) || (_) |>  < 
                 |_____/  \\__||_|   \\___/ |_| |_| \\__, ||_.__/  \\___//_/\\_\\
                                                   __/ |                   
                                                  |___/                    
`);
console.log();
console.log('Options:');
console.table([
    {'key': 'rootPath', 'value': projectRootPath()},
    {'key': 'appPath', 'value': appPath},
    {'key': 'distPath', 'value': distPath()},
    {'key': 'outputPath', 'value': buildOptions.outputPath},
    {'key': 'assetsPath', 'value': assetsPath()},
    {'key': 'baseHref', 'value': buildOptions.baseHref},
    {'key': 'deployUrl', 'value': buildOptions.deployUrl},
    {'key': 'version', 'value': packageJson.version}
], ['key', 'value']);
console.log('\n');

module.exports = {
    mode: 'production',
    entry: [
        ...glob.sync( distPath() + '/*.*'),
        ...glob.sync(assetsPath() + '/*.*'),
    ],
    output: {
        path: distPath(),
        filename: '[name]',
    },
    module: {
        rules: [
            {
                test: /.*/,
                exclude: [/\.html/],
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '/' + path.relative(distPath(), assetsPath())
                    }
                }]
            },
            {
                test: /\.html/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '/' + path.relative(distPath(), distPath())
                    }
                }]
            }
        ]
    },
    plugins: [
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|woff|woff2|ttf|svg|eot)$/,
            threshold: 10240,
            minRatio: 0.9,
        }),
        new CompressionPlugin({
            filename: '[path].br[query]',
            algorithm: 'brotliCompress',
            test: /\.(js|css|woff|woff2|ttf|svg|eot)$/,
            compressionOptions: { level: 11 },
            threshold: 10240,
            minRatio: 0.9,
        }),
        new ManifestPlugin({
            basePath: distPath(),
            fileName: 'assets-manifest.json',
            /**
             * https://github.com/danethurber/webpack-manifest-plugin/blob/1.x/README.md#hooks-options
             * {
             *      path: string,
             *      chunk: Chunk,
             *      name: string|null,
             *      isInitial: boolean,
             *      isAsset: boolean,
             *      isModuleAsset: boolean
             * }
             */
            map: (data) => {
                return {
                    path: data.path.replace('/index.html', '/'),
                    name: path.basename(data.name),
                    isInitial: data.isInitial,
                    isChunk: data.chunk,
                    isAsset: data.isAsset,
                    isModuleAsset: data.isModuleAsset
                }
            },
            filter: (data) => {
                return data.name.match(/main\.main$/) === null;
            }
        }),
        new FileManagerPlugin({
            onEnd: {
                delete: [ distPath('main') ],
                archive: [{
                    source: distPath(),
                    destination: distPath('../') + '/' + appName + '.zip',
                    format: 'zip',
                    options: {
                        zlib: {
                            level: 9
                        }
                    }
                }]
            }
        })
    ]
};
