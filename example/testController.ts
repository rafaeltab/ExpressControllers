import { Controller, Methods, requestParameter } from "../dist/src";

@Controller({
    path: "/test",
    tags: ["Test"]
})
class TestController {

    @Methods.delete({
        path: "/test",
        description: "cool yeah"
    })
    public get(
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
        cool: boolean): void {
        console.log(index + " " + cool);
    }
}

export { TestController };