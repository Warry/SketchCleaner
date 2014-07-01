var util = require('util'),
    xml = {};

var NodeSet = xml.NodeSet = function NodeSet() {
    this.children = [];
};

NodeSet.prototype.append = function(node) {
    this.children.push(node);
    return this;
};

NodeSet.prototype.toJSON = function() {
    return this.children.map(function(c) { return c.toJSON(); });
};



var Tag = xml.Tag = function Tag(name, attrs, parent) {
    var _attrs = attrs || {},
        _parent = parent;

    this.name = name;
    this.attrs = _attrs;
    this.parent = _parent;
    this.children = [];
};

Tag.prototype.append = function(node) {
    this.children.push(node);
    return this;
};

Tag.prototype.toJSON = function() {
    var jsonTag = { name : this.name };

    if (typeof this.attrs === 'object' && Object.keys(this.attrs).length > 0) {
        jsonTag.attrs = this.attrs;
    }

    if (this.children.length === 1 && typeof this.children[0] === 'string') {
        jsonTag.text = this.children[0];
    } else if (this.children.length > 0) {
        jsonTag.children = this.children.map(function(c) { return c.toJSON(); });
    }

    return jsonTag;
};



var Comment = xml.Comment = function Comment(comment) {
    this.comment = comment;
};

Comment.prototype.toJSON = function() {
    return { comment: this.comment };
};



var CData = xml.CData = function CData(chunk) {
    this.rawData = [];
    this.data = '';
    this.cached = true;

    if (typeof chunk !== 'undefined') {
        this.push(chunk);
    }
};

CData.prototype.push = function(chunk) {
    this.rawData.push(chunk);
    this.cached = false;
};

CData.prototype.getData = function() {
    if ( ! this.cached) {
        this.data = this.rawData.join('');
        this.cached = true;
    }

    return this.data;
};

CData.prototype.toString = function() {
    return this.getData();
};

CData.prototype.toJSON = function() {
    return { cdata : this.getData() };
};


module.exports = xml;
