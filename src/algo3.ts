import {Node, NodeType} from './algo'
export function WriteGraph(data: string) {
    let buffer = "";
    let group = []
    let connections = []
    let groupId = -1;
    let prevSymbol = "";
    let portKey = 1
    group.push({key: 0, category: "Merge"})
    group.push({key: groupId, isGroup: true})
    connections.push({from: 0, to: groupId})
    for(let i = 0; i < data.length; i++) {
        const symbol = data[i]
        if(symbol == '*') {
            group.push({key: ++portKey, text: buffer, color: "lightblue", group: groupId})
            group.push({key: --groupId, isGroup: true})
            connections.push({from: groupId+1, to: groupId})
            prevSymbol = symbol
            buffer = ""
        } else if (symbol == '+') {
            group.push({key: ++portKey, text: buffer, color: "lightblue", group: groupId})
            prevSymbol = symbol
            buffer = ""
        } else {
            buffer += symbol
        }
    }
    group.push({key: 9999, category: "Merge"})
    connections.push({from: groupId, to: 9999})
    if(buffer.length > 0) {
        group.push({key: ++portKey, text: buffer, color: "lightblue", group: groupId})
    }
    return {group, connections}
}

export function CalculateReliability(node: Node, values: Map<string, number>): number {
    if(node.Type == NodeType.Variable) {
        const value = values.get(node.Value);
        if(value == undefined)
            throw new Error("Enter values of all variables")
        return value
    }
    else if(node.children && node.children.length == 2) {
        const p1 = CalculateReliability(node.children[0], values)
        const p2 = CalculateReliability(node.children[1], values)
        if(node.Type == NodeType.OperandOR) {
            return p1 + p2 - p1 * p2
        }
        if(node.Type == NodeType.OperandAND) {
            return p1 * p2
        }
    }
    throw new Error("Invalid input format")
}