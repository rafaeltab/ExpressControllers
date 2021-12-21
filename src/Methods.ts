import { BaseController } from "controller";
import { FunctionThatReturns, NumberEnumerate, NumberRange } from "helpers/advancedTypes";

const get = method("get");
const post = method("post");
const put = method("put");
const patch = method("patch");
const _delete = method("delete");

function method(method: Methods) {
    return function (options: MethodOptions) {
        return function <T extends BaseController>(
            target: T,
            propertyKey: keyof T,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            descriptor: TypedPropertyDescriptorType
        ): void {

            const targetProp: T[keyof T] & TargetPropOptions = target[propertyKey];
            Object.keys(options).forEach((x) => {
                targetProp[x as keyof MethodOptions] = options[x as keyof MethodOptions];
            })

            targetProp["method"] = method;
        };
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypedPropertyDescriptorType = TypedPropertyDescriptor<FunctionThatReturns<Promise<MethodReturnType>>>
    | TypedPropertyDescriptor<FunctionThatReturns<Promise<void>>>
    | TypedPropertyDescriptor<FunctionThatReturns<MethodReturnType>>
    | TypedPropertyDescriptor<FunctionThatReturns<void>>

export type MethodType = TypedPropertyDescriptorType["value"]

export type MethodReturnType = {
    httpCode: `${NumberRange<1, 6>}${NumberEnumerate<10>}${NumberEnumerate<10>}` | number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any
}

export type MethodOptions = {
    path?: string,
    description?: string
}

type Methods = "get" | "post" | "put" | "patch" | "delete";

export type TargetPropOptions = {
    method?: Methods
} & MethodOptions;

export {
    get,
    post,
    put,
    patch,
    _delete as delete,
    _delete
}