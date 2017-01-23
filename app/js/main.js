/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("\"use strict\";\n\nvar _test = __webpack_require__(1);\n\nvar _test2 = _interopRequireDefault(_test);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n//const React = require('react');\n//const ReactDOM = require('react-dom');\n\n//console.log(ReactDOM, \"ss\");\n\n_test2.default.innerHTML = \"<h1>Hello world!</h1>\";//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz9jNDViIl0sIm5hbWVzIjpbImlubmVySFRNTCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxlQUFLQSxTQUFMLEdBQWlCLHVCQUFqQiIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhZ2UgZnJvbSAnLi90ZXN0Jztcbi8vY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuLy9jb25zdCBSZWFjdERPTSA9IHJlcXVpcmUoJ3JlYWN0LWRvbScpO1xuXG4vL2NvbnNvbGUubG9nKFJlYWN0RE9NLCBcInNzXCIpO1xuXG5wYWdlLmlubmVySFRNTCA9IFwiPGgxPkhlbGxvIHdvcmxkITwvaDE+XCI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL21haW4uanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("'use strict';\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar page = document.querySelector('#My-App');\nexports.default = page;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvdGVzdC5qcz9jYzVhIl0sIm5hbWVzIjpbInBhZ2UiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTUEsT0FBT0MsU0FBU0MsYUFBVCxDQUF1QixTQUF2QixDQUFiO2tCQUNlRixJIiwiZmlsZSI6IjEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI015LUFwcCcpO1xyXG5leHBvcnQgZGVmYXVsdCBwYWdlOyBcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL3Rlc3QuanMiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }
/******/ ]);