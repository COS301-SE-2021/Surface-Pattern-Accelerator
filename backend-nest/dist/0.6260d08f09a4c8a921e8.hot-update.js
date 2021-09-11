exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 17:
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateFileController = void 0;
const common_1 = __webpack_require__(6);
const google_api_service_1 = __webpack_require__(10);
let UpdateFileController = class UpdateFileController {
    constructor(googleApiService) {
        this.googleApiService = googleApiService;
    }
    updateFile(request, session, fileID, content, newName) {
        return new Promise((success, failure) => {
            if (newName) {
                this.googleApiService.updateJSONFile(session.accessToken, fileID, content, newName).then((result) => {
                    success({ Message: "Rename and Write to File Successful" });
                });
            }
            else {
                this.googleApiService.updateJSONFile(session.accessToken, fileID, content).then((result) => {
                    success({ Message: "Write to File Successful" });
                });
            }
        });
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Session)()),
    __param(2, (0, common_1.Body)('fileID')),
    __param(3, (0, common_1.Body)('content')),
    __param(4, (0, common_1.Body)('newName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Request !== "undefined" && Request) === "function" ? _a : Object, typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object, String, Object, String]),
    __metadata("design:returntype", void 0)
], UpdateFileController.prototype, "updateFile", null);
UpdateFileController = __decorate([
    (0, common_1.Controller)('api/updateFile'),
    __metadata("design:paramtypes", [typeof (_c = typeof google_api_service_1.GoogleApiService !== "undefined" && google_api_service_1.GoogleApiService) === "function" ? _c : Object])
], UpdateFileController);
exports.UpdateFileController = UpdateFileController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("d142ac868e6a669a8c37")
/******/ })();
/******/ 
/******/ }
;