import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Cookbook",
    component: () => import("../views/Recipes.vue"),
  },
  {
    path: "/groceries",
    name: "Grocery List",
    component: () => import("../views/Groceries.vue"),
  },
  {
    path: "/substitutions",
    name: "Lookup Substitutions",
    component: () => import("../views/Substitutions.vue"),
  }  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
