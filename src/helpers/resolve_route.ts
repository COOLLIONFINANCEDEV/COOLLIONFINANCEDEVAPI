function resolve_route(route: string): string {
    route = route[0] != "/" ? `/${route}` : route;
    // route = route[route.length - 1] != "/" ? `${route}/` : route;

    return route;
}

export default resolve_route;