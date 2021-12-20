import { Express } from "express";
import { join } from "path";

export abstract class ExpressServer {
    constructor(protected _app: Express) { }

    public static registerController(controller: any) {
        const proto = ExpressServer.guarenteeProto(controller);

        if (proto.isController === false) {
            throw new TypeError("Controller supplied to register controller was not a controller");
        }

        const properties = Object.getOwnPropertyNames(proto);
        const basePath = proto.path ?? "/";

        for (const property of properties) {
            const possibleMethod = proto[property];
            if (typeof possibleMethod === "function") {
                if (possibleMethod.method != undefined) { 
                    const fullPath = join(basePath, possibleMethod.path ?? "");
                    console.log(`${fullPath} ${possibleMethod.description}`);
                }
            }
        }

        // console.log(proto)
    }

    private addMethod(fullPath: string, method: any) {
        throw new Error("Not implemented");
    }

    private static guarenteeProto(obj: any) {
        let proto = obj;
        if (obj.prototype === undefined) {
            proto = Object.getPrototypeOf(obj);
        } else {
            proto = obj.prototype;
        }
        return proto;
    }
}