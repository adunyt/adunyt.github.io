/**
 * Класс для работы с Green API.
 */
class GreenApi {
    /**
     * Конструктор класса GreenApi.
     * @param {string} apiUrl - URL API.
     * @param {string} mediaUrl - URL медиа сервера.
     */
    constructor(apiUrl, mediaUrl) {
        this.apiUrl = apiUrl;
        this.mediaUrl = mediaUrl;
        this.idInstance = undefined;
        this.apiTokenInstance = undefined;
    }

    /**
     * Устанавливает данные авторизации.
     * @param {string} idInstance - Идентификатор экземпляра.
     * @param {string} apiTokenInstance - Токен API.
     */
    setAuthData(idInstance, apiTokenInstance) {
        this.idInstance = idInstance;
        this.apiTokenInstance = apiTokenInstance;
    }

    /**
     * Строит URL для API запроса.
     * @param {string} methodName - Название метода API.
     * @returns {string} Сформированный URL.
     * @private
     */
    __urlBuilder(methodName) {
        return `${this.apiUrl}/waInstance${this.idInstance}/${methodName}/${this.apiTokenInstance}`;
    }

    /**
     * Получает настройки аккаунта.
     * @returns {Promise<Object>} Ответ API с настройками аккаунта.
     * @throws Ошибка при неудачном запросе.
     */
    async getSettings() {
        const url = this.__urlBuilder("getSettings");
        return await this.__sendRequest(url);
    }

    /**
     * Получает состояние экземпляра.
     * @returns {Promise<Object>} Ответ API с состоянием экземпляра.
     * @throws Ошибка при неудачном запросе.
     */
    async getStateInstance() {
        const url = this.__urlBuilder("getStateInstance");
        return await this.__sendRequest(url);
    }

    /**
     * Отправляет сообщение в чат.
     * @param {string} chatId - Идентификатор чата.
     * @param {string} message - Сообщение для отправки.
     * @param {string} [quotedMessageId] - Идентификатор цитируемого сообщения.
     * @param {boolean} [linkPreview] - Включить предварительный просмотр ссылки.
     * @returns {Promise<Object>} Ответ API.
     * @throws Ошибка при неудачном запросе.
     */
    async sendMessage(chatId, message, quotedMessageId, linkPreview) {
        const url = this.__urlBuilder("sendMessage");
        const payload = {
            chatId,
            message,
            quotedMessageId,
            linkPreview
        };
        return await this.__sendRequest(url, 'POST', payload);
    }

    /**
     * Отправляет файл по URL в чат.
     * @param {string} chatId - Идентификатор чата.
     * @param {string} urlFile - URL файла.
     * @param {string} fileName - Название файла.
     * @param {string} [caption] - Подпись к файлу.
     * @param {string} [quotedMessageId] - Идентификатор цитируемого сообщения.
     * @returns {Promise<Object>} Ответ API.
     * @throws Ошибка при неудачном запросе.
     */
    async sendFileByUrl(chatId, urlFile, fileName, caption, quotedMessageId) {
        const url = this.__urlBuilder("sendFileByUrl");
        const payload = {
            chatId,
            urlFile,
            fileName,
            caption,
            quotedMessageId
        };
        return await this.__sendRequest(url, 'POST', payload);
    }

    /**
     * Выполняет HTTP-запрос к API.
     * @param {string} url - URL запроса.
     * @param {string} [method='GET'] - HTTP метод (по умолчанию GET).
     * @param {Object} [payload=null] - Тело запроса для методов POST.
     * @returns {Promise<Object>} Ответ API.
     * @throws Ошибка при неудачном запросе.
     * @private
     */
    async __sendRequest(url, method = 'GET', payload = null) {
        const headers = {
            'Content-Type': 'application/json'
        };
        const options = {
            method,
            headers,
            body: payload ? JSON.stringify(payload) : null
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}

/**
 * Класс для валидации входных данных.
 */
class Validator {
    /**
     * Проверяет валидность URL.
     * @param {HTMLInputElement} inputElement - Элемент ввода.
     * @returns {boolean} Содержит ли поле валидный URL.
     */
    static isValidUrl(inputElement) {
        let isValid = true;
        try {
            new URL(inputElement.value);
        } catch {
            isValid = false;
        }
        inputElement.classList.toggle("is-invalid", !isValid);
        return isValid;
    }
    /**
     * Проверяет, заполнено ли поле ввода.
     * @param {HTMLInputElement} inputElement - Элемент ввода.
     * @returns {boolean} Является ли поле непустым.
     */
    static isNotEmpty(inputElement) {
        const isValid = inputElement.value.trim() !== '';
        inputElement.classList.toggle("is-invalid", !isValid);
        return isValid;
    }
}

/**
 * Класс для работы с уведомлениями.
 * Реализует паттерн Singleton.
 */
class Alert {
    constructor() {
        if (Alert.instance) return Alert.instance;
        this.alertElement = document.querySelector("#alert");
        this.alertTextElement = document.querySelector("#alert-message-text");
        this.currentAlertTimeout = undefined;
        Alert.instance = this;
    }
    /**
     * Показывает уведомление.
     * @param {string} [text="An unexpected error occurred!"] - Текст уведомления.
     */
    show(text = "An unexpected error occurred!") {
        clearTimeout(this.currentAlertTimeout);
        this.alertTextElement.textContent = text;
        this.alertElement.classList.add("show");
        this.alertElement.classList.remove("pe-none");
        this.currentAlertTimeout = setTimeout(() => this.hide(), 6000);
    }
    /**
     * Прячет уведомление.
     */
    hide() {
        this.alertElement.classList.remove("show");
        this.alertElement.classList.add("pe-none");
        this.currentAlertTimeout = undefined;
    }
}

// Возможно избыточен, пересмотреть где можно разместить метод
/**
 * Утилитарный класс с полезными методами.
 */
class Utility {
    /**
     * Получает имя файла из URL.
     * @param {string} url - URL файла.
     * @returns {string} Имя файла.
     */
    static getFilenameFromUrl(url) {
        const pathname = new URL(url).pathname;
        return pathname.substring(pathname.lastIndexOf('/') + 1) || 'download';
    }
}

/**
 * Класс для управления интерфейсом и обработки событий.
 */
class UiHandler {
    /**
     * Конструктор класса UiHandler.
     * @param {GreenApi} apiInstance - Экземпляр GreenApi.
     */
    constructor(apiInstance) {
        this.apiInstance = apiInstance;
        this.alert = new Alert();
        this.initializeEventListeners();
    }

    /**
     * Устанавливает данные авторизации из полей ввода.
     * @throws {Error} Ошибка, если поля ввода некорректны.
     */
    setAuthData() {
        const idInstance = document.querySelector("#idInstance-input");
        const apiTokenInstance = document.querySelector("#apiTokenInstance-input");
        if (Validator.isNotEmpty(idInstance) && Validator.isNotEmpty(apiTokenInstance)) {
            this.apiInstance.setAuthData(idInstance.value, apiTokenInstance.value);
        } else {
            throw new Error("Проверьте поля idInstance и API Token");
        }
    }

    /**
     * Устанавливает текст в элемент вывода.
     * @param {string} text - Текст для отображения.
     */
    setText(text) {
        const element = document.querySelector("#output-textarea");
        element.value = text;
    }

    /**
     * Выполняет переданный в функцию запрос и выводит ответ запроса в поле вывода.
     * @param {function} requestFunc - Функция, возвращающая Promise с результатом запроса.
     */
    async executeRequest(requestFunc) {
        try {
            this.setAuthData(); // Update auth data before executing the request
            const response = await requestFunc();
            this.setText(JSON.stringify(response, null, 2));
        } catch (error) {
            this.alert.show(error.toString());
        }
    }

    /**
     * Инициализирует обработчики событий.
     */
    initializeEventListeners() {
        document.querySelector("#alert-btn").addEventListener("click", () => {
            this.alert.hide();
        });

        document.querySelector("#getSettings-btn").addEventListener("click", () => {
            this.executeRequest(() => this.apiInstance.getSettings());
        });

        document.querySelector("#getStateInstance-btn").addEventListener("click", () => {
            this.executeRequest(() => this.apiInstance.getStateInstance());
        });

        document.querySelector("#sendMessage-btn").addEventListener("click", () => {
            const userId = document.querySelector("#sendMessage-userId-input");
            const message = document.querySelector("#sendMessage-message-input");

            if (Validator.isNotEmpty(userId) && Validator.isNotEmpty(message)) {
                this.executeRequest(() => this.apiInstance.sendMessage(userId.value, message.value));
            }
        });

        document.querySelector("#sendFileByUrl-btn").addEventListener("click", () => {
            const userId = document.querySelector("#sendFileByUrl-userId-input");
            const fileUrl = document.querySelector("#sendFileByUrl-fileUrl-input");

            if (Validator.isNotEmpty(userId) && Validator.isValidUrl(fileUrl)) {
                const fileName = Utility.getFilenameFromUrl(fileUrl.value);
                this.executeRequest(() => this.apiInstance.sendFileByUrl(userId.value, fileUrl.value, fileName));
            }
        });
    }
}


// Инициализация класса работы GreenAPI
const apiUrl = "https://1103.api.green-api.com";
const mediaUrl = "https://1103.media.green-api.com";
const greenApi = new GreenApi(apiUrl, mediaUrl);

// Инициализация класса обработчика UI
const uiHandler = new UiHandler(greenApi);