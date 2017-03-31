/*
 angular.treeview.js
 */
(function ( angular ) {
  'use strict';

  angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile', function( $compile ) {
    return {
      restrict: 'A',
      link: function ( scope, element, attrs ) {
        //tree id
        var treeId = attrs.treeId;

        //tree model
        var treeModel = attrs.treeModel;

        //node id
        var nodeId = attrs.nodeId || 'id';

        //node label
        var nodeLabel = attrs.nodeLabel || 'label';

        //children
        var nodeChildren = attrs.nodeChildren || 'children';

        //tree template
        var template =
          '<ul>' +
          '<li data-ng-class="(!node.children)?\'dsui-child-node-li\':\'dsui-parent-node-li\'" data-ng-repeat="node in ' + treeModel + '">' +
          '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length>=0 && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
          '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length>=0 && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
          '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length!==undefined"></i> ' +
          '<span data-ng-class="(!node.children)?\'dsui-child-node\':\'dsui-parent-node\'" data-ng-click="fnSelectNode(node)"><input data-ng-show="!node.children" type="checkbox" data-ng-model="node.ischeckboxselected"/><span data-ng-class="(!node.children)?\'dsui-child-node-chk-label\':\'dsui-parent-node-chk-label\'">{{node.' + nodeLabel + '}}</span></span>' +
          '<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
          '</li>' +
          '</ul>';


        //check tree id, tree model
        if( treeId && treeModel ) {

          //root node
          if( attrs.angularTreeview ) {

            //create tree object if not exists
            scope[treeId] = scope[treeId] || {};

            //if node head clicks,
            scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

                //Collapse or Expand
                selectedNode.collapsed = !selectedNode.collapsed;
              };

            //if node label clicks,
            scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

                //remove highlight from previous node
                if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
                  scope[treeId].currentNode.selected = undefined;
                }

                //set highlight to selected node
                selectedNode.selected = 'selected';

                //set currentNode
                scope[treeId].currentNode = selectedNode;
              };
          }

          //Rendering template.
          element.html('').append( $compile( template )( scope ) );
        }
      }
    };
  }]);
})( angular );
