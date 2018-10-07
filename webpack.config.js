const path = require('path');
const glob = require('glob');

const CompressionPlugin = require('compression-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

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
        new FileManagerPlugin({
            onEnd: {
                move: [
                    {
                        source: newPackagingTempPath + "/" + appName,
                        destination: newPackageAppPath
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