import { RouteRecordRaw } from "vue-router";

interface MenuItem {
  key: string;
  label: string;
  title: string;
  order: number;
  children?: MenuItem[];
}

// 根据路由meta的menu选项生成菜单
const createMenu = (routes: readonly RouteRecordRaw[]) => {
  const menuItems: MenuItem[] = [];

  const create = (routes: readonly RouteRecordRaw[], parent?: any[]) => {
    routes.forEach(item => {
      if (!item.meta?.menu) return;

      const menu: MenuItem = { key: "", label: "", title: "", order: 0, children: undefined };
      menu.key = item.name as string;
      menu.label = item.meta.menuLabel as string;
      menu.title = item.meta.menuLabel as string;
      menu.order = item.meta.order as number;

      if (Array.isArray(item.children) && item.children.length > 0) {
        menu.children = [];
        create(item.children, menu.children);
      }
      if (parent) {
        parent.push(menu);
        parent.sort((a, b) => a.order - b.order);
      } else {
        menuItems.push(menu);
        menuItems.sort((a, b) => a.order - b.order);
      }
    });
  };
  create(routes);
  return menuItems;

};

export default createMenu;
