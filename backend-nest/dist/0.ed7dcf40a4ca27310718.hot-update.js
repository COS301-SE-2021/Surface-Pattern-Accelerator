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
        const { client_secret, client_id, redirect_uris } = this.googleApiService.getCredentials().installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: this.googleApiService.getScopes(),
        });
        console.log("sign in URL: " + authUrl);
        return { signInURL: authUrl };
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


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("2959e8413d64c0e5e93f")
/******/ })();
/******/ 
/******/ }
;