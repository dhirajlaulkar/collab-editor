class TextOperation {
    constructor(type, position, chars) {
        this.type = type; // 'insert' or 'delete'
        this.position = position;
        this.chars = chars;
    }

    static transform(op1, op2) {
        // If op1 is before op2, no adjustment needed
        if (op1.position < op2.position) {
            return op1;
        }

        // If op1 is after op2
        if (op2.type === 'insert') {
            return new TextOperation(op1.type, op1.position + op2.chars.length, op1.chars);
        } else if (op2.type === 'delete') {
            return new TextOperation(op1.type, op1.position - op2.chars.length, op1.chars);
        }

        return op1;
    }

    apply(text) {
        if (this.type === 'insert') {
            return text.slice(0, this.position) + this.chars + text.slice(this.position);
        } else if (this.type === 'delete') {
            return text.slice(0, this.position) + text.slice(this.position + this.chars.length);
        }
        return text;
    }
}

module.exports = TextOperation;
