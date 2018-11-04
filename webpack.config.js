const path = require('path');
const glob = require('glob');

const CompressionPlugin = require('compression-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const angularJson = require('./angular');
const appName = angularJson.defaultProject;

const targetPath = (appendPath) => {
    if (!appendPath) appendPath = '';
    return path.resolve(__dirname, 'dist', appendPath);
};

const assetsRootPath = () => {
    return appName + '/';
};

const assetsStaticPath = (appendPath) => {
    if(!appendPath) appendPath = '';
    return (assetsRootPath() + '/static/' + appendPath).replace(/(\/+){2,}/g, '/');
};

const originalPackagePath = targetPath(appName);
const newPackagingRootPath = targetPath('packaging');
const newPackagingTempPath = targetPath('packaging/tmp');
const newPackageAppPath = targetPath('packaging/' + appName);

console.log('');
console.log('Original angular package path: ', originalPackagePath);
console.log('New packaging root path: ', newPackagingRootPath);
console.log('New packaging temp path: ', newPackagingTempPath);
console.log('New packaging app path: ', newPackageAppPath);
console.log('');

module.exports = {
    mode: 'production',
    entry: [
        ...glob.sync(originalPackagePath + '/*.*'),
        ...glob.sync(originalPackagePath + '/static/assets/*.*'),
    ],
    output: {
        path: newPackagingTempPath,
        filename: '[name]'
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
                        outputPath: assetsStaticPath('assets')
                    }
                }]
            },
            {
                test: /\.html/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: assetsRootPath()
                    }
                }]
            }
        ]
    },
    plugins: [
        new CompressionPlugin({
            test: /\.(js|css|woff|woff2|ttf|svg|eot)$/,
            minRatio: 0.8,
            threshold: 20000 // in bytes = 20kb
        }),
        new ManifestPlugin({
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
                    path: data.path.replace(/^strongbox-web-ui/i, '').replace('/index.html', '/'),
                    name: path.basename(data.name),
                    isInitial: data.isInitial,
                    isChunk: data.chunk,
                    isAsset: data.isAsset,
                    isModuleAsset: data.isModuleAsset
                }
            },
            filter: (data) => {
                return data.name !== 'main.main'
            }
        }),
        new FileManagerPlugin({
            onEnd: {
                move: [
                    {
                        source: newPackagingTempPath + "/" + appName,
                        destination: newPackageAppPath
                    },
                    {
                        source: newPackagingTempPath + "/manifest.json",
                        destination: newPackageAppPath + "/assets-manifest.json"
                    }
                ],
                delete: [newPackagingTempPath],
                archive: [{
                    source: newPackageAppPath,
                    destination: newPackagingRootPath + '/' + appName + '.zip',
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