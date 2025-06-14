import rateLimit from "express-rate-limit";

export const ddosProtection = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
        errorMessage: [{
            path: "rate-limit",
            message: "Rate limit exceeded"
        }]
    },
    standardHeaders: true,
    legacyHeaders: false
})