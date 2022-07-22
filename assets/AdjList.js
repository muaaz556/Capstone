import { adjListNode } from "./adjListNode.js";

export class AdjList{
    constructor() {
        this.head = null;
        this.tail = null;
        this.len = 0;
    }

    addAdjNode(node) {
        if(this.head == null) {
            this.head = node;
        } else {
            this.tail.next = node;
        }
        this.tail = node;
        
        this.len++;
    }

    addGNode(node, direction = null) {
        var nodeToAdd = new adjListNode(node);
        if(direction != null) {
            nodeToAdd.setDirection(direction);
        }

        if(this.head == null) {
            this.head = nodeToAdd;
        } else {
            this.tail.next = nodeToAdd;
        }
        this.tail = nodeToAdd;
        
        this.len++;
    }

    getLen() { return this.len }

    print(name) {
        var recur = this.head;
        var output = name + "'s adjacency list: ";
        for(var i = 0; i < this.len; i++) {
            output += recur.graphNode.name + recur.getDirection() + ",";
            recur = recur.next;
        }
        console.log(output);
    }


}