exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 3:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
const session = __webpack_require__(11);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: ["http://localhost:8100"],
        credentials: true });
    app.use(session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
    }));
    await app.listen(3000);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ "use strict";
/******/ 
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("2ecf3cc883446bd80b98")
/******/ })();
/******/ 
/******/ }
;