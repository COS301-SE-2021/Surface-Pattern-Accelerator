exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 12:
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
exports.GetCollectionsController = void 0;
const common_1 = __webpack_require__(6);
const google_api_service_1 = __webpack_require__(10);
let GetCollectionsController = class GetCollectionsController {
    constructor(googleApiService) {
        this.googleApiService = googleApiService;
    }
    getCollectionsList(request, session) {
        return new Promise((success, failure) => {
            console.log(session.accessToken);
            this.googleApiService.getCollections(session.accessToken)
                .then((retValue) => {
                console.log("Collections are: ************");
                console.log(retValue);
                success(retValue);
            }).catch((error) => {
                console.log("Could not find collections");
                console.log(error);
                this.googleApiService.createFolder(session.accessToken, "SPA")
                    .then((SPAFolderResult) => {
                    const SPAFolderDetails = SPAFolderResult.data;
                    console.log(SPAFolderDetails.id);
                    const collectionsPromise = this.googleApiService.createFolder(session.accessToken, "Collections", SPAFolderDetails.id);
                    const patternsPromise = this.googleApiService.createFolder(session.accessToken, "Patterns", SPAFolderDetails.id);
                    const motifsPromise = this.googleApiService.createFolder(session.accessToken, "Motifs", SPAFolderDetails.id);
                    Promise.all([collectionsPromise, patternsPromise, motifsPromise])
                        .then((promiseResultArray) => {
                        success({ collections: [] = [] });
                    });
                });
            });
            failure();
        });
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Request !== "undefined" && Request) === "function" ? _a : Object, typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], GetCollectionsController.prototype, "getCollectionsList", null);
GetCollectionsController = __decorate([
    (0, common_1.Controller)('api/getCollections'),
    __metadata("design:paramtypes", [typeof (_c = typeof google_api_service_1.GoogleApiService !== "undefined" && google_api_service_1.GoogleApiService) === "function" ? _c : Object])
], GetCollectionsController);
exports.GetCollectionsController = GetCollectionsController;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("890a93fe923074a0cd23")
/******/ })();
/******/ 
/******/ }
;