"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/session/route";
exports.ids = ["app/api/auth/session/route"];
exports.modules = {

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5CPFS%5Calumni-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPFS%5Calumni-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5CPFS%5Calumni-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPFS%5Calumni-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_PFS_alumni_app_app_api_auth_session_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/session/route.ts */ \"(rsc)/./app/api/auth/session/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/session/route\",\n        pathname: \"/api/auth/session\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/session/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\PFS\\\\alumni-app\\\\app\\\\api\\\\auth\\\\session\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_PFS_alumni_app_app_api_auth_session_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/session/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGc2Vzc2lvbiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYXV0aCUyRnNlc3Npb24lMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhdXRoJTJGc2Vzc2lvbiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNQRlMlNUNhbHVtbmktYXBwJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNQRlMlNUNhbHVtbmktYXBwJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNhO0FBQzFGO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYWx1bW5pLWFwcC8/MTQwZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxQRlNcXFxcYWx1bW5pLWFwcFxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcc2Vzc2lvblxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9zZXNzaW9uL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9zZXNzaW9uXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL3Nlc3Npb24vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxQRlNcXFxcYWx1bW5pLWFwcFxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcc2Vzc2lvblxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYXV0aC9zZXNzaW9uL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5CPFS%5Calumni-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPFS%5Calumni-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/session/route.ts":
/*!***************************************!*\
  !*** ./app/api/auth/session/route.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\n// Never statically cache this route — it reads/writes live data via\n// Prisma on every request. Without this, Next.js can silently\n// pre-render a GET handler with no request-derived params ONCE at\n// build time and serve that frozen snapshot forever after (this is\n// exactly what broke newly-assigned executives from ever showing up).\nconst dynamic = \"force-dynamic\";\nasync function GET() {\n    const session = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_1__.getSession)();\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        authenticated: !!session,\n        username: session?.username || null\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvc2Vzc2lvbi9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTJDO0FBQ0g7QUFFeEMsb0VBQW9FO0FBQ3BFLDhEQUE4RDtBQUM5RCxrRUFBa0U7QUFDbEUsbUVBQW1FO0FBQ25FLHNFQUFzRTtBQUMvRCxNQUFNRSxVQUFVLGdCQUFnQjtBQUVoQyxlQUFlQztJQUNwQixNQUFNQyxVQUFVSCxxREFBVUE7SUFDMUIsT0FBT0QscURBQVlBLENBQUNLLElBQUksQ0FBQztRQUN2QkMsZUFBZSxDQUFDLENBQUNGO1FBQ2pCRyxVQUFVSCxTQUFTRyxZQUFZO0lBQ2pDO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hbHVtbmktYXBwLy4vYXBwL2FwaS9hdXRoL3Nlc3Npb24vcm91dGUudHM/YTJhYiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IGdldFNlc3Npb24gfSBmcm9tIFwiQC9saWIvYXV0aFwiO1xuXG4vLyBOZXZlciBzdGF0aWNhbGx5IGNhY2hlIHRoaXMgcm91dGUg4oCUIGl0IHJlYWRzL3dyaXRlcyBsaXZlIGRhdGEgdmlhXG4vLyBQcmlzbWEgb24gZXZlcnkgcmVxdWVzdC4gV2l0aG91dCB0aGlzLCBOZXh0LmpzIGNhbiBzaWxlbnRseVxuLy8gcHJlLXJlbmRlciBhIEdFVCBoYW5kbGVyIHdpdGggbm8gcmVxdWVzdC1kZXJpdmVkIHBhcmFtcyBPTkNFIGF0XG4vLyBidWlsZCB0aW1lIGFuZCBzZXJ2ZSB0aGF0IGZyb3plbiBzbmFwc2hvdCBmb3JldmVyIGFmdGVyICh0aGlzIGlzXG4vLyBleGFjdGx5IHdoYXQgYnJva2UgbmV3bHktYXNzaWduZWQgZXhlY3V0aXZlcyBmcm9tIGV2ZXIgc2hvd2luZyB1cCkuXG5leHBvcnQgY29uc3QgZHluYW1pYyA9IFwiZm9yY2UtZHluYW1pY1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICBjb25zdCBzZXNzaW9uID0gZ2V0U2Vzc2lvbigpO1xuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgIGF1dGhlbnRpY2F0ZWQ6ICEhc2Vzc2lvbixcbiAgICB1c2VybmFtZTogc2Vzc2lvbj8udXNlcm5hbWUgfHwgbnVsbCxcbiAgfSk7XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0U2Vzc2lvbiIsImR5bmFtaWMiLCJHRVQiLCJzZXNzaW9uIiwianNvbiIsImF1dGhlbnRpY2F0ZWQiLCJ1c2VybmFtZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/session/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   clearSessionCookie: () => (/* binding */ clearSessionCookie),\n/* harmony export */   createSessionToken: () => (/* binding */ createSessionToken),\n/* harmony export */   getSession: () => (/* binding */ getSession),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   isHttpsRequest: () => (/* binding */ isHttpsRequest),\n/* harmony export */   requireSession: () => (/* binding */ requireSession),\n/* harmony export */   setSessionCookie: () => (/* binding */ setSessionCookie),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\n\nconst COOKIE_NAME = \"alumni_session\";\nconst SESSION_HOURS = 8;\n/**\n * Detects whether the ORIGINAL request from the browser was HTTPS.\n * Checks X-Forwarded-Proto first, since Nginx sits in front of Node —\n * once HTTPS is set up, Nginx terminates SSL and forwards plain HTTP\n * to Node internally, so req.url alone would always say \"http\" even\n * on a fully HTTPS site. Falls back to the request's own protocol for\n * local dev (no proxy in front).\n */ function isHttpsRequest(req) {\n    const forwardedProto = req.headers.get(\"x-forwarded-proto\");\n    if (forwardedProto) return forwardedProto.split(\",\")[0].trim() === \"https\";\n    return req.nextUrl.protocol === \"https:\";\n}\nfunction getSecret() {\n    const secret = process.env.JWT_SECRET;\n    if (!secret) throw new Error(\"JWT_SECRET is not set in .env\");\n    return secret;\n}\nasync function hashPassword(plain) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().hash(plain, 12);\n}\nasync function verifyPassword(plain, hash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().compare(plain, hash);\n}\nfunction createSessionToken(userId, username) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign({\n        userId,\n        username\n    }, getSecret(), {\n        expiresIn: `${SESSION_HOURS}h`\n    });\n}\nfunction setSessionCookie(token, isHttps) {\n    (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)().set(COOKIE_NAME, token, {\n        httpOnly: true,\n        // Reflects whether THIS request actually arrived over HTTPS, not\n        // NODE_ENV. A cookie marked Secure is silently dropped by the\n        // browser on a plain HTTP connection — using NODE_ENV=\"production\"\n        // as the signal broke login entirely on a production site still\n        // served over HTTP (no SSL certificate set up yet). Once HTTPS is\n        // added, requests will naturally come in as isHttps=true and the\n        // cookie becomes Secure automatically — no code change needed then.\n        secure: isHttps,\n        sameSite: \"lax\",\n        // No maxAge/expires on purpose: this makes it a true browser-session\n        // cookie, cleared automatically when the browser is fully closed —\n        // so leaving and coming back later requires signing in again. The\n        // JWT itself still expires server-side after SESSION_HOURS as a\n        // backstop for tabs left open longer than that.\n        path: \"/\"\n    });\n}\nfunction clearSessionCookie() {\n    (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)().delete({\n        name: COOKIE_NAME,\n        path: \"/\"\n    });\n}\n/** Reads and verifies the session cookie. Returns null if not signed in. */ function getSession() {\n    const token = (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)().get(COOKIE_NAME)?.value;\n    if (!token) return null;\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().verify(token, getSecret());\n    } catch  {\n        return null;\n    }\n}\n/** Use inside API routes that require sign-in (Add Contribution / Add Dues). */ function requireSession() {\n    const session = getSession();\n    if (!session) {\n        const err = new Error(\"UNAUTHENTICATED\");\n        err.name = \"UNAUTHENTICATED\";\n        throw err;\n    }\n    return session;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQThCO0FBQ0M7QUFDUTtBQUd2QyxNQUFNRyxjQUFjO0FBQ3BCLE1BQU1DLGdCQUFnQjtBQUV0Qjs7Ozs7OztDQU9DLEdBQ00sU0FBU0MsZUFBZUMsR0FBZ0I7SUFDN0MsTUFBTUMsaUJBQWlCRCxJQUFJRSxPQUFPLENBQUNDLEdBQUcsQ0FBQztJQUN2QyxJQUFJRixnQkFBZ0IsT0FBT0EsZUFBZUcsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUNDLElBQUksT0FBTztJQUNuRSxPQUFPTCxJQUFJTSxPQUFPLENBQUNDLFFBQVEsS0FBSztBQUNsQztBQUVBLFNBQVNDO0lBQ1AsTUFBTUMsU0FBU0MsUUFBUUMsR0FBRyxDQUFDQyxVQUFVO0lBQ3JDLElBQUksQ0FBQ0gsUUFBUSxNQUFNLElBQUlJLE1BQU07SUFDN0IsT0FBT0o7QUFDVDtBQUVPLGVBQWVLLGFBQWFDLEtBQWE7SUFDOUMsT0FBT3JCLG9EQUFXLENBQUNxQixPQUFPO0FBQzVCO0FBRU8sZUFBZUUsZUFBZUYsS0FBYSxFQUFFQyxJQUFZO0lBQzlELE9BQU90Qix1REFBYyxDQUFDcUIsT0FBT0M7QUFDL0I7QUFFTyxTQUFTRyxtQkFBbUJDLE1BQWMsRUFBRUMsUUFBZ0I7SUFDakUsT0FBTzFCLHdEQUFRLENBQUM7UUFBRXlCO1FBQVFDO0lBQVMsR0FBR2IsYUFBYTtRQUNqRGUsV0FBVyxDQUFDLEVBQUV6QixjQUFjLENBQUMsQ0FBQztJQUNoQztBQUNGO0FBRU8sU0FBUzBCLGlCQUFpQkMsS0FBYSxFQUFFQyxPQUFnQjtJQUM5RDlCLHFEQUFPQSxHQUFHK0IsR0FBRyxDQUFDOUIsYUFBYTRCLE9BQU87UUFDaENHLFVBQVU7UUFDVixpRUFBaUU7UUFDakUsOERBQThEO1FBQzlELG1FQUFtRTtRQUNuRSxnRUFBZ0U7UUFDaEUsa0VBQWtFO1FBQ2xFLGlFQUFpRTtRQUNqRSxvRUFBb0U7UUFDcEVDLFFBQVFIO1FBQ1JJLFVBQVU7UUFDVixxRUFBcUU7UUFDckUsbUVBQW1FO1FBQ25FLGtFQUFrRTtRQUNsRSxnRUFBZ0U7UUFDaEUsZ0RBQWdEO1FBQ2hEQyxNQUFNO0lBQ1I7QUFDRjtBQUVPLFNBQVNDO0lBQ2RwQyxxREFBT0EsR0FBR3FDLE1BQU0sQ0FBQztRQUFFQyxNQUFNckM7UUFBYWtDLE1BQU07SUFBSTtBQUNsRDtBQU9BLDBFQUEwRSxHQUNuRSxTQUFTSTtJQUNkLE1BQU1WLFFBQVE3QixxREFBT0EsR0FBR08sR0FBRyxDQUFDTixjQUFjdUM7SUFDMUMsSUFBSSxDQUFDWCxPQUFPLE9BQU87SUFDbkIsSUFBSTtRQUNGLE9BQU85QiwwREFBVSxDQUFDOEIsT0FBT2pCO0lBQzNCLEVBQUUsT0FBTTtRQUNOLE9BQU87SUFDVDtBQUNGO0FBRUEsOEVBQThFLEdBQ3ZFLFNBQVM4QjtJQUNkLE1BQU1DLFVBQVVKO0lBQ2hCLElBQUksQ0FBQ0ksU0FBUztRQUNaLE1BQU1DLE1BQU0sSUFBSTNCLE1BQU07UUFDdEIyQixJQUFJTixJQUFJLEdBQUc7UUFDWCxNQUFNTTtJQUNSO0lBQ0EsT0FBT0Q7QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL2FsdW1uaS1hcHAvLi9saWIvYXV0aC50cz9iZjdlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiY3J5cHQgZnJvbSBcImJjcnlwdGpzXCI7XG5pbXBvcnQgand0IGZyb20gXCJqc29ud2VidG9rZW5cIjtcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XG5pbXBvcnQgeyBOZXh0UmVxdWVzdCB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuXG5jb25zdCBDT09LSUVfTkFNRSA9IFwiYWx1bW5pX3Nlc3Npb25cIjtcbmNvbnN0IFNFU1NJT05fSE9VUlMgPSA4O1xuXG4vKipcbiAqIERldGVjdHMgd2hldGhlciB0aGUgT1JJR0lOQUwgcmVxdWVzdCBmcm9tIHRoZSBicm93c2VyIHdhcyBIVFRQUy5cbiAqIENoZWNrcyBYLUZvcndhcmRlZC1Qcm90byBmaXJzdCwgc2luY2UgTmdpbnggc2l0cyBpbiBmcm9udCBvZiBOb2RlIOKAlFxuICogb25jZSBIVFRQUyBpcyBzZXQgdXAsIE5naW54IHRlcm1pbmF0ZXMgU1NMIGFuZCBmb3J3YXJkcyBwbGFpbiBIVFRQXG4gKiB0byBOb2RlIGludGVybmFsbHksIHNvIHJlcS51cmwgYWxvbmUgd291bGQgYWx3YXlzIHNheSBcImh0dHBcIiBldmVuXG4gKiBvbiBhIGZ1bGx5IEhUVFBTIHNpdGUuIEZhbGxzIGJhY2sgdG8gdGhlIHJlcXVlc3QncyBvd24gcHJvdG9jb2wgZm9yXG4gKiBsb2NhbCBkZXYgKG5vIHByb3h5IGluIGZyb250KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSHR0cHNSZXF1ZXN0KHJlcTogTmV4dFJlcXVlc3QpOiBib29sZWFuIHtcbiAgY29uc3QgZm9yd2FyZGVkUHJvdG8gPSByZXEuaGVhZGVycy5nZXQoXCJ4LWZvcndhcmRlZC1wcm90b1wiKTtcbiAgaWYgKGZvcndhcmRlZFByb3RvKSByZXR1cm4gZm9yd2FyZGVkUHJvdG8uc3BsaXQoXCIsXCIpWzBdLnRyaW0oKSA9PT0gXCJodHRwc1wiO1xuICByZXR1cm4gcmVxLm5leHRVcmwucHJvdG9jb2wgPT09IFwiaHR0cHM6XCI7XG59XG5cbmZ1bmN0aW9uIGdldFNlY3JldCgpOiBzdHJpbmcge1xuICBjb25zdCBzZWNyZXQgPSBwcm9jZXNzLmVudi5KV1RfU0VDUkVUO1xuICBpZiAoIXNlY3JldCkgdGhyb3cgbmV3IEVycm9yKFwiSldUX1NFQ1JFVCBpcyBub3Qgc2V0IGluIC5lbnZcIik7XG4gIHJldHVybiBzZWNyZXQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYXNoUGFzc3dvcmQocGxhaW46IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIHJldHVybiBiY3J5cHQuaGFzaChwbGFpbiwgMTIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZ5UGFzc3dvcmQocGxhaW46IHN0cmluZywgaGFzaDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHJldHVybiBiY3J5cHQuY29tcGFyZShwbGFpbiwgaGFzaCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTZXNzaW9uVG9rZW4odXNlcklkOiBudW1iZXIsIHVzZXJuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gand0LnNpZ24oeyB1c2VySWQsIHVzZXJuYW1lIH0sIGdldFNlY3JldCgpLCB7XG4gICAgZXhwaXJlc0luOiBgJHtTRVNTSU9OX0hPVVJTfWhgLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFNlc3Npb25Db29raWUodG9rZW46IHN0cmluZywgaXNIdHRwczogYm9vbGVhbikge1xuICBjb29raWVzKCkuc2V0KENPT0tJRV9OQU1FLCB0b2tlbiwge1xuICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgIC8vIFJlZmxlY3RzIHdoZXRoZXIgVEhJUyByZXF1ZXN0IGFjdHVhbGx5IGFycml2ZWQgb3ZlciBIVFRQUywgbm90XG4gICAgLy8gTk9ERV9FTlYuIEEgY29va2llIG1hcmtlZCBTZWN1cmUgaXMgc2lsZW50bHkgZHJvcHBlZCBieSB0aGVcbiAgICAvLyBicm93c2VyIG9uIGEgcGxhaW4gSFRUUCBjb25uZWN0aW9uIOKAlCB1c2luZyBOT0RFX0VOVj1cInByb2R1Y3Rpb25cIlxuICAgIC8vIGFzIHRoZSBzaWduYWwgYnJva2UgbG9naW4gZW50aXJlbHkgb24gYSBwcm9kdWN0aW9uIHNpdGUgc3RpbGxcbiAgICAvLyBzZXJ2ZWQgb3ZlciBIVFRQIChubyBTU0wgY2VydGlmaWNhdGUgc2V0IHVwIHlldCkuIE9uY2UgSFRUUFMgaXNcbiAgICAvLyBhZGRlZCwgcmVxdWVzdHMgd2lsbCBuYXR1cmFsbHkgY29tZSBpbiBhcyBpc0h0dHBzPXRydWUgYW5kIHRoZVxuICAgIC8vIGNvb2tpZSBiZWNvbWVzIFNlY3VyZSBhdXRvbWF0aWNhbGx5IOKAlCBubyBjb2RlIGNoYW5nZSBuZWVkZWQgdGhlbi5cbiAgICBzZWN1cmU6IGlzSHR0cHMsXG4gICAgc2FtZVNpdGU6IFwibGF4XCIsXG4gICAgLy8gTm8gbWF4QWdlL2V4cGlyZXMgb24gcHVycG9zZTogdGhpcyBtYWtlcyBpdCBhIHRydWUgYnJvd3Nlci1zZXNzaW9uXG4gICAgLy8gY29va2llLCBjbGVhcmVkIGF1dG9tYXRpY2FsbHkgd2hlbiB0aGUgYnJvd3NlciBpcyBmdWxseSBjbG9zZWQg4oCUXG4gICAgLy8gc28gbGVhdmluZyBhbmQgY29taW5nIGJhY2sgbGF0ZXIgcmVxdWlyZXMgc2lnbmluZyBpbiBhZ2Fpbi4gVGhlXG4gICAgLy8gSldUIGl0c2VsZiBzdGlsbCBleHBpcmVzIHNlcnZlci1zaWRlIGFmdGVyIFNFU1NJT05fSE9VUlMgYXMgYVxuICAgIC8vIGJhY2tzdG9wIGZvciB0YWJzIGxlZnQgb3BlbiBsb25nZXIgdGhhbiB0aGF0LlxuICAgIHBhdGg6IFwiL1wiLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyU2Vzc2lvbkNvb2tpZSgpIHtcbiAgY29va2llcygpLmRlbGV0ZSh7IG5hbWU6IENPT0tJRV9OQU1FLCBwYXRoOiBcIi9cIiB9KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXNzaW9uUGF5bG9hZCB7XG4gIHVzZXJJZDogbnVtYmVyO1xuICB1c2VybmFtZTogc3RyaW5nO1xufVxuXG4vKiogUmVhZHMgYW5kIHZlcmlmaWVzIHRoZSBzZXNzaW9uIGNvb2tpZS4gUmV0dXJucyBudWxsIGlmIG5vdCBzaWduZWQgaW4uICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Vzc2lvbigpOiBTZXNzaW9uUGF5bG9hZCB8IG51bGwge1xuICBjb25zdCB0b2tlbiA9IGNvb2tpZXMoKS5nZXQoQ09PS0lFX05BTUUpPy52YWx1ZTtcbiAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGw7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGp3dC52ZXJpZnkodG9rZW4sIGdldFNlY3JldCgpKSBhcyBTZXNzaW9uUGF5bG9hZDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqIFVzZSBpbnNpZGUgQVBJIHJvdXRlcyB0aGF0IHJlcXVpcmUgc2lnbi1pbiAoQWRkIENvbnRyaWJ1dGlvbiAvIEFkZCBEdWVzKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlU2Vzc2lvbigpOiBTZXNzaW9uUGF5bG9hZCB7XG4gIGNvbnN0IHNlc3Npb24gPSBnZXRTZXNzaW9uKCk7XG4gIGlmICghc2Vzc2lvbikge1xuICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihcIlVOQVVUSEVOVElDQVRFRFwiKTtcbiAgICBlcnIubmFtZSA9IFwiVU5BVVRIRU5USUNBVEVEXCI7XG4gICAgdGhyb3cgZXJyO1xuICB9XG4gIHJldHVybiBzZXNzaW9uO1xufVxuIl0sIm5hbWVzIjpbImJjcnlwdCIsImp3dCIsImNvb2tpZXMiLCJDT09LSUVfTkFNRSIsIlNFU1NJT05fSE9VUlMiLCJpc0h0dHBzUmVxdWVzdCIsInJlcSIsImZvcndhcmRlZFByb3RvIiwiaGVhZGVycyIsImdldCIsInNwbGl0IiwidHJpbSIsIm5leHRVcmwiLCJwcm90b2NvbCIsImdldFNlY3JldCIsInNlY3JldCIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwiRXJyb3IiLCJoYXNoUGFzc3dvcmQiLCJwbGFpbiIsImhhc2giLCJ2ZXJpZnlQYXNzd29yZCIsImNvbXBhcmUiLCJjcmVhdGVTZXNzaW9uVG9rZW4iLCJ1c2VySWQiLCJ1c2VybmFtZSIsInNpZ24iLCJleHBpcmVzSW4iLCJzZXRTZXNzaW9uQ29va2llIiwidG9rZW4iLCJpc0h0dHBzIiwic2V0IiwiaHR0cE9ubHkiLCJzZWN1cmUiLCJzYW1lU2l0ZSIsInBhdGgiLCJjbGVhclNlc3Npb25Db29raWUiLCJkZWxldGUiLCJuYW1lIiwiZ2V0U2Vzc2lvbiIsInZhbHVlIiwidmVyaWZ5IiwicmVxdWlyZVNlc3Npb24iLCJzZXNzaW9uIiwiZXJyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/ms","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=C%3A%5CUsers%5CPFS%5Calumni-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPFS%5Calumni-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();