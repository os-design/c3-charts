# Install

## css
```html
<link rel="stylesheet" href="./dist/c3.css">
```

## js

```html
<script src="./dist/c3.js"></script>
```

# Charts

## [Hierarchical Edge Bundling](http://mbostock.github.io/d3/talk/20111116/bundle.html)

## usage
```javascript
c3.heb(el, data, config);
```

## params


### el

- *type* : css selector
- *desc* : the container of the chart
- *demo* : #app
### data

- *type* : Object of Array
- *desc* : the data
- *demo* : name is the target key, imports is the source key

```json
[
  {
    "name": "flare.analytics.cluster.AgglomerativeCluster",
    "size": 3938,
    "imports": [
      "flare.animate.Transitioner",
      "flare.vis.data.DataList",
      "flare.util.math.IMatrix"
    ]
  },
  {
    "name": "flare.analytics.cluster.CommunityStructure",
    "size": 3812,
    "imports": [
      "flare.analytics.cluster.HierarchicalCluster",
      "flare.animate.Transitioner"
    ]
  }
]
```

### config

- *type* : Object
- *desc* : the config of the chart

**width**

the width of the chart, default is el width.

**height**

the height of the chart, default is el height.

**radius**

the radius of the line circle, default is `Math.min(width, height) / 2 - 150`

**tension**

the tension of the line, default is `0.85`