/**
 * 統一的日誌管理系統
 * 提供開發環境除錯和生產環境控制功能
 */

/**
 * 日誌等級類型
 * @typedef {'debug' | 'info' | 'warn' | 'error'} LogLevel
 */

/**
 * Logger 配置介面
 * @typedef {Object} LoggerConfig
 * @property {string} prefix - 日誌前綴，用於識別不同模組
 * @property {boolean} enabled - 是否啟用日誌輸出
 * @property {LogLevel} [minLevel] - 最小日誌等級，低於此等級的日誌不會輸出
 * @property {boolean} [showTimestamp] - 是否顯示時間戳
 * @property {boolean} [showStack] - 是否顯示堆疊追蹤（僅錯誤等級）
 */

/**
 * 日誌等級權重，用於比較等級
 * @type {Object.<LogLevel, number>}
 */
const LOG_LEVEL_WEIGHTS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

/**
 * 日誌等級對應的 emoji
 * @type {Object.<LogLevel, string>}
 */
const LOG_LEVEL_EMOJIS = {
  debug: '🔍',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
}

/**
 * 日誌等級對應的樣式
 * @type {Object.<LogLevel, string>}
 */
const LOG_LEVEL_STYLES = {
  debug: 'color: #6B7280; background: #F3F4F6; padding: 2px 6px; border-radius: 4px;',
  info: 'color: #059669; background: #D1FAE5; padding: 2px 6px; border-radius: 4px;',
  warn: 'color: #D97706; background: #FEF3C7; padding: 2px 6px; border-radius: 4px;',
  error: 'color: #DC2626; background: #FEE2E2; padding: 2px 6px; border-radius: 4px;',
}

/**
 * 創建 Logger 實例
 * @param {Partial<LoggerConfig>} [config={}] - Logger 配置
 * @returns {Object} Logger 實例
 *
 * @example
 * // 基本使用
 * const logger = useLogger({ prefix: 'UserService', enabled: true })
 * logger.info('用戶登入成功', { userId: 123 })
 *
 * @example
 * // 進階配置
 * const logger = useLogger({
 *   prefix: 'API',
 *   enabled: import.meta.env.DEV,
 *   minLevel: 'info',
 *   showTimestamp: true,
 *   showStack: true
 * })
 * logger.debug('這不會顯示，因為 minLevel 是 info')
 * logger.error('API 錯誤', error)
 */
export function useLogger(config = {}) {
  // 預設配置
  /** @type {LoggerConfig} */
  const defaultConfig = {
    prefix: '',
    enabled: import.meta.env.DEV,
    minLevel: 'debug',
    showTimestamp: false,
    showStack: false,
  }

  const finalConfig = { ...defaultConfig, ...config }

  /**
   * 檢查是否應該輸出日誌
   * @param {LogLevel} level
   * @returns {boolean}
   */
  function shouldLog(level) {
    if (!finalConfig.enabled) return false

    const currentWeight = LOG_LEVEL_WEIGHTS[level]
    const minWeight = LOG_LEVEL_WEIGHTS[finalConfig.minLevel]

    return currentWeight >= minWeight
  }

  /**
   * 格式化日誌前綴
   * @param {LogLevel} level
   * @returns {string}
   */
  function formatPrefix(level) {
    /** @type {string[]} */
    const parts = []

    // 時間戳
    if (finalConfig.showTimestamp) {
      const now = new Date()
      const timestamp = now.toLocaleTimeString('zh-TW', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      const milliseconds = now.getMilliseconds().toString().padStart(3, '0')
      parts.push(`[${timestamp}.${milliseconds}]`)
    }

    // 等級 emoji
    parts.push(LOG_LEVEL_EMOJIS[level])

    // 模組前綴
    if (finalConfig.prefix) {
      parts.push(`[${finalConfig.prefix}]`)
    }

    return parts.join(' ')
  }

  /**
   * 輸出日誌
   * @param {LogLevel} level
   * @param {...any} args
   */
  function log(level, ...args) {
    if (!shouldLog(level)) return

    const prefix = formatPrefix(level)
    const style = LOG_LEVEL_STYLES[level]

    // 使用對應的 console 方法
    const consoleMethod = console[level] || console.log

    if (level === 'error' && finalConfig.showStack && args[0] instanceof Error) {
      // 錯誤等級且啟用堆疊追蹤
      consoleMethod(`%c${prefix}`, style, args[0].message)
      console.error('Stack trace:', args[0].stack)
      if (args.length > 1) {
        consoleMethod('Additional data:', ...args.slice(1))
      }
    } else {
      // 一般日誌輸出
      consoleMethod(`%c${prefix}`, style, ...args)
    }
  }

  return {
    /**
     * 除錯等級日誌 - 詳細的除錯資訊
     * @param {...any} args - 要輸出的內容
     */
    debug: (...args) => log('debug', ...args),

    /**
     * 資訊等級日誌 - 一般資訊
     * @param {...any} args - 要輸出的內容
     */
    info: (...args) => log('info', ...args),

    /**
     * 警告等級日誌 - 警告訊息
     * @param {...any} args - 要輸出的內容
     */
    warn: (...args) => log('warn', ...args),

    /**
     * 錯誤等級日誌 - 錯誤訊息
     * @param {...any} args - 要輸出的內容
     */
    error: (...args) => log('error', ...args),

    /**
     * 取得當前配置
     * @returns {LoggerConfig}
     */
    getConfig: () => ({ ...finalConfig }),

    /**
     * 動態更新配置
     * @param {Partial<LoggerConfig>} newConfig - 新的配置
     */
    updateConfig: (newConfig) => {
      Object.assign(finalConfig, newConfig)
    },

    /**
     * 建立子 Logger（繼承當前配置）
     * @param {string} childPrefix - 子模組前綴
     * @param {Partial<LoggerConfig>} [childConfig] - 子配置（可選）
     * @returns {ReturnType<typeof useLogger>}
     */
    createChild: (childPrefix, childConfig) => {
      const childFullPrefix = finalConfig.prefix ? `${finalConfig.prefix}:${childPrefix}` : childPrefix

      return useLogger({
        ...finalConfig,
        ...childConfig,
        prefix: childFullPrefix,
      })
    },
  }
}

/**
 * 全域 Logger 實例，供快速使用
 * 建議在大型專案中為每個模組建立專屬的 Logger
 */
export const globalLogger = useLogger({
  prefix: 'App',
  enabled: import.meta.env.DEV,
  showTimestamp: true,
})

/**
 * 快速除錯函式，等同於 globalLogger.debug
 * @deprecated 建議使用模組化的 Logger 實例
 */
export const debug = globalLogger.debug

/**
 * 效能監控 Logger
 * 用於監控函式執行時間
 * @param {string} [prefix='Performance'] - Logger 前綴
 */
export function createPerformanceLogger(prefix = 'Performance') {
  const logger = useLogger({
    prefix,
    enabled: import.meta.env.DEV,
    showTimestamp: true,
  })

  /** @type {Map<string, number>} */
  const timers = new Map()

  return {
    /**
     * 開始計時
     * @param {string} label - 計時標籤
     */
    start: (label) => {
      timers.set(label, performance.now())
      logger.debug(`⏱️ 開始計時: ${label}`)
    },

    /**
     * 結束計時並輸出結果
     * @param {string} label - 計時標籤
     */
    end: (label) => {
      const startTime = timers.get(label)
      if (startTime === undefined) {
        logger.warn(`⚠️ 找不到計時標籤: ${label}`)
        return
      }

      const duration = performance.now() - startTime
      timers.delete(label)

      const emoji = duration > 1000 ? '🐌' : duration > 100 ? '⏳' : '⚡'
      logger.info(`${emoji} ${label} 執行時間: ${duration.toFixed(2)}ms`)
    },

    /**
     * 監控非同步函式執行時間
     * @template T
     * @param {string} label - 監控標籤
     * @param {() => Promise<T>} fn - 要監控的函式
     * @returns {Promise<T>}
     */
    async monitor(label, fn) {
      this.start(label)
      try {
        const result = await fn()
        this.end(label)
        return result
      } catch (error) {
        this.end(label)
        logger.error(`❌ ${label} 執行失敗:`, error)
        throw error
      }
    },
  }
}
