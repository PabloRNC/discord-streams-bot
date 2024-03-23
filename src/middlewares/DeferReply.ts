import { createMiddleware } from "seyfert";

export default createMiddleware<void>(async(data) => {

    await data.context.deferReply();

    return data.next();

})