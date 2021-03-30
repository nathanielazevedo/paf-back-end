
const conjunctions = ["and",
    "that",
    "but",
    "or",
    "as",
    "if",
    "when",
    "than",
    "because",
    "while",
    "where",
    "after",
    "so",
    "though",
    "since",
    "until",
    "whether",
    "before",
    "although",
    "nor",
    "like",
    "once",
    "unless",
    "now",
    "except"];

let adjectives = [
    'good',
    'new',
    'first',
    'last',
    'long',
    'great',
    'little',
    'own',
    'other',
    'old',
    'right',
    'big',
    'high',
    'different',
    'small',
    'large',
    'next',
    'early',
    'young',
    'important',
    'few',
    'public',
    'bad',
    'same',
    'able'];

let adverbs = [
'up',
'so',
'out',
'just',
'now',
'how',
'then',
'more',
'also',
'here',
'well',
'only',
'very',
'even',
'back',
'there',
'down',
'still',
'in',
'as',
'too',
'when',
'never',
'really',
'most']

function textParser(text) {
    let str = text.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase();
    let newText = str.split(' ');
    let newer = newText.filter((w) => {
        if (w.length > 2 && w !== 'hi') {
            return w
        }
    });

    let set = new Set(newer);
    for (let each of conjunctions) {
        if (set.has(each)) {
            set.delete(each);
        }
    }
    for (let each of adjectives) {
        if (set.has(each)) {
            set.delete(each);
        }
    }
    for (let each of adverbs) {
        if (set.has(each)) {
            set.delete(each);
        }
    }
    return (Array.from(set))
}

module.exports = {textParser}