export function requireAuth(to, from, next) {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = localStorage.getItem("token");
  if (requiresAuth && !isAuthenticated) {
    next("/sign-in");
  } 
  else if (isAuthenticated && (to.path === "/sign-in" || to.path === "/sign-un")){
    next("/home");
  }
  else {
    next();
  }
}
