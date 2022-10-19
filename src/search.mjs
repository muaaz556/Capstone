import { AdjList } from "./AdjList.mjs";

export function aStar(start, dest) {

    //ideally have this be some pre-calculated value we lookup instead of calling calcHeuristic
    var heuristic = calcHeuristic(dest);

    var curr = start;
    var list = [];
    var currCost = 0;
    var currPath = start.getName();

    while(curr.getName() != dest.getName()) {
        
        //add all nodes adjacent to current node to list with each nodes' cost, heuristic, and path
        var tempAdjList = curr.adjList;
        var recurNode = tempAdjList.head;
        for(var i = 0; i < tempAdjList.len; i++) {
            list.push({
                cost: currCost + 1,
                heuristic: heuristic[recurNode.graphNode.getName()],
                path: currPath + " " + recurNode.getDirection() + " - " + recurNode.graphNode.getName(),
                node: recurNode
            });
            recurNode = recurNode.next;
        }

        //find node in list with lowest cost + heuristic
        var minTotalCost = 100000;
        var minElement = null;

        list.forEach(element => {
            if(element.cost + element.heuristic < minTotalCost) {
                minTotalCost = element.cost + element.heuristic;
                minElement = element;
            }
        });

        //remove lowest cost + heuristic element from list
        var index = list.indexOf(minElement);
        list.splice(index,1);

        //update curr with the new min element
        curr = minElement.node.graphNode;
        currPath = minElement.path;
        currCost = minElement.cost;
    }

    return minElement;
}


/*
calculates heuristic values for all nodes in the graph
for a given destination node
heuristic is the number of steps away the destination is from any node
returns a hash map that takes a node as input and return an integer value that 
*/

export function calcHeuristic(dest) {
    var map = {};
    var heuristic = 1;
    map[dest.getName()] = 0;
    
    var list = dest.adjList;

    //keep running until no new nodes are found
    while (list.len > 0) {

        //loop through current list of nodes
        var tempList = new AdjList();
        var listNode = list.head;
        for(let i = 0; i < list.len; i++) {

            //if node hasn't been mapped yet, add it to map
            if (!(listNode.graphNode.getName() in map)) {
                map[listNode.graphNode.getName()] = heuristic;

                //add adjacent nodes to a temp list if the adjacent node isn't already in the map
                var listNodeAdjList = listNode.graphNode.adjList;
                var recurNode = listNodeAdjList.head;
                for(let j = 0; j < listNodeAdjList.len; j++) {
                    if(!(recurNode.graphNode.getName() in map)) {
                        // var tempAdjListNode = new adjListNode(recurNode.graphNode);
                        tempList.addGNode(recurNode.graphNode);
                    }
                    recurNode = recurNode.next;
                }
            }

            listNode = listNode.next;
        }

        //update list and heuristic value for current iteration
        list = tempList;
        heuristic++;
    }

    return map;
}