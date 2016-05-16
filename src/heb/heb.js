import d3 from 'd3';

export default class Heb {
    constructor(el, opts) {
        this.$el = d3.select(el);                                 //容器
        var width = parseInt(this.$el.style('width'));
        var height = parseInt(this.$el.style('height'));
        var maxR = Math.min(width, height) / 2;

        this.opts = Object.assign({
            width: width,                                         //容器宽度
            height: height,                                       //容器高度
            radius: maxR - 150,                                        //路径圆半径
            tension: 0.85                                         //路径张力
        }, opts);
        this.draw();
    }

    draw() {
        var cluster = d3.layout.cluster()
            .size([360, this.opts.radius])
            .sort(null)
            .value(function (d) {
                return d.size;
            });

        var bundle = d3.layout.bundle();

        var line = d3.svg.line.radial()
            .interpolate('bundle')
            .tension(this.opts.tension)
            .radius(function (d) {
                return d.y;
            })
            .angle(function (d) {
                return d.x / 180 * Math.PI;
            });

        var svg = this.svg = this.$el.append('svg')
            .attr('width', this.opts.width)
            .attr('height', this.opts.height)
            .attr('class', 'c3-heb-wrapper')
            .append('g')
            .attr('transform', 'translate(' + this.opts.width / 2 + ',' + this.opts.height / 2 + ')');

        var nodes = cluster.nodes(this.packageHierarchy(this.opts.data)),
            links = this.packageImports(nodes),
            splines = bundle(links);

        var path = svg.selectAll('path.link')
            .data(links)
            .enter().append('path')
            .attr('class', function (d) {
                return 'link source-' + d.source.key + ' target-' + d.target.key;
            })
            .attr('d', function (d, i) {
                return line(splines[i]);
            });

        svg.selectAll('g.node')
            .data(nodes.filter(function (n) {
                return !n.children;
            }))
            .enter().append('g')
            .attr('class', 'node')
            .attr('id', function (d) {
                return 'node-' + d.key;
            })
            .attr('transform', function (d) {
                return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')';
            })
            .append('text')
            .attr('dx', function (d) {
                return d.x < 180 ? 8 : -8;
            })
            .attr('dy', '.31em')
            .attr('text-anchor', function (d) {
                return d.x < 180 ? 'start' : 'end';
            })
            .attr('transform', function (d) {
                return d.x < 180 ? null : 'rotate(180)';
            })
            .text(function (d) {
                return d.name;
            })
            .on('mouseover', this.nodeMouseover.bind(this))
            .on('mouseout', this.nodeMouseout.bind(this));
    }

    nodeMouseover(d) {
        this.svg.selectAll('path.link.target-' + d.key)
            .classed('target', true)
            .each(this.updateNodes('source', true));

        this.svg.selectAll('path.link.source-' + d.key)
            .classed('source', true)
            .each(this.updateNodes('target', true));
    }

    nodeMouseout(d) {
        this.svg.selectAll('path.link.source-' + d.key)
            .classed('source', false)
            .each(this.updateNodes('target', false));

        this.svg.selectAll('path.link.target-' + d.key)
            .classed('target', false)
            .each(this.updateNodes('source', false));
    }

    updateNodes(name, value) {
        var svg = this.svg;
        return function (d) {
            if (value) this.parentNode.appendChild(this);
            svg.select('#node-' + d[name].key).classed(name, value);
        };
    }

    packageHierarchy(classes) {
        var map = {name: '', children: []};

        classes.forEach(function (d) {
            map.children.push({name: d.name, size: d.size, key: d.name.replace(/[\.\s\:]/ig, '-')});
        });

        return map;
    }

    packageImports(nodes) {
        var map = {},
            imports = [];
        nodes.forEach(function (d) {
            map[d.name] = d;
        });

        this.opts.data.forEach(function (d) {
            if (d.imports) d.imports.forEach(function (i) {
                imports.push({source: map[d.name], target: map[i]});
            });
        });

        return imports;
    }
}