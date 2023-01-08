export class Reader {
    private state: ReaderState = ReaderState.Idle;
    private data: string;
    private currentNode?: Node;
    private previousNode?: Node;
    private buffer: string = '';

    constructor(data: string) {
        this.data = data.replace(' ', '');
    }

    private isVariable(sym: string) {
        return sym >= 'a' && sym <= 'z' || sym >= '0' && sym <= '9';
    }

    private clearBuffer = () => this.buffer = '';

    private addChild (node: Node) {
        if(!this.currentNode)
            return;
        if(this.currentNode.children)
            this.currentNode.children.push(node)
        else
            this.currentNode.children = [node]
    }

    public ReadNodes() {
        for(let i = 0; i < this.data.length; i++) {
            const symbol = this.data[i];
            if(this.state == ReaderState.Idle || this.state == ReaderState.ReadingOperand) {
                if(this.isVariable(symbol)) {
                    this.state = ReaderState.ReadingVariables
                    this.buffer += symbol;
                    continue;
                } else {
                    throw new Error('Invalid format')
                }
            }
            
            if (this.state == ReaderState.ReadingVariables) {
                if(this.isVariable(symbol)) {
                    this.buffer += symbol;
                    continue;
                }
                // Reading OR operand
                if(symbol == '+') {
                    this.state = ReaderState.ReadingOperand;
                    const varNode: Node = {
                        Type: NodeType.Variable,
                        Value: this.buffer,
                    }

                    if(!this.currentNode) {
                        this.currentNode = {
                            Type: NodeType.OperandOR,
                            Value: OperandValue.OR,
                            children: [varNode]
                        }
                    } else if (this.currentNode.Type == NodeType.OperandOR) {
                        this.addChild(varNode);
                    } else if (this.currentNode.Type == NodeType.OperandAND) {
                        this.previousNode = this.currentNode;
                        const operandNode: Node = {
                            Type: NodeType.OperandOR,
                            Value: OperandValue.OR,
                            children: [varNode]
                        };
                        this.currentNode = operandNode;
                    } else {
                        throw new Error("Invalid format")
                    }
                    this.clearBuffer();
                    continue
                }
                //Reading AND operand
                if (symbol == '*') {
                    this.state = ReaderState.ReadingOperand;
                    const varNode: Node = {
                        Type: NodeType.Variable,
                        Value: this.buffer,
                    }

                    if(!this.currentNode) {
                        this.currentNode = {
                            Type: NodeType.OperandAND,
                            Value: OperandValue.AND,
                            children: [varNode]
                        }
                    } else if (this.currentNode.Type == NodeType.OperandOR) {
                        this.addChild(varNode);
                        const operandNode: Node = {
                            Type: NodeType.OperandAND,
                            Value: OperandValue.AND,
                            children: [this.currentNode]
                        };
                        this.currentNode = operandNode
                        if(this.previousNode) {
                            console.log("1", this.currentNode, this.previousNode)
                            this.addChild(this.previousNode)
                        }
                    } else if (this.currentNode.Type  == NodeType.OperandAND) {
                        this.addChild(varNode)
                    } else {
                        throw new Error("Invalid format")
                    }
                    this.clearBuffer();
                    continue
                }
            }
        }
        console.log(this.currentNode)
        //Append last variable
        if(this.buffer.length > 0 && this.currentNode) {
            if(this.state != ReaderState.ReadingVariables)
                throw new Error("Invalid format")
            const varNode: Node = {
                Type: NodeType.Variable,
                Value: this.buffer,
            };
            if(this.currentNode.Type == NodeType.OperandAND) {
                this.addChild(varNode)    
            }
            if(this.currentNode.Type == NodeType.OperandOR) {
                if(this.previousNode) {
                    this.addChild(varNode)
                    const current = this.currentNode;
                    this.currentNode = this.previousNode;
                    this.addChild(current)
                } else {
                    this.addChild(varNode)
                }
            }
        }
        return this.currentNode
    }
}

export interface Node {
    Type: NodeType;
    Value: string | OperandValue;
    children?: Node[];
}

export enum NodeType {
    Variable = 0,
    OperandAND = 1,
    OperandOR = 2,
}

enum OperandValue {
    AND = '^',
    OR = 'v',
}

enum ReaderState {
    ReadingVariables = 0,
    ReadingOperand = 1,
    Idle = 2,
}