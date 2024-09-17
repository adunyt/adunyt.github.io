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
                throw new Error(`Error ${response.status}: ${response.statusText}`);
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
                throw new Error(`Error ${response.status}: ${response.statusText}`);
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
                throw new Error(`Error ${response.status}: ${response.statusText}`);
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
                throw new Error(`Error ${response.status}: ${response.statusText}`);
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
    element.textContent = text;
}

function updateAuthData() {
    greenApi.setIdInstance(idInstanceInput.value);
    greenApi.setApiTokenInstance(apiTokenInstanceInput.value);
}

function showAlert(text = "Возникла непредвиденная ошибка!") {
    alertTextElement.textContent = text;
    alertElement.classList.add("show");
}

function hideAlert() {
    alertElement.classList.remove("show");
}

const alertElement = document.querySelector("#alert")
const alertTextElement = document.querySelector("#alert-message-text")

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
    updateAuthData();
    try {
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
    const userId = sendFileByUrlUserIdInput.value;
    const fileUrl = sendFileByUrlFileUrlInput.value
    const filename = getFilenameFromUrl(fileUrl);

    try {
        updateAuthData();
        const response = await greenApi.sendFileByUrl(userId, fileUrl, filename);
        setText(JSON.stringify(response, null, 2));
    } catch (error) {
        showAlert(error.toString());
    }
});