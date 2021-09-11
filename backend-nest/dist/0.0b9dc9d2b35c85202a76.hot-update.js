exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 19:
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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadMotifController = void 0;
const common_1 = __webpack_require__(6);
const google_api_service_1 = __webpack_require__(10);
const platform_express_1 = __webpack_require__(20);
let UploadMotifController = class UploadMotifController {
    constructor(googleApiService) {
        this.googleApiService = googleApiService;
    }
    uploadMotif(request, session, files) {
        console.log(files);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('files[]', { dest: "./uploads" })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Session)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Request !== "undefined" && Request) === "function" ? _a : Object, typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object, typeof (_c = typeof Array !== "undefined" && Array) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], UploadMotifController.prototype, "uploadMotif", null);
UploadMotifController = __decorate([
    (0, common_1.Controller)('api/uploadMotif'),
    __metadata("design:paramtypes", [typeof (_d = typeof google_api_service_1.GoogleApiService !== "undefined" && google_api_service_1.GoogleApiService) === "function" ? _d : Object])
], UploadMotifController);
exports.UploadMotifController = UploadMotifController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("417785dc569fadf8ac0e")
/******/ })();
/******/ 
/******/ }
;