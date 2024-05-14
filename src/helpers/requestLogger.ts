import expressPino from "express-pino-logger";

export default expressPino({
  level: "info",
  enabled: true,
});
