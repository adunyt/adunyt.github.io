// API MODULE 
class GreenApi {

    // Ref: https://green-api.com/docs/before-start/#parameters
    constructor() {
        this.apiUrl = undefined;
        this.mediaUrl = undefined;
        this.idInstance = undefined;
        this.apiTokenInstance = undefined;
    }

    setApiUrl(apiUrl) {
        this.apiUrl = apiUrl;
    }

    setMediaUrl(mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    setIdInstance(idInstance) {
        this.idInstance = idInstance;
    }

    setApiTokenInstance(apiTokenInstance) {
        this.apiTokenInstance = apiTokenInstance;
    }

    __urlBuilder(methodName) {
        const url = `${this.apiUrl}/waInstance${this.idInstance}/${methodName}/${this.apiTokenInstance}`;
        return url;
    }

    // Ref: https://green-api.com/docs/api/account/GetSettings/
    async getSettings() {
        const url = this.__urlBuilder("getSettings");
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка запроса. ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // Ref: https://green-api.com/docs/api/account/GetStateInstance/
    async getStateInstance() {
        const url = this.__urlBuilder("getStateInstance");

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка запроса. ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // Ref: https://green-api.com/docs/api/sending/SendMessage/
    async sendMessage(chatId, message, quotedMessageId, linkPreview) {
        const url = this.__urlBuilder("sendMessage");
        // TODO: add removing unnecessary payload

        const payload = {
            chatId: chatId,
            message: message,
            quotedMessageId: quotedMessageId,
            linkPreview: linkPreview
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(
                url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                });
            if (!response.ok) {
                throw new Error(`Ошибка запроса. ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // Ref: https://green-api.com/docs/api/sending/SendFileByUrl/
    async sendFileByUrl(chatId, urlFile, fileName, caption, quotedMessageId) {
        const url = this.__urlBuilder("sendFileByUrl");

        // TODO: add filename extraction if no fileName provided from urlFile
        // TODO: add removing unnecessary payload

        const payload = {
            chatId: chatId,
            urlFile: urlFile,
            fileName: fileName,
            caption: caption,
            quotedMessageId: quotedMessageId
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(
                url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                });
            if (!response.ok) {
                throw new Error(`Ошибка запроса. ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

}

function getFilenameFromUrl(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);

    if (!filename) {
        return 'download';
    }

    return filename;
}

function setText(text) {
    const element = document.querySelector("#output-textarea");
    element.value = text;
}

function updateAuthData() {
    if (!isIdInstanceInputValid() || !isApiTokenInstanceInputValid()){
        throw new Error("Проверьте данные авторизации");
    }
    greenApi.setIdInstance(idInstanceInput.value);
    greenApi.setApiTokenInstance(apiTokenInstanceInput.value);
}

function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

function isIdInstanceInputValid(){
    if (idInstanceInput.value.trim() === ''){
        idInstanceInput.classList.add("is-invalid");
        return false;
    }
    idInstanceInput.classList.remove("is-invalid");
    return true;
}

function isApiTokenInstanceInputValid(){
    if (apiTokenInstanceInput.value.trim() === ''){
        apiTokenInstanceInput.classList.add("is-invalid");
        return false;
    }
    apiTokenInstanceInput.classList.remove("is-invalid");
    return true;
}

function isSendMessageInputsValid(){
    let isValid = true;
    if (sendMessageMessageInput.value.trim() === ''){
        sendMessageMessageInput.classList.add("is-invalid");
        isValid = false;
    }
    else{
        sendMessageMessageInput.classList.remove("is-invalid");
    }
    if (sendMessageUserIdInput.value.trim() === ''){
        sendMessageUserIdInput.classList.add("is-invalid");
        isValid = false;
    }
    else{
        sendMessageUserIdInput.classList.remove("is-invalid");
    }
    return isValid;
}

function isSendFileInputsValid(){
    let isValid = true;
    if (!isValidUrl(sendFileByUrlFileUrlInput.value)){
        sendFileByUrlFileUrlInput.classList.add("is-invalid");
        isValid = false;
    }
    else{
        sendFileByUrlFileUrlInput.classList.remove("is-invalid");
    }
    if (sendFileByUrlUserIdInput.value.trim() === ''){
        sendFileByUrlUserIdInput.classList.add("is-invalid");
        isValid = false;
    }
    else{
        sendFileByUrlUserIdInput.classList.remove("is-invalid");
    }
    return isValid;
}

let currentAlertTimeout = undefined;

function showAlert(text = "Возникла непредвиденная ошибка!") {
    if (currentAlertTimeout) {
        clearTimeout(currentAlertTimeout);
        currentAlertTimeout = undefined;
    }
    alertTextElement.textContent = text;
    alertElement.classList.add("show");
    currentAlertTimeout = setTimeout(() => {
        hideAlert();
    }, 6000);
}

function hideAlert() {
    currentAlertTimeout = undefined;
    alertElement.classList.remove("show");
}

const alertElement = document.querySelector("#alert");
const alertTextElement = document.querySelector("#alert-message-text");

const idInstanceInput = document.querySelector("#idInstance-input");
const apiTokenInstanceInput = document.querySelector("#apiTokenInstance-input");

const sendMessageUserIdInput = document.querySelector("#sendMessage-userId-input");
const sendMessageMessageInput = document.querySelector("#sendMessage-message-input");

const sendFileByUrlUserIdInput = document.querySelector("#sendFileByUrl-userId-input");
const sendFileByUrlFileUrlInput = document.querySelector("#sendFileByUrl-fileUrl-input");

const apiUrl = "https://1103.api.green-api.com";
const mediaUrl = "https://1103.media.green-api.com";

const greenApi = new GreenApi();
greenApi.setApiUrl(apiUrl);
greenApi.setMediaUrl(mediaUrl);

document.querySelector("#alert-btn").addEventListener("click", async () => {
    hideAlert();
});

document.querySelector("#getSettings-btn").addEventListener("click", async () => {
    try {
        updateAuthData();
        const response = await greenApi.getSettings();
        setText(JSON.stringify(response, null, 2));
    } catch (error) {
        showAlert(error.toString());
    }
});

document.querySelector("#getStateInstance-btn").addEventListener("click", async () => {
    try {
        updateAuthData();
        const response = await greenApi.getStateInstance();
        setText(JSON.stringify(response, null, 2));
    } catch (error) {
        showAlert(error.toString());
    }
});

document.querySelector("#sendMessage-btn").addEventListener("click", async () => {
    if (!isSendMessageInputsValid()){
        return;
    }

    const userId = sendMessageUserIdInput.value;
    const message = sendMessageMessageInput.value;
    
    try {
        updateAuthData();
        const response = await greenApi.sendMessage(userId, message);
        setText(JSON.stringify(response, null, 2));
    } catch (error) {
        showAlert(error.toString());
    }
});

document.querySelector("#sendFileByUrl-btn").addEventListener("click", async () => {
    if (!isSendFileInputsValid()){
        return;
    }

    const userId = sendFileByUrlUserIdInput.value;
    const fileUrl = sendFileByUrlFileUrlInput.value;
    const filename = getFilenameFromUrl(fileUrl);

    try {
        updateAuthData();
        const response = await greenApi.sendFileByUrl(userId, fileUrl, filename);
        setText(JSON.stringify(response, null, 2));
    } catch (error) {
        showAlert(error.toString());
    }
});