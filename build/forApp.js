var replace = require("replace");
var pretty = require('pretty');
var fs = require('fs');
var remove = require('remove');
var fs = require('fs-extra');

var fileUrl = './dist/index.html'
replace({
    regex: `<!-- plus js -->`,
    replacement: `<script type="text/javascript" src="cordova.js"></script>`,
    paths: [fileUrl],
    recursive: true,
    silent: false,
});
replace({
    regex: `<!-- plus meta -->`,
    replacement: `<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: * 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src * data: content:;">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">`,
    paths: [fileUrl],
    recursive: true,
    silent: false,
});


fs.readFile(fileUrl, 'utf8', function(err, data){
    fs.writeFileSync(fileUrl,pretty(data));
});

remove('/Users/zxs/Documents/workSpace/万达/cordovaSpace/www/index.html', function(err) {
    if (err) console.error(err);
    else console.log('success!');
    remove('/Users/zxs/Documents/workSpace/万达/cordovaSpace/www/static', function(err) {
        if (err) console.error(err);
        else console.log('success!');
        try {
            fs.copySync('./dist', '/Users/zxs/Documents/workSpace/万达/cordovaSpace/www')
            console.log('success!')
        } catch (err) {
            console.error(err)
        }
    });
});
