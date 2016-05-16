(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["d3"], factory);
	else if(typeof exports === 'object')
		exports["c3"] = factory(require("d3"));
	else
		root["c3"] = factory(root["d3"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _index = __webpack_require__(1);

	Object.keys(_index).forEach(function (key) {
	  if (key === "default") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _index[key];
	    }
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.heb = heb;

	var _heb = __webpack_require__(2);

	var _heb2 = _interopRequireDefault(_heb);

	__webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function heb(el, data, config) {
	    return new _heb2.default(el, data, config);
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _d = __webpack_require__(3);

	var _d2 = _interopRequireDefault(_d);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Heb = function () {
	    function Heb(el, opts) {
	        _classCallCheck(this, Heb);

	        this.$el = _d2.default.select(el); //容器
	        var width = parseInt(this.$el.style('width'));
	        var height = parseInt(this.$el.style('height'));
	        var maxR = Math.min(width, height) / 2;

	        this.opts = Object.assign({
	            width: width, //容器宽度
	            height: height, //容器高度
	            radius: maxR - 150, //路径圆半径
	            tension: 0.85 //路径张力
	        }, opts);
	        this.draw();
	    }

	    _createClass(Heb, [{
	        key: 'draw',
	        value: function draw() {
	            var cluster = _d2.default.layout.cluster().size([360, this.opts.radius]).sort(null).value(function (d) {
	                return d.size;
	            });

	            var bundle = _d2.default.layout.bundle();

	            var line = _d2.default.svg.line.radial().interpolate('bundle').tension(this.opts.tension).radius(function (d) {
	                return d.y;
	            }).angle(function (d) {
	                return d.x / 180 * Math.PI;
	            });

	            var svg = this.svg = this.$el.append('svg').attr('width', this.opts.width).attr('height', this.opts.height).attr('class', 'c3-heb-wrapper').append('g').attr('transform', 'translate(' + this.opts.width / 2 + ',' + this.opts.height / 2 + ')');

	            var nodes = cluster.nodes(this.packageHierarchy(this.opts.data)),
	                links = this.packageImports(nodes),
	                splines = bundle(links);

	            var path = svg.selectAll('path.link').data(links).enter().append('path').attr('class', function (d) {
	                return 'link source-' + d.source.key + ' target-' + d.target.key;
	            }).attr('d', function (d, i) {
	                return line(splines[i]);
	            });

	            svg.selectAll('g.node').data(nodes.filter(function (n) {
	                return !n.children;
	            })).enter().append('g').attr('class', 'node').attr('id', function (d) {
	                return 'node-' + d.key;
	            }).attr('transform', function (d) {
	                return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')';
	            }).append('text').attr('dx', function (d) {
	                return d.x < 180 ? 8 : -8;
	            }).attr('dy', '.31em').attr('text-anchor', function (d) {
	                return d.x < 180 ? 'start' : 'end';
	            }).attr('transform', function (d) {
	                return d.x < 180 ? null : 'rotate(180)';
	            }).text(function (d) {
	                return d.name;
	            }).on('mouseover', this.nodeMouseover.bind(this)).on('mouseout', this.nodeMouseout.bind(this));
	        }
	    }, {
	        key: 'nodeMouseover',
	        value: function nodeMouseover(d) {
	            this.svg.selectAll('path.link.target-' + d.key).classed('target', true).each(this.updateNodes('source', true));

	            this.svg.selectAll('path.link.source-' + d.key).classed('source', true).each(this.updateNodes('target', true));
	        }
	    }, {
	        key: 'nodeMouseout',
	        value: function nodeMouseout(d) {
	            this.svg.selectAll('path.link.source-' + d.key).classed('source', false).each(this.updateNodes('target', false));

	            this.svg.selectAll('path.link.target-' + d.key).classed('target', false).each(this.updateNodes('source', false));
	        }
	    }, {
	        key: 'updateNodes',
	        value: function updateNodes(name, value) {
	            var svg = this.svg;
	            return function (d) {
	                if (value) this.parentNode.appendChild(this);
	                svg.select('#node-' + d[name].key).classed(name, value);
	            };
	        }
	    }, {
	        key: 'packageHierarchy',
	        value: function packageHierarchy(classes) {
	            var map = { name: '', children: [] };

	            classes.forEach(function (d) {
	                map.children.push({ name: d.name, size: d.size, key: d.name.replace(/[\.\s\:]/ig, '-') });
	            });

	            return map;
	        }
	    }, {
	        key: 'packageImports',
	        value: function packageImports(nodes) {
	            var map = {},
	                imports = [];
	            nodes.forEach(function (d) {
	                map[d.name] = d;
	            });

	            this.opts.data.forEach(function (d) {
	                if (d.imports) d.imports.forEach(function (i) {
	                    imports.push({ source: map[d.name], target: map[i] });
	                });
	            });

	            return imports;
	        }
	    }]);

	    return Heb;
	}();

	exports.default = Heb;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ])
});
;