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
exports.id = "app/api/constitution/route";
exports.ids = ["app/api/constitution/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fconstitution%2Froute&page=%2Fapi%2Fconstitution%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fconstitution%2Froute.ts&appDir=C%3A%5CUsers%5CPFS%5Calumni-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPFS%5Calumni-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fconstitution%2Froute&page=%2Fapi%2Fconstitution%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fconstitution%2Froute.ts&appDir=C%3A%5CUsers%5CPFS%5Calumni-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPFS%5Calumni-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_PFS_alumni_app_app_api_constitution_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/constitution/route.ts */ \"(rsc)/./app/api/constitution/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/constitution/route\",\n        pathname: \"/api/constitution\",\n        filename: \"route\",\n        bundlePath: \"app/api/constitution/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\PFS\\\\alumni-app\\\\app\\\\api\\\\constitution\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_PFS_alumni_app_app_api_constitution_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/constitution/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZjb25zdGl0dXRpb24lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmNvbnN0aXR1dGlvbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmNvbnN0aXR1dGlvbiUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNQRlMlNUNhbHVtbmktYXBwJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNQRlMlNUNhbHVtbmktYXBwJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUNZO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYWx1bW5pLWFwcC8/NGVmOCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxQRlNcXFxcYWx1bW5pLWFwcFxcXFxhcHBcXFxcYXBpXFxcXGNvbnN0aXR1dGlvblxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvY29uc3RpdHV0aW9uL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvY29uc3RpdHV0aW9uXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9jb25zdGl0dXRpb24vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxQRlNcXFxcYWx1bW5pLWFwcFxcXFxhcHBcXFxcYXBpXFxcXGNvbnN0aXR1dGlvblxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvY29uc3RpdHV0aW9uL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fconstitution%2Froute&page=%2Fapi%2Fconstitution%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fconstitution%2Froute.ts&appDir=C%3A%5CUsers%5CPFS%5Calumni-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPFS%5Calumni-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/constitution/route.ts":
/*!***************************************!*\
  !*** ./app/api/constitution/route.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\n\n// GET /api/constitution — full table of contents with nested sub-sections.\nasync function GET() {\n    const sections = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.constitutionSection.findMany({\n        where: {\n            parentSectionId: null\n        },\n        include: {\n            children: {\n                orderBy: {\n                    orderIndex: \"asc\"\n                }\n            }\n        },\n        orderBy: {\n            orderIndex: \"asc\"\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(sections);\n}\nasync function POST(req) {\n    try {\n        (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.requireSession)();\n    } catch  {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Sign in required.\"\n        }, {\n            status: 401\n        });\n    }\n    const payload = await req.json();\n    const title = String(payload.title || \"\").trim();\n    const content = String(payload.content || \"\").trim();\n    const orderIndex = Number(payload.orderIndex) || 1;\n    const parentSectionId = payload.parentSectionId ? Number(payload.parentSectionId) : null;\n    if (!title || !content) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Title and content are required.\"\n        }, {\n            status: 400\n        });\n    }\n    const section = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.constitutionSection.create({\n        data: {\n            title,\n            content,\n            orderIndex,\n            parentSectionId\n        }\n    });\n    const response = next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(section, {\n        status: 201\n    });\n    (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.clearSessionCookie)();\n    return response;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2NvbnN0aXR1dGlvbi9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUF3RDtBQUN0QjtBQUM4QjtBQUVoRSwyRUFBMkU7QUFDcEUsZUFBZUk7SUFDcEIsTUFBTUMsV0FBVyxNQUFNSiwyQ0FBTUEsQ0FBQ0ssbUJBQW1CLENBQUNDLFFBQVEsQ0FBQztRQUN6REMsT0FBTztZQUFFQyxpQkFBaUI7UUFBSztRQUMvQkMsU0FBUztZQUFFQyxVQUFVO2dCQUFFQyxTQUFTO29CQUFFQyxZQUFZO2dCQUFNO1lBQUU7UUFBRTtRQUN4REQsU0FBUztZQUFFQyxZQUFZO1FBQU07SUFDL0I7SUFDQSxPQUFPYixxREFBWUEsQ0FBQ2MsSUFBSSxDQUFDVDtBQUMzQjtBQUVPLGVBQWVVLEtBQUtDLEdBQWdCO0lBQ3pDLElBQUk7UUFDRmIseURBQWNBO0lBQ2hCLEVBQUUsT0FBTTtRQUNOLE9BQU9ILHFEQUFZQSxDQUFDYyxJQUFJLENBQUM7WUFBRUcsT0FBTztRQUFvQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUN6RTtJQUVBLE1BQU1DLFVBQVUsTUFBTUgsSUFBSUYsSUFBSTtJQUM5QixNQUFNTSxRQUFRQyxPQUFPRixRQUFRQyxLQUFLLElBQUksSUFBSUUsSUFBSTtJQUM5QyxNQUFNQyxVQUFVRixPQUFPRixRQUFRSSxPQUFPLElBQUksSUFBSUQsSUFBSTtJQUNsRCxNQUFNVCxhQUFhVyxPQUFPTCxRQUFRTixVQUFVLEtBQUs7SUFDakQsTUFBTUosa0JBQWtCVSxRQUFRVixlQUFlLEdBQUdlLE9BQU9MLFFBQVFWLGVBQWUsSUFBSTtJQUVwRixJQUFJLENBQUNXLFNBQVMsQ0FBQ0csU0FBUztRQUN0QixPQUFPdkIscURBQVlBLENBQUNjLElBQUksQ0FBQztZQUFFRyxPQUFPO1FBQWtDLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ3ZGO0lBRUEsTUFBTU8sVUFBVSxNQUFNeEIsMkNBQU1BLENBQUNLLG1CQUFtQixDQUFDb0IsTUFBTSxDQUFDO1FBQ3REQyxNQUFNO1lBQ0pQO1lBQ0FHO1lBQ0FWO1lBQ0FKO1FBQ0Y7SUFDRjtJQUVBLE1BQU1tQixXQUFXNUIscURBQVlBLENBQUNjLElBQUksQ0FBQ1csU0FBUztRQUFFUCxRQUFRO0lBQUk7SUFDMURoQiw2REFBa0JBO0lBQ2xCLE9BQU8wQjtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYWx1bW5pLWFwcC8uL2FwcC9hcGkvY29uc3RpdHV0aW9uL3JvdXRlLnRzP2FlNmEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIkAvbGliL2RiXCI7XG5pbXBvcnQgeyBjbGVhclNlc3Npb25Db29raWUsIHJlcXVpcmVTZXNzaW9uIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcblxuLy8gR0VUIC9hcGkvY29uc3RpdHV0aW9uIOKAlCBmdWxsIHRhYmxlIG9mIGNvbnRlbnRzIHdpdGggbmVzdGVkIHN1Yi1zZWN0aW9ucy5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIGNvbnN0IHNlY3Rpb25zID0gYXdhaXQgcHJpc21hLmNvbnN0aXR1dGlvblNlY3Rpb24uZmluZE1hbnkoe1xuICAgIHdoZXJlOiB7IHBhcmVudFNlY3Rpb25JZDogbnVsbCB9LFxuICAgIGluY2x1ZGU6IHsgY2hpbGRyZW46IHsgb3JkZXJCeTogeyBvcmRlckluZGV4OiBcImFzY1wiIH0gfSB9LFxuICAgIG9yZGVyQnk6IHsgb3JkZXJJbmRleDogXCJhc2NcIiB9LFxuICB9KTtcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHNlY3Rpb25zKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxOiBOZXh0UmVxdWVzdCkge1xuICB0cnkge1xuICAgIHJlcXVpcmVTZXNzaW9uKCk7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIlNpZ24gaW4gcmVxdWlyZWQuXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgfVxuXG4gIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXEuanNvbigpO1xuICBjb25zdCB0aXRsZSA9IFN0cmluZyhwYXlsb2FkLnRpdGxlIHx8IFwiXCIpLnRyaW0oKTtcbiAgY29uc3QgY29udGVudCA9IFN0cmluZyhwYXlsb2FkLmNvbnRlbnQgfHwgXCJcIikudHJpbSgpO1xuICBjb25zdCBvcmRlckluZGV4ID0gTnVtYmVyKHBheWxvYWQub3JkZXJJbmRleCkgfHwgMTtcbiAgY29uc3QgcGFyZW50U2VjdGlvbklkID0gcGF5bG9hZC5wYXJlbnRTZWN0aW9uSWQgPyBOdW1iZXIocGF5bG9hZC5wYXJlbnRTZWN0aW9uSWQpIDogbnVsbDtcblxuICBpZiAoIXRpdGxlIHx8ICFjb250ZW50KSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVGl0bGUgYW5kIGNvbnRlbnQgYXJlIHJlcXVpcmVkLlwiIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gIH1cblxuICBjb25zdCBzZWN0aW9uID0gYXdhaXQgcHJpc21hLmNvbnN0aXR1dGlvblNlY3Rpb24uY3JlYXRlKHtcbiAgICBkYXRhOiB7XG4gICAgICB0aXRsZSxcbiAgICAgIGNvbnRlbnQsXG4gICAgICBvcmRlckluZGV4LFxuICAgICAgcGFyZW50U2VjdGlvbklkLFxuICAgIH0sXG4gIH0pO1xuXG4gIGNvbnN0IHJlc3BvbnNlID0gTmV4dFJlc3BvbnNlLmpzb24oc2VjdGlvbiwgeyBzdGF0dXM6IDIwMSB9KTtcbiAgY2xlYXJTZXNzaW9uQ29va2llKCk7XG4gIHJldHVybiByZXNwb25zZTtcbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJjbGVhclNlc3Npb25Db29raWUiLCJyZXF1aXJlU2Vzc2lvbiIsIkdFVCIsInNlY3Rpb25zIiwiY29uc3RpdHV0aW9uU2VjdGlvbiIsImZpbmRNYW55Iiwid2hlcmUiLCJwYXJlbnRTZWN0aW9uSWQiLCJpbmNsdWRlIiwiY2hpbGRyZW4iLCJvcmRlckJ5Iiwib3JkZXJJbmRleCIsImpzb24iLCJQT1NUIiwicmVxIiwiZXJyb3IiLCJzdGF0dXMiLCJwYXlsb2FkIiwidGl0bGUiLCJTdHJpbmciLCJ0cmltIiwiY29udGVudCIsIk51bWJlciIsInNlY3Rpb24iLCJjcmVhdGUiLCJkYXRhIiwicmVzcG9uc2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/constitution/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   clearSessionCookie: () => (/* binding */ clearSessionCookie),\n/* harmony export */   createSessionToken: () => (/* binding */ createSessionToken),\n/* harmony export */   getSession: () => (/* binding */ getSession),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   requireSession: () => (/* binding */ requireSession),\n/* harmony export */   setSessionCookie: () => (/* binding */ setSessionCookie),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\n\nconst COOKIE_NAME = \"alumni_session\";\nconst SESSION_HOURS = 8;\nfunction getSecret() {\n    const secret = process.env.JWT_SECRET;\n    if (!secret) throw new Error(\"JWT_SECRET is not set in .env\");\n    return secret;\n}\nasync function hashPassword(plain) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().hash(plain, 12);\n}\nasync function verifyPassword(plain, hash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().compare(plain, hash);\n}\nfunction createSessionToken(userId, username) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().sign({\n        userId,\n        username\n    }, getSecret(), {\n        expiresIn: `${SESSION_HOURS}h`\n    });\n}\nfunction setSessionCookie(token) {\n    (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)().set(COOKIE_NAME, token, {\n        httpOnly: true,\n        secure: \"development\" === \"production\",\n        sameSite: \"lax\",\n        maxAge: SESSION_HOURS * 60 * 60,\n        path: \"/\"\n    });\n}\nfunction clearSessionCookie() {\n    (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)().delete({\n        name: COOKIE_NAME,\n        path: \"/\"\n    });\n}\n/** Reads and verifies the session cookie. Returns null if not signed in. */ function getSession() {\n    const token = (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)().get(COOKIE_NAME)?.value;\n    if (!token) return null;\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default().verify(token, getSecret());\n    } catch  {\n        return null;\n    }\n}\n/** Use inside API routes that require sign-in (Add Contribution / Add Dues). */ function requireSession() {\n    const session = getSession();\n    if (!session) {\n        const err = new Error(\"UNAUTHENTICATED\");\n        err.name = \"UNAUTHENTICATED\";\n        throw err;\n    }\n    return session;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBOEI7QUFDQztBQUNRO0FBRXZDLE1BQU1HLGNBQWM7QUFDcEIsTUFBTUMsZ0JBQWdCO0FBRXRCLFNBQVNDO0lBQ1AsTUFBTUMsU0FBU0MsUUFBUUMsR0FBRyxDQUFDQyxVQUFVO0lBQ3JDLElBQUksQ0FBQ0gsUUFBUSxNQUFNLElBQUlJLE1BQU07SUFDN0IsT0FBT0o7QUFDVDtBQUVPLGVBQWVLLGFBQWFDLEtBQWE7SUFDOUMsT0FBT1osb0RBQVcsQ0FBQ1ksT0FBTztBQUM1QjtBQUVPLGVBQWVFLGVBQWVGLEtBQWEsRUFBRUMsSUFBWTtJQUM5RCxPQUFPYix1REFBYyxDQUFDWSxPQUFPQztBQUMvQjtBQUVPLFNBQVNHLG1CQUFtQkMsTUFBYyxFQUFFQyxRQUFnQjtJQUNqRSxPQUFPakIsd0RBQVEsQ0FBQztRQUFFZ0I7UUFBUUM7SUFBUyxHQUFHYixhQUFhO1FBQ2pEZSxXQUFXLENBQUMsRUFBRWhCLGNBQWMsQ0FBQyxDQUFDO0lBQ2hDO0FBQ0Y7QUFFTyxTQUFTaUIsaUJBQWlCQyxLQUFhO0lBQzVDcEIscURBQU9BLEdBQUdxQixHQUFHLENBQUNwQixhQUFhbUIsT0FBTztRQUNoQ0UsVUFBVTtRQUNWQyxRQUFRbEIsa0JBQXlCO1FBQ2pDbUIsVUFBVTtRQUNWQyxRQUFRdkIsZ0JBQWdCLEtBQUs7UUFDN0J3QixNQUFNO0lBQ1I7QUFDRjtBQUVPLFNBQVNDO0lBQ2QzQixxREFBT0EsR0FBRzRCLE1BQU0sQ0FBQztRQUFFQyxNQUFNNUI7UUFBYXlCLE1BQU07SUFBSTtBQUNsRDtBQU9BLDBFQUEwRSxHQUNuRSxTQUFTSTtJQUNkLE1BQU1WLFFBQVFwQixxREFBT0EsR0FBRytCLEdBQUcsQ0FBQzlCLGNBQWMrQjtJQUMxQyxJQUFJLENBQUNaLE9BQU8sT0FBTztJQUNuQixJQUFJO1FBQ0YsT0FBT3JCLDBEQUFVLENBQUNxQixPQUFPakI7SUFDM0IsRUFBRSxPQUFNO1FBQ04sT0FBTztJQUNUO0FBQ0Y7QUFFQSw4RUFBOEUsR0FDdkUsU0FBUytCO0lBQ2QsTUFBTUMsVUFBVUw7SUFDaEIsSUFBSSxDQUFDSyxTQUFTO1FBQ1osTUFBTUMsTUFBTSxJQUFJNUIsTUFBTTtRQUN0QjRCLElBQUlQLElBQUksR0FBRztRQUNYLE1BQU1PO0lBQ1I7SUFDQSxPQUFPRDtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYWx1bW5pLWFwcC8uL2xpYi9hdXRoLnRzP2JmN2UiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJjcnlwdCBmcm9tIFwiYmNyeXB0anNcIjtcbmltcG9ydCBqd3QgZnJvbSBcImpzb253ZWJ0b2tlblwiO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gXCJuZXh0L2hlYWRlcnNcIjtcblxuY29uc3QgQ09PS0lFX05BTUUgPSBcImFsdW1uaV9zZXNzaW9uXCI7XG5jb25zdCBTRVNTSU9OX0hPVVJTID0gODtcblxuZnVuY3Rpb24gZ2V0U2VjcmV0KCk6IHN0cmluZyB7XG4gIGNvbnN0IHNlY3JldCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQ7XG4gIGlmICghc2VjcmV0KSB0aHJvdyBuZXcgRXJyb3IoXCJKV1RfU0VDUkVUIGlzIG5vdCBzZXQgaW4gLmVudlwiKTtcbiAgcmV0dXJuIHNlY3JldDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhc2hQYXNzd29yZChwbGFpbjogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIGJjcnlwdC5oYXNoKHBsYWluLCAxMik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB2ZXJpZnlQYXNzd29yZChwbGFpbjogc3RyaW5nLCBoYXNoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgcmV0dXJuIGJjcnlwdC5jb21wYXJlKHBsYWluLCBoYXNoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNlc3Npb25Ub2tlbih1c2VySWQ6IG51bWJlciwgdXNlcm5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBqd3Quc2lnbih7IHVzZXJJZCwgdXNlcm5hbWUgfSwgZ2V0U2VjcmV0KCksIHtcbiAgICBleHBpcmVzSW46IGAke1NFU1NJT05fSE9VUlN9aGAsXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0U2Vzc2lvbkNvb2tpZSh0b2tlbjogc3RyaW5nKSB7XG4gIGNvb2tpZXMoKS5zZXQoQ09PS0lFX05BTUUsIHRva2VuLCB7XG4gICAgaHR0cE9ubHk6IHRydWUsXG4gICAgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJwcm9kdWN0aW9uXCIsXG4gICAgc2FtZVNpdGU6IFwibGF4XCIsXG4gICAgbWF4QWdlOiBTRVNTSU9OX0hPVVJTICogNjAgKiA2MCxcbiAgICBwYXRoOiBcIi9cIixcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhclNlc3Npb25Db29raWUoKSB7XG4gIGNvb2tpZXMoKS5kZWxldGUoeyBuYW1lOiBDT09LSUVfTkFNRSwgcGF0aDogXCIvXCIgfSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2Vzc2lvblBheWxvYWQge1xuICB1c2VySWQ6IG51bWJlcjtcbiAgdXNlcm5hbWU6IHN0cmluZztcbn1cblxuLyoqIFJlYWRzIGFuZCB2ZXJpZmllcyB0aGUgc2Vzc2lvbiBjb29raWUuIFJldHVybnMgbnVsbCBpZiBub3Qgc2lnbmVkIGluLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlc3Npb24oKTogU2Vzc2lvblBheWxvYWQgfCBudWxsIHtcbiAgY29uc3QgdG9rZW4gPSBjb29raWVzKCkuZ2V0KENPT0tJRV9OQU1FKT8udmFsdWU7XG4gIGlmICghdG9rZW4pIHJldHVybiBudWxsO1xuICB0cnkge1xuICAgIHJldHVybiBqd3QudmVyaWZ5KHRva2VuLCBnZXRTZWNyZXQoKSkgYXMgU2Vzc2lvblBheWxvYWQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKiBVc2UgaW5zaWRlIEFQSSByb3V0ZXMgdGhhdCByZXF1aXJlIHNpZ24taW4gKEFkZCBDb250cmlidXRpb24gLyBBZGQgRHVlcykuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZVNlc3Npb24oKTogU2Vzc2lvblBheWxvYWQge1xuICBjb25zdCBzZXNzaW9uID0gZ2V0U2Vzc2lvbigpO1xuICBpZiAoIXNlc3Npb24pIHtcbiAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3IoXCJVTkFVVEhFTlRJQ0FURURcIik7XG4gICAgZXJyLm5hbWUgPSBcIlVOQVVUSEVOVElDQVRFRFwiO1xuICAgIHRocm93IGVycjtcbiAgfVxuICByZXR1cm4gc2Vzc2lvbjtcbn1cbiJdLCJuYW1lcyI6WyJiY3J5cHQiLCJqd3QiLCJjb29raWVzIiwiQ09PS0lFX05BTUUiLCJTRVNTSU9OX0hPVVJTIiwiZ2V0U2VjcmV0Iiwic2VjcmV0IiwicHJvY2VzcyIsImVudiIsIkpXVF9TRUNSRVQiLCJFcnJvciIsImhhc2hQYXNzd29yZCIsInBsYWluIiwiaGFzaCIsInZlcmlmeVBhc3N3b3JkIiwiY29tcGFyZSIsImNyZWF0ZVNlc3Npb25Ub2tlbiIsInVzZXJJZCIsInVzZXJuYW1lIiwic2lnbiIsImV4cGlyZXNJbiIsInNldFNlc3Npb25Db29raWUiLCJ0b2tlbiIsInNldCIsImh0dHBPbmx5Iiwic2VjdXJlIiwic2FtZVNpdGUiLCJtYXhBZ2UiLCJwYXRoIiwiY2xlYXJTZXNzaW9uQ29va2llIiwiZGVsZXRlIiwibmFtZSIsImdldFNlc3Npb24iLCJnZXQiLCJ2YWx1ZSIsInZlcmlmeSIsInJlcXVpcmVTZXNzaW9uIiwic2Vzc2lvbiIsImVyciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// Prevents multiple PrismaClient instances in Next.js dev hot-reload\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log:  true ? [\n        \"error\",\n        \"warn\"\n    ] : 0\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQThDO0FBRTlDLHFFQUFxRTtBQUNyRSxNQUFNQyxrQkFBa0JDO0FBRWpCLE1BQU1DLFNBQ1hGLGdCQUFnQkUsTUFBTSxJQUN0QixJQUFJSCx3REFBWUEsQ0FBQztJQUNmSSxLQUFLQyxLQUFzQyxHQUFHO1FBQUM7UUFBUztLQUFPLEdBQUcsQ0FBUztBQUM3RSxHQUFHO0FBRUwsSUFBSUEsSUFBcUMsRUFBRUosZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYWx1bW5pLWFwcC8uL2xpYi9kYi50cz8xZGYwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xuXG4vLyBQcmV2ZW50cyBtdWx0aXBsZSBQcmlzbWFDbGllbnQgaW5zdGFuY2VzIGluIE5leHQuanMgZGV2IGhvdC1yZWxvYWRcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbCBhcyB1bmtub3duIGFzIHsgcHJpc21hOiBQcmlzbWFDbGllbnQgfTtcblxuZXhwb3J0IGNvbnN0IHByaXNtYSA9XG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgfHxcbiAgbmV3IFByaXNtYUNsaWVudCh7XG4gICAgbG9nOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJkZXZlbG9wbWVudFwiID8gW1wiZXJyb3JcIiwgXCJ3YXJuXCJdIDogW1wiZXJyb3JcIl0sXG4gIH0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbCIsInByaXNtYSIsImxvZyIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/ms","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fconstitution%2Froute&page=%2Fapi%2Fconstitution%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fconstitution%2Froute.ts&appDir=C%3A%5CUsers%5CPFS%5Calumni-app%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CPFS%5Calumni-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();