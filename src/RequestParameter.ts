import { addArgumentMeta, ArgumentMeta } from "./helpers/argumentMeta";

function requestParameter(options: RequestParameterOptions) {
    const meta: ArgumentMeta[] = Object.keys(options).map(x => ({
        name: x,
        value: options[x as keyof RequestParameterOptions]
    }));

    return addArgumentMeta(meta);
}

type RequestParameterOptions = {
    name: string,
    type: "string" | "float" | "integer" | "object" | "boolean",
    required: boolean,
    description?: string,
    example?: string
}

export { requestParameter, RequestParameterOptions }