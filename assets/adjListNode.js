export class adjListNode {
    constructor(graphNode, direction = null) {
        this.next = null;
        this.graphNode = graphNode;
        this.direction = direction;
    }

    setDirection(direction) { this.direction = direction; }

    getDirection() { return this.direction; }
}