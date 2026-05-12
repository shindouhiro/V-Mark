import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface Lesson {
  id: number;
  title: string;
  status: LessonStatus;
  note: string;
  dateCompleted?: string;
  rating?: number;
}

interface CheckinState {
  lessons: Lesson[];
  githubToken: string;
  gistId: string;
  isSyncing: boolean;
  
  // Actions
  checkIn: (id: number, note: string, rating: number) => void;
  startLesson: (id: number) => void;
  setGithubToken: (token: string) => void;
  setGistId: (id: string) => void;
  
  // Gist Actions
  syncWithGist: () => Promise<void>;
  fetchFromGist: () => Promise<void>;
  
  // Helpers
  getOverallProgress: () => { completed: number; total: number; percentage: number };
  getStreak: () => number;
}

const courseTitles = [
  "01-vue3源码结构的介绍",
  "02-reactivity 的核心流程",
  "03-runtime-core 初始化的核心",
  "04-runtime-core 更新的核心流",
  "05-setup环境-集成jest做单元测",
  "06-实现 effect & reactive & 依",
  "07-实现 effect 返回 runner",
  "08-实现 effect.scheduler 功能",
  "09-实现 effect 的 stop 功能",
  "10-实现 readonly 功能",
  "11-实现 isReactive 和 isReadonly",
  "12-优化 stop 功能",
  "13-实现 reactive 和 readonly 嵌",
  "14-实现 shallowReadonly 功能",
  "15-实现 isProxy 功能",
  "16-实现 ref 功能",
  "17-实现 isRef 和 unRef 功能",
  "18-实现 proxyRefs 功能",
  "19-实现 computed 计算属性",
  "20-实现初始化 component 主流",
  "21-使用 rollup 打包库",
  "22-实现初始化 element 主流程",
  "23-实现组件代理对象",
  "24-实现 shapeFlags",
  "25-实现注册事件功能",
  "26-实现组件 props 逻辑",
  "27-实现组件 emit 功能",
  "28-实现组件 slots 功能",
  "29-实现 Fragment 和 Text 类型",
  "30-实现 getCurrentInstance",
  "31-实现 provide-inject 功能",
  "32-实现自定义渲染器 custom re",
  "33-更新element流程搭建",
  "34-更新element 的 props",
  "35-更新 element 的 children",
  "36-更新 element 的 children - 1",
  "37-更新 element 的 children - 2",
  "38-更新 element 的 children - 3",
  "39-学习尤大解决bug的处理方式",
  "40-实现组件更新功能",
  "41-实现 nextTick 功能",
  "42-编译模块概述",
  "43-实现解析插值功能",
  "44-实现解析 element 标签",
  "45-实现解析 text 功能",
  "46-实现解析三种联合类型",
  "47-parse 的实现原理&有限状态",
  "48-实现 transform 功能",
  "49-实现代码生成 string 类型",
  "50-实现代码生成插值类型",
  "51-实现代码生成三种联合类型",
  "52-实现编译 template 成 render",
  "53-实现 monorepo & 使用 vitest",
  "54-实现 watchEffect"
];

const initialLessons: Lesson[] = courseTitles.map((title, i) => ({
  id: i + 1,
  title,
  status: 'not_started',
  note: '',
}));

export const useCheckinStore = create<CheckinState>()(
  persist(
    (set, get) => ({
      lessons: initialLessons,
      githubToken: '',
      gistId: '',
      isSyncing: false,

      checkIn: (id, note, rating) => {
        set((state) => {
          const updated = state.lessons.map((lesson) => {
            if (lesson.id === id) {
              return {
                ...lesson,
                status: 'completed' as LessonStatus,
                note,
                rating,
                dateCompleted: new Date().toISOString(),
              };
            }
            return lesson;
          });
          return { lessons: updated };
        });
      },

      startLesson: (id) => {
        set((state) => {
          const updated = state.lessons.map((lesson) => {
            if (lesson.id === id && lesson.status === 'not_started') {
              return { ...lesson, status: 'in_progress' as LessonStatus };
            }
            return lesson;
          });
          return { lessons: updated };
        });
      },

      setGithubToken: (token) => set({ githubToken: token }),
      setGistId: (id) => set({ gistId: id }),

      syncWithGist: async () => {
        const { githubToken, gistId, lessons } = get();
        if (!githubToken) throw new Error('未配置 GitHub Token');
        
        set({ isSyncing: true });
        try {
          const fileName = 'mini-vue-checkin-data.json';
          const content = JSON.stringify(lessons, null, 2);
          
          const method = gistId ? 'PATCH' : 'POST';
          const url = gistId 
            ? `https://api.github.com/gists/${gistId}` 
            : 'https://api.github.com/gists';

          const response = await fetch(url, {
            method,
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              description: 'Mini-Vue 源码学习打卡数据',
              public: false,
              files: {
                [fileName]: { content }
              }
            })
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || '同步失败');
          }

          const data = await response.json();
          if (!gistId) {
            set({ gistId: data.id });
          }
        } finally {
          set({ isSyncing: false });
        }
      },

      fetchFromGist: async () => {
        const { githubToken, gistId } = get();
        if (!githubToken || !gistId) throw new Error('未配置 Token 或 Gist ID');

        set({ isSyncing: true });
        try {
          const response = await fetch(`https://api.github.com/gists/${gistId}`, {
            headers: {
              'Authorization': `token ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
            }
          });

          if (!response.ok) throw new Error('获取数据失败');

          const data = await response.json();
          const fileName = 'mini-vue-checkin-data.json';
          const file = data.files[fileName];
          
          if (file && file.content) {
            const remoteLessons = JSON.parse(file.content);
            set({ lessons: remoteLessons });
          } else {
            throw new Error('Gist 中未找到打卡数据文件');
          }
        } finally {
          set({ isSyncing: false });
        }
      },

      getOverallProgress: () => {
        const { lessons } = get();
        const completed = lessons.filter((l) => l.status === 'completed').length;
        const total = lessons.length;
        return {
          completed,
          total,
          percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
        };
      },

      getStreak: () => {
        const { lessons } = get();
        const completedDates = lessons
          .filter((l) => l.dateCompleted)
          .map((l) => new Date(l.dateCompleted!).toDateString());
        
        const uniqueDates = Array.from(new Set(completedDates)).sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );

        if (uniqueDates.length === 0) return 0;
        
        let streak = 1;
        const today = new Date().toDateString();
        const latest = uniqueDates[0];
        const isLatestTodayOrYest = 
          latest === today || 
          new Date(latest).getTime() === new Date(today).getTime() - 86400000;
          
        if (!isLatestTodayOrYest) return 0;

        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const curr = new Date(uniqueDates[i]);
          const prev = new Date(uniqueDates[i + 1]);
          const diff = (curr.getTime() - prev.getTime()) / (1000 * 3600 * 24);
          if (diff === 1) streak++;
          else break;
        }
        return streak;
      },
    }),
    {
      name: 'mini-vue-v1-storage',
      // Ensure sync settings are persisted
      partialize: (state) => ({
        lessons: state.lessons,
        githubToken: state.githubToken,
        gistId: state.gistId,
      }),
    }
  )
);
