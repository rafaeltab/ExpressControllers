var get:any = method("get");
var post:any = method("post");
var put:any = method("put");
var patch:any = method("patch");
var _delete:any = method("delete");

function method(method: "get" | "post" | "put" | "patch" | "delete") {
    return function (options: MethodOptions) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): any {
            Object.keys(options).forEach((x) => {
                target[propertyKey][x] = options[x as keyof MethodOptions];
            })

            target[propertyKey]["method"] = "get";
        };
    }
    
}

export type MethodOptions = {
    path?: string,
    description?: string
}

export { 
    get,
    post,
    put,
    patch,
    _delete as delete,
    _delete
}