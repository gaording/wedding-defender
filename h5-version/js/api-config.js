/**
 * API 配置
 * 根据环境自动选择 API 端点
 */

const API_CONFIG = {
  // 本地开发环境
  development: {
    baseUrl: 'http://localhost:3000',
    chatEndpoint: '/api/chat'
  },
  // 生产环境 - 替换为你的服务器地址
  production: {
    baseUrl: '',  // 同域名，留空
    chatEndpoint: '/api/chat'
  }
};

// 检测环境
const isLocalhost = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.protocol === 'file:';

const currentEnv = isLocalhost ? 'development' : 'production';
const config = API_CONFIG[currentEnv];

// 导出配置
window.API_CONFIG = {
  ...config,
  getChatUrl: () => `${config.baseUrl}${config.chatEndpoint}`
};

console.log('API Config:', window.API_CONFIG);
