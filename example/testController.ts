import { Controller, get, requestParameter, BaseController, MethodReturnType } from "../src";

@Controller({
    path: "/test",
    tags: ["Test"]
})
class TestController extends BaseController {

    supacool = "yyeyaaaaah";

    @get({
        path: "/test",
        description: "cool yeah"
    })
    public async get(
        @requestParameter({
            name: "index",
            required: true,
            type: "integer"
        })
        index: number,

        @requestParameter({
            name: "cool",
            required: true,
            type: "boolean"
        })
        cool: boolean): Promise<MethodReturnType> {
        
        return {
            content: `${index} ok ${cool} ${this.supacool}`,
            httpCode: 200
        }
    }
}

export { TestController };