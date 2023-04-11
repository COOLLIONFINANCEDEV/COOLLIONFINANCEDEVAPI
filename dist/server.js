"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/esm/esm.js
var require_esm = __commonJS({
  "node_modules/esm/esm.js"(exports, module2) {
    var e = function() {
      return this || Function("return this")();
    }();
    var { apply: t, defineProperty: n } = Reflect;
    var { freeze: r } = Object;
    var { hasOwnProperty: l } = Object.prototype;
    var o = Symbol.for;
    var { type: i, versions: u } = process;
    var { filename: a, id: s, parent: c } = module2;
    var _ = x(u, "electron");
    var p = _ && "renderer" === i;
    var d = "";
    "string" == typeof s && s.startsWith("internal/") && (d = q("internal/esm/loader"));
    var f = require("module");
    var { Script: m } = require("vm");
    var { createCachedData: y, runInNewContext: h, runInThisContext: b } = m.prototype;
    var { sep: g } = require("path");
    var { readFileSync: v } = require("fs");
    var w = new f(s);
    function q(e2) {
      let t2;
      try {
        const { internalBinding: n2 } = require("internal/bootstrap/loaders"), r2 = n2("natives");
        x(r2, e2) && (t2 = r2[e2]);
      } catch (e3) {
      }
      return "string" == typeof t2 ? t2 : "";
    }
    function x(e2, n2) {
      return null != e2 && t(l, e2, [n2]);
    }
    function D() {
      return M(require, w, T), w.exports;
    }
    function O(e2, t2) {
      return D()(e2, t2);
    }
    function j(e2, t2) {
      try {
        return v(e2, t2);
      } catch (e3) {
      }
      return null;
    }
    var C;
    var F;
    w.filename = a, w.parent = c;
    var I = "";
    var S = "";
    "" !== d ? (S = d, F = { __proto__: null, filename: "esm.js" }) : (I = __dirname + g + "node_modules" + g + ".cache" + g + "esm", C = j(I + g + ".data.blob"), S = j(__dirname + g + "esm" + g + "loader.js", "utf8"), null === C && (C = void 0), null === S && (S = ""), F = { __proto__: null, cachedData: C, filename: a, produceCachedData: "function" != typeof y });
    var k = new m("const __global__ = this;(function (require, module, __shared__) { " + S + "\n});", F);
    var M;
    var T;
    if (M = p ? t(b, k, [{ __proto__: null, filename: a }]) : t(h, k, [{ __proto__: null, global: e }, { __proto__: null, filename: a }]), T = D(), "" !== I) {
      const { dir: e2 } = T.package;
      let t2 = e2.get(I);
      if (void 0 === t2) {
        let n3 = C;
        void 0 === n3 && (n3 = null), t2 = { buffer: C, compile: /* @__PURE__ */ new Map([["esm", { circular: 0, code: null, codeWithTDZ: null, filename: null, firstAwaitOutsideFunction: null, firstReturnOutsideFunction: null, mtime: -1, scriptData: n3, sourceType: 1, transforms: 0, yieldIndex: -1 }]]), meta: /* @__PURE__ */ new Map() }, e2.set(I, t2);
      }
      const { pendingScripts: n2 } = T;
      let r2 = n2.get(I);
      void 0 === r2 && (r2 = /* @__PURE__ */ new Map(), n2.set(I, r2)), r2.set("esm", k);
    }
    n(O, T.symbol.package, { __proto__: null, value: true }), n(O, T.customInspectKey, { __proto__: null, value: () => "esm enabled" }), n(O, o("esm:package"), { __proto__: null, value: true }), r(O), module2.exports = O;
  }
});

// src/server.ts
var import_debug15 = __toESM(require("debug"));

// src/app.ts
var import_express12 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_helmet = __toESM(require("helmet"));
var import_morgan = __toESM(require("morgan"));

// src/utils/error.middleware.ts
var import_debug = __toESM(require("debug"));

// src/utils/response.helper.ts
var CustomResponse = class {
  constructor(res) {
    this.response = res;
  }
  static make_response(options) {
    return {
      success: options.success !== void 0 ? options.success : true,
      message: options.message || "",
      data: options.data || [],
      errors: options.errors || []
    };
  }
  /**
   * ANY RESPONSE
   * 
   * @param responseData
   * @param statusCode 200 <= statusCode <= 599
   */
  sendResponse(responseData, statusCode) {
    if (statusCode < 200 || statusCode > 599)
      throw new Error("Success status code range (200 - 599) exceeded!");
    responseData = CustomResponse.make_response(responseData);
    this.response.status(statusCode).send(responseData);
  }
  /**
   * SUCCESS RESPONSE,  200 <= STATUS <= 299
   */
  success({ responseData, statusCode = 200 }) {
    if (statusCode < 200 || statusCode > 299)
      throw new Error("Success status code range (200 - 299) exceeded!");
    responseData.success = true;
    responseData.message = responseData.message || "Ok";
    this.sendResponse(responseData, statusCode);
  }
  /**
   * ERROR RESPONSE,  400 <= STATUS <= 599
   */
  error({ responseData, statusCode = 500 }) {
    if (statusCode < 400 || statusCode > 599 || !Number.isInteger(statusCode))
      throw new Error("Success status code range (200 - 299) exceeded!");
    responseData.success = false;
    responseData.message = responseData.message || "Internal Server Error";
    this.sendResponse(responseData, statusCode);
  }
  /**
   * OK
   */
  200(responseData = {}) {
    this.success({ responseData });
  }
  /**
   * CREATED 
   */
  201(responseData = {}) {
    responseData.message = responseData.message || "Created";
    this.success({ responseData, statusCode: 201 });
  }
  /**
   * NO CONTENT
   */
  204(responseData = {}) {
    responseData.success = true;
    responseData.message = responseData.message || "No Content";
    this.sendResponse(responseData, 204);
  }
  /**
   * BAD REQUEST
   */
  400(responseData = {}) {
    responseData.message = responseData.message || "Bad Request";
    this.error({ responseData, statusCode: 400 });
  }
  /**
   * UNAUTHORIZED
   */
  401(responseData = {}) {
    responseData.message = responseData.message || "Unauthorized";
    this.error({ responseData, statusCode: 401 });
  }
  /**
   * FORBIDDEN
   */
  403(responseData = {}) {
    responseData.message = responseData.message || "Forbidden";
    this.error({ responseData, statusCode: 403 });
  }
  /**
   * NOT FOUND
   */
  404(responseData = {}) {
    responseData.message = responseData.message || "Not Found";
    this.error({ responseData, statusCode: 404 });
  }
  /**
   * CONFLICT
   */
  409(responseData = {}) {
    responseData.message = responseData.message || "Conflict";
    this.error({ responseData, statusCode: 409 });
  }
  /**
   * INTERNAL SERVER ERROR
   */
  500(responseData = {}) {
    this.error({ responseData });
  }
};
var response_helper_default = CustomResponse;

// src/utils/error.middleware.ts
var logger = (0, import_debug.default)("coollion:middleware:error");
var errorHandler = (err, req, res, next) => {
  logger(err.stack);
  new response_helper_default(res)[500]({ message: "Something broke!" });
};

// src/utils/not-found.middleware.ts
var notFoundHandler = (req, res, next) => {
  new response_helper_default(res)[404]({ message: "Resource  not found!" });
};

// src/routes/auth.route.ts
var import_express = __toESM(require("express"));

// src/configs/endpoints.conf.ts
var import_joi = __toESM(require("@hapi/joi"));

// src/utils/validators.helper.ts
var isPhoneNumber = (value, helpers) => {
  if (!/(^\+[1-9][0-9]{0,2}[ ]?[0-9]{8,12}$)|(^\+[1-9]{1,2}-[0-9]{3}[ ]?[0-9]{8,12}$)/.test(value)) {
    return helpers.error("Invalid phone number");
  }
  return value;
};

// src/configs/endpoints.conf.ts
var user = {
  list: {
    method: "get",
    path: "/tenant/:tenantId/user/list:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "User",
      mainRule: true
    }]
  },
  retriveOther: {
    method: "get",
    path: "/tenant/:tenantId/user/:userId",
    authorizationRules: [{
      action: "read",
      subject: "User",
      mainRule: true
    }]
  },
  retrive: {
    method: "get",
    path: "/user",
    authorizationRules: [{
      action: "read",
      subject: "User",
      mainRule: true
    }]
  },
  remove: {
    method: "delete",
    path: "/user",
    authorizationRules: [{
      action: "delete",
      subject: "User",
      mainRule: true
    }]
  },
  update: {
    method: "put",
    path: "/user/",
    schema: import_joi.default.object({
      firstName: import_joi.default.string().lowercase().trim(),
      lastName: import_joi.default.string().lowercase().trim(),
      email: import_joi.default.string().lowercase().trim().email(),
      phone: import_joi.default.string().lowercase().trim().custom(isPhoneNumber, "Validate phone number"),
      phone2: import_joi.default.string().lowercase().trim().custom(isPhoneNumber, "Validate phone number")
    }),
    authorizationRules: [{
      action: "update",
      subject: "User",
      fields: ["firstName", "lastName", "email", "phone", "phone2"],
      mainRule: true
    }]
  }
};
var tenant = {
  list: {
    method: "get",
    path: "/tenant/:tenantId/list/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "Tenant",
      mainRule: true
    }]
  },
  retriveOther: {
    method: "get",
    path: "/tenant/:tenantId/other/:otherId",
    authorizationRules: [{
      action: "read",
      subject: "Tenant",
      mainRule: true
    }]
  },
  retrive: {
    method: "get",
    path: "/tenant/:tenantId",
    authorizationRules: [{
      action: "read",
      subject: "Tenant",
      mainRule: true
    }]
  },
  remove: {
    method: "delete",
    path: "/tenant/:tenantId",
    authorizationRules: [{
      action: "delete",
      subject: "Tenant",
      mainRule: true
    }]
  },
  update: {
    method: "put",
    path: "/tenant/:tenantId",
    schema: import_joi.default.object({
      name: import_joi.default.string().lowercase().trim()
    }),
    authorizationRules: [{
      action: "update",
      subject: "Tenant",
      fields: ["name"],
      mainRule: true
    }]
  },
  register: {
    method: "post",
    path: "/tenant",
    schema: import_joi.default.object({
      name: import_joi.default.string().lowercase().trim().required(),
      accountType: import_joi.default.number().integer().required()
    }),
    authorizationRules: [{
      action: "create",
      subject: "Tenant",
      mainRule: true
    }]
  }
};
var userTenant = {
  list: {
    method: "get",
    path: "/tenant/:tenantId/member/list/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "UserTenant",
      mainRule: true
    }]
  },
  retrive: {
    method: "get",
    path: "/tenant/:tenantId/member/:memberId",
    authorizationRules: [{
      action: "read",
      subject: "UserTenant",
      mainRule: true
    }]
  },
  removeMemberRole: {
    method: "delete",
    path: "/tenant/:tenantId/user-tenant/member/:memberId/remove/role/:roleId",
    authorizationRules: [{
      action: "delete",
      subject: "UserTenant",
      mainRule: true
    }]
  },
  removeMember: {
    method: "delete",
    path: "/tenant/:tenantId/user-tenant/member/:memberId/remove",
    authorizationRules: [{
      action: "delete",
      subject: "UserTenant",
      mainRule: true
    }]
  },
  grantRole: {
    method: "post",
    path: "/tenant/:tenantId/user-tenant/grant-role",
    schema: import_joi.default.object({
      memberId: import_joi.default.number().integer().required(),
      roles: import_joi.default.array().items(import_joi.default.number().integer().required()).required()
    }),
    authorizationRules: [{
      action: "create",
      subject: "UserTenant",
      mainRule: true
    }]
  }
};
var accountTypes = {
  register: {
    method: "post",
    path: "/account-type/",
    schema: import_joi.default.object({
      name: import_joi.default.string().lowercase().trim().required(),
      description: import_joi.default.string().lowercase().trim(),
      roles: import_joi.default.array().items(import_joi.default.number().integer().required()).required(),
      permissions: import_joi.default.array().items(import_joi.default.number().integer())
    }),
    authorizationRules: [
      {
        action: "create",
        subject: "AccountType",
        fields: ["name", "description"],
        mainRule: true
      }
    ]
  }
};
var role = {
  list: {
    method: "get",
    path: "/tenant/:tenantId/role/list/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "Role",
      mainRule: true
    }]
  },
  retrive: {
    method: "get",
    path: "/tenant/:tenantId/role/:roleId",
    authorizationRules: [{
      action: "read",
      subject: "Role",
      mainRule: true
    }]
  },
  remove: {
    method: "delete",
    path: "/tenant/:tenantId/role/:roleId",
    authorizationRules: [{
      action: "delete",
      subject: "Role",
      mainRule: true
    }]
  },
  update: {
    method: "put",
    path: "/tenant/:tenantId/role/:roleId",
    schema: import_joi.default.object({
      name: import_joi.default.string().lowercase().trim().alphanum().min(3).max(30),
      description: import_joi.default.string().lowercase().trim(),
      newPermissions: import_joi.default.array().items(import_joi.default.number().integer()),
      removePermissions: import_joi.default.array().items(import_joi.default.number().integer()),
      published: import_joi.default.boolean()
    }),
    authorizationRules: [{
      action: "update",
      subject: "Role",
      fields: ["name", "description", "published"],
      mainRule: true
    }]
  },
  register: {
    method: "post",
    path: "/tenant/:tenantId/role",
    schema: import_joi.default.object({
      name: import_joi.default.string().lowercase().trim().alphanum().min(3).max(30).required(),
      description: import_joi.default.string().lowercase().trim(),
      permissions: import_joi.default.array().items(
        import_joi.default.number().integer().required(),
        import_joi.default.number().integer().required()
      ).required(),
      published: import_joi.default.boolean().default(false)
    }),
    authorizationRules: [{
      action: "create",
      subject: "Role",
      fields: ["name", "description", "published"],
      mainRule: true
    }]
  }
};
var auth = {
  changePassword: {
    method: "post",
    path: "/auth/change-password",
    schema: import_joi.default.object({
      oldPassword: import_joi.default.string().required(),
      newPassword: import_joi.default.string().required().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{10,})/).messages({ "string.pattern.base": "Give a strong password for more security." })
    }),
    authorizationRules: [{
      action: "update",
      subject: "User",
      fields: "password",
      mainRule: true
    }]
  },
  refreshToken: {
    method: "post",
    path: "/auth/refresh-access",
    schema: import_joi.default.object({
      refreshToken: import_joi.default.string().lowercase().trim().guid({ version: "uuidv4" }).required(),
      userId: import_joi.default.number().integer().required()
    })
  },
  login: {
    method: "post",
    path: "/auth/login",
    schema: import_joi.default.object({
      username: import_joi.default.alternatives().try(
        import_joi.default.string().lowercase().trim().email(),
        import_joi.default.string().lowercase().trim().custom(isPhoneNumber, "Validate phone number")
      ).messages({
        "alternatives.match": "{#label} does not match valide email address or phone number."
      }),
      password: import_joi.default.string(),
      address: import_joi.default.string(),
      magicLink: import_joi.default.string().uri()
    }).with("username", "password").xor("username", "address", "magicLink")
  },
  register: {
    method: "post",
    path: "/auth/register",
    schema: import_joi.default.object({
      email: import_joi.default.string().lowercase().trim().email().required(),
      password: import_joi.default.string().required().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{10,})/).messages({ "string.pattern.base": "Give a strong password for more security." })
    })
  }
};
var project = {
  list: {
    method: "get",
    path: "/tenant/:tenantId/project/list/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "Project",
      mainRule: true
    }]
  },
  retrive: {
    method: "get",
    path: "/tenant/:tenantId/project/:projectId",
    authorizationRules: [{
      action: "read",
      subject: "Project",
      mainRule: true
    }]
  },
  remove: {
    method: "delete",
    path: "/tenant/:tenantId/project/:projectId",
    authorizationRules: [{
      action: "delete",
      subject: "Project",
      mainRule: true
    }]
  },
  update: {
    method: "put",
    path: "/tenant/:tenantId/project/:projectId",
    schema: import_joi.default.object({
      title: import_joi.default.string().lowercase().trim().min(3).max(95),
      disabled: import_joi.default.boolean(),
      treat: import_joi.default.boolean()
    }),
    authorizationRules: [{
      action: "update",
      subject: "Project",
      fields: ["title", "disabled", "treat"],
      mainRule: true
    }]
  },
  register: {
    method: "post",
    path: "/tenant/:tenantId/project/",
    schema: import_joi.default.object({
      title: import_joi.default.string().lowercase().trim().min(3).max(95).required()
    }),
    authorizationRules: [{
      action: "create",
      subject: "Project",
      fields: ["title"],
      mainRule: true
    }]
  }
};
var wallet = {
  retrive: {
    method: "get",
    path: "/tenant/:tenantId/wallet/",
    authorizationRules: [{
      action: "read",
      subject: "Wallet",
      mainRule: true
    }]
  },
  register: {
    method: "post",
    path: "/tenant/:tenantId/wallet/",
    authorizationRules: [{
      action: "create",
      subject: "Wallet",
      mainRule: true
    }]
  }
};
var paymentMethod = {
  listOther: {
    method: "get",
    path: "/tenant/:tenantId/:otherId/payment-method/list/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "PaymentMethod",
      mainRule: true
    }]
  },
  list: {
    method: "get",
    path: "/tenant/:tenantId/payment-method/list/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "PaymentMethod",
      mainRule: true
    }]
  },
  retrive: {
    method: "get",
    path: "/tenant/:tenantId/payment-method/:paymentMethodId",
    authorizationRules: [{
      action: "read",
      subject: "PaymentMethod",
      mainRule: true
    }]
  },
  remove: {
    method: "delete",
    path: "/tenant/:tenantId/payment-method/:paymentMethodId",
    authorizationRules: [{
      action: "delete",
      subject: "PaymentMethod",
      mainRule: true
    }]
  },
  update: {
    method: "put",
    path: "/tenant/:tenantId/payment-method/:paymentMethodId",
    schema: import_joi.default.object({
      disabled: import_joi.default.boolean()
    }),
    authorizationRules: [{
      action: "update",
      subject: "PaymentMethod",
      fields: ["disabled"],
      mainRule: true
    }]
  },
  register: {
    method: "post",
    path: "/tenant/:tenantId/payment-method/",
    schema: import_joi.default.object({
      paymentMethodTypeId: import_joi.default.number().integer().required(),
      // currencyId: Joi.number().integer().required(),
      bank: import_joi.default.string().lowercase().trim().min(3).max(95),
      iban: import_joi.default.string().lowercase().trim().min(3).max(95),
      rib: import_joi.default.string().lowercase().trim().min(3).max(95),
      phone: import_joi.default.string().lowercase().trim().custom(isPhoneNumber, "Validate phone number")
    }),
    authorizationRules: [{
      action: "create",
      subject: "PaymentMethod",
      fields: [
        "paymentMethodTypeId",
        /*"currencyId",*/
        "bank",
        "iban",
        "rib"
      ],
      mainRule: true
    }]
  }
};
var investment = {
  listByProject: {
    method: "get",
    path: "/tenant/:tenantId/project/:projectId/investment/list/:selfOrOther/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "Investment",
      mainRule: true
    }]
  },
  list: {
    method: "get",
    path: "/tenant/:tenantId/investment/list/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "Investment",
      mainRule: true
    }]
  },
  retrive: {
    method: "get",
    path: "/tenant/:tenantId/investment/:investmentId",
    authorizationRules: [{
      action: "read",
      subject: "Investment",
      mainRule: true
    }]
  },
  invest: {
    method: "post",
    path: "/tenant/:tenantId/investment/",
    schema: import_joi.default.object({
      amount: import_joi.default.number().required(),
      projectId: import_joi.default.number().integer().required(),
      term: import_joi.default.number().integer().required()
    }),
    authorizationRules: [{
      action: "create",
      subject: "Investment",
      fields: ["amount", "projectId", "term"],
      mainRule: true
    }]
  }
};
var transaction = {
  listOther: {
    method: "get",
    path: "/tenant/:tenantId/:otherId/transaction/list/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "Transaction",
      mainRule: true
    }]
  },
  list: {
    method: "get",
    path: "/tenant/:tenantId/transaction/list/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "Transaction",
      mainRule: true
    }]
  },
  retrive: {
    method: "get",
    path: "/tenant/:tenantId/transaction/:transactionId",
    authorizationRules: [{
      action: "read",
      subject: "Transaction",
      mainRule: true
    }]
  },
  makeDeposit: {
    method: "post",
    path: "/tenant/:tenantId/transaction",
    schema: import_joi.default.object({
      paymentMethodTypeCodename: import_joi.default.string().trim().valid("MM", "CrC", "CC").required().messages({
        "any.only": 'The allowed values for {#label} are "MM": Mobile Money, "CrC": Credit Card, "CC": Crypto Currency'
      }),
      amount: import_joi.default.number().required(),
      currency: import_joi.default.string().trim().lowercase().valid("usd", "usdc").required().messages({ "any.only": 'The accepted currency are "USD", "USDC"' }),
      transactionId: import_joi.default.string().uuid().required()
    }).when("paymentMethodTypeCodename", {
      is: import_joi.default.string().valid("CC"),
      then: import_joi.default.object({ address: import_joi.default.string().required() })
    }).when("paymentMethodTypeCodename", {
      is: import_joi.default.string().valid("CrC"),
      then: import_joi.default.object({
        customerName: import_joi.default.string().trim().lowercase().required(),
        customerSurname: import_joi.default.string().trim().lowercase().required(),
        customerEmail: import_joi.default.string().trim().lowercase().email().required(),
        customerPhoneNumber: import_joi.default.string().trim().lowercase().required(),
        customerAddress: import_joi.default.string().trim().lowercase().required(),
        customerCity: import_joi.default.string().trim().lowercase().required(),
        customerCountry: import_joi.default.string().trim().lowercase().required(),
        customerState: import_joi.default.string().trim().lowercase().required(),
        customerZipCode: import_joi.default.string().trim().lowercase().required()
      })
    }),
    authorizationRules: [{
      action: "create",
      subject: "Transaction",
      fields: [
        "amount",
        "currency",
        "sender",
        "recipient",
        "reason",
        "transactionId",
        "paymentMethodType",
        "address",
        "customerName",
        "customerSurname",
        "customerEmail",
        "customerPhoneNumber",
        "customerAddress",
        "customerCity",
        "customerState",
        "customerCountry",
        "customerZipCode"
      ],
      mainRule: true
    }]
  },
  syncCinetpayPayment: {
    method: "post",
    path: "/transaction/cinetpay/synchronize-payment"
  }
};
var invitation = {
  list: {
    method: "get",
    path: "/tenant/:tenantId/invitation/list/:page?/:perPage?",
    authorizationRules: [{
      action: "read",
      subject: "Invitation",
      mainRule: true
    }]
  },
  remove: {
    method: "delete",
    path: "/tenant/:tenantId/invitation/:invitationId",
    authorizationRules: [{
      action: "delete",
      subject: "Invitation",
      mainRule: true
    }]
  },
  confirm: {
    method: "post",
    path: "/tenant/:tenantId/invitation/reply",
    schema: import_joi.default.object({
      confirmation: import_joi.default.boolean().required(),
      invitationId: import_joi.default.number().integer().required()
    }),
    authorizationRules: [{
      action: "update",
      subject: "Invitation",
      fields: ["confirm", "deleted"],
      mainRule: true
    }]
  },
  invite: {
    method: "post",
    path: "/tenant/:tenantId/invitation",
    schema: import_joi.default.object({
      emails: import_joi.default.array().items(
        {
          email: import_joi.default.string().lowercase().trim().email().required(),
          roleId: import_joi.default.number().integer().required()
        }
      ).required()
    }),
    authorizationRules: [{
      action: "create",
      subject: "Invitation",
      mainRule: true
    }]
  }
};

// src/controllers/auth.controller.ts
var import_crypto3 = require("crypto");
var import_debug3 = __toESM(require("debug"));
var import_jsonwebtoken4 = __toESM(require("jsonwebtoken"));

// src/configs/app.conf.ts
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var app = {
  version: "v2",
  jwtSecret: String(process.env.JWT_SECRET),
  anonymousPwdSalt: String(process.env.ANONYMOUS_PWD_SALT),
  appBaseUrl: "https://app.coollionfi.com",
  /** 5 minutes */
  tokenExpirationTime: 5 * 60,
  /** 1 hours */
  sessionExpirationTime: 60 * 60,
  baseUserRoleName: String(process.env.BASE_USER_ROLE),
  /** 4 */
  walletMaxPaymentMethods: 4,
  masterWalletId: Number(process.env.MASTER_WALLET_ID),
  /** 300 */
  minimumToInvest: 300,
  /** as much as possible */
  maximumToInvest: void 0,
  pagination: {
    /** 1 */
    page: 1,
    /** 10 */
    perPage: 10
  },
  redisKeys: {
    revokedUserSession: "revokedUserSession"
  },
  transaction: {
    status: {
      REJECTED: -1,
      PENDING: 0,
      ACCEPTED: 1,
      // Cinetpay
      // PENDING: 0,
      SUCCESS: 1,
      REFUNDED: 2,
      CANCELLED: -1,
      FAILED: -2,
      EXPIRED: -3,
      // Stripe
      SUCCEEDED: 1,
      // PENDING: 0,
      // FAILED: -2,
      CANCELED: -1,
      // REFUNDED: 2,
      PARTIALLY_REFUNDED: 3
    },
    services: {
      cinetpay: {
        apiKey: String(process.env.CINETPAY_API_KEY),
        siteId: String(process.env.CINETPAY_SITE_ID),
        password: String(process.env.CINETPAY_PASSWORD),
        secretKey: String(process.env.CINETPAY_SECRET_KEY)
      }
    }
  },
  constants: {
    TOKEN_EXPIRED: "Token expired",
    INVALID_TOKEN: "Invalid token",
    AUTH_HEADER_MISSED: "Missing authorization header",
    ERR_BEARER_TOKEN: "Invalid authorization header",
    COMPROMISED_SESSION: "Session possibly compromised.",
    ERR_REVOKED_SESSION: "Session revoked, re login required!",
    EXP_SESSION: "Session expired.",
    ERR_AUTH_RULES: "Invalid authorization rules",
    ACCESS_DENIED: "Access denied",
    ANY_FIELD: "any field"
  }
};

// src/configs/utils.conf.ts
var import_dotenv2 = __toESM(require("dotenv"));
import_dotenv2.default.config();
var hasher = {
  hashSecretKey: String(process.env.HASH_SECRET_KEY),
  defaultOptions: {
    hashAlgorithm: "sha512",
    hashLength: 64,
    saltLength: 32,
    pbkdf2Iterations: 1e5
  }
};
var twilio = {
  defaultOptions: {
    from: { name: "Cool Lion Team", email: "dev@coollionfi.com" },
    templateId: "d-83839b67e6d340da92ae57b79beee9bd"
  },
  serviceID: String(process.env.SERVICE_ID),
  accountSID: String(process.env.ACCOUNT_SID),
  authToken: String(process.env.AUTH_TOKEN),
  sendGridApiKey: String(process.env.SG_APIKEY),
  templateIDs: {
    accountActivation: "d-6467621fc15440c18fb32b269b64d507",
    invitation: "d-6467621fc15440c18fb32b269b64d507",
    communityInvitation: "d-6467621fc15440c18fb32b269b64d507"
  }
};
var redis = {
  host: String(process.env.REDIS_HOST),
  port: Number(process.env.REDIS_PORT),
  password: String(process.env.REDIS_PASSWORD)
};

// src/models/user.model.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var getAllUsers = async ({ where, page, perPage }) => {
  const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : void 0;
  return await prisma.user.findMany({
    where,
    ...paginate
  });
};
var getUserById = async (id) => {
  return await prisma.user.findFirst({ where: { id, deleted: false } });
};
var getUserByParam = async (params) => {
  return await prisma.user.findFirst({ where: params });
};
var createUser = async (user2) => {
  return await prisma.user.create({
    data: user2
  });
};
var updateUser = async (id, user2) => {
  return await prisma.user.update({
    where: { id },
    data: user2
  });
};

// src/models/permission-role.model.ts
var import_client2 = require("@prisma/client");
var prisma2 = new import_client2.PrismaClient();
var getAllPermissionRoles = async (where) => {
  return await prisma2.permissionRole.findMany({
    where
  });
};
var createPermissionRole = async (permissionRole) => {
  return await prisma2.permissionRole.create({
    data: permissionRole
  });
};
var deletePermissionRoleByPermRole = async (permissionId, roleId) => {
  return await prisma2.permissionRole.delete({
    where: {
      permissionId_roleId: {
        permissionId,
        roleId
      }
    }
  });
};

// src/services/permission-role.service.ts
var getAllPermissionRoles2 = async (where) => {
  return await getAllPermissionRoles(where);
};
var deletePermissionRoleByPermRole2 = async (permissionId, roleId) => {
  return await deletePermissionRoleByPermRole(permissionId, roleId);
};
var attributePermissionToRole = async (permissionId, roleId) => {
  return await createPermissionRole({ permissionId, roleId });
};

// src/models/role.model.ts
var import_client3 = require("@prisma/client");
var prisma3 = new import_client3.PrismaClient();
var getAllRoles = async ({ where, page, perPage } = {}) => {
  const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : void 0;
  return await prisma3.role.findMany({
    where,
    ...paginate
  });
};
var getRoleById = async (id) => {
  return await prisma3.role.findUnique({ where: { id } });
};
var getRoleByParam = async (params) => {
  return await prisma3.role.findFirst({ where: params });
};
var createRole = async (role2) => {
  return await prisma3.role.create({
    data: role2
  });
};
var updateRole = async (id, role2) => {
  return await prisma3.role.update({
    where: { id },
    data: role2
  });
};
var deleteRole = async (roleId) => {
  return await prisma3.role.delete({ where: { id: roleId } });
};

// src/services/role.service.ts
var pagination = app.pagination;
var getAllRoles2 = async ({ where, page, perPage } = {}) => {
  page = page || pagination.page;
  perPage = perPage || pagination.perPage;
  return await getAllRoles({ where, page, perPage });
};
var getRoleById2 = async (id) => {
  return await getRoleById(id);
};
var getRoleByParam2 = async (where) => {
  return await getRoleByParam(where);
};
var getRoleByName = async (roleName) => {
  return await getRoleByParam({
    name: roleName
  });
};
var deleteRole2 = async (roleId) => {
  return deleteRole(roleId);
};
var updateRole2 = async (id, role2) => {
  return await updateRole(id, role2);
};
var registerRole = async (role2) => {
  return await createRole(role2);
};

// src/services/user.service.ts
var pagination2 = app.pagination;
var getAllUsers2 = async ({ where, page, perPage }) => {
  page = page || pagination2.page;
  perPage = perPage || pagination2.perPage;
  return await getAllUsers({ where, page, perPage });
};
var getUserById2 = async (id) => {
  return await getUserById(id);
};
var getUserByEmailOrPhone = async (username) => {
  return await getUserByParam({
    deleted: false,
    OR: [
      { email: username },
      { phone: username }
    ]
  });
};
var updateUser2 = async (id, user2) => {
  return await updateUser(id, user2);
};
var deleteUser = async (id) => {
  return await updateUser(id, { deleted: true });
};
var registerUser = async (user2) => {
  return await createUser(user2);
};

// src/models/users-permissions.model.ts
var import_client4 = require("@prisma/client");
var prisma4 = new import_client4.PrismaClient();
var getUsersPermissionsByUserId = async (id) => {
  return await prisma4.usersPermissions.findMany({
    where: { userId: id },
    select: {
      permission: { select: { codename: true } }
    }
  });
};
var createUsersPermissions = async (usersPermissions) => {
  return await prisma4.usersPermissions.create({
    data: usersPermissions
  });
};

// src/services/users-permissions.service.ts
var registerUsersPermission = async (usersPermissions) => {
  return await createUsersPermissions(usersPermissions);
};

// src/utils/get-access.helper.ts
var import_crypto2 = require("crypto");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/models/users-tenants.model.ts
var import_client5 = require("@prisma/client");
var prisma5 = new import_client5.PrismaClient();
var getAllUserTenants = async ({ where, page, perPage } = {}) => {
  const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : void 0;
  return await prisma5.userTenant.findMany({
    where,
    include: {
      role: {
        include: {
          permissionRole: {
            select: {
              permission: {
                select: { codename: true }
              }
            }
          }
        }
      }
    },
    ...paginate
  });
};
var getUserTenantByParam = async (params) => {
  return await prisma5.userTenant.findFirst({
    where: params,
    include: {
      role: {
        include: {
          permissionRole: {
            select: {
              permission: {
                select: { codename: true }
              }
            }
          }
        }
      }
    }
  });
};
var createUserTenant = async (userTenant2) => {
  return await prisma5.userTenant.create({
    data: userTenant2
  });
};
var deleteUserTenant = async (id) => {
  return await prisma5.userTenant.delete({
    where: { id }
  });
};

// src/services/users-tenants.service.ts
var pagination3 = app.pagination;
var getAllUserTenants2 = async ({ where, page, perPage } = {}) => {
  page = page || pagination3.page;
  perPage = perPage || pagination3.perPage;
  return await getAllUserTenants({ where, page, perPage });
};
var getUserTenantByUserId = async (id) => {
  return await getAllUserTenants({ where: { userId: id } });
};
var getUserTenantByParam2 = async (where) => {
  return await getUserTenantByParam(where);
};
var deleteUserTenant2 = async (id) => {
  return await deleteUserTenant(id);
};
var attributeUserToTenant = async (userTenant2) => {
  return await createUserTenant(userTenant2);
};

// src/utils/hasher.helper.ts
var import_crypto = __toESM(require("crypto"));
var import_bcrypt = __toESM(require("bcrypt"));
var Hasher = class {
  constructor(secretKey, options) {
    this.secretKey = secretKey;
    this.options = { ...hasher.defaultOptions, ...options };
  }
  generateSalt() {
    return import_crypto.default.randomBytes(this.options.saltLength);
  }
  hashString(value, salt) {
    return import_crypto.default.pbkdf2Sync(
      value,
      salt,
      this.options.pbkdf2Iterations,
      this.options.hashLength,
      this.options.hashAlgorithm
    );
  }
  compareHashes(hash1, hash2) {
    return import_crypto.default.timingSafeEqual(hash1, hash2);
  }
  hmac(value, key) {
    const hmac = import_crypto.default.createHmac("sha256", key);
    hmac.update(value);
    return hmac.digest("hex");
  }
  hashPassword(password) {
    const salt = this.generateSalt();
    const hash = this.hashString(password, salt);
    const combined = Buffer.concat([salt, hash]);
    return combined.toString("hex");
  }
  verifyPassword(password, hash) {
    const combined = Buffer.from(hash, "hex");
    const salt = combined.slice(0, this.options.saltLength);
    const expectedHash = combined.slice(
      this.options.saltLength,
      this.options.saltLength + this.options.hashLength
    );
    const actualHash = this.hashString(password, salt);
    return this.compareHashes(actualHash, expectedHash);
  }
  hashToken(token) {
    return this.hmac(token, this.secretKey);
  }
  hashPasswordBcrypt(password) {
    const saltRounds = 12;
    return import_bcrypt.default.hash(password, saltRounds);
  }
  verifyPasswordBcrypt(password, hash) {
    return import_bcrypt.default.compare(password, hash);
  }
};
var hasher_helper_default = Hasher;

// src/utils/redis-client.helper.ts
var import_ioredis = __toESM(require("ioredis"));
var import_debug2 = __toESM(require("debug"));
var redisConnect = new import_ioredis.default(redis);
var logger2 = (0, import_debug2.default)("coollionfi:redisClient");
redisConnect.on("connect", () => {
  logger2("Connected to Redis");
});
redisConnect.on("error", (err) => {
  logger2("%O", "Error connecting to Redis", err);
});
var redisClient = redisConnect;

// src/utils/get-access.helper.ts
var getAccess = async (req, userId) => {
  const hasher2 = new hasher_helper_default(hasher.hashSecretKey);
  const usersTenants = await getUserTenantByUserId(userId);
  const usersPermissions = await getUsersPermissionsByUserId(userId);
  const tenantsPermissions = usersTenants.map(({ tenantId, role: role2 }) => {
    const permissions = role2.permissionRole.map(({ permission }) => permission.codename);
    return [tenantId, permissions];
  });
  const appPermissions = usersPermissions.map(({ permission }) => permission.codename);
  const sessionId = hasher2.hashToken(`${JSON.stringify(req.clientInfo)}${userId}`);
  const refreshToken3 = (0, import_crypto2.randomUUID)();
  const newSession = [refreshToken3, tenantsPermissions, appPermissions];
  await redisClient.set(sessionId, JSON.stringify(newSession), "EX", app.sessionExpirationTime);
  await redisClient.set(refreshToken3, sessionId, "EX", app.sessionExpirationTime);
  await redisClient.srem(app.redisKeys.revokedUserSession, userId);
  const accessToken = import_jsonwebtoken.default.sign({
    userId,
    sessionId,
    tenants: tenantsPermissions.map((tenant2) => tenant2[0])
  }, app.jwtSecret, { expiresIn: app.tokenExpirationTime });
  return { accessToken, refreshToken: refreshToken3 };
};

// src/utils/jwt-error.helper.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var constants = app.constants;
var jwtErrorHandler = (err) => {
  if (err instanceof import_jsonwebtoken2.default.TokenExpiredError)
    return constants.TOKEN_EXPIRED;
  else if (err instanceof import_jsonwebtoken2.default.JsonWebTokenError)
    return constants.INVALID_TOKEN;
  else
    return false;
};

// src/utils/prisma-error.helper.ts
var handlePrismaError = (error, logger4) => {
  const errors = [];
  if (error.code === "P2002") {
    const field = error.meta.target.split("_")[1];
    errors.push({
      field,
      message: `The value of the field "${field}" already used.`
    });
  } else if (error.code === "P2003") {
    const field = error.meta.field_name;
    errors.push({
      field,
      message: `The value of the field "${field}" does not exist in the database.`
    });
  } else if (error.code === "P2025") {
    const cause = error.meta.cause;
    errors.push({
      field: "RecordNotFound",
      message: cause
    });
  }
  return errors;
};

// src/utils/send-magic-link.helper.ts
var import_jsonwebtoken3 = __toESM(require("jsonwebtoken"));

// src/utils/send-email.helper.ts
var import_mail = __toESM(require("@sendgrid/mail"));
import_mail.default.setApiKey(twilio.sendGridApiKey);
var sgSendEmail = async (...options) => {
  try {
    const data = options.map((option) => {
      return { ...twilio.defaultOptions, ...option };
    });
    return await import_mail.default.send(data);
  } catch (error) {
    throw error;
  }
};
var send_email_helper_default = sgSendEmail;

// src/utils/send-magic-link.helper.ts
var sendMagicLink = async (userId, to) => {
  const token = import_jsonwebtoken3.default.sign({ userId }, app.jwtSecret, { expiresIn: app.sessionExpirationTime });
  const tokenBase64Url = Buffer.from(token).toString("base64url");
  const magicLink = `${app.appBaseUrl}?token=${tokenBase64Url}`;
  await send_email_helper_default({
    from: { ...twilio.defaultOptions.from, name: "Cool Lion Finance Account Team" },
    to,
    templateId: twilio.templateIDs.accountActivation,
    dynamicTemplateData: { magicLink }
  });
};

// src/controllers/auth.controller.ts
var constants2 = app.constants;
var changePassword = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug3.default)("coollionfi:auth:changePassword");
  try {
    const { oldPassword, newPassword } = req.body;
    5;
    const hasher2 = new hasher_helper_default(hasher.hashSecretKey);
    const auth2 = req.auth;
    const user2 = await getUserById2(auth2.userId);
    const checkPassword = await hasher2.verifyPasswordBcrypt(oldPassword, String(user2?.password));
    if (!checkPassword) {
      response[401]({
        message: "Incorrect credentials!",
        errors: [{ field: "oldPassword", message: "Invalid old password!" }]
      });
      return;
    }
    const newPasswordHash = await hasher2.hashPasswordBcrypt(newPassword);
    await updateUser(auth2.userId, { password: newPasswordHash });
    await redisClient.sadd(app.redisKeys.revokedUserSession, auth2.userId);
    await redisClient.del(auth2.sessionId);
    response.sendResponse({
      message: "Password was change successfull!"
    }, 201);
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred when changing password" });
  }
};
var refreshToken = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug3.default)("coollionfi:auth:refreshToken");
  try {
    const { refreshToken: refreshToken3, userId } = req.body;
    const hasher2 = new hasher_helper_default(hasher.hashSecretKey);
    const sessionId = await redisClient.get(refreshToken3);
    if (sessionId === null) {
      response[401]({ message: "Session probably expired." });
      return;
    }
    const testSessionId = hasher2.hashToken(`${JSON.stringify(req.clientInfo)}${userId}`);
    if (sessionId !== testSessionId) {
      response[403]({ message: "Session possibly compromised." });
      return;
    }
    const isUserRevoked = await redisClient.sismember(app.redisKeys.revokedUserSession, userId);
    if (isUserRevoked === 1) {
      await redisClient.del([refreshToken3, String(sessionId)]);
      response[401]({ message: "Session revoked, re login required!" });
      return;
    }
    const session = await redisClient.get(sessionId);
    if (session === null) {
      response[401]({ message: "Session expired." });
      return;
    }
    const oldSession = JSON.parse(session);
    const newRefreshToken = (0, import_crypto3.randomUUID)();
    const newSession = [newRefreshToken, oldSession[1], oldSession[2]];
    await redisClient.del(refreshToken3);
    await redisClient.set(sessionId, JSON.stringify(newSession), "EX", app.sessionExpirationTime);
    await redisClient.set(newRefreshToken, sessionId, "EX", app.sessionExpirationTime);
    const newAccessToken = import_jsonwebtoken4.default.sign({
      userId,
      sessionId,
      tenants: oldSession[1].map((tenant2) => tenant2[0])
    }, app.jwtSecret, { expiresIn: app.tokenExpirationTime });
    response.sendResponse({
      message: "Access refresh was successful!",
      data: [{ tokenType: "Bearer", accessToken: newAccessToken, refreshToken: newRefreshToken }]
    }, 200);
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while refreshing the access." });
  }
};
var login = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug3.default)("coollionfi:auth:login");
  try {
    const { username, password, magicLink, address } = req.body;
    const hasher2 = new hasher_helper_default(hasher.hashSecretKey);
    let refreshToken3 = "";
    let accessToken = "null";
    if (magicLink) {
      const token = Buffer.from(magicLink, "base64url").toString("utf8");
      const decodedToken = import_jsonwebtoken4.default.verify(token, app.jwtSecret);
      if (typeof decodedToken === "string")
        return response[401]({ message: constants2.INVALID_TOKEN });
      await updateUser(decodedToken.userId, { emailVerified: true, accountActivated: true });
      const access = await getAccess(req, decodedToken.userId);
      refreshToken3 = access.refreshToken;
      accessToken = access.accessToken;
    } else if (address) {
      const anonymousUser = {
        email: `${address.substring(0, 8)}@anonymous.com`,
        password: `${address}`
      };
      let user2 = await getUserByEmailOrPhone(anonymousUser.email);
      if (!user2) {
        const hasher3 = new hasher_helper_default(hasher.hashSecretKey);
        const passwordHash = await hasher3.hashPasswordBcrypt(anonymousUser.password);
        user2 = await registerUser({ email: anonymousUser.email, password: passwordHash, accountActivated: true });
      } else {
        if (!user2.accountActivated)
          return response[401]({
            message: "Account deactivated! Take look at your emails or contact us for more information about the reason!"
          });
        const checkPassword = await hasher2.verifyPasswordBcrypt(anonymousUser.password, user2.password);
        if (!checkPassword) {
          response[401]({
            message: "Incorrect credentials!",
            errors: [{ field: "password", message: "Invalid password!" }]
          });
          return;
        }
      }
      const access = await getAccess(req, user2.id);
      refreshToken3 = access.refreshToken;
      accessToken = access.accessToken;
    } else {
      const user2 = await getUserByEmailOrPhone(username);
      if (!user2)
        return response[401]({
          message: "Incorrect credentials!",
          errors: [{ field: "username", message: "Account  not found!" }]
        });
      if (!user2.accountActivated) {
        return response[401]({
          message: "Account deactivated! Take look at your emails or contact us for more information about the reason!"
        });
      }
      const parseUsername = username.replace(/ /g, "");
      if (!isNaN(Number(parseUsername)) && !user2.phoneVerified)
        return response[401]({
          message: "You cannot log in with your phone number as it is not verified.",
          errors: [{ field: "username", message: "Use email to log in" }]
        });
      const checkPassword = await hasher2.verifyPasswordBcrypt(password, user2.password);
      if (!checkPassword) {
        response[401]({
          message: "Incorrect credentials!",
          errors: [{ field: "password", message: "Invalid password!" }]
        });
        return;
      }
      const access = await getAccess(req, user2.id);
      refreshToken3 = access.refreshToken;
      accessToken = access.accessToken;
    }
    response[200]({
      message: "Login successful!",
      data: [{ tokenType: "Bearer", accessToken, refreshToken: refreshToken3 }]
    });
  } catch (err) {
    logger4(err);
    logger4(err);
    const jwtError = jwtErrorHandler(err);
    if (jwtError)
      return response[401]({ message: jwtError });
    response[500]({ message: "An error occurred while logging in." });
  }
};
var register = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug3.default)("coollionfi:auth:register");
  try {
    const { email, password } = req.body;
    const hasher2 = new hasher_helper_default(hasher.hashSecretKey);
    const passwordHash = await hasher2.hashPasswordBcrypt(password);
    const baseUserRole = await getRoleByName(app.baseUserRoleName);
    if (baseUserRole === null) {
      response[500]({
        message: "Can't set user permissions!"
      });
      return;
    }
    const permissionsRole = await getAllPermissionRoles2({ roleId: baseUserRole.id });
    if (permissionsRole.length === 0) {
      response[500]({
        message: "Can't set user permissions!"
      });
      return;
    }
    const newUser = await registerUser({ email, password: passwordHash });
    logger4("New user registered successfully!");
    for (const { permissionId } of permissionsRole)
      await registerUsersPermission({ permissionId, userId: newUser.id });
    logger4("Basic access granted for the user!");
    await sendMagicLink(newUser.id, email);
    logger4("Activation account email sent");
    response[201]({ message: "Account created successfully! Please check the magic link in your email box to actvate your account." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while registering." });
    }
  }
};

// src/utils/auth.middleware.ts
var import_debug4 = __toESM(require("debug"));
var import_jsonwebtoken5 = __toESM(require("jsonwebtoken"));

// src/abilities/main.ability.ts
var import_ability = require("@casl/ability");

// src/utils/get-prisma-model-field.helper.ts
var import_client6 = require("@prisma/client");
var getPrismaModelField = (modelName) => {
  const dmmf = import_client6.Prisma.dmmf.datamodel.models.find((value) => value.name === modelName);
  if (dmmf === void 0)
    return void 0;
  return dmmf.fields.map((field) => field.name);
};

// src/abilities/main.ability.ts
var loadPermissionsForUser = (auth2) => {
  if (auth2 === void 0)
    throw new Error("auth is undefined");
  const { userId, tenantId, tenantPermissions, userPermissions } = auth2;
  const abilities = /* @__PURE__ */ new Set();
  tenantPermissions.forEach((permission) => {
    const [action, subject, ...fields] = permission.split("__");
    abilities.add({
      action,
      subject,
      fields: fields[0] !== "" || fields.length > 0 ? fields : void 0
      // conditions: { tenantId }
    });
  });
  userPermissions.forEach((permission) => {
    const [action, subject, ...fields] = permission.split("__");
    abilities.add({
      action,
      subject,
      fields: fields.length > 0 ? fields : void 0
      // conditions: { userId }
    });
  });
  const abilityChecker = new import_ability.PureAbility([...abilities], {
    fieldMatcher: (fields) => (field) => fields.includes(field),
    conditionsMatcher: (conditions) => (rule) => {
      if (!rule.conditions)
        return true;
      const entries = Object.entries(rule.conditions);
      return entries.every(([key, value]) => conditions[key] === value);
    }
  });
  return {
    can: (...[action, subject, field, options]) => {
      const { ignore = false } = options || {};
      if (!ignore) {
        const subjectFields = getPrismaModelField(subject);
        if (field !== void 0 && !subjectFields?.includes(field) && !subjectFields?.includes(field.substring(0, field.lastIndexOf("O"))))
          throw new Error(`Field "${field}" does not exist in model "${subject}"`);
      }
      return abilityChecker.can(action, subject, field);
    },
    cannot: (...[action, subject, field]) => {
      const subjectFields = getPrismaModelField(subject);
      if (!subjectFields?.includes(field))
        throw new Error(`Field "${field}" does not exist in model" ${subject}"`);
      return abilityChecker.cannot(action, subject, field);
    },
    relevantRuleFor: abilityChecker.relevantRuleFor
  };
};

// src/utils/auth.middleware.ts
var constants3 = app.constants;
var authenticate = async (req, res, next) => {
  const response = new response_helper_default(res);
  const hasher2 = new hasher_helper_default(hasher.hashSecretKey);
  const authHeader = req.headers.authorization;
  const logger4 = (0, import_debug4.default)("coollionfi:middleware:auth:authenticate");
  if (!authHeader)
    return response[401]({ message: constants3.AUTH_HEADER_MISSED });
  const [bearer, token] = authHeader.split(" ");
  if (!bearer || !token || bearer !== "Bearer")
    return response[401]({ message: constants3.ERR_BEARER_TOKEN });
  try {
    const decodedToken = import_jsonwebtoken5.default.verify(token, app.jwtSecret);
    if (typeof decodedToken === "string")
      return response[401]({ message: constants3.INVALID_TOKEN });
    const testSessionId = hasher2.hashToken(`${JSON.stringify(req.clientInfo)}${decodedToken.userId}`);
    if (decodedToken.sessionId !== testSessionId) {
      return response[403]({ message: constants3.COMPROMISED_SESSION });
    }
    const isUserRevoked = await redisClient.sismember(app.redisKeys.revokedUserSession, decodedToken.userId);
    if (isUserRevoked === 1)
      return response[401]({ message: constants3.ERR_REVOKED_SESSION });
    const session = await redisClient.get(decodedToken.sessionId);
    if (session === null)
      return response[401]({ message: constants3.EXP_SESSION });
    let tenantId = Number(req.params.tenantId);
    if (isNaN(tenantId))
      tenantId = Math.floor(Math.random() * -1e3);
    const authKey = `user:${decodedToken.userId}:tenant:${tenantId}`;
    const auth2 = await redisClient.get(authKey);
    if (auth2 !== null)
      req.auth = JSON.parse(auth2);
    else {
      const parsedSession = JSON.parse(session);
      const tenantsPermissions = parsedSession[1];
      const userPermissions = ["delete__Transaction", "create__Transaction", "update__Transaction", "read__Transaction__nameOther", ...parsedSession[2]];
      const actualTenantPermissions = tenantsPermissions.filter(([tenant2]) => tenant2 === tenantId);
      const tenantPermissions = /* @__PURE__ */ new Set();
      actualTenantPermissions.forEach(([, permissions]) => {
        for (const permission of permissions)
          tenantPermissions.add(permission);
      });
      req.auth = {
        userId: decodedToken.userId,
        tenantId,
        sessionId: decodedToken.sessionId,
        tenantPermissions: [...tenantPermissions],
        userPermissions
      };
      await redisClient.set(authKey, JSON.stringify(req.auth), "EX", 2.5 * 60);
    }
    next();
  } catch (err) {
    logger4(err);
    const jwtError = jwtErrorHandler(err);
    if (jwtError)
      return response[401]({ message: jwtError });
    response[401]({ message: constants3.INVALID_TOKEN });
  }
};
var authorize = (authorizationRules) => {
  return async (req, res, next) => {
    const response = new response_helper_default(res);
    const logger4 = (0, import_debug4.default)("coollionfi:middleware:auth:authorize");
    if (authorizationRules === void 0)
      throw new Error(`${constants3.ERR_AUTH_RULES}`);
    try {
      req.abilities = loadPermissionsForUser(req.auth);
      const { can } = req.abilities;
      let checker = true;
      const bodyFields = Object.keys(req.body);
      for (let { action, subject, fields, mainRule } of authorizationRules) {
        action = action;
        subject = subject;
        const bool = typeof fields === "string" && (Boolean(mainRule) ? bodyFields.includes(fields) : true);
        if (bool || typeof fields === "undefined") {
          fields = fields;
          checker = can(action, subject, fields);
          if (!checker) {
            let fieldToCheck = constants3.ANY_FIELD;
            if (fields && fields !== "") {
              if (fields.substring(fields.lastIndexOf("O")) === "Other")
                fieldToCheck = fields.substring(0, fields.lastIndexOf("O"));
            }
            response[403]({
              message: constants3.ACCESS_DENIED,
              errors: [{
                field: fieldToCheck,
                message: `You have not authorized to ${action} the following field of subject ${subject}: ${fieldToCheck}`
              }]
            });
            return;
          }
        } else {
          for (const field of fields) {
            const bool2 = Boolean(mainRule) ? bodyFields.includes(field) : true;
            if (bool2) {
              checker = can(action, subject, field);
              if (!checker) {
                let fieldToCheck = constants3.ANY_FIELD;
                if (field && field !== "") {
                  if (field.substring(field.lastIndexOf("O")) === "Other")
                    fieldToCheck = field.substring(0, field.lastIndexOf("O"));
                }
                response[403]({
                  message: constants3.ACCESS_DENIED,
                  errors: [{
                    field: fieldToCheck,
                    message: `You have not authorized to ${action} the following field of subject ${subject}: ${fieldToCheck}`
                  }]
                });
                return;
              }
            }
          }
        }
        if (!checker)
          return;
      }
      if (checker)
        next();
      else
        return;
    } catch (err) {
      logger4(err);
      return response[403]({ message: "An error occurred while checking authorization." });
    }
  };
};

// src/utils/validator.middleware.ts
var validator = (schema) => {
  return async (req, res, next) => {
    if (schema === void 0)
      throw new Error(`Invalid schema`);
    try {
      const value = await schema.validateAsync(req.body, { abortEarly: false });
      req.body = value;
      next();
    } catch (err) {
      const errors = [];
      err.details.forEach(({ message, context }) => {
        const { key } = context;
        errors.push({ field: key, message });
      });
      const response = new response_helper_default(res);
      response[400]({ errors });
    }
  };
};

// src/routes/auth.route.ts
var router = import_express.default.Router();
var { register: register2, login: login2, refreshToken: refreshToken2, changePassword: changePassword2 } = auth;
router.post(changePassword2.path, authenticate, authorize(changePassword2.authorizationRules), validator(changePassword2.schema), changePassword);
router.post(refreshToken2.path, validator(refreshToken2.schema), refreshToken);
router.post(login2.path, validator(login2.schema), login);
router.post(register2.path, validator(register2.schema), register);
var auth_route_default = router;

// src/routes/user.route.ts
var import_express2 = __toESM(require("express"));

// src/controllers/user.controller.ts
var import_debug5 = __toESM(require("debug"));

// src/abilities/filter.ability.ts
var abilitiesFilter = (arg, customFilter) => {
  const { subject, action = "read", abilities, input, selfInput = true } = arg;
  return new Promise((resolve, reject) => {
    if (input.length === 0)
      resolve([]);
    if (customFilter) {
      try {
        resolve(customFilter({ subject, action, abilities, input, selfInput }));
      } catch (err) {
        reject(err);
      }
    }
    const filteredInput = input.map((value) => {
      const filteredValue = {};
      Object.keys(value).forEach((item) => {
        if (abilities.can(action, subject, selfInput ? item : `${item}Other`))
          filteredValue[item] = value[item];
      });
      return filteredValue;
    });
    resolve(filteredInput);
  });
};

// src/utils/out-item-from-list.helper.ts
var outItemFromList = (input, filterCallBack) => {
  return new Promise((resolve, reject) => {
    if (input.length === 0)
      resolve([]);
    if (filterCallBack)
      resolve(filterCallBack(input));
    if (typeof input[0] === "string" || typeof input[0] === "number")
      resolve(input.filter((item) => Boolean(item)));
    resolve(input.filter((item) => Object.keys(item).length > 0));
  });
};

// src/controllers/user.controller.ts
var list = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug5.default)("coollionfi:user:list");
  try {
    const { userId } = req.auth;
    const { page, perPage } = req.params;
    const users = await getAllUsers2({ where: { id: { not: userId }, deleted: false }, page: Number(page), perPage: Number(perPage) });
    const filteredUsers = await abilitiesFilter({
      subject: "User",
      abilities: req.abilities,
      input: users,
      selfInput: false
    });
    const finalUsers = await outItemFromList(filteredUsers);
    response[200]({ data: finalUsers });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var retrive = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug5.default)("coollionfi:user:retrive");
  try {
    let userId = req.auth.userId;
    const paramUserId = req.params.userId;
    if (paramUserId && isNaN(Number(paramUserId)))
      return response[400]({ message: "Invalid query parameter userId." });
    else
      userId = Number(paramUserId) || userId;
    const user2 = await getUserById2(userId);
    if (!user2)
      return response[404]({ message: "The record to read not found!" });
    const filteredUser = await abilitiesFilter({
      subject: "User",
      abilities: req.abilities,
      input: [user2],
      selfInput: userId === req.auth?.userId
    });
    const finalUser = await outItemFromList(filteredUser);
    response[200]({ data: finalUser });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var remove = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug5.default)("coollionfi:user:delete");
  try {
    const { userId } = req.auth;
    await deleteUser(userId);
    response[204]({ message: "Successfully deleted." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0 && errors[0].field === "RecordNotFound") {
      response[404]({ message: "The record to delete not found!" });
    } else {
      logger4(err);
      response[500]({ message: "An error occurred while deleting information." });
    }
  }
};
var update = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug5.default)("coollionfi:user:update");
  try {
    const { userId } = req.auth;
    const user2 = await getUserById2(Number(userId));
    if (!user2)
      return response[404]({ message: "The record to update not found!" });
    const { email, phone, phone2 } = req.body;
    let { emailVerified, phoneVerified, phone2Verified } = user2;
    let emailActivationMsg = "";
    if (email && email !== user2.email) {
      emailVerified = false;
      emailActivationMsg = "Please open the magic link in the email we sent you to activate your email address.";
      await sendMagicLink(user2.id, email);
      logger4("Activation account email sent");
    }
    phoneVerified = phone && phone !== user2.phone ? false : phoneVerified;
    phone2Verified = phone2 && phone2 !== user2.phone2 ? false : phone2Verified;
    await updateUser2(user2.id, { emailVerified, phoneVerified, phone2Verified, ...req.body });
    response[200]({ message: `Informations updated successfully! ${emailActivationMsg}` });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while updating information." });
    }
  }
};

// src/routes/user.route.ts
var router2 = import_express2.default.Router();
var { update: update2, remove: remove2, retrive: retrive2, retriveOther, list: list2 } = user;
router2[list2.method](list2.path, authenticate, authorize(list2.authorizationRules), list);
router2[retriveOther.method](retriveOther.path, authenticate, authorize(retriveOther.authorizationRules), retrive);
router2[retrive2.method](retrive2.path, authenticate, authorize(retrive2.authorizationRules), retrive);
router2[remove2.method](remove2.path, authenticate, authorize(remove2.authorizationRules), remove);
router2[update2.method](update2.path, authenticate, authorize(update2.authorizationRules), validator(update2.schema), update);
var user_route_default = router2;

// src/routes/tenant.route.ts
var import_express3 = __toESM(require("express"));

// src/controllers/tenant.controller.ts
var import_debug6 = __toESM(require("debug"));

// src/models/account-type.model.ts
var import_client7 = require("@prisma/client");
var prisma6 = new import_client7.PrismaClient();
var getAccountTypeById = async (id) => {
  return await prisma6.accountType.findUnique({ where: { id } });
};

// src/models/account-type-role.model.ts
var import_client8 = require("@prisma/client");
var prisma7 = new import_client8.PrismaClient();
var getAllAccountTypeRole = async (where) => {
  return await prisma7.accountTypeRole.findMany({
    where
  });
};

// src/services/account-type-role.service.ts
var getAllAccountTypeRole2 = async (where) => {
  return await getAllAccountTypeRole(where);
};

// src/models/tenant.model.ts
var import_client9 = require("@prisma/client");
var prisma8 = new import_client9.PrismaClient();
var getAllTenants = async ({ where, page, perPage } = {}) => {
  const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : void 0;
  return await prisma8.tenant.findMany({
    where,
    ...paginate
  });
};
var getTenantById = async (id) => {
  return await prisma8.tenant.findFirst({ where: { id, deleted: false } });
};
var createTenant = async (tenant2) => {
  return await prisma8.tenant.create({
    data: tenant2
  });
};
var updateTenant = async (id, tenant2) => {
  return await prisma8.tenant.update({
    where: { id },
    data: tenant2
  });
};

// src/services/tenant.service.ts
var pagination4 = app.pagination;
var getAllTenants2 = async ({ where, page, perPage } = {}) => {
  page = page || pagination4.page;
  perPage = perPage || pagination4.perPage;
  return await getAllTenants({ where, page, perPage });
};
var getTenantById2 = async (id) => {
  return await getTenantById(id);
};
var updateTenant2 = async (id, tenant2) => {
  return await updateTenant(id, tenant2);
};
var registerTenant = async (tenant2) => {
  return await createTenant(tenant2);
};

// src/controllers/tenant.controller.ts
var list3 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug6.default)("coollionfi:tenant:list");
  try {
    const { tenantId } = req.auth;
    const { page, perPage } = req.params;
    const tenants = await getAllTenants2({ where: { id: { not: tenantId }, deleted: false }, page: Number(page), perPage: Number(perPage) });
    const filteredTenants = await abilitiesFilter({
      subject: "Tenant",
      abilities: req.abilities,
      input: tenants,
      selfInput: false
    });
    const finalTenants = await outItemFromList(filteredTenants);
    response[200]({ data: finalTenants });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var retriveOther2 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug6.default)("coollionfi:tenant:retriveOther");
  try {
    const { tenantId } = req.auth;
    const { otherId } = req.params;
    if (isNaN(Number(otherId)))
      return response[400]({ message: "Invalid query parameter tenantId." });
    const tenant2 = await getTenantById2(Number(otherId));
    if (!tenant2)
      return response[404]({ message: "The record to read not found!" });
    const filteredTenant = await abilitiesFilter({
      subject: "Tenant",
      abilities: req.abilities,
      input: [tenant2],
      selfInput: tenantId === Number(otherId) ? true : false
    });
    const finalTenant = await outItemFromList(filteredTenant);
    response[200]({ data: finalTenant });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var retrive3 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug6.default)("coollionfi:tenant:retrive");
  try {
    const { tenantId } = req.auth;
    const tenant2 = await getTenantById2(tenantId);
    if (!tenant2)
      return response[404]({ message: "The record to read not found!" });
    const filteredTenant = await abilitiesFilter({
      subject: "Tenant",
      abilities: req.abilities,
      input: [tenant2]
    });
    const finalTenant = await outItemFromList(filteredTenant);
    response[200]({ data: finalTenant });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var remove3 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug6.default)("coollionfi:tenant:delete");
  try {
    const { tenantId } = req.auth;
    await updateTenant2(tenantId, { deleted: true });
    response[204]({ message: "Successfully deleted." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0 && errors[0].field === "RecordNotFound") {
      response[404]({ message: "The record to delete not found!" });
    } else {
      logger4(err);
      response[500]({ message: "An error occurred while deleting information." });
    }
  }
};
var update3 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug6.default)("coollionfi:tenant:update");
  try {
    const { tenantId } = req.auth;
    await updateTenant2(tenantId, req.body);
    response[200]({ message: "Informations updated successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while updating information." });
    }
  }
};
var register3 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug6.default)("coollionfi:tenant:register");
  try {
    const { name, accountTypeId } = req.body;
    const { userId, tenantId } = req.auth;
    const accountTypesRoles = await getAllAccountTypeRole2({ accountTypeId });
    if (accountTypesRoles.length === 0) {
      return response[500]({
        message: "Invalid account type!",
        errors: [{
          field: "accountType",
          message: "Can't set manager for this account type"
        }]
      });
    }
    const accountType = await getAccountTypeById(accountTypeId);
    if (!accountType)
      return response[404]({ message: "Account type not found" });
    if (!req.abilities?.can("create", "Tenant", `withAccountType${accountType.codename}`, { ignore: true }))
      return response[403]({ message: "You have no permission to create tenant with this account type." });
    const newTenant = await registerTenant({ name, accountTypeId });
    logger4("New tenant registered successfully by user" + userId);
    for (const accountTypeRole of accountTypesRoles)
      await attributeUserToTenant({
        userId,
        tenantId: newTenant.id,
        userTenantId: tenantId > 0 ? tenantId : void 0,
        roleId: accountTypeRole.roleId,
        manager: true
      });
    logger4("User set as tenant manager");
    response[201]({ message: "Tenant registered successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while registering the tenant." });
    }
  }
};

// src/routes/tenant.route.ts
var router3 = import_express3.default.Router();
var { register: register4, update: update4, remove: remove4, retrive: retrive4, retriveOther: retriveOther3, list: list4 } = tenant;
router3[list4.method](list4.path, authenticate, authorize(list4.authorizationRules), list3);
router3[retriveOther3.method](retriveOther3.path, authenticate, authorize(retriveOther3.authorizationRules), retriveOther2);
router3[retrive4.method](retrive4.path, authenticate, authorize(retrive4.authorizationRules), retrive3);
router3[remove4.method](remove4.path, authenticate, authorize(remove4.authorizationRules), remove3);
router3[update4.method](update4.path, authenticate, authorize(update4.authorizationRules), validator(update4.schema), update3);
router3[register4.method](register4.path, authenticate, authorize(register4.authorizationRules), validator(register4.schema), register3);
var tenant_route_default = router3;

// src/routes/role.route.ts
var import_express4 = __toESM(require("express"));

// src/controllers/role.controller.ts
var import_debug7 = __toESM(require("debug"));
var list5 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug7.default)("coollionfi:role:list");
  try {
    const { tenantId, userId } = req.auth;
    const { page, perPage } = req.params;
    let roles = [];
    const { can } = req.abilities;
    if (can("manage", "Role")) {
      roles = await getAllRoles2({ page: Number(page), perPage: Number(perPage) });
    } else {
      const tenant2 = await getTenantById2(tenantId);
      if (!tenant2)
        return response[404]({ message: "The record to read not found!" });
      roles = await getAllRoles2({
        where: {
          usersTenants: {
            some: { userId, tenantId }
          },
          OR: [
            { owner: tenantId },
            { published: true }
          ]
        },
        page: Number(page),
        perPage: Number(perPage)
      });
    }
    const filteredRoles = await abilitiesFilter({
      subject: "Role",
      abilities: req.abilities,
      input: roles,
      selfInput: false
    }, ({ subject, action, abilities, input }) => {
      const filteredInput = input.map((role2) => {
        const filteredValue = {};
        Object.keys(role2).forEach((item) => {
          if (abilities.can(action, subject, role2.owner === tenantId ? item : `${item}Other`))
            filteredValue[item] = role2[item];
        });
        return filteredValue;
      });
      return filteredInput;
    });
    const finalRoles = await outItemFromList(filteredRoles);
    response[200]({ data: finalRoles });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var retrive5 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug7.default)("coollionfi:role:retrive");
  try {
    const { tenantId } = req.auth;
    const { roleId } = req.params;
    if (isNaN(Number(roleId)))
      return response[400]({ message: "Invalid query parameter roleId." });
    let role2 = null;
    const { can } = req.abilities;
    if (can("manage", "Role")) {
      role2 = await getRoleById2(Number(roleId));
    } else {
      const tenant2 = await getTenantById2(tenantId);
      if (!tenant2)
        return response[404]({ message: "The record to read not found!" });
      role2 = await getRoleByParam2({
        id: Number(roleId),
        accountsTypesRoles: {
          some: {
            accountTypeId: tenant2.accountTypeId
          }
        }
      });
    }
    if (!role2)
      return response[404]({ message: "Record not found!" });
    const testOwner = role2.owner !== tenantId;
    if (testOwner && !role2.published)
      return response[403]({ message: "You do not have permission to view the selected record information." });
    const filteredRole = await abilitiesFilter({
      subject: "Role",
      abilities: req.abilities,
      input: [role2],
      selfInput: testOwner ? false : true
    });
    const finalRole = await outItemFromList(filteredRole);
    response[200]({ data: finalRole });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var remove5 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug7.default)("coollionfi:role:delete");
  try {
    const { tenantId } = req.auth;
    const { roleId } = req.params;
    if (isNaN(Number(roleId)))
      return response[400]({ message: "Invalid query parameter roleId." });
    const role2 = await getRoleById2(Number(roleId));
    if (!role2)
      return response[404]({ message: "The record to delete not found!" });
    if (role2.owner !== tenantId)
      return response[403]({ message: "You do not have permission to delete the selected record!" });
    await deleteRole2(Number(roleId));
    response[204]({ message: "Successfully deleted." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0 && errors[0].field === "RecordNotFound") {
      response[404]({ message: "The record to delete not found!" });
    } else {
      logger4(err);
      response[500]({ message: "An error occurred while deleting information." });
    }
  }
};
var update5 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug7.default)("coollionfi:role:update");
  try {
    const { tenantId } = req.auth;
    const { roleId } = req.params;
    const { name, description, published, newPermissions, removePermissions } = req.body;
    if (isNaN(Number(roleId)))
      return response[400]({ message: "Invalid query parameter roleId." });
    const role2 = await getRoleById2(Number(roleId));
    if (!role2)
      return response[404]({ message: "The record to update not found!" });
    if (role2.owner !== tenantId)
      return response[403]({ message: "You do not have permission to update the selected record!" });
    for (const permissionId of newPermissions)
      await attributePermissionToRole(permissionId, role2.id);
    for (const permissionId of removePermissions)
      await deletePermissionRoleByPermRole2(permissionId, role2.id);
    await updateRole2(role2.id, { name, description, published });
    response[200]({ message: "Informations updated successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while updating information." });
    }
  }
};
var register5 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug7.default)("coollionfi:role:register");
  try {
    const { name, description, published, permissions } = req.body;
    const { userId, tenantId } = req.auth;
    const newRole = await registerRole({ name, description, published, owner: tenantId });
    logger4(`New role registered successfully. Owner:  ${tenantId}, creator: ${userId}`);
    for (const permissionId of permissions)
      await attributePermissionToRole(permissionId, newRole.id);
    logger4("Permissions attribute to role: ");
    response[201]({ message: "Role registered successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while registering the tenant." });
    }
  }
};

// src/routes/role.route.ts
var router4 = import_express4.default.Router();
var { register: register6, update: update6, remove: remove6, retrive: retrive6, list: list6 } = role;
router4[list6.method](list6.path, authenticate, authorize(list6.authorizationRules), list5);
router4[retrive6.method](retrive6.path, authenticate, authorize(retrive6.authorizationRules), retrive5);
router4[remove6.method](remove6.path, authenticate, authorize(remove6.authorizationRules), remove5);
router4[update6.method](update6.path, authenticate, authorize(update6.authorizationRules), validator(update6.schema), update5);
router4[register6.method](register6.path, authenticate, authorize(register6.authorizationRules), validator(register6.schema), register5);
var role_route_default = router4;

// src/routes/project.route.ts
var import_express5 = __toESM(require("express"));

// src/controllers/project.controller.ts
var import_debug8 = __toESM(require("debug"));

// src/models/project.model.ts
var import_client10 = require("@prisma/client");
var prisma9 = new import_client10.PrismaClient();
var getAllProjects = async ({ where, page, perPage } = {}) => {
  const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : void 0;
  return await prisma9.project.findMany({
    where,
    ...paginate
  });
};
var getProjectById = async (id) => {
  return await prisma9.project.findFirst({ where: { id, deleted: false } });
};
var getProjectByParam = async (params) => {
  return await prisma9.project.findFirst({ where: params });
};
var createProject = async (project2) => {
  return await prisma9.project.create({
    data: project2
  });
};
var updateProject = async (id, project2) => {
  return await prisma9.project.update({
    where: { id },
    data: project2
  });
};

// src/services/project.service.ts
var pagination5 = app.pagination;
var getAllProjects2 = async ({ where, page, perPage } = {}) => {
  page = page || pagination5.page;
  perPage = perPage || pagination5.perPage;
  return await getAllProjects({ where, page, perPage });
};
var getProjectById2 = async (id) => {
  return await getProjectById(id);
};
var getProjectByParam2 = async (where) => {
  return await getProjectByParam(where);
};
var deleteProject = async (id) => {
  return await updateProject(id, { deleted: true });
};
var updateProject2 = async (id, project2) => {
  return await updateProject(id, project2);
};
var registerProject = async (project2) => {
  return await createProject(project2);
};

// src/controllers/project.controller.ts
var list7 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug8.default)("coollionfi:project:list");
  try {
    const { tenantId } = req.auth;
    const { page, perPage } = req.params;
    const { can } = req.abilities;
    const projects = await getAllProjects2({ page: Number(page), perPage: Number(perPage) });
    const filteredProjects = await abilitiesFilter({
      subject: "Project",
      abilities: req.abilities,
      input: projects
      // selfInput: testOwner || !can("manage", "Project") ? false : true
    }, ({ action, subject, abilities, input, selfInput }) => {
      const projects2 = [];
      for (const project2 of input) {
        const testOwner = project2.owner !== tenantId;
        selfInput = testOwner || !can("manage", "Project") ? false : true;
        if (selfInput || !project2.disabled) {
          let filteredValue = {};
          Object.keys(project2).forEach((item) => {
            if (abilities.can(action, subject, selfInput ? item : `${item}Other`))
              filteredValue[item] = project2[item];
          });
          projects2.push(filteredValue);
        }
      }
      return projects2;
    });
    const finalProjects = await outItemFromList(filteredProjects);
    response[200]({ data: finalProjects });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var retrive7 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug8.default)("coollionfi:project:retrive");
  try {
    const { tenantId } = req.auth;
    const { projectId } = req.params;
    const { can } = req.abilities;
    if (isNaN(Number(projectId)))
      return response[400]({ message: "Invalid query parameter projectId." });
    const project2 = await getProjectById2(Number(projectId));
    if (!project2)
      return response[404]({ message: "Record not found!" });
    const testOwner = project2.owner !== tenantId;
    const filteredProject = await abilitiesFilter({
      subject: "Project",
      abilities: req.abilities,
      input: [project2],
      selfInput: testOwner || !can("manage", "Project") ? false : true
    }, ({ action, subject, abilities, input, selfInput }) => {
      const projects = [];
      for (const project3 of input) {
        if (selfInput || !project3.disabled) {
          let filteredValue = {};
          Object.keys(project3).forEach((item) => {
            if (abilities.can(action, subject, selfInput ? item : `${item}Other`))
              filteredValue[item] = project3[item];
          });
          projects.push(filteredValue);
        }
      }
      return projects;
    });
    const finalProject = await outItemFromList(filteredProject);
    response[200]({ data: finalProject });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var remove7 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug8.default)("coollionfi:project:delete");
  try {
    const { tenantId } = req.auth;
    const { projectId } = req.params;
    if (isNaN(Number(projectId)))
      return response[400]({ message: "Invalid query parameter projectId." });
    const project2 = await getProjectById2(Number(projectId));
    if (!project2)
      return response[404]({ message: "The record to delete not found!" });
    if (project2.owner !== tenantId)
      return response[403]({ message: "You do not have permission to delete the selected record!" });
    await deleteProject(Number(projectId));
    response[204]({ message: "Successfully deleted." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0 && errors[0].field === "RecordNotFound") {
      response[404]({ message: "The record to delete not found!" });
    } else {
      logger4(err);
      response[500]({ message: "An error occurred while deleting information." });
    }
  }
};
var update7 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug8.default)("coollionfi:project:update");
  try {
    const { tenantId } = req.auth;
    const { projectId } = req.params;
    const { can } = req.abilities;
    if (isNaN(Number(projectId)))
      return response[400]({ message: "Invalid query parameter projectId." });
    const project2 = await getProjectById2(Number(projectId));
    if (!project2)
      return response[404]({ message: "The record to update not found!" });
    if (project2.owner !== tenantId && !can("manage", "Project"))
      return response[403]({ message: "You do not have permission to update the selected record!" });
    await updateProject2(project2.id, { disabled: true, treat: false, ...req.body });
    response[200]({ message: "Informations updated successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while updating information." });
    }
  }
};
var register7 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug8.default)("coollionfi:project:register");
  try {
    const { title } = req.body;
    const { userId, tenantId } = req.auth;
    const project2 = await getProjectByParam2({ title, owner: tenantId, deleted: false });
    if (project2)
      return response[400]({
        message: "Duplicate record",
        errors: [{
          field: "title",
          message: "You already have a project with that title."
        }]
      });
    await registerProject({ title, owner: tenantId });
    logger4(`New project registered successfully. Owner:  ${tenantId}, creator: ${userId}`);
    response[201]({ message: "Project registered successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while registering the project." });
    }
  }
};

// src/routes/project.route.ts
var router5 = import_express5.default.Router();
var { register: register8, update: update8, remove: remove8, retrive: retrive8, list: list8 } = project;
router5[list8.method](list8.path, authenticate, authorize(list8.authorizationRules), list7);
router5[retrive8.method](retrive8.path, authenticate, authorize(retrive8.authorizationRules), retrive7);
router5[remove8.method](remove8.path, authenticate, authorize(remove8.authorizationRules), remove7);
router5[update8.method](update8.path, authenticate, authorize(update8.authorizationRules), validator(update8.schema), update7);
router5[register8.method](register8.path, authenticate, authorize(register8.authorizationRules), validator(register8.schema), register7);
var project_route_default = router5;

// src/routes/wallet.route.ts
var import_express6 = __toESM(require("express"));

// src/controllers/wallet.controller.ts
var import_debug9 = __toESM(require("debug"));

// src/models/wallet.model.ts
var import_client11 = require("@prisma/client");
var prisma10 = new import_client11.PrismaClient();
var getWalletById = async (id) => {
  return await prisma10.wallet.findFirst({ where: { id } });
};
var getWalletByParam = async (params) => {
  return await prisma10.wallet.findFirst({ where: params });
};
var createWallet = async (wallet2) => {
  return await prisma10.wallet.create({
    data: wallet2
  });
};
var updateWallet = async (id, wallet2) => {
  return await prisma10.wallet.update({
    where: { id },
    data: wallet2
  });
};

// src/services/wallet.service.ts
var getWalletByTenantId = async (tenantId) => {
  return await getWalletByParam({ owner: tenantId });
};
var updateWallet2 = async (id, project2) => {
  return await updateWallet(id, project2);
};
var registerWallet = async (project2) => {
  return await createWallet(project2);
};

// src/controllers/wallet.controller.ts
var retrive9 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug9.default)("coollionfi:wallet:retrive");
  try {
    const { tenantId } = req.auth;
    const wallet2 = await getWalletByTenantId(tenantId);
    if (!wallet2)
      return response[404]({ message: "Record not found!" });
    const testOwner = wallet2.owner !== tenantId;
    if (testOwner)
      return response[403]({ message: "You do not have permission to view the selected record information." });
    const filteredWallet = await abilitiesFilter({
      subject: "Wallet",
      abilities: req.abilities,
      input: [wallet2]
    });
    const finalWallet = await outItemFromList(filteredWallet);
    response[200]({ data: finalWallet });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var register9 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug9.default)("coollionfi:wallet:register");
  try {
    const { userId, tenantId } = req.auth;
    const wallet2 = await getWalletByTenantId(tenantId);
    if (wallet2)
      return response[400]({ message: "You already have a wallet!" });
    await registerWallet({ owner: tenantId });
    logger4(`New wallet registered successfully. Owner:  ${tenantId}, creator: ${userId}`);
    response[201]({ message: "Wallet registered successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while registering the wallet." });
    }
  }
};

// src/routes/wallet.route.ts
var router6 = import_express6.default.Router();
var { register: register10, retrive: retrive10 } = wallet;
router6[retrive10.method](retrive10.path, authenticate, authorize(retrive10.authorizationRules), retrive9);
router6[register10.method](register10.path, authenticate, authorize(register10.authorizationRules), register9);
var wallet_route_default = router6;

// src/routes/payment-method.route.ts
var import_express7 = __toESM(require("express"));

// src/controllers/payment-method.controller.ts
var import_debug10 = __toESM(require("debug"));

// src/models/payment-method.model.ts
var import_client12 = require("@prisma/client");
var prisma11 = new import_client12.PrismaClient();
var getAllPaymentMethods = async ({ where, page, perPage } = {}) => {
  const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : void 0;
  return await prisma11.paymentMethod.findMany({
    where,
    ...paginate
  });
};
var getPaymentMethodById = async (id) => {
  return await prisma11.paymentMethod.findFirst({ where: { id, deleted: false } });
};
var createPaymentMethod = async (paymentMethod2) => {
  return await prisma11.paymentMethod.create({
    data: paymentMethod2
  });
};
var updatePaymentMethod = async (id, paymentMethod2) => {
  return await prisma11.paymentMethod.update({
    where: { id },
    data: paymentMethod2
  });
};

// src/services/payment-method.service.ts
var pagination6 = app.pagination;
var getAllPaymentMethods2 = async ({ where, page, perPage } = {}) => {
  page = page || pagination6.page;
  perPage = perPage || pagination6.perPage;
  return await getAllPaymentMethods({ where, page, perPage });
};
var getPaymentMethodById2 = async (id) => {
  return await getPaymentMethodById(id);
};
var deletePaymentMethod = async (id) => {
  return await updatePaymentMethod(id, { deleted: true });
};
var updatePaymentMethod2 = async (id, project2) => {
  return await updatePaymentMethod(id, project2);
};
var registerPaymentMethod = async (project2) => {
  return await createPaymentMethod(project2);
};

// src/controllers/payment-method.controller.ts
var listOther = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug10.default)("coollionfi:paymentMethod:list");
  try {
    const { otherId, page, perPage } = req.params;
    if (isNaN(Number(otherId)))
      return response[400]({ message: "Invalid query parameter otherId." });
    const wallet2 = await getWalletByTenantId(Number(otherId));
    if (!wallet2)
      return response[404]({ message: "The selected tenant does not have a wallet!" });
    const paymentMethods = await getAllPaymentMethods2({
      where: { walletId: wallet2.id, deleted: false },
      page: Number(page),
      perPage: Number(perPage)
    });
    const filteredPaymentMethods = await abilitiesFilter({
      subject: "PaymentMethod",
      abilities: req.abilities,
      input: paymentMethods,
      selfInput: false
    }, ({ subject, action, abilities, input }) => {
      const filteredInput = input.map((project2) => {
        const filteredValue = {};
        Object.keys(project2).forEach((item) => {
          if (abilities.can(action, subject, `${item}Other`))
            filteredValue[item] = project2[item];
        });
        return filteredValue;
      });
      return filteredInput;
    });
    const finalPaymentMethods = await outItemFromList(filteredPaymentMethods);
    response[200]({ data: finalPaymentMethods });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var list9 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug10.default)("coollionfi:paymentMethod:list");
  try {
    const { tenantId } = req.auth;
    const { page, perPage } = req.params;
    const wallet2 = await getWalletByTenantId(tenantId);
    if (!wallet2)
      return response[404]({ message: "You don\u2019t have a wallet!" });
    const paymentMethods = await getAllPaymentMethods2({
      where: { walletId: wallet2.id, deleted: false },
      page: Number(page),
      perPage: Number(perPage)
    });
    const filteredPaymentMethods = await abilitiesFilter({
      subject: "PaymentMethod",
      abilities: req.abilities,
      input: paymentMethods
    });
    const finalPaymentMethods = await outItemFromList(filteredPaymentMethods);
    response[200]({ data: finalPaymentMethods });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var retrive11 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug10.default)("coollionfi:paymentMethod:retrive");
  try {
    const { tenantId } = req.auth;
    const { paymentMethodId } = req.params;
    if (isNaN(Number(paymentMethodId)))
      return response[400]({ message: "Invalid query parameter paymentMethodId." });
    const paymentMethod2 = await getPaymentMethodById2(Number(paymentMethodId));
    if (!paymentMethod2)
      return response[404]({ message: "Record not found!" });
    const { can } = req.abilities;
    if (!can("manage", "PaymentMethod", "disabled")) {
      const wallet2 = await getWalletByTenantId(tenantId);
      if (!wallet2)
        return response[404]({ message: "You don\u2019t have a wallet!" });
      if (paymentMethod2.id !== wallet2.id)
        return response[403]({ message: "You do not have permission to update the selected record!" });
    }
    const filteredPaymentMethod = await abilitiesFilter({
      subject: "PaymentMethod",
      abilities: req.abilities,
      input: [paymentMethod2]
    });
    const finalPaymentMethod = await outItemFromList(filteredPaymentMethod);
    response[200]({ data: finalPaymentMethod });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var remove9 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug10.default)("coollionfi:paymentMethod:delete");
  try {
    const { tenantId } = req.auth;
    const { paymentMethodId } = req.params;
    if (isNaN(Number(paymentMethodId)))
      return response[400]({ message: "Invalid query parameter paymentMethodId." });
    const paymentMethod2 = await getPaymentMethodById2(Number(paymentMethodId));
    if (!paymentMethod2)
      return response[404]({ message: "The record to delete not found!" });
    const wallet2 = await getWalletByTenantId(tenantId);
    if (!wallet2)
      return response[404]({ message: "You don\u2019t have a wallet!" });
    if (paymentMethod2.id !== wallet2.id)
      return response[403]({ message: "You do not have permission to delete the selected record!" });
    await deletePaymentMethod(Number(paymentMethodId));
    response[204]({ message: "Successfully deleted." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0 && errors[0].field === "RecordNotFound") {
      response[404]({ message: "The record to delete not found!" });
    } else {
      logger4(err);
      response[500]({ message: "An error occurred while deleting information." });
    }
  }
};
var update9 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug10.default)("coollionfi:paymentMethod:update");
  try {
    const { tenantId } = req.auth;
    const { paymentMethodId } = req.params;
    const { can } = req.abilities;
    if (isNaN(Number(paymentMethodId)))
      return response[400]({ message: "Invalid query parameter paymentMethodId." });
    const paymentMethod2 = await getPaymentMethodById2(Number(paymentMethodId));
    if (!paymentMethod2)
      return response[404]({ message: "The record to update not found!" });
    if (!can("manage", "PaymentMethod", "disabled")) {
      const wallet2 = await getWalletByTenantId(tenantId);
      if (!wallet2)
        return response[404]({ message: "You don\u2019t have a wallet!" });
      if (paymentMethod2.id !== wallet2.id)
        return response[403]({ message: "You do not have permission to update the selected record!" });
    }
    await updatePaymentMethod2(paymentMethod2.id, req.body);
    response[200]({ message: "Informations updated successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while updating information." });
    }
  }
};
var register11 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug10.default)("coollionfi:paymentMethod:register");
  try {
    const { userId, tenantId } = req.auth;
    let wallet2 = await getWalletByTenantId(tenantId);
    const { can } = req.abilities;
    if (!wallet2) {
      if (can("create", "Wallet"))
        wallet2 = await registerWallet({ owner: tenantId });
      else
        return response[403]({ message: "You have no permission to create wallet. You must have a wallet account to add a payment method." });
    }
    const paymentMethods = await getAllPaymentMethods2({ where: { walletId: wallet2.id, deleted: false } });
    if (paymentMethods.length >= app.walletMaxPaymentMethods)
      return response[409]({
        message: `The max payment methods for the wallet is ${app.walletMaxPaymentMethods}`
      });
    let duplicateField = "";
    const notDuplicate = paymentMethods.every((paymentMethod2) => {
      const keys = Object.keys(paymentMethod2);
      return keys.every((key) => {
        duplicateField = key;
        const value = paymentMethod2[key];
        return value === null ? true : value !== req.body[key];
      });
    });
    if (!notDuplicate)
      return response[400]({
        message: "Conflict in database.",
        errors: [{
          field: duplicateField,
          message: `The value of the field "${duplicateField}" already used.`
        }]
      });
    await registerPaymentMethod(req.body);
    logger4(`New paymentMethod registered successfully. Wallet:  ${wallet2.id}, Owner:  ${tenantId}, creator: ${userId}`);
    response[201]({ message: "PaymentMethod registered successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while registering the paymentMethod." });
    }
  }
};

// src/routes/payment-method.route.ts
var router7 = import_express7.default.Router();
var { register: register12, update: update10, remove: remove10, retrive: retrive12, list: list10, listOther: listOther2 } = paymentMethod;
router7[listOther2.method](listOther2.path, authenticate, authorize(listOther2.authorizationRules), listOther);
router7[list10.method](list10.path, authenticate, authorize(list10.authorizationRules), list9);
router7[retrive12.method](retrive12.path, authenticate, authorize(retrive12.authorizationRules), retrive11);
router7[remove10.method](remove10.path, authenticate, authorize(remove10.authorizationRules), remove9);
router7[update10.method](update10.path, authenticate, authorize(update10.authorizationRules), validator(update10.schema), update9);
router7[register12.method](register12.path, authenticate, authorize(register12.authorizationRules), validator(register12.schema), register11);
var payment_method_route_default = router7;

// src/routes/investment.route.ts
var import_express8 = __toESM(require("express"));

// src/controllers/investment.controller.ts
var import_debug11 = __toESM(require("debug"));

// src/models/investment.model.ts
var import_client13 = require("@prisma/client");
var prisma12 = new import_client13.PrismaClient();
var getAllInvestments = async ({ where, page, perPage } = {}) => {
  const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : void 0;
  return await prisma12.investment.findMany({
    where,
    ...paginate
  });
};
var getInvestmentById = async (id) => {
  return await prisma12.investment.findFirst({ where: { id } });
};
var createInvestment = async (investment2) => {
  return await prisma12.investment.create({
    data: investment2
  });
};

// src/models/investment-term.model.ts
var import_client14 = require("@prisma/client");
var prisma13 = new import_client14.PrismaClient();
var getInvestmentTermById = async (id) => {
  return await prisma13.investmentTerm.findFirst({ where: { id } });
};

// src/services/investment-term.service.ts
var pagination7 = app.pagination;
var getInvestmentTermById2 = async (id) => {
  return await getInvestmentTermById(id);
};

// src/services/investment.service.ts
var pagination8 = app.pagination;
var getAllInvestments2 = async ({ where, page, perPage } = {}) => {
  page = page || pagination8.page;
  perPage = perPage || pagination8.perPage;
  return await getAllInvestments({ where, page, perPage });
};
var registerInvestment = async (project2) => {
  return await createInvestment(project2);
};

// src/models/transaction.model.ts
var import_client15 = require("@prisma/client");
var prisma14 = new import_client15.PrismaClient();
var getAllTransactions = async ({ where, page, perPage } = {}) => {
  const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : void 0;
  return await prisma14.transaction.findMany({
    where,
    ...paginate
  });
};
var getTransactionById = async (id) => {
  return await prisma14.transaction.findFirst({ where: { id } });
};
var getTransactionByParam = async (params) => {
  return await prisma14.transaction.findFirst({ where: params });
};
var createTransaction = async (transaction2) => {
  return await prisma14.transaction.create({
    data: transaction2
  });
};
var updateTransaction = async (id, transaction2) => {
  return await prisma14.transaction.update({
    where: { id },
    data: transaction2
  });
};

// src/services/transaction.service.ts
var pagination9 = app.pagination;
var getAllTransactions2 = async ({ where, page, perPage } = {}) => {
  page = page || pagination9.page;
  perPage = perPage || pagination9.perPage;
  return await getAllTransactions({ where, page, perPage });
};
var getTransactionById2 = async (id) => {
  return await getTransactionById(id);
};
var getTransactionByTransId = async (transactionId) => {
  return await getTransactionByParam({ transactionId });
};
var registerTransaction = async (transaction2) => {
  return await createTransaction(transaction2);
};
var updateTransaction2 = async (id, transaction2) => {
  return await updateTransaction(id, transaction2);
};

// src/utils/add-month-to-date.helper.ts
var addMonthsToDate = (date, months) => {
  const newDate = new Date(date.getTime());
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

// src/controllers/investment.controller.ts
var list11 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug11.default)("coollionfi:investment:retrive");
  try {
    const { tenantId } = req.auth;
    const { projectId, selfOrOther, page, perPage } = req.params;
    if (projectId && (isNaN(Number(selfOrOther)) || ![0, 1].includes(Number(selfOrOther))))
      return response[400]({
        message: "Invalid query parameter selfOrOther.",
        errors: [{
          field: "query parameter: selfOrOther",
          message: "It must be a Bit, 0 for the list of investments of the connected tenant and 1 for the others."
        }]
      });
    const otherOrSelf = projectId ? Boolean(Number(selfOrOther)) : false;
    if (otherOrSelf) {
      if (isNaN(Number(projectId)))
        return response[400]({ message: "Invalid query parameter projectId." });
    }
    const project2 = isNaN(Number(projectId)) ? void 0 : { projectId: Number(projectId) };
    const funder = otherOrSelf ? void 0 : { funder: tenantId };
    const investments = await getAllInvestments2({
      where: {
        ...project2,
        ...funder
      },
      page: Number(page),
      perPage: Number(perPage)
    });
    const filteredInvestments = await abilitiesFilter({
      subject: "Investment",
      abilities: req.abilities,
      input: investments,
      selfInput: !otherOrSelf
    });
    const finalInvestments = await outItemFromList(filteredInvestments);
    response[200]({ data: finalInvestments });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var retrive13 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug11.default)("coollionfi:investment:retrive");
  try {
    const { tenantId } = req.auth;
    const { investmentId } = req.params;
    if (isNaN(Number(investmentId)))
      return response[400]({ message: "Invalid query parameter investmentId." });
    const investment2 = await getInvestmentById(Number(investmentId));
    if (!investment2)
      return response[404]({ message: "Record not found!" });
    const filteredInvestment = await abilitiesFilter({
      subject: "Investment",
      abilities: req.abilities,
      input: [investment2],
      selfInput: investment2.funder === tenantId
    });
    const finalInvestment = await outItemFromList(filteredInvestment);
    response[200]({ data: finalInvestment });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var invest = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug11.default)("coollionfi:investment:invest");
  try {
    const masterWalletId = app.masterWalletId;
    if (isNaN(masterWalletId)) {
      logger4("Master wallet ID is not specified!");
      return response[500]();
    }
    const masterWallet = await getWalletById(masterWalletId);
    if (!masterWallet) {
      logger4("Master wallet is not registered!");
      return response[500]();
    }
    const { amount, projectId, term } = req.body;
    const { userId, tenantId } = req.auth;
    const project2 = await getProjectById(projectId);
    const respectMinimumToInvest = app.minimumToInvest ? app.minimumToInvest <= amount : true;
    if (!respectMinimumToInvest)
      return response[400]({ message: `You have not reached the minimum amount you can invest, $${app.minimumToInvest}` });
    const respectMaximumToInvest = app.maximumToInvest ? app.maximumToInvest >= amount : true;
    if (!respectMaximumToInvest)
      return response[400]({ message: `You exceed the maximum amount you can invest, $${app.maximumToInvest}` });
    if (!project2)
      return response[404]({ message: "The selected project is unavailable." });
    if (project2.disabled)
      return response.sendResponse({
        success: false,
        message: "The project is temporarily unavailable!"
      }, 200);
    const investmentTerm = await getInvestmentTermById2(term);
    if (!investmentTerm)
      return response[404]({ message: "The selected investment term is unavailable!" });
    if (investmentTerm.disabled)
      return response[404]({ message: "The selected investment term is temporarily unavailable!" });
    const wallet2 = await getWalletByTenantId(tenantId);
    if (!wallet2)
      return response[404]({ message: "You do not have a wallet!" });
    if (wallet2.balance < amount)
      return response.sendResponse({
        success: false,
        message: "Insufficient balance!"
      }, 200);
    const dueGain = amount * investmentTerm.benefit / 100;
    const collectionDate = addMonthsToDate(/* @__PURE__ */ new Date(), investmentTerm.term);
    await registerInvestment({
      amount,
      projectId,
      term,
      funder: tenantId,
      dueAmount: dueGain + amount,
      dueGain,
      collectionDate
    });
    logger4(`New investment registered successfully. Owner:  ${tenantId}, creator: ${userId}`);
    await registerTransaction({
      amount,
      recipient: masterWalletId,
      sender: tenantId,
      reason: "Investment",
      paymentMethodTypeCodename: "CLFW"
    });
    logger4(`New transaction registered successfully. Recipient wallet: ${masterWalletId}, sender: ${tenantId}`);
    const senderBalance = wallet2.balance - amount;
    const recipientBalance = Number(masterWallet.balance) + amount;
    await updateWallet2(wallet2.id, { balance: senderBalance });
    await updateWallet2(masterWallet.id, { balance: recipientBalance });
    response[201]({ message: "Investment registered successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while registering the investment." });
    }
  }
};

// src/routes/investment.route.ts
var router8 = import_express8.default.Router();
var { invest: invest2, retrive: retrive14, list: list12, listByProject } = investment;
router8[listByProject.method](listByProject.path, authenticate, authorize(listByProject.authorizationRules), list11);
router8[list12.method](list12.path, authenticate, authorize(list12.authorizationRules), list11);
router8[retrive14.method](retrive14.path, authenticate, authorize(retrive14.authorizationRules), retrive13);
router8[invest2.method](invest2.path, authenticate, authorize(invest2.authorizationRules), invest);
var investment_route_default = router8;

// src/routes/transaction.route.ts
var import_express9 = __toESM(require("express"));

// src/controllers/transaction.controller.ts
var import_debug12 = __toESM(require("debug"));
var import_got = __toESM(require("got"));
require = require_esm()(module);
var list13 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug12.default)("coollionfi:transaction:list");
  try {
    const { tenantId } = req.auth;
    const { otherId, page, perPage } = req.params;
    if (otherId && isNaN(Number(otherId)))
      return response[400]({ message: "Invalid query parameter otherId." });
    const transactions = await getAllTransactions2({
      where: {
        OR: [
          { sender: Number(otherId) || tenantId },
          { recipient: Number(otherId) || tenantId }
        ]
      },
      page: Number(page),
      perPage: Number(perPage)
    });
    const filteredTransactions = await abilitiesFilter({
      subject: "Transaction",
      abilities: req.abilities,
      input: transactions,
      selfInput: false
    }, ({ subject, action, abilities, input }) => {
      const filteredInput = input.map((transaction2) => {
        const filteredValue = {};
        Object.keys(transaction2).forEach((item) => {
          const testOwner = transaction2.sender === tenantId || transaction2.recipient === tenantId;
          item = testOwner ? item : `${item}Other`;
          if (abilities.can(action, subject, item))
            filteredValue[item] = transaction2[item];
        });
        return filteredValue;
      });
      return filteredInput;
    });
    const finalTransactions = await outItemFromList(filteredTransactions);
    response[200]({ data: finalTransactions });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var retrive15 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug12.default)("coollionfi:transaction:retrive");
  try {
    const { tenantId } = req.auth;
    const { transactionId } = req.params;
    const { can } = req.abilities;
    if (isNaN(Number(transactionId)))
      return response[400]({ message: "Invalid query parameter transactionId." });
    const transaction2 = await getTransactionById2(Number(transactionId));
    if (!transaction2)
      return response[404]({ message: "Record not found!" });
    const testOwner = transaction2.sender === tenantId || transaction2.recipient === tenantId;
    const filteredTransaction = await abilitiesFilter({
      subject: "Transaction",
      abilities: req.abilities,
      input: [transaction2],
      selfInput: testOwner || can("manage", "Transaction")
    });
    const finalTransaction = await outItemFromList(filteredTransaction);
    response[200]({ data: finalTransaction });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var makeDeposit = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug12.default)("coollionfi:transaction:makeDeposit");
  try {
    const { userId, tenantId } = req.auth;
    const wallet2 = await getWalletByTenantId(tenantId);
    if (!wallet2)
      return response[400]({ message: "You do not have a wallet!" });
    await registerTransaction({
      status: app.transaction.status.PENDING,
      sender: tenantId,
      recipient: tenantId,
      reason: "Deposit on my wallet account",
      ...req.body
    });
    logger4(`New transaction registered successfully. Owner:  ${tenantId}, creator: ${userId}`);
    response[201]({ message: "Transaction in treatement." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while making deposite." });
    }
  }
};
var syncCinetpayPayment = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug12.default)("coollionfi:transaction:syncCinetpayPayment");
  const body = req.body;
  try {
    if (req.method === "POST") {
      const hasher2 = new hasher_helper_default(hasher.hashSecretKey);
      const cmp = body.cpm_site_id + body.cpm_trans_id + body.cpm_trans_date + body.cpm_amount + body.cpm_currency + body.signature + body.payment_method + body.cel_phone_num + body.cpm_phone_prefixe + body.cpm_language + body.cpm_version + body.cpm_payment_config + body.cpm_page_action + body.cpm_custom + body.cpm_designation + body.cpm_error_message;
      const token = hasher2.hashToken(cmp);
      const verifiedToken = req.headers["x-token"];
      if (verifiedToken === token) {
        const transaction2 = await getTransactionByTransId(body.cpm_trans_id);
        if (transaction2 || !transaction2) {
          const payload = {
            apikey: app.transaction.services.cinetpay.apiKey,
            site_id: app.transaction.services.cinetpay.siteId,
            transaction_id: transaction2?.transactionId
          };
          const responseData = await import_got.default.post("https://api-checkout.cinetpay.com/v2/payment/check", {
            json: {
              apikey: "your-api-key",
              site_id: "your-site-id",
              transaction_id: "your-transaction-id"
            },
            responseType: "json",
            headers: {
              "Content-Type": "application/json"
            }
          });
          const { code, data } = responseData.body;
          if (code === "00") {
            const transactionStatusCode = app.transaction.status;
            const transactionStatus = data.status;
            updateTransaction2(transaction2?.id, {
              status: transactionStatusCode[transactionStatus],
              operator: body.payment_method,
              phone: `+${body.cpm_phone_prefixe}${body.cel_phone_num}`
            });
          }
        }
      }
    }
    response[200]();
  } catch (err) {
    logger4(err);
    response[500]();
  }
};

// src/routes/transaction.route.ts
var router9 = import_express9.default.Router();
var { makeDeposit: makeDeposit2, retrive: retrive16, list: list14, listOther: listOther3, syncCinetpayPayment: syncCinetpayPayment2 } = transaction;
router9[listOther3.method](listOther3.path, authenticate, authorize(listOther3.authorizationRules), list13);
router9[list14.method](list14.path, authenticate, authorize(list14.authorizationRules), list13);
router9[retrive16.method](retrive16.path, authenticate, authorize(retrive16.authorizationRules), retrive15);
router9[makeDeposit2.method](makeDeposit2.path, authenticate, authorize(makeDeposit2.authorizationRules), validator(makeDeposit2.schema), makeDeposit);
router9[syncCinetpayPayment2.method](syncCinetpayPayment2.path, syncCinetpayPayment);
router9.get(syncCinetpayPayment2.path, syncCinetpayPayment);
var transaction_route_default = router9;

// src/routes/invitation.route.ts
var import_express10 = __toESM(require("express"));

// src/controllers/invitation.controller.ts
var import_debug13 = __toESM(require("debug"));

// src/models/invitation.model.ts
var import_client16 = require("@prisma/client");
var prisma15 = new import_client16.PrismaClient();
var getAllInvitations = async ({ where, page, perPage } = {}) => {
  const paginate = page && perPage ? { skip: (page - 1) * perPage, take: perPage } : void 0;
  return await prisma15.invitation.findMany({
    where,
    ...paginate
  });
};
var getInvitationById = async (id) => {
  return await prisma15.invitation.findFirst({ where: { id, deleted: false } });
};
var getInvitationByParam = async (params) => {
  return await prisma15.invitation.findFirst({ where: params });
};
var createInvitation = async (invitation2) => {
  return await prisma15.invitation.create({
    data: invitation2
  });
};
var updateInvitation = async (id, invitation2) => {
  return await prisma15.invitation.update({
    where: { id },
    data: invitation2
  });
};

// src/services/invitation.service.ts
var pagination10 = app.pagination;
var getAllInvitations2 = async ({ where, page, perPage } = {}) => {
  page = page || pagination10.page;
  perPage = perPage || pagination10.perPage;
  return await getAllInvitations({ where, page, perPage });
};
var getInvitationById2 = async (id) => {
  return await getInvitationById(id);
};
var getInvitationByParam2 = async (where) => {
  return await getInvitationByParam(where);
};
var deleteInvitation = async (id) => {
  return await updateInvitation(id, { deleted: true });
};
var confirmInvitation = async (id, confirmation) => {
  return await updateInvitation(id, { confirm: confirmation, deleted: true });
};
var registerInvitation = async (invitation2) => {
  return await createInvitation(invitation2);
};

// src/controllers/invitation.controller.ts
var list15 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug13.default)("coollionfi:invitation:list");
  try {
    const { tenantId, userId } = req.auth;
    const { page, perPage } = req.params;
    const user2 = await getUserById2(userId);
    if (!user2)
      return response[404]({ message: "Logged in user not found." });
    const invitationsSent = await getAllInvitations2({
      where: { sender: tenantId, deleted: false },
      page: Number(page),
      perPage: Number(perPage)
    });
    const filteredInvitationsSent = await abilitiesFilter({
      subject: "Invitation",
      abilities: req.abilities,
      input: invitationsSent,
      selfInput: false
    });
    const filteredReceivedInvitations = await abilitiesFilter({
      subject: "Invitation",
      abilities: req.abilities,
      input: invitationsSent,
      selfInput: false
    });
    const finalInvitationsSent = await outItemFromList(filteredInvitationsSent);
    const finalReceivedInvitations = await outItemFromList(filteredReceivedInvitations);
    response[200]({
      data: [{
        sent: finalInvitationsSent,
        received: finalReceivedInvitations
      }]
    });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var remove11 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug13.default)("coollionfi:invitation:delete");
  try {
    const { tenantId } = req.auth;
    const { invitationId } = req.params;
    if (isNaN(Number(invitationId)))
      return response[400]({ message: "Invalid query parameter invitationId." });
    const invitation2 = await getInvitationById2(Number(invitationId));
    if (!invitation2)
      return response[404]({ message: "The record to delete not found!" });
    if (invitation2.sender !== tenantId)
      return response[403]({ message: "You do not have permission to delete the selected record!" });
    await deleteInvitation(Number(invitationId));
    response[204]({ message: "Successfully deleted." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0 && errors[0].field === "RecordNotFound") {
      response[404]({ message: "The record to delete not found!" });
    } else {
      logger4(err);
      response[500]({ message: "An error occurred while deleting information." });
    }
  }
};
var confirm = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug13.default)("coollionfi:invitation:confirm");
  try {
    const { userId, tenantId } = req.auth;
    const { confirmation, invitationId } = req.body;
    const user2 = await getUserById2(userId);
    if (!user2)
      return response[404]({ message: "No user!" });
    const invitation2 = await getInvitationByParam2({ id: invitationId, receiverEmail: user2.email });
    if (!invitation2)
      return response[404]({ message: "Invitation not found!" });
    const hostTenant = await getTenantById2(invitation2.sender);
    if (!hostTenant)
      return response[404]({ message: "Invitation sender not found!" });
    const hostTenantAccountType = await getAccountTypeById(hostTenant.accountTypeId);
    if (!hostTenantAccountType)
      return response[404]({ message: "Can't determine invitation sender account type!" });
    if (!req.abilities?.can("create", "Tenant", `withAccountType${hostTenantAccountType.codename}`, { ignore: true }))
      return response[403]({ message: `You must have an ${hostTenantAccountType.name} account to respond to the invitation.` });
    await attributeUserToTenant({
      userId,
      tenantId: invitation2.sender,
      userTenantId: tenantId,
      roleId: invitation2.roleId,
      manager: false
    });
    await confirmInvitation(invitationId, confirmation);
    logger4(`Invitation confirmed. creator: ${userId}`);
    response[201]({ message: "Invitation(s) sent successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while sending invitation(s)." });
    }
  }
};
var invite = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug13.default)("coollionfi:invitation:invite");
  try {
    const { userId, tenantId } = req.auth;
    const { emails } = req.body;
    const nonRegisteredEmails = /* @__PURE__ */ new Set();
    const tenant2 = await getTenantById2(tenantId);
    if (!tenant2)
      return response[404]({ message: "No tenant!" });
    for (const { email, roleId } of emails) {
      const user2 = await getUserByEmailOrPhone(email);
      if (!user2)
        nonRegisteredEmails.add({
          to: email,
          templateId: twilio.templateIDs.invitation,
          dynamicTemplateData: { sender: tenant2.name }
        });
      await registerInvitation({
        sender: tenantId,
        receiverEmail: email,
        roleId
      });
    }
    await send_email_helper_default(...[...nonRegisteredEmails]);
    logger4(`New invitation(s) sent successfully. Sender:  ${tenantId}, creator: ${userId}`);
    response[201]({ message: "Invitation(s) sent successfully." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred while sending invitation(s)." });
    }
  }
};

// src/routes/invitation.route.ts
var router10 = import_express10.default.Router();
var { invite: invite2, confirm: confirm2, remove: remove12, list: list16 } = invitation;
router10[list16.method](list16.path, authenticate, authorize(list16.authorizationRules), list15);
router10[remove12.method](remove12.path, authenticate, authorize(remove12.authorizationRules), remove11);
router10[confirm2.method](confirm2.path, authenticate, authorize(confirm2.authorizationRules), validator(confirm2.schema), confirm);
router10[invite2.method](invite2.path, authenticate, authorize(invite2.authorizationRules), validator(invite2.schema), invite);
var invitation_route_default = router10;

// src/routes/user-tenant.route.ts
var import_express11 = __toESM(require("express"));

// src/controllers/user-tenant.controller.ts
var import_debug14 = __toESM(require("debug"));

// src/utils/group-by.helper.ts
var groupBy = (array, grouper) => {
  return new Promise((resolve, reject) => {
    try {
      const group = array.reduce((store, item) => {
        const key = grouper(item);
        if (!store.has(key)) {
          store.set(key, [item]);
        } else {
          store.get(key)?.push(item);
        }
        return store;
      }, /* @__PURE__ */ new Map());
      resolve(group);
    } catch (err) {
      reject(err);
    }
  });
};

// src/controllers/user-tenant.controller.ts
var list17 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug14.default)("coollionfi:userTenant:retriveUser");
  try {
    const { tenantId, userId } = req.auth;
    const { page, perPage } = req.params;
    const userTenants = await getAllUserTenants2({ where: { tenantId }, page: Number(page), perPage: Number(perPage) });
    const groupByUserId = await groupBy(userTenants, (item) => item.userId);
    const finalUserTenants = [...groupByUserId].map(([, userTenants2]) => {
      const userRoles = userTenants2.map(({ role: role2 }) => {
        return {
          id: role2.id,
          name: role2.name,
          description: role2.description,
          owner: role2.owner,
          published: role2.published,
          createdAt: role2.createdAt
        };
      });
      return {
        userId,
        tenantId,
        roles: userRoles
      };
    });
    response[200]({ data: finalUserTenants });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var retrive17 = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug14.default)("coollionfi:userTenant:retriveUser");
  try {
    const { tenantId, userId } = req.auth;
    const { memberId } = req.params;
    if (isNaN(Number(memberId)))
      return response[400]({ message: "Invalid query parameter memberId." });
    const userTenants = await getAllUserTenants2({ where: { userId: Number(memberId), tenantId } });
    if (userTenants.length === 0)
      return response[404]({ message: "Record not found!" });
    const userRoles = userTenants.map(({ role: role2 }) => {
      return {
        id: role2.id,
        name: role2.name,
        description: role2.description,
        owner: role2.owner,
        published: role2.published,
        createdAt: role2.createdAt
      };
    });
    response[200]({
      data: [{
        userId,
        tenantId,
        roles: userRoles
      }]
    });
  } catch (err) {
    logger4(err);
    response[500]({ message: "An error occurred while reading information." });
  }
};
var removeMemberRole = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug14.default)("coollionfi:userTenant:deleteMember");
  try {
    const { tenantId } = req.auth;
    const { memberId, roleId } = req.params;
    if (isNaN(Number(memberId)))
      return response[400]({ message: "Invalid query parameter memberId." });
    if (isNaN(Number(roleId)))
      return response[400]({ message: "Invalid query parameter roleId." });
    const userTenant2 = await getUserTenantByParam2({ userId: Number(memberId), tenantId, roleId: Number(roleId) });
    if (!userTenant2)
      return response[404]({ message: "The record to delete not found!" });
    await deleteUserTenant2(userTenant2.id);
    response[204]({ message: "Successfully deleted." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0 && errors[0].field === "RecordNotFound") {
      response[404]({ message: "The record to delete not found!" });
    } else {
      logger4(err);
      response[500]({ message: "An error occurred while deleting information." });
    }
  }
};
var removeMember = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug14.default)("coollionfi:userTenant:deleteUser");
  try {
    const { tenantId } = req.auth;
    const { memberId } = req.params;
    if (isNaN(Number(memberId)))
      return response[400]({ message: "Invalid query parameter memberId." });
    const userTenants = await getAllUserTenants2({ where: { userId: Number(memberId), tenantId } });
    if (userTenants.length === 0)
      return response[404]({ message: "The record to delete not found!" });
    for (const { id } of userTenants)
      await deleteUserTenant2(id);
    response[204]({ message: "Successfully deleted." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0 && errors[0].field === "RecordNotFound") {
      response[404]({ message: "The record to delete not found!" });
    } else {
      logger4(err);
      response[500]({ message: "An error occurred while deleting information." });
    }
  }
};
var grantRole = async (req, res) => {
  const response = new response_helper_default(res);
  const logger4 = (0, import_debug14.default)("coollionfi:userTenant:grantRole");
  try {
    const { tenantId, userId } = req.auth;
    const { memberId, roles } = req.body;
    if (Number(memberId) === userId)
      return response[403]({ message: "You can\u2019t give yourself a role." });
    const member = await getAllUserTenants2({ where: { userId: Number(memberId), tenantId } });
    if (member.length === 0)
      return response[404]({ message: "Member not found! Please invite member to join your organisation." });
    const finalRoles = [];
    for (const { role: role2 } of member)
      if (!roles.includes(role2.id))
        finalRoles.push(role2.id);
    for (const roleId of finalRoles)
      await attributeUserToTenant({ userId: memberId, tenantId, userTenantId: member[0].userTenantId, roleId });
    response[201]({ message: "Roles successfully granted." });
  } catch (err) {
    const errors = handlePrismaError(err, logger4);
    if (errors.length > 0)
      response[409]({
        message: "Conflict in database.",
        errors
      });
    else {
      logger4(err);
      response[500]({ message: "An error occurred when assigning roles to members." });
    }
  }
};

// src/routes/user-tenant.route.ts
var router11 = import_express11.default.Router();
var { grantRole: grantRole2, removeMember: removeMember2, removeMemberRole: removeMemberRole2, retrive: retrive18, list: list18 } = userTenant;
router11[list18.method](list18.path, authenticate, authorize(list18.authorizationRules), list17);
router11[retrive18.method](retrive18.path, authenticate, authorize(retrive18.authorizationRules), retrive17);
router11[removeMemberRole2.method](removeMemberRole2.path, authenticate, authorize(removeMemberRole2.authorizationRules), removeMemberRole);
router11[removeMember2.method](removeMember2.path, authenticate, authorize(removeMember2.authorizationRules), removeMember);
router11[grantRole2.method](grantRole2.path, authenticate, authorize(grantRole2.authorizationRules), validator(grantRole2.schema), grantRole);
var user_tenant_route_default = router11;

// src/utils/get-client-info.middleware.ts
var import_ua_parser_js = require("ua-parser-js");
var getClientInfo = (req, res, next) => {
  const userAgent = req.headers["user-agent"];
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const parser = new import_ua_parser_js.UAParser();
  parser.setUA(String(userAgent));
  const clientInfo = {
    ip,
    device: parser.getDevice(),
    browser: parser.getBrowser(),
    os: parser.getOS(),
    engine: parser.getEngine(),
    cpu: parser.getCPU()
  };
  req.clientInfo = clientInfo;
  next();
};

// src/app.ts
var app2 = (0, import_express12.default)();
app2.use((0, import_cors.default)());
app2.use((0, import_helmet.default)());
app2.use((0, import_morgan.default)("dev"));
app2.use(import_express12.default.json());
app2.use(import_express12.default.urlencoded({ extended: true }));
app2.use(getClientInfo);
var baseRoute = `/${app.version}`;
app2.use(baseRoute, auth_route_default);
app2.use(baseRoute, user_route_default);
app2.use(baseRoute, tenant_route_default);
app2.use(baseRoute, role_route_default);
app2.use(baseRoute, project_route_default);
app2.use(baseRoute, wallet_route_default);
app2.use(baseRoute, payment_method_route_default);
app2.use(baseRoute, investment_route_default);
app2.use(baseRoute, transaction_route_default);
app2.use(baseRoute, invitation_route_default);
app2.use(baseRoute, user_tenant_route_default);
app2.use(errorHandler);
app2.use(notFoundHandler);
var app_default = app2;

// src/server.ts
var logger3 = (0, import_debug15.default)("coollion:server");
var PORT = process.env.PORT || 3e3;
app_default.listen(PORT, () => {
  logger3(`Server running on port ${PORT}`);
});
