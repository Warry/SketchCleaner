var fs = require('fs'),
    parse = require("./lib/parse"),
    serialize = require("./lib/serialize");

function cleanAttributes(attributes) {
  for (var k in attributes){
    if (k.indexOf(":sketch") > 0) delete attributes[k]
    else if (k.indexOf("sketch:") == 0) delete attributes[k]
    else if (k == "id") {
      attributes["class"] = "svg-"+attributes[k]
      delete attributes[k]
    }
  }
  return attributes;
}

var blacklist = ["title", "desc", "defs"];
function cleanTag(tag) {
  // Remve Sketch page wrapper... useless
  if (tag.attrs && tag.attrs.id && tag.attrs.id.indexOf("Page-") == 0) return clean(tag.children);
  // remove black listed tags
  if (tag.name && blacklist.indexOf(tag.name) >= 0) return void 0;
  // remove comments
  else if (tag.comment) return void 0;
  // Clean attributes
  if (tag.attrs) tag.attrs = cleanAttributes(tag.attrs)
  // Recurively clean children
  if (tag.children) tag.children = clean(tag.children)
  return tag;
}

function clean(node) {
  var ret = [];
  for (var i in node){
    var tag = cleanTag(node[i])
    if ({}.toString.call(tag) == '[object Array]') return tag;
    else if (tag) ret.push(tag);
  }
  return ret;
}

var dir = process.argv[2];
var directory = "";
var stack = [];

function cleanFile(){
  if (stack.length == 0) return;
  filename = stack.pop();
  console.log("Reading "+filename+"...");
  fs.readFile(directory + '/' + filename, function(err, data) {
      parse(data.toString(), function (err, result) {
          var xml = serialize(clean(result.toJSON()), {pretty: true});
          fs.writeFile(directory + '/' + filename, xml, function(err) {
              if(err) {
                  console.log(err);
              } else {
                  console.log(filename+" was saved!");
                  cleanFile()
              }
          }); 
      });
  });
}

module.exports = function sketchCleaner(dir){
  directory = dir;
  fs.readdir(directory, function(err, files) {
    stack = files.filter(function(name){
      return name.substr(-4) == ".svg";
    });
    cleanFile();
  });
}


