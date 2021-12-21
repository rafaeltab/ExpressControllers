import { Request } from "express";
import { addArgumentMeta, ArgumentMeta } from "./helpers/argumentMeta";

/**
 * Mark an argument as a request parameter
 * @param options The options for the argument. Includes type, name, etc.
 * @returns decorator for parameters
 */
export function requestParameter<T extends RequestParameterOptions | CustomParameterOptions>(options: T) {
    const meta: ArgumentMeta[] = Object.keys(options).map(x => ({
        name: x,
        value: options[x as keyof T]
    }));

    return addArgumentMeta(meta);
}

/**
 * Options required for marking a parameter as originating from a request
 */
export type RequestParameterOptions = {
    /** The name of the parameter on the method. Not the name on the request */
    name: string,
    /** The type of the argument. If they do not match required will be looked at to determine if an error should be returned. An attempt will always be made to coerce a value into this type */
    type: "string" | "float" | "integer" | "object" | "boolean",
    /** Is this parameter required? */
    required: boolean,
    /** A description that can be displayed in documentation */
    description?: string,
    /** An example that can be displayed in documentation */
    example?: string,
    /** The possible names on the request. Automatically includes the name on the body and query. */
    aliases?: ParameterPosition[],
    /** If the name is not an alias remove it here */
    nameNotAlias?: boolean
}

/** Define a place that the parameter can be. */
export type ParameterPosition = {
    name: string,
    position: "body" | "query" | "both"
}

/**
 * Options required for creating a custom parameter for a request. This could for example be used for retrieving authentication headers
 */
export type CustomParameterOptions = {
    type: "custom",
    name: string,
    verify: (req: Request) => CustomParameterResult
    description?: string,
    example?: string,
}

export function isCustomRequestParameter(param: CustomParameterOptions | RequestParameterOptions): param is CustomParameterOptions {
    return param.type === "custom";
}

export function baseVerify(options: RequestParameterOptions) {
    return (req: Request): CustomParameterResult => {
        const aliases = options.aliases ?? [];

        if (!options.nameNotAlias) aliases.push({
            name: options.name,
            position: "both"
        });

        let value = undefined;

        for (const alias of aliases) {
            if ((alias.position === "body" || alias.position === "both") && req.query !== undefined) {
                value = req.query[alias.name];
            }

            if (value !== undefined) break;

            if ((alias.position === "query" || alias.position === "both") && req.body !== undefined) {
                value = req.body[alias.name];
            }

            if (value !== undefined) break;
        }

        if (value === undefined && options.required === true) return {
            success: false,
            message: `Parameter ${options.name} was not present in the request.`
        }

        if (value === undefined) return {
            success: true,
            result: undefined
        }

        return verifyType(value, options);
    }
}

function verifyType(value: unknown, options: RequestParameterOptions): CustomParameterResult {
    switch (options.type) {
        case "boolean":
            return verifyBoolean(value, options);
        case "float":
            return verifyFloat(value, options);
        case "integer":
            return verifyInteger(value, options);
        case "object":
            return verifyObject(value, options);
        case "string":
            return verifyString(value, options);
        default:
            throw new Error("Unexpected parameter type: " + options.type)
    }
}

function verifyBoolean(value: unknown, options: RequestParameterOptions): CustomParameterResult {
    if (value === true || value === 1 || (typeof value === "string" && value.toLowerCase() === "true")) return {
        success: true,
        result: true
    }

    if (value === false || value === 0 || (typeof value === "string" && value.toLowerCase() === "false")) return {
        success: true,
        result: false
    }

    if (options.required === true) {
        return {
            success: false,
            message: `Parameter ${options.name} was present but of an incorrect type, ${typeof value}, while it should have been ${options.type}`
        }
    }

    return {
        success: true,
        result: value
    }
}

function verifyFloat(value: unknown, options: RequestParameterOptions): CustomParameterResult {
    if (typeof value === "number") return {
        success: true,
        result: value
    }

    if (typeof value === "string") {
        const val = parseFloat(value);

        if(!isNaN(val)) return {
            success: true,
            result: value
        }
    }

    if (options.required === true) {
        return {
            success: false,
            message: `Parameter ${options.name} was present but of an incorrect type, ${typeof value}, while it should have been ${options.type}`
        }
    }

    return {
        success: true,
        result: value
    }
}

function verifyInteger(value: unknown, options: RequestParameterOptions): CustomParameterResult {
    if (typeof value === "number") return {
        success: true,
        result: parseInt(value.toString())
    }

    if (typeof value === "string") {
        const val = parseInt(value);

        if (!isNaN(val)) return {
            success: true,
            result: value
        }
    }

    if (options.required === true) {
        return {
            success: false,
            message: `Parameter ${options.name} was present but of an incorrect type, ${typeof value}, while it should have been ${options.type}`
        }
    }

    return {
        success: true,
        result: value
    }
}

function verifyObject(value: unknown, options: RequestParameterOptions): CustomParameterResult {
    if (typeof value === "object") return {
        success: true,
        result: value
    }

    if (options.required === true) {
        return {
            success: false,
            message: `Parameter ${options.name} was present but of an incorrect type, ${typeof value}, while it should have been ${options.type}`
        }
    }

    return {
        success: true,
        result: value
    }
}

function verifyString(value: unknown, options: RequestParameterOptions): CustomParameterResult {
    if (typeof value === "string") return {
        success: true,
        result: value
    }

    if (typeof value === "number") return {
        success: true,
        result: value.toString()
    }

    if (typeof value === "boolean") return {
        success: true,
        result: value.toString()
    }

    if (options.required === true) {
        return {
            success: false,
            message: `Parameter ${options.name} was present but of an incorrect type, ${typeof value}, while it should have been ${options.type}`
        }
    }

    return {
        success: true,
        result: value
    }
}

export type CustomParameterResult = CustomParameterSuccessResult | CustomParameterFailureResult;

export type CustomParameterSuccessResult = {
    success: true,
    result: unknown
}
export type CustomParameterFailureResult = {
    success: false,
    message: string
}

export function isSuccessResult(result: CustomParameterResult): result is CustomParameterSuccessResult {
    return result.success === true;
}