export function Controller(options: ControllerOptions) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function(constructor: Function) {
        constructor.prototype = {
            ...constructor.prototype,
            ...options,
            isController: true
        }

        Object.seal(constructor);
        Object.seal(constructor.prototype);
    }
}

export type ControllerOptions = {
    path: string,
    tags?: string[]
}