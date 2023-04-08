const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/",
    component: () => import("layouts/BlankLayout.vue"),
    children: [
      { path: "recept", component: () => import("pages/ReceptPage.vue") },
      { path: "myrecept", component: () => import("pages/MojReceptPage.vue") },
      { path: "login", component: () => import("pages/LoginPage.vue") },
      { path: "us", component: () => import("pages/AboutPage.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;