const EngToRus = new Map([
    ["q", "й"],
    ["w", "ц"],
    ["e", "у"],
    ["r", "к"],
    ["t", "е"],
    ["y", "н"],
    ["u", "г"],
    ["i", "ш"],
    ["o", "щ"],
    ["p", "з"],
    ["[", "х"],
    ["]", "ъ"],
    ["a", "ф"],
    ["s", "ы"],
    ["d", "в"],
    ["f", "а"],
    ["g", "п"],
    ["h", "р"],
    ["j", "о"],
    ["k", "л"],
    ["l", "д"],
    [";", "ж"],
    ["'", "э"],
    ["z", "я"],
    ["x", "ч"],
    ["c", "с"],
    ["v", "м"],
    ["b", "и"],
    ["n", "т"],
    ["m", "ь"],
    [",", "б"],
    [".", "ю"],
    ["/", "."]
]);
const RusToEng = new Map([
	["й", "q"], 
	["ц", "w"], 
	["у", "e"], 
	["к", "r"], 
	["е", "t"], 
	["н", "y"], 
	["г", "u"], 
	["ш", "i"], 
	["щ", "o"], 
	["з", "p"], 
	["х", "["], 
	["ъ", "]"], 
	["ф", "a"], 
	["ы", "s"], 
	["в", "d"], 
	["а", "f"], 
	["п", "g"], 
	["р", "h"], 
	["о", "j"], 
	["л", "k"], 
	["д", "l"], 
	["ж", ";"], 
	["э", "'"], 
	["я", "z"], 
	["ч", "x"], 
	["с", "c"], 
	["м", "v"], 
	["и", "b"], 
	["т", "n"], 
	["ь", "m"], 
	["б", ","], 
	["ю", "."], 
	[".", "/"]
]);
const srcText = document.getElementsByName("source-textarea")[0];
const cnvText = document.getElementsByName("converted-textarea")[0];
srcText.addEventListener("input", translate);

if (srcText.value.length != 0){ // проверка при загрузке страницы - есть текст или нет
    translate();
}

function translate() {
    let text = srcText.value;
    let textIsUpper;
    let convertedValue;
    let sourceValue;
    cnvText.textContent = "";

    for (let lastChangedChar = 0; lastChangedChar < text.length; lastChangedChar++) {
        sourceValue = text[lastChangedChar];
        textIsUpper = isUpper(sourceValue);
        if(textIsUpper){
            sourceValue = sourceValue.toLowerCase();
        }
        if (EngToRus.has(sourceValue)){
            convertedValue = EngToRus.get(sourceValue);
        }
        else if(RusToEng.has(sourceValue)){
            convertedValue = RusToEng.get(sourceValue);
        }
        else{
            console.error(`Не найден символ на позиции ${lastChangedChar}`);
            convertedValue = sourceValue;
        }
        if (textIsUpper) {
            convertedValue = convertedValue.toUpperCase();
        }
        cnvText.textContent += convertedValue;

    }
    // console.log("Converting complite!");
}


function isUpper(char){
    lowerChar = char.toLowerCase();
    if (lowerChar == char){
        return false;
    }
    return true;
}