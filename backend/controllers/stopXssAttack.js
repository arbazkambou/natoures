import xss from "xss";

// Middleware to sanitize request body
const sanitizeRequestBody = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
};

// Middleware to sanitize request query parameters
const sanitizeQuery = (req, res, next) => {
  if (req.query) {
    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        req.query[key] = xss(req.query[key]);
      }
    }
  }
  next();
};

// Middleware to sanitize request params
const sanitizeParams = (req, res, next) => {
  if (req.params) {
    for (const key in req.params) {
      if (req.params.hasOwnProperty(key)) {
        req.params[key] = xss(req.params[key]);
      }
    }
  }
  next();
};

export { sanitizeParams, sanitizeRequestBody, sanitizeQuery };
