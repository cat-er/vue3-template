import { defineComponent } from "vue";
import type { NavigationGuard } from "vue-router";

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import("*.vue")>)
  | (() => Promise<T>);

export interface RouteMeta {
  requiresAuth?: boolean; //是否需要验证登录
  menu?: boolean; //是否为菜单选项
  menuLabel?: string; //当为菜单项时的标题
  order?: number; //顺序
}

export interface AppRouteRecordRaw {
  path: string;
  name?: string | symbol;
  meta?: RouteMeta;
  redirect?: string;
  component: Component | string;
  children?: AppRouteRecordRaw[];
  alias?: string | string[];
  props?: Record<string, any>;
  beforeEnter?: NavigationGuard | NavigationGuard[];
  fullPath?: string;
}
