var sax = require('sax'),
    xml = require('./xml'),
    NodeSet = xml.NodeSet,
    Tag = xml.Tag,
    Comment = xml.Comment,
    CData = xml.CData;

module.exports = function parse(xml, options, callback) {
    var parser,
        target = new NodeSet(),
        pointer = target,
        firstError = null;

    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    options.trim = true;
    parser = sax.parser(options.strict !== false, options);

    parser.onopentag = function(node) {
        var tag = new Tag(node.name, node.attributes, pointer);
        pointer.append(tag);
        pointer = tag;
    };

    /* jshint unused:false */
    parser.onclosetag = function(node) {
        pointer = pointer.parent;
    };

    parser.oncomment = function(comment) {
        pointer.append(new Comment(comment));
    };

    parser.onopencdata = function() {
        pointer.append(new CData());
    };

    parser.oncdata = function(chunk) {
        pointer.children[pointer.children.length - 1].push(chunk);
    };

    parser.onclosecdata = function() {
        pointer = pointer.parent;
    };

    parser.ontext = function(text) {
        pointer.append(text);
    };

    parser.onerror = function(error) {
        parser.resume();
    };

    parser.onend = function() {
        callback(firstError, firstError ? null : target);
    };

    parser.write(xml).close();
};
