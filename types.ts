
export interface GeneratedAssets {
  imageUrl: string;
  candidates?: string[]; // 存储生成的 4 张原始候选图
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  SELECTING = 'SELECTING', 
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface MemePreset {
  id: string;
  label: string;
  emoji: string;
  action: string;
}

export interface CharacterStyle {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export type LayoutPosition = 
  | 'none'
  | 'top-center' 
  | 'bottom-center' 
  | 'left-center' 
  | 'right-center' 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'around' 
  | 'behind';

export interface LayoutOption {
  id: LayoutPosition;
  label: string;
  description: string;
}

export type FocusArea = 'face' | 'upper' | 'full';

export interface FocusOption {
  id: FocusArea;
  label: string;
  description: string;
}

export type ResolutionValue = 320 | 640 | 1080;

export interface ResolutionOption {
  id: ResolutionValue;
  label: string;
}

export const STYLE_OPTIONS: CharacterStyle[] = [
  { id: 'original', label: '原图复刻', emoji: '📸', description: '保持原始画风细节' },
  { id: 'sticker-cutout', label: '贴纸切边', emoji: '✂️', description: '带粗白边框的剪纸效果' },
  { id: '3d-disney', label: '3D 萌化', emoji: '🧸', description: '精致 3D 渲染，皮克斯风格' },
  { id: 'flat-vector', label: '简约扁平', emoji: '🎨', description: '现代矢量插画风格' },
  { id: 'japanese-anime', label: '经典日漫', emoji: '🌸', description: '细腻的二次元画风' },
  { id: 'pixel-art', label: '像素艺术', emoji: '👾', description: '复古 8-bit 游戏感' },
  { id: 'clay-style', label: '黏土手工', emoji: '🧶', description: '可爱的定格动画黏土质感' }
];

export const PRESETS: MemePreset[] = [
  { id: '1', emoji: '🎉', label: '开心', action: '欢呼雀跃、抛洒彩带的动作' },
  { id: '2', emoji: '👋', label: '你好', action: '热情招手并带微笑' },
  { id: '3', emoji: '💪', label: '加油', action: '紧握双拳，展示自信力量' },
  { id: '4', emoji: '👏', label: '太棒了', action: '热烈鼓掌，面带赞许' },
  { id: '5', emoji: '😂', label: '大笑', action: '捧腹大笑，流出眼泪' },
  { id: '6', emoji: '🙏', label: '感谢', action: '双手合十，真诚鞠躬' },
  { id: '7', emoji: '❤️', label: '比心', action: '用双手比出一个完美的爱心' },
  { id: '8', emoji: '😲', label: '惊讶', action: '目瞪口呆，露出极其吃惊的表情' },
  { id: '9', emoji: '🥺', label: '委屈', action: '眼含泪水，露出惹人怜爱的委屈表情' },
  { id: '10', emoji: '🤔', label: '思考', action: '一只手托着下巴，陷入沉思' },
  { id: '11', emoji: '💢', label: '生气', action: '眉头紧锁，咬牙切齿的愤怒神情' },
  { id: '12', emoji: '😴', label: '困了', action: '打着哈欠，睡眼惺忪的状态' },
  { id: '13', emoji: '👍', label: '点赞', action: '竖起大拇指，露出自信笑容' },
  { id: '14', emoji: '👌', label: '没问题', action: '做出OK的手势，显得很轻松' },
  { id: '15', emoji: '😎', label: '装酷', action: '戴着黑墨镜，酷酷地站着' },
  { id: '16', emoji: '❓', label: '疑惑', action: '歪着头，满脸问号的神态' },
  { id: '17', emoji: '💰', label: '发财', action: '抱着金元宝或者数钱的快乐动作' },
  { id: '18', emoji: '🍚', label: '干饭', action: '大口吃东西，手里拿着碗筷' },
  { id: '19', emoji: '💻', label: '摸鱼', action: '偷偷玩手机或者躲在电脑后面偷懒' },
  { id: '20', emoji: '☕', label: '淡定', action: '优雅地喝咖啡或茶，表情十分平静' },
  { id: '21', emoji: '🚀', label: '起飞', action: '像超人一样飞上天，速度感十足' },
  { id: '22', emoji: '🏃', label: '快逃', action: '惊慌失措地奔跑，后面有灰尘效果' },
  { id: '23', emoji: '🎁', label: '求带', action: '双手托腮，卖萌求关注求礼物' },
  { id: '24', emoji: '🎈', label: '庆祝', action: '手里拉着气球，欢庆节日的样子' }
];

export const LAYOUTS: LayoutOption[] = [
  { id: 'none', label: '无文字', description: '纯净图像' },
  { id: 'top-center', label: '顶部居中', description: '' },
  { id: 'bottom-center', label: '底部居中', description: '' },
  { id: 'left-center', label: '左侧居中', description: '' },
  { id: 'right-center', label: '右侧居中', description: '' },
  { id: 'top-left', label: '左上角', description: '' },
  { id: 'top-right', label: '右上角', description: '' },
  { id: 'around', label: '环绕主体', description: '' }
];

export const FOCUS_OPTIONS: FocusOption[] = [
  { id: 'face', label: '特写', description: '面部表情' },
  { id: 'upper', label: '半身', description: '肢体动作' },
  { id: 'full', label: '全身', description: '整体动态' }
];

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
  { id: 640, label: '标准 (640px)' },
  { id: 1080, label: '高清 (1080px)' }
];
