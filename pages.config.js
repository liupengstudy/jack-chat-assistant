module.exports = {
  // 构建命令
  build: {
    command: "npm install --legacy-peer-deps && npm run build",
    directory: ".next",
    environment: {
      NODE_VERSION: "18.17.1"
    }
  },
  // 环境变量
  env: {
    NODE_VERSION: "18",
  },
} 