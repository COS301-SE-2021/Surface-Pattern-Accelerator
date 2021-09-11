exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 9:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginController = void 0;
const common_1 = __webpack_require__(6);
const google_api_service_1 = __webpack_require__(11);
let LoginController = class LoginController {
    constructor(googleApiService) {
        this.googleApiService = googleApiService;
    }
    googleLogin(session) {
        console.log("My session id is: " + session.id);
        console.log("get url");
        const { client_secret, client_id, redirect_uris } = this.googleApiService.getCredentials().installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES,
        });
        console.log("sign in URL: " + authUrl);
        res.json({ signInURL: authUrl });
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Record !== "undefined" && Record) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "googleLogin", null);
LoginController = __decorate([
    (0, common_1.Controller)('/api/googleLogin'),
    __metadata("design:paramtypes", [typeof (_b = typeof google_api_service_1.GoogleApiService !== "undefined" && google_api_service_1.GoogleApiService) === "function" ? _b : Object])
], LoginController);
exports.LoginController = LoginController;


/***/ }),

/***/ 11:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoogleApiService = void 0;
const common_1 = __webpack_require__(6);
let GoogleApiService = class GoogleApiService {
    constructor() {
        this.SCOPES = ["https://www.googleapis.com/auth/drive"];
    }
    getCredentials() {
        if (this.appCredentials == undefined) {
            this.appCredentials = JSON.parse("{\n" +
                '    "installed":{\n' +
                '        "client_id":"838530253471-o3arioj6ta566o6eg8140npcvb7a59tv.apps.googleusercontent.com",\n' +
                '        "project_id":"spadd-6","auth_uri":"https://accounts.google.com/o/oauth2/auth",\n' +
                '        "token_uri":"https://oauth2.googleapis.com/token",\n' +
                '        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",\n' +
                '        "client_secret":"qykE5ojYUpiRNSl3WFTlCIfR",\n' +
                '        "redirect_uris":["http://localhost:8100/loginResponse"],\n' +
                '        "javascript_origins":["http://localhost:3000","http://localhost:8100"]\n' +
                "    }\n" +
                "}");
            return this.appCredentials;
        }
        else {
            return this.appCredentials;
        }
    }
    getScopes() {
        return this.SCOPES;
    }
};
GoogleApiService = __decorate([
    (0, common_1.Injectable)()
], GoogleApiService);
exports.GoogleApiService = GoogleApiService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("ed7dcf40a4ca27310718")
/******/ })();
/******/ 
/******/ }
;