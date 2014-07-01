var XMLWriter = require('xml-writer');

function writeAttrs(xw, node) {
    for (i in node.attrs){
        xw.writeAttribute(i, node.attrs[i]);
    }
}

function processNodeSet(xw, nset) {
    var idx, node;

    for (idx in nset) {
        node = nset[idx]
        if (node.name) {
            xw.startElement(node.name);
            if (node.attrs) writeAttrs(xw, node)
            if (node.children) processNodeSet(xw, node.children)
            else if (node.text) xw.text(node.text);
            xw.endElement();
        } else if (node.comment) {
            xw.writeComment(node.comment);
        } else if (node.cdata) {
            xw.writeCData(node.cdata);
        }
    }
}

module.exports = function serialize(nset, options) {

    if (typeof options !== 'object' || options === null) {
        options = {};
    }

    var xw = new XMLWriter(options.pretty);

    if (options.header !== false) {
        xw.startDocument();
    }

    processNodeSet(xw, nset);

    return xw.toString();
}
