# Sketch SVG cleaner

## Convert Sketch's layer names in class names

This is just a hack, it won't be maintained.

run the command in the directory where your SVG are exported from Sketch, it will remove useless XML nodes, convert `ID`s to `CLASS` and add a prefix to those (`svg-` by default).

    > bin/sketchCleaner


## Example:

```svg
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="9px" height="6px" viewBox="0 0 9 6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    <!-- Generator: Sketch 3.0.3 (7891) - http://www.bohemiancoding.com/sketch -->
    <title>down-arrow</title>
    <desc>Created with Sketch.</desc>
    <defs></defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <g id="down-arrow" sketch:type="MSArtboardGroup" fill="#FF0000">
            <path d="M0,0 L9.03566885,0 L4.37312037,6 L0,0 L0,0 Z" id="shape" sketch:type="MSShapeGroup"></path>
        </g>
    </g>
</svg>
```

will become:

```svg
<?xml version="1.0"?>
<svg width="9px" height="6px" viewBox="0 0 9 6" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g fill="#FF0000" class="svg-down-arrow">
        <path d="M0,0 L9.03566885,0 L4.37312037,6 L0,0 L0,0 Z" class="svg-shape"/>
    </g>
</svg>
```

(inspired from [Xamel](https://github.com/nodules/xamel) for the XML parsing)

### How to use the SVG in your project?

```javascript
var placeholder = document.createComment("svg");
element.appendChild(placeholder);
$.get(url, null, function(data) {
  var img = document.adoptNode(data.querySelector('svg'));
  element.insertBefore(img, placeholder);
  element.removeChild(placeholder);
}, 'xml');
```

```css
.svg-shape { /* this class name correspond to a layer name in Sketch */
    fill: blue;
}
```

Animations and transitions will work in CSS.