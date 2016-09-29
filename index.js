var fs = require('fs');
var express = require('express');
var gm = require('gm');

var app = express();
var PORT = 3000;
// var IMG = '/git/u-crop/qCad_4.png';
var IMG = '/git/u-crop/img.jpg';
var gmufferType = 'PNG';
var defaultCropParams = {
  w: 100,
  h: 100,
  x: 0,
  y: 0,
};

var getParams = function (data) {
  var params = {};

  if (!data.length) {
    params = defaultCropParams;
  }

  data[2] ? params.w = data[2] : params.w = defaultCropParams.w;
  data[3] ? params.h = data[3] : params.h = defaultCropParams.h;

  if (data[0]) {
    params.x = data[0] - (params.w / 2);
  } else {
    params.x = defaultCropParams.x;
  }

  if (data[1]) {
    params.y = data[1] - (params.h / 2);
  } else {
    params.y = defaultCropParams.y;
  }
  // console.log(params);
  return params;
};

var crop = function (data, callback) {
  var cropParams = getParams(data.params || []);
  gm(data.img)
    .crop(
      cropParams.w,
      cropParams.h,
      cropParams.x,
      cropParams.y
    )
    .setFormat('jpeg')
    // .toBuffer(gmufferType, function (err, buffer) {
    .toBuffer( function (err, buffer) {
        if (err) {
          callback(err);
        } else {
          callback(null, buffer);
        }
    })
  ;
};

app.get('/img', function(req, res){
  var start = new Date();
  if (!req.query.crop) {
    res.send('ok');
  } else {
    crop(
      {
        img: IMG,
        params: req.query.crop.split(',')
      },
      function (err, img) {
        if (err) console.log('err', err);
        // res.set( 'Content-Type', 'image/png' );
        res.set( 'Content-Type', 'image/jpeg' );
        res.send(img);
        console.log((new Date() - start) / 1000 % 60 );
      }
    );
  }
});

app.get('/', function(req, res){

  res.send(
    'Схема целиком: <a href="/img?crop=0,0,22000,22000" target="_blank">клик!</a>' +
    '<br/><br/>Кусок из схемы:<br/>' +
    '<img src="/img?crop=9880,5820,500,500" />'
  );

});

app.listen(PORT, function () {
    console.log('listening on port ' + PORT + '...');
});
