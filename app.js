var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var url = "http://substack.net/images/";

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {

    $ = cheerio.load(body);

    var images = [];

    

    var stream = fs.createWriteStream("images.csv");
    stream.once('open', function(fd) {

      $('tr').each(function(i, elem) {
        var filename = elem.children[2].children[0].children[0]['data'];
        if (/[a-zA-Z0-9]+\.[a-z]{3}/.test(filename)) {
          var href = elem.children[2].children[0].attribs['href'];
          var permissions = elem.children[0].children[0].children[0]['data'];
          var filetype = filename.split('.')[1];
          // console.log(permissions + ',' + href + ',' + filetype);
          stream.write(permissions + ',' + href + ',' + filetype + '\n');
        }
      });

      stream.end();

    });

  }
  else {
    console.error(error);
  }
})