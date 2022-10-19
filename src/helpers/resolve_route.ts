function resolve_route(route: string): string {
    return route[0] != "/" ? `/${route}` : route;
}

export default resolve_route;