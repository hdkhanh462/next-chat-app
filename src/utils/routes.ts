export function isMatchingRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (route.endsWith("/*")) {
      const baseRoute = route.slice(0, -2);
      return baseRoute.length > 0 && pathname.startsWith(baseRoute);
    }

    return route === pathname;
  });
}
