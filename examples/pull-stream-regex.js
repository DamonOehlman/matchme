var geonames = require('geonames');
var pull = require('pull-stream');
var matchme = require('..');

pull(
  geonames.read(__dirname + '/data/AU.txt'),
  pull.filter(matchme.filter('name =~ /Island$/ && featureCode != ISL')),
  pull.drain(function(place) {
    console.log(place.name + ' might seem like an island but is in fact a ' + place.featureCode);
  })
);
