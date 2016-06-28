'use strict';

/* exported sankeyChart */

function sankeyChart() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 800,
    height = 800,
    scale = d3.scale.linear()
      .domain([0,5000, 10000, 100000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 910000, 950000])
      .range(['#303F9F', '#3F51B5', '#448AFF', '#E64A19','#03A9F4', '#4CAF50', '#00BCD4', '#00BCD4', '#FF4081', '#009688', '#CDDC39', '#D32F2F', '#B6B6B6', '#607D8B', '#303F9F', '#8BC34A', '#FFA000', '#CDDC39'  ]);

  var nodeVal = function(d) { return { nodes: d[0].map(function(dd) { return { name: dd[0], node: dd[1] }; }) }; };
  var linkVal = function(d) { return { links: d[1].map(function(dd) { return { source: dd[0], target: dd[1], value: dd[2] }; }) }; };

  function chart(selection) {
    selection.each(function (data) {
      data = data.map(function (d) {
        return {nodes: nodeVal.call(data, d), links: linkVal.call(data, d) };
      })[0];

      var nodeMap = {};

      data.nodes.forEach(function(d) { nodeMap[d.name] = d; });
      data.links = data.links.map(function(d) {
        return {
          source: nodeMap[d.source],
          target: nodeMap[d.target],
          value: d.value
        };
      });

      // append the svg canvas to the page
      var svg = d3.select(this).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

      // Set the sankey diagram properties
      var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(10)
        .size([width - margin.left - margin.right, height - margin.top - margin.bottom]);

      var path = sankey.link();

      sankey
        .nodes(data.nodes)
        .links(data.links)
        .layout(32);

      // add in the links
      var link = svg.append('g').selectAll('.link')
        .data(data.links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

      var units = 'Incidents',
          formatNumber = d3.format(',.0f'),    // zero decimal places
          format = function(d) { return formatNumber(d) + ' ' + units; };

      // add the link titles
      link.append('title')
        .text(function(d) {
          return d.source.name + ' → ' +
            d.target.name + '\n' + format(d.value); });

      // add in the nodes
      var node = svg.append('g').selectAll('.node')
        .data(data.nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'; })
        .call(d3.behavior.drag()
          .origin(function(d) { return d; })
          .on('dragstart', function() {
            this.parentNode.appendChild(this); })
          .on('drag', function(d) {
            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y));
            d3.select(this).attr('transform', 'translate(' + d.x + ',' + d.y + ')');

            sankey.relayout();
            link.attr('d', path);
          }));

      // add the rectangles for the nodes
      node.append('rect')
        .attr('height', function(d) { return d.dy; })
        .attr('id', function(d) { return d.name; })
        .attr('width', sankey.nodeWidth())
        .style('fill',function (d) {
          return scale(d.value);
        })
        .append('title')
        .text(function(d) {
          return d.name + '\n' + format(d.value); });

      // add in the title for the nodes
      node.append('text')
        .attr('x', -6)
        .attr('y', function(d) { return d.dy / 2; })
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .attr('class', 'node-text')
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x < width / 2; })
        .attr('x', 6 + sankey.nodeWidth())
        .attr('text-anchor', 'start');
    });
  }

  chart.margin = function (value) {
    if (!arguments.length) {
      return margin;
    }
    margin = value;
    return chart;
  };

  chart.width = function (value) {
    if (!arguments.length) {
      return width;
    }
    width = value;
    return chart;
  };

  chart.height = function (value) {
    if (!arguments.length) {
      return height;
    }
    height = value;
    return chart;
  };

  chart.nodes = function (value) {
    if (!arguments.length) { return nodeVal; }
    nodeVal = value;
    return chart;
  };

  chart.links = function (value) {
    if (!arguments.length) { return linkVal; }
    linkVal = value;
    return chart;
  };

  return chart;
}

d3.sankey = function() {
  var sankey = {},
    nodeWidth = 24,
    nodePadding = 8,
    size = [1, 1],
    nodes = [],
    links = [],
    sinksRight = true;

  sankey.nodeWidth = function(_) {
    if (!arguments.length) { return nodeWidth; }
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodePadding = function(_) {
    if (!arguments.length) { return nodePadding; }
    nodePadding = +_;
    return sankey;
  };

  sankey.nodes = function(_) {
    if (!arguments.length) { return nodes; }
    nodes = _;
    return sankey;
  };

  sankey.links = function(_) {
    if (!arguments.length) { return links; }
    links = _;
    return sankey;
  };

  sankey.size = function(_) {
    if (!arguments.length) { return size; }
    size = _;
    return sankey;
  };

  sankey.sinksRight = function (_) {
    if (!arguments.length) { return sinksRight; }
    sinksRight = _;
    return sankey;
  };

  sankey.layout = function(iterations) {
    computeNodeLinks();
    computeNodeValues();
    computeNodeBreadths();
    computeNodeDepths(iterations);
    return sankey;
  };

  sankey.relayout = function() {
    computeLinkDepths();
    return sankey;
  };

  // SVG path data generator, to be used as 'd' attribute on 'path' element selection.
  sankey.link = function() {
    var curvature = 0.5;

    function link(d) {
      var x0 = d.source.x + d.source.dx,
        x1 = d.target.x,
        xi = d3.interpolateNumber(x0, x1),
        x2 = xi(curvature),
        x3 = xi(1 - curvature),
        y0 = d.source.y + d.sy + d.dy / 2,
        y1 = d.target.y + d.ty + d.dy / 2;
      return  'M' + x0 + ',' + y0 +
              'C' + x2 + ',' + y0 +
              ' ' + x3 + ',' + y1 +
              ' ' + x1 + ',' + y1;
    }

    link.curvature = function(_) {
      if (!arguments.length) { return curvature; }
      curvature = +_;
      return link;
    };

    return link;
  };

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach(function(node) {
      // Links that have this node as source.
      node.sourceLinks = [];
      // Links that have this node as target.
      node.targetLinks = [];
    });

    links.forEach(function(link) {
      var source = link.source,
        target = link.target;
      if (typeof source === 'number') { source = link.source = nodes[link.source]; }
      if (typeof target === 'number') { target = link.target = nodes[link.target]; }
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    nodes.forEach(function(node) {
      node.value = Math.max(
        d3.sum(node.sourceLinks, value),
        d3.sum(node.targetLinks, value)
      );
    });
  }

  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {
    var remainingNodes = nodes,
      nextNodes,
      x = 0;

    // Work from left to right.
    // Keep updating the breath (x-position) of nodes that are target of recently updated nodes.
    while (remainingNodes.length && x < nodes.length) {
      nextNodes = [];
      remainingNodes.forEach(function(node) {
        node.x = x;
        node.dx = nodeWidth;
        node.sourceLinks.forEach(function(link) {
          if (nextNodes.indexOf(link.target) < 0) {
            nextNodes.push(link.target);
          }
        });
      });
      remainingNodes = nextNodes;
      ++x;
    }

    // Optionally move pure sinks always to the right.
    if (sinksRight) {
      moveSinksRight(x);
    }

    scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
  }

  /*
  function moveSourcesRight() {
    nodes.forEach(function(node) {
      if (!node.targetLinks.length) {
        node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
      }
    });
  }
  */

  function moveSinksRight(x) {
    nodes.forEach(function(node) {
      if (!node.sourceLinks.length) {
        node.x = x - 1;
      }
    });
  }

  function scaleNodeBreadths(kx) {
    nodes.forEach(function(node) {
      node.x *= kx;
    });
  }

  // Compute the depth (y-position) for each node.
  function computeNodeDepths(iterations) {
    // Group nodes by breath.
    var nodesByBreadth = d3.nest()
      .key(function(d) { return d.x; })
      .sortKeys(d3.ascending)
      .entries(nodes)
      .map(function(d) { return d.values; });

    function initializeNodeDepth() {
      // Calculate vertical scaling factor.
      var ky = d3.min(nodesByBreadth, function (nodes) {
        return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
      });

      nodesByBreadth.forEach(function (nodes) {
        nodes.forEach(function (node, i) {
          node.y = i;
          node.dy = node.value * ky;
        });
      });

      links.forEach(function (link) {
        link.dy = link.value * ky;
      });
    }

    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            // Value-weighted average of the y-position of source node centers linked to this node.
            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedSource(link) {
        return (link.source.y + link.sy + link.dy / 2) * link.value;
      }
    }

    function relaxRightToLeft(alpha) {
      nodesByBreadth.slice().reverse().forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            // Value-weighted average of the y-positions of target nodes linked to this node.
            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedTarget(link) {
        return (link.target.y + link.ty + link.dy / 2) * link.value;
      }
    }

    function resolveCollisions() {
      nodesByBreadth.forEach(function(nodes) {
        var node,
          dy,
          y0 = 0,
          n = nodes.length,
          i;

        // Push any overlapping nodes down.
        nodes.sort(ascendingDepth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y0 - node.y;
          if (dy > 0) { node.y += dy; }
          y0 = node.y + node.dy + nodePadding;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y0 - nodePadding - size[1];
        if (dy > 0) {
          y0 = node.y -= dy;

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) { node.y -= dy; }
            y0 = node.y;
          }
        }
      });
    }

    initializeNodeDepth();
    resolveCollisions();
    computeLinkDepths();

    for (var alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft(alpha *= 0.99);
      resolveCollisions();
      computeLinkDepths();
      relaxLeftToRight(alpha);
      resolveCollisions();
      computeLinkDepths();
    }

    function ascendingDepth(a, b) {
      return a.y - b.y;
    }
  }

  // Compute y-offset of the source endpoint (sy) and target endpoints (ty) of links,
  // relative to the source/target node's y-position.
  function computeLinkDepths() {
    nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function(node) {
      var sy = 0, ty = 0;
      node.sourceLinks.forEach(function(link) {
        link.sy = sy;
        sy += link.dy;
      });
      node.targetLinks.forEach(function(link) {
        link.ty = ty;
        ty += link.dy;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  // Y-position of the middle of a node.
  function center(node) {
    return node.y + node.dy / 2;
  }

  // Value property accessor.
  function value(x) {
    return x.value;
  }

  return sankey;
};
