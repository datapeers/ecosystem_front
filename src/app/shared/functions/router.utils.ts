import { ActivatedRouteSnapshot } from '@angular/router';

export function getResolvedUrl(route: ActivatedRouteSnapshot): string {
  return (
    '/' +
    route.pathFromRoot
      .filter((snapshot) => snapshot.url.length)
      .map((snapshot) =>
        snapshot.url.map((segment) => segment.toString()).join('/')
      )
      .join('/')
  );
}

export function getConfiguredUrl(route: ActivatedRouteSnapshot): string {
  return route.pathFromRoot
    .filter((v) => v.routeConfig)
    .map((v) => v.routeConfig!.path)
    .join('/');
}

export function getDeepestData(
  route: ActivatedRouteSnapshot,
  fieldName: string
) {
  if (route.firstChild) {
    const innerData = getDeepestData(route.firstChild, fieldName);
    return innerData ? innerData : route.data[fieldName];
  }
  return route.data[fieldName];
}
