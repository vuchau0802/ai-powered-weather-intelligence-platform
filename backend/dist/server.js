"use strict";
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const weather_routes_1 = __importDefault(require("./routes/weather.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();

app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
}));
app.use(express_1.default.json());

app.use("/api/weather", weather_routes_1.default);

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});