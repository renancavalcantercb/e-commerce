function generateItems(numItems) {
    const items = [];

    for (let i = 1; i <= numItems; i++) {
        const hasDiscount = Math.random() > 0.5;
        const item = {
            id: i,
            title: `Item ${i}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: Math.floor(Math.random() * 100) + 1,
            sale: hasDiscount,
            discount: hasDiscount ? Math.floor(Math.random() * 50) + 1 : 0,
            hasDiscount: hasDiscount,
            image: 'https://via.placeholder.com/150',
        };

        items.push(item);
    }

    return items;
}

function formatCPF(cpf) {
    return cpf.replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
        .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

// cpf utils functions
const BLACKLIST = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    '12345678909'
];

const STRICT_STRIP_REGEX = /[.-]/g;
const LOOSE_STRIP_REGEX = /[^\d]/g;

const verifierDigit = (digits) => {
    const numbers = digits
        .split('')
        .map((number) => {
            return parseInt(number, 10);
        });

    const modulus = numbers.length + 1;
    const multiplied = numbers.map((number, index) => number * (modulus - index));
    const mod = multiplied.reduce((buffer, number) => buffer + number) % 11;

    return mod < 2 ? 0 : 11 - mod;
};

const strip = (number, strict) => {
    const regex = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
    return (number || '').replace(regex, '');
};

function isValid(number, strict) {
    const stripped = strip(number, strict);

    if (!stripped) {
        return false;
    }

    if (stripped.length !== 11) {
        return false;
    }

    if (BLACKLIST.includes(stripped)) {
        return false;
    }

    let numbers = stripped.substr(0, 9);
    numbers += verifierDigit(numbers);
    numbers += verifierDigit(numbers);

    return numbers.substr(-2) === stripped.substr(-2);
};


export { generateItems, formatCPF, isValid };
