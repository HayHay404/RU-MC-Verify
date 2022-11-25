export function generateCode() {
    const code : number[] = [];
    for (let i = 0; i < 6; i++) {
        code.push(Math.floor(Math.random() * 10))
    }
    return code.join("");
}