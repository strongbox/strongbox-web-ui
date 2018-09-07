const path = require('path');
const glob = require('glob');

const appName = 'strongbox-web-ui';

const CompressionPlugin = require('compression-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const distPath = path.resolve(__dirname, 'dist');
const distAngularPath = path.resolve(distPath, appName);
const packagingRootPath = path.resolve(distPath, 'packaging');
const packagingTempPath = path.resolve(packagingRootPath, 'tmp');
const packagingAppPath = path.resolve(packagingRootPath, appName);

module.exports = {
    mode: 'production',
    entry: toObject(glob.sync(distAngularPath + '/*.*')),
    output: {
        path: packagingTempPath,
        filename: '[name]'
    },
    module: {
        rules: [
            {
                test: /.*/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: appName + '/'
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
                move: [{
                    source: packagingTempPath + "/" + appName,
                    destination: packagingRootPath + "/" + appName
                }],
                delete: [packagingTempPath],
                archive: [{
                    source: packagingAppPath,
                    destination: packagingRootPath + '/' + appName + '.zip',
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

function toObject(paths) {
    var ret = {};

    paths.forEach(function (path) {
        ret[path.split('/').slice(-1)[0]] = path;
    });

    console.log("Paths to repackage: ");
    console.log(ret);

    return ret;
}