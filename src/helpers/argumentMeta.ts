export function addArgumentMeta(meta: ArgumentMeta[]) {
    return function required(target: unknown, propertyKey: string | symbol, parameterIndex: number) {
        if (typeof target !== "object") throw new Error("target was not an object, it was " + typeof target);
        if (target === null || target === undefined) throw new Error("target was null or undefined")

        if (!(propertyKey in target)) throw new Error(propertyKey.toString() + " did not exist on target");

        const targetElement: Record<string, unknown> = target[propertyKey as keyof typeof target]


        if (!isArgumentMetaUndefined(targetElement)) {
            targetElement["argument_meta"] = []
        }

        const argMeta: Record<string, unknown>[] = targetElement["argument_meta"] as Record<string, unknown>[];

        if (argMeta[parameterIndex] == undefined) {
            argMeta[parameterIndex] = {}
        }

        meta.forEach(({ name, value }) => {
            argMeta[parameterIndex][name] = value;
        });
    }
}

type ObjectWithMeta = {
    argument_meta: unknown[]
} & unknown;

function isArgumentMetaUndefined(target: object): target is ObjectWithMeta {
    return !("argument_meta" in target);
}

export type ArgumentMeta = {
    name: string,
    value: unknown
}