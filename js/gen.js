const numbersToAdd = "1234567890",
    symbolsToAdd = "!@#$%^&*(),.;'{}~/_-",
    letters = 'abcdefghijklmnopqrstuvwxyz',
    caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
class BigBool {
    name = "";
    value = false;
    controls = "";
    constructor(name, value = false, controls) {
        this.name = name;
        this.value = value;
        this.controls = controls;
    };
    refresh() {
        this.value = document.getElementById(this.name).checked;
    }
};
let currentList = {
        items: list.a.list,
        max: list.a.max,
        min: list.a.min
    },
    mode = document.getElementById("passwordType").value,
    switches = {};
switches.useNumbers = new BigBool("useNumbers", false, "hideNumbers");
switches.useSymbols = new BigBool("useSymbols", false, "hideSymbols");
switches.useCaps = new BigBool("useCaps", false, "hideCaps");

function randomInt(value, startAtOne = false) {
    let offset = startAtOne ? parseInt(startAtOne) || 1 : 0;
    return Math.floor(Math.random() * value) + offset;
};
let upSingle = (input, index) => input.slice(0, index) + input.charAt(index).toUpperCase() + input.slice(index + 1);

function addFromArray(pass, array, method) {
    for (var i = 0; i < Math.ceil(array.length / 2); i++) array = array.shuffle();
    switch (method) {
        case "a":
            return pass + array.join("");
        case "b":
            return array.join("") + pass;
        default:
            for (var i = 0; i < array.length; i++) {
                let rn = randomInt(pass.length);
                pass = pass.slice(0, rn) + array[i] + pass.slice(rn);
            }
            return pass;
    }
};

function pickNewType() {
    switch (randomInt(3, 1)) {
        case 1:
            return "a";
        case 2:
            return "b";
        default:
            return "c";
    }
};

function handleCaps(pass, method) {
    switch (method) {
        case 'a':
            return upSingle(pass, 0);
        case 'b':
            return pass.toUpperCase();
        case 'c':
            for (var i = 0; i < Math.floor(pass.length / 2); i++) pass = upSingle(pass, randomInt(pass.length, 0));
            return pass;
        case 'd':
            if (randomInt(2, 1) == 1)
                for (i = 0; i < pass.length; i++) pass = i % 2 == 0 ? upSingle(pass, i) : pass;
            else
                for (i = 0; i < pass.length; i++) pass = i % 2 == 0 ? pass : upSingle(pass, i);
            return pass;
        default:
            switch (randomInt(4, 1)) {
                case 1:
                    return handleCaps(pass, "a");
                case 2:
                    return handleCaps(pass, "b");
                case 3:
                    return handleCaps(pass, "c");
                default:
                    return handleCaps(pass, "d");
            }
    }
};

function newRandom(current, range, start) {
    if (range < 2 && start == current) return current;
    let temp = randomInt(range, start);
    return current == temp ? newRandom(current, range, start) : temp;
};
Array.prototype.shuffle = function () {
    var i = this.length,
        j, temp;
    if (i == 0) return this;
    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
};
String.prototype.replaceAt = function (index, replacement) {
    return this.slice(0, index) + replacement + this.slice(index + replacement.length);
};
String.prototype.replaceShift = function (index, length) {
    let toReplace = this.substr(index, length),
        replacement = "";
    for (var i = 0; i < toReplace.length; i++)
        if (letters.indexOf(toReplace[i]) >= 0) replacement += caps.charAt(letters.indexOf(toReplace[i]));
        else if (numbersToAdd.indexOf(toReplace[i]) >= 0) replacement += symbolsToAdd.charAt(numbersToAdd.indexOf(toReplace[i]));
    else replacement += toReplace[i];
    let news = this.replaceAt(index, replacement);
    return news;
};

function toggleChange(name) {
    switches[name].refresh();
    let randomChar = document.getElementById("passwordType").value == 'y' ? true : false,
        keySmash = document.getElementById("passwordType").value == 'x' ? true : false;
    boxes = document.getElementsByClassName(switches[name].controls), flippers = document.getElementsByClassName("keySmash");
    for (var i = 0; i < boxes.length; i++)
        if (switches[name].value) boxes[i].style.display = randomChar || keySmash ? "none" : "";
        else boxes[i].style.display = "none";
    for (var i = 0; i < flippers.length; i++)
        if (keySmash) flippers[i].style.display = "none";
        else flippers[i].style.display = "";
};

function updateSwitches() {
    Object.keys(switches).forEach(sw => {
        toggleChange(sw);
    });
};
updateSwitches();

function typeChange(md) {
    mode = md;
    switch (mode) {
        case "y":
            currentList.items = undefined;
            currentList.max = undefined;
            currentList.min = undefined;
            break;
        default:
            if (mode == "z") mode = Object.keys(list)[randomInt(Object.keys(list).length)];
            currentList.items = list[mode].list;
            currentList.max = list[mode].max;
            currentList.min = list[mode].min;
            break;
    }
    updateSwitches();
};

function generate() {
    let pass = '',
        options = {};
    options.min = parseInt(document.getElementById("minLength").value) || 4;
    options.max = parseInt(document.getElementById("maxLength").value) || 60;
    if (options.min > options.max) return alert("Min. Text Length can not exceed Max Text Length!");
    let useNumbers = document.getElementById("useNumbers").checked,
        useSymbols = document.getElementById("useSymbols").checked,
        useCaps = document.getElementById("useCaps").checked;
    options.useNumbers = useNumbers ? parseInt(document.getElementById("numNumbers").value) || 1 : 0;
    options.numberType = useNumbers ? document.getElementById("numberType").value : false;
    options.useSymbols = useSymbols ? parseInt(document.getElementById("numSymbols").value) || 1 : 0;
    options.symbolType = useSymbols ? document.getElementById("symbolType").value : false;
    options.useCaps = useCaps;
    options.capsType = useCaps ? document.getElementById("capsType").value : false;
    if (document.getElementById("passwordType").value == "z") {
        let temp = Object.keys(list);
        temp.push('y');
        temp.push('y');
        mode = temp[randomInt(temp.length)];
        typeChange(mode);
    }
    switch (mode) {
        case "y":
            pass = generateCharacters(options);
            break;
        default:
            pass = mode == "x" ? generateKeysmash(options) : generateText(options);
            break;
    }
    document.getElementById('genResult').innerText = pass;
};

function generateText(options) {
    let numToAdd = [],
        symToAdd = [],
        wList = currentList.items.filter(a => a.length >= Math.min(currentList.max, options.min) && a.length <= options.max),
        pass = wList[randomInt(wList.length, 0)].toLowerCase();
    if (options.useCaps && options.capsType) pass = handleCaps(pass, options.capsType);
    if (options.symbolType == 'd') options.symbolType = pickNewType();
    if (options.numberType == 'd') options.numberType = pickNewType();
    if (options.useNumbers && options.useNumbers > 0)
        for (var i = 0; i < options.useNumbers; i++) numToAdd.push(randomInt(10, 0).toString());
    if (options.useSymbols && options.useSymbols > 0)
        if (options.numberType == options.symbolType)
            for (var i = 0; i < options.useSymbols; i++) numToAdd.push(symbolsToAdd[randomInt(symbolsToAdd.length)]);
        else
            for (var i = 0; i < options.useSymbols; i++) symToAdd.push(symbolsToAdd[randomInt(symbolsToAdd.length)]);
    if (numToAdd && numToAdd.length > 0) pass = addFromArray(pass, numToAdd, options.numberType);
    if (symToAdd && symToAdd.length > 0) pass = addFromArray(pass, symToAdd, options.symbolType);
    return pass;
};

function generateCharacters(options) {
    let pass = '',
        fullString = "";
    fullString += letters;
    if (options.useCaps) fullString += caps;
    if (options.useNumbers) fullString += numbersToAdd;
    if (options.useCaps && options.useNumbers) fullString += numbersToAdd;
    if (options.useSymbols) fullString += symbolsToAdd;
    if (options.useCaps && options.useSymbols) fullString += symbolsToAdd;
    let variance = randomInt(options.max - options.min + 1, 0);
    for (var i = 0; i < options.min + variance; i++) pass += fullString[Math.floor(Math.random() * fullString.length)];
    return pass;
};

function generateKeysmash(options) {
    let length = randomInt(options.max - options.min + 1, 0) + options.min,
        pass = '';
    let iterations = Math.max(Math.ceil(length / currentList.max), 3);
    let loops = randomInt(iterations, 1),
        k = randomInt(currentList.items.length, 0),
        arr = [];
    for (var i = 0; i < iterations; i++) {
        if (loops - i <= 0) k = newRandom(k, currentList.items.length, 0);
        arr.push(k);
    }
    for (var i = 0; i < arr.length; i++) {
        pass += currentList.items[arr[i]];
        pass = pass.split("").shuffle().join("");
    }
    if (pass.length > length) pass = pass.substr(0, length);
    switch (randomInt(5, 1)) {
        case 1:
        case 2:
            break;
        case 3:
            pass = pass.replaceShift(0, pass.length);
            break;
        default:
            let start = Math.max(0, randomInt(pass.length, 0 - Math.floor(pass.length / 6))),
                end = Math.min(pass.length, randomInt(pass.length, Math.floor(pass.length / 6)));
            let aStart = Math.min(start, end),
                aEnd = Math.max(start, end);
            if (Math.abs(aStart - aEnd) <= 1)
                for (var i = 0; i < Math.floor(pass.length / 2); i++) pass = pass.replaceShift(randomInt(pass.length), 1);
            else pass = pass.replaceShift(aStart, aEnd - aStart);
            break;
    }
    return pass;
};
