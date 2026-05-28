/**
 * AI 模型图标工具
 * 使用 @lobehub/icons-static-svg 图标库
 */

// 图标库 CDN 基础路径
const LOBE_ICONS_CDN =
  'https://unpkg.com/@lobehub/icons-static-svg@latest/icons';

// 模型提供商到图标名称的映射
const PROVIDER_ICON_MAP: Record<string, string> = {
  // 国内模型
  阿里云: 'qwen',
  DeepSeek: 'deepseek',
  智谱AI: 'chatglm',
  百川智能: 'baichuan',
  月之暗面: 'kimi',
  零一万物: 'yi',
  上海AI实验室: 'internlm',
  Moonshot: 'moonshot',

  // 国际模型
  OpenAI: 'openai',
  Anthropic: 'claude',
  Google: 'gemini',
  Meta: 'metaai',
  Mistral: 'mistral',
  xAI: 'grok',
  Microsoft: 'microsoft',
  Cohere: 'cohere',
};

// 模型名称前缀到图标名称的映射
const MODEL_PREFIX_MAP: Record<string, string> = {
  qwen: 'qwen',
  deepseek: 'deepseek',
  chatglm: 'chatglm',
  glm: 'chatglm',
  baichuan: 'baichuan',
  kimi: 'kimi',
  yi: 'yi',
  intern: 'internlm',
  moonshot: 'moonshot',

  gpt: 'openai',
  o1: 'openai',
  o2: 'openai',
  o3: 'openai',
  claude: 'claude',
  gemini: 'gemini',
  llama: 'metaai',
  mistral: 'mistral',
  mixtral: 'mistral',
  grok: 'grok',
  phi: 'microsoft',
  command: 'cohere',
};

/**
 * 根据模型名称获取图标名称
 */
function getIconNameByModel(modelName: string): string | null {
  const lowerName = modelName.toLowerCase();

  for (const [prefix, iconName] of Object.entries(MODEL_PREFIX_MAP)) {
    if (lowerName.startsWith(prefix)) {
      return iconName;
    }
  }

  return null;
}

/**
 * 根据提供商名称获取图标名称
 */
function getIconNameByProvider(provider: string): string | null {
  return PROVIDER_ICON_MAP[provider] || null;
}

/**
 * 获取模型图标的 CDN URL
 * @param modelName 模型名称（如 'Qwen2-7B'）
 * @param provider 提供商名称（如 '阿里云'）
 * @param variant 图标变体：'default' | 'color' | 'text'
 */
export function getModelIconUrl(
  modelName: string,
  provider?: string,
  variant: 'default' | 'color' | 'text' = 'color',
): string {
  // 优先根据模型名称匹配
  let iconName = getIconNameByModel(modelName);

  // 如果模型名称没有匹配，尝试根据提供商匹配
  if (!iconName && provider) {
    iconName = getIconNameByProvider(provider);
  }

  // 如果都没匹配，使用默认图标
  if (!iconName) {
    iconName = 'openai';
  }

  // 构建图标文件名
  const suffix = variant === 'default' ? '' : `-${variant}`;

  return `${LOBE_ICONS_CDN}/${iconName}${suffix}.svg`;
}

/**
 * 获取模型图标的本地路径（用于 img src）
 * 需要将图标文件复制到 public 目录或使用 CDN
 */
export function getModelIconSrc(modelName: string, provider?: string): string {
  return getModelIconUrl(modelName, provider, 'color');
}

/**
 * 预加载常用模型图标
 */
export function preloadModelIcons(): void {
  const commonIcons = [
    'qwen-color',
    'deepseek-color',
    'chatglm-color',
    'openai',
    'claude-color',
    'gemini-color',
    'metaai-color',
    'mistral-color',
  ];

  commonIcons.forEach((icon) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `${LOBE_ICONS_CDN}/${icon}.svg`;
    link.as = 'image';
    document.head.append(link);
  });
}

/**
 * 获取所有支持的模型图标列表
 */
export function getSupportedModelIcons(): string[] {
  return Object.values(PROVIDER_ICON_MAP);
}
