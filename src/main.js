import {aStar, calcHeuristic} from './search.js';
import { GraphNode } from './GraphNode.js';


//nodes for testing setup globally
var src = new GraphNode("src");
var dest = new GraphNode("dest");

var one = new GraphNode("1");
var two = new GraphNode("2");
var three = new GraphNode("3");
var four = new GraphNode("4");
var five = new GraphNode("5");
var six = new GraphNode("6");
var seven = new GraphNode("7");
var eight = new GraphNode("8");
var nine = new GraphNode("9");

var hallNodes = new Array(32);
var doorNodes = new Array(23);

function initEdges(num) {
    switch(num) {
        case 1:
            setupGraph1();
            break;
        case 2:
            setupGraph2();
            break;
        case 3: 
            setupGraph3();
            break;
        default:
            console.log("Invalid case setup")
    }
}


function setupGraph4() {
    src.adjList.addGNode(one, "N");
    one.adjList.addGNode(two, "N");
    two.adjList.addGNode(three, "N");
    three.adjList.addGNode(four, "N");
    four.adjList.addGNode(five, "N");
    five.adjList.addGNode(six, "N");
    six.adjList.addGNode(seven, "N");
    seven.adjList.addGNode(eight, "N");
    eight.adjList.addGNode(nine, "N");
    nine.adjList.addGNode(dest, "N");

    one.adjList.addGNode(src, "S");
    two.adjList.addGNode(one, "S");
    three.adjList.addGNode(two, "S");
    four.adjList.addGNode(three, "S");
    five.adjList.addGNode(four, "S");
    six.adjList.addGNode(five, "S");
    seven.adjList.addGNode(six, "S");
    eight.adjList.addGNode(seven, "S");
    nine.adjList.addGNode(eight, "S");
    dest.adjList.addGNode(nine, "S");

}

function setupGraph2() {
    src.adjList.addGNode(one, "N");
    one.adjList.addGNode(two, "N");
    two.adjList.addGNode(three, "N");
    two.adjList.addGNode(six, "E");
    three.adjList.addGNode(four, "E");
    four.adjList.addGNode(five, "N");
    four.adjList.addGNode(six, "S");
    four.adjList.addGNode(seven, "E");
    five.adjList.addGNode(eight, "E");
    five.adjList.addGNode(nine, "W");
    seven.adjList.addGNode(dest, "E");

    one.adjList.addGNode(src, "S");
    two.adjList.addGNode(one, "S");
    three.adjList.addGNode(two, "S");
    six.adjList.addGNode(two, "W");
    four.adjList.addGNode(three, "W");
    five.adjList.addGNode(four, "S");
    six.adjList.addGNode(four, "N");
    seven.adjList.addGNode(four, "W");
    eight.adjList.addGNode(five, "W");
    nine.adjList.addGNode(five, "E");
    dest.adjList.addGNode(seven, "W");
}

function setupGraph3() {
    src.adjList.addGNode(one, "N");
    one.adjList.addGNode(two, "N");
    two.adjList.addGNode(three, "N");
    two.adjList.addGNode(six, "E");
    three.adjList.addGNode(four, "E");
    four.adjList.addGNode(five, "N");
    four.adjList.addGNode(six, "S");
    four.adjList.addGNode(seven, "E");
    five.adjList.addGNode(eight, "E");
    five.adjList.addGNode(nine, "W");
    nine.adjList.addGNode(dest, "W");

    one.adjList.addGNode(src, "S");
    two.adjList.addGNode(one, "S");
    three.adjList.addGNode(two, "S");
    six.adjList.addGNode(two, "W");
    four.adjList.addGNode(three, "W");
    five.adjList.addGNode(four, "S");
    six.adjList.addGNode(four, "N");
    seven.adjList.addGNode(four, "W");
    eight.adjList.addGNode(five, "W");
    nine.adjList.addGNode(five, "E");
    dest.adjList.addGNode(nine, "E");
}

function setupGraph1() {
    var name = "hall";
    for(var i = 0; i < hallNodes.length; i++) {
        hallNodes[i] = new GraphNode(name + i);
    }

    name = "door"
    for(var i = 0; i < doorNodes.length; i++) {
        doorNodes[i] = new GraphNode(name + i);
    }

    const directions = ["W", "N", "E", "S"];
    var currDirection = 0;
    for(var i = 0; i < hallNodes.length; i++) {
        if(i == 10 || i == 16 || i == 26) {
            currDirection++;
        }
        hallNodes[i].adjList.addGNode(hallNodes[(i+1)%hallNodes.length], directions[currDirection]);
        hallNodes[(i+1)%hallNodes.length].adjList.addGNode(hallNodes[i], directions[(currDirection+2)%4]);
    }

    var hallDoorPairsSN = [
        [2,7],[4,8],[6,9],[8,10],[16,22],[17,21],[18,20],[19,19],[20,18],[21,17],
        [22,16],[23,15],[24,14],[25,13]];

    var hallDoorPairsNS = [[0,0],[2,1],[4,2],[5,3],[7,4],[8,5],[10,6],[20,12],[25,11]];

    for(var i = 0; i < hallDoorPairsNS.length; i++) {
        var node1 = hallDoorPairsNS[i][0];
        var node2 = hallDoorPairsNS[i][1];

        hallNodes[node1].adjList.addGNode(doorNodes[node2], "S");
        doorNodes[node2].adjList.addGNode(hallNodes[node1], "N");
    }

    for(var i = 0; i < hallDoorPairsSN.length; i++) {
        var node1 = hallDoorPairsSN[i][0];
        var node2 = hallDoorPairsSN[i][1];

        hallNodes[node1].adjList.addGNode(doorNodes[node2], "N");
        doorNodes[node2].adjList.addGNode(hallNodes[node1], "S");
    }

    var node = aStar(doorNodes[0], doorNodes[22]);

    return node.path;



    

//     for(var i = 0; i < hallNodes.length; i++) {
//         hallNodes[i].printAdjList();
//     }

//     for(var i = 0; i < doorNodes.length; i++) {
//         doorNodes[i].printAdjList();
//     }

}

function testAdjLists() {
    console.log("ADJACENCY LISTS:");
    src.printAdjList();
    one.printAdjList();
    two.printAdjList();
    three.printAdjList();
    four.printAdjList();
    five.printAdjList();
    six.printAdjList();
    seven.printAdjList();
    eight.printAdjList();
    nine.printAdjList();
    dest.printAdjList();
    console.log("\n");
}


function testHeuristic() {
    console.log("HEURISTIC VALUES: ")
    var map = calcHeuristic(dest);
    console.log(dest.getName() + "'s heuristic value: " + map[dest.getName()]);
    console.log(nine.getName() + "'s heuristic value: " + map[nine.getName()]);
    console.log(eight.getName() + "'s heuristic value: " + map[eight.getName()]);
    console.log(seven.getName() + "'s heuristic value: " + map[seven.getName()]);
    console.log(six.getName() + "'s heuristic value: " + map[six.getName()]);
    console.log(five.getName() + "'s heuristic value: " + map[five.getName()]);
    console.log(four.getName() + "'s heuristic value: " + map[four.getName()]);
    console.log(three.getName() + "'s heuristic value: " + map[three.getName()]);
    console.log(two.getName() + "'s heuristic value: " + map[two.getName()]);
    console.log(one.getName() + "'s heuristic value: " + map[one.getName()]);
    console.log(src.getName() + "'s heuristic value: " + map[src.getName()]);
    console.log("\n");
}

function testSearch() {
    console.log("SEARCH: ");
    var node = aStar(src, dest);
    console.log("path: " + node.path);
    console.log("cost: " + node.cost);
    console.log("\n");
}

function emptyAdjLists() {
    src.clearAdjList();
    dest.clearAdjList();
    one.clearAdjList();
    two.clearAdjList();
    three.clearAdjList();
    four.clearAdjList();
    five.clearAdjList();
    six.clearAdjList();
    seven.clearAdjList();
    eight.clearAdjList();
    nine.clearAdjList();
}

export function runTest(num) {
    if(num == 1) {
        return setupGraph1();
    } else {
        initEdges(num);
        // testAdjLists();
        // testHeuristic();
        // testSearch();
        var node = aStar(src, dest);
        // console.log("path: " + node.path);
        emptyAdjLists();
        return node.path;
    }
}



