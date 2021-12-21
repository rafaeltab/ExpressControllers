import { BaseController, ControllerMark, ControllerOptions } from "./controller";
import { Express, IRouterMatcher, Request } from "express";
import { join } from "path";
import { MethodType, TargetPropOptions } from "./methods";
import { ObjectWithMeta } from "./helpers/argumentMeta";
import {
    RequestParameterOptions,
    CustomParameterOptions,
    isCustomRequestParameter,
    CustomParameterResult,
    baseVerify,
    isSuccessResult,
    CustomParameterSuccessResult,
    CustomParameterFailureResult
} from "./requestParameter";

export abstract class ExpressServer {
    constructor(protected _app: Express) { }

    /**
     * Register a controller or controller instance with all of its methods to express
     * @param controller THe controller to register
     */
    protected registerController<T extends BaseController>(controller: T | { new(): T } ) {
        const proto: typeof BaseController & Partial<ControllerOptions> & ControllerMark = guaranteeProto(controller);

        if (proto.isController !== true) {
            throw new TypeError("Controller supplied to registerController was not a controller");
        }

        const properties = Object.getOwnPropertyNames(proto);
        const basePath = proto.path ?? "/";

        for (const property of properties) {
            const possibleMethod = proto[property as keyof typeof proto];
            if (isControllerMethod(possibleMethod)) {
                const fullPath = join(basePath, possibleMethod.path ?? "").replace(/\\/g, "/");

                let controllerInstance: T;
                if (!isType(controller)) controllerInstance = controller;
                else controllerInstance = new controller();

                this.addMethod(fullPath, possibleMethod, controllerInstance);
            }
        }
    }

    /**
     * Register method to express
     * @param fullPath The path to register the method for
     * @param method The method to register
     */
    private addMethod<T extends BaseController>(
        fullPath: string,
        method: MethodType & Partial<TargetPropOptions> & Partial<ObjectWithMeta<RequestParameterOptions | CustomParameterOptions>>,
        controller: T | typeof BaseController
    ) {
        const argument_meta = method.argument_meta;

        (this._app[method.method ?? "get"] as IRouterMatcher<Express>)(fullPath, async (req, res) => {
            const parameters = retrieveParameters(req, argument_meta);

            const failures = getFailures(parameters);
            if (failures.length > 0) {
                res.status(422).send(failures.map(x => x.message))
                return;
            }

            const actualParameters: unknown[] = Object.values(parameters as Record<string, CustomParameterSuccessResult>).map(x => x.result)

            const result = method.bind(controller)(...actualParameters);
            const awaitedResult = await Promise.resolve(result);

            if (isVoid(awaitedResult)) {
                res.status(200).send();
                return;
            }

            if (typeof awaitedResult.content === "object") {
                res.status(parseInt(awaitedResult.httpCode.toString()))
                    .json(awaitedResult.content);
                return;
            }

            res.status(parseInt(awaitedResult.httpCode.toString()))
                .send(awaitedResult.content);
            return;
        });
    }
}

function getFailures(parameters: Record<string, CustomParameterResult>): CustomParameterFailureResult[] {
    return Object.values(parameters).filter((x) => !isSuccessResult(x)) as CustomParameterFailureResult[];
}

function isVoid<T>(val: void | T): val is void {
    return val === undefined;
}

function retrieveParameters(req: Request, argument_meta?: (RequestParameterOptions | CustomParameterOptions)[]): Record<string, CustomParameterResult> {
    const parameters: Record<string, CustomParameterResult> = {}
    if (argument_meta === undefined) return {}

    for (const meta of argument_meta) {
        let value: CustomParameterResult;
        if (isCustomRequestParameter(meta)) {
            value = meta.verify(req);
        } else {
            value = baseVerify(meta)(req);
        }

        parameters[meta.name] = value;
    }

    return parameters;
}

/**
 * Check if a property is a controller method
 * @param method property on controller that might be a controller method
 * @returns Whether the property is a controller method or not
 */
function isControllerMethod(method: unknown): method is (MethodType & Partial<TargetPropOptions>) {
    if (typeof method !== "function") return false;
    if (!("method" in method)) return false;

    return true;
}

/**
 * Make an object or type into a type
 * @param obj The object or type to ensure becomes a type
 * @returns The type whether it came from the object or was already a type does not matter
 */
function guaranteeProto<T extends BaseController>(obj: T | typeof BaseController): typeof BaseController {
    if (!isType(obj)) {
        return Object.getPrototypeOf(obj);
    } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (obj as any)["prototype"];
    }
}

/**
 * Check if object or type is a type.
 * @param obj The object to check
 * @returns Is it a type
 */
function isType<T extends BaseController>(obj: T | typeof BaseController): obj is typeof BaseController {
    return typeof obj === typeof BaseController;
}