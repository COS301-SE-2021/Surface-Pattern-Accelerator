exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 16:
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
exports.CreateJsonfileController = void 0;
const common_1 = __webpack_require__(6);
const google_api_service_1 = __webpack_require__(10);
let CreateJsonfileController = class CreateJsonfileController {
    constructor(googleApiService) {
        this.googleApiService = googleApiService;
    }
    createNewJSONFile(request, session, patternFolderID) {
        return new Promise((success, failure) => {
            this.googleApiService.createNewJSONFile(session.accessToken, "reservation", "", patternFolderID)
                .then((result) => {
                console.log(result);
                success(result);
            });
        });
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Session)()),
    __param(2, (0, common_1.Body)('patternFolderID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Request !== "undefined" && Request) === "function" ? _a : Object, typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object, String]),
    __metadata("design:returntype", void 0)
], CreateJsonfileController.prototype, "createNewJSONFile", null);
CreateJsonfileController = __decorate([
    (0, common_1.Controller)('api/createNewJSONFile'),
    __metadata("design:paramtypes", [typeof (_c = typeof google_api_service_1.GoogleApiService !== "undefined" && google_api_service_1.GoogleApiService) === "function" ? _c : Object])
], CreateJsonfileController);
exports.CreateJsonfileController = CreateJsonfileController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("a93777e73ffeee6ba29b")
/******/ })();
/******/ 
/******/ }
;