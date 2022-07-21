import { AdjList } from './AdjList.js';

export class GraphNode {
    constructor(name = null) {
        this.x = -1;
        this.y = -1;
        this.name = name;
        this.adjList = new AdjList();
    }

    getX() { return this.x; }

    getY() { return this.y; }

    setX(x) { this.x = x; }

    setY(y) { this.y = y; }

    setXY(x,y) { 
        this.setX(x);
        this.setY(y);
    }

    getAdjList() { return this.adjList; }

    setAdjList(list) { this.adjList = list; }

    printAdjList() { this.adjList.print(this.name); }

    clearAdjList() { this.adjList = new AdjList(); }

    addEdge(node) { this.adjList.add(node); }

    getName() { return this.name; }

    setName(name) { this.name = name; }

}