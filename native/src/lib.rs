use neon::context::{FunctionContext, Context};
use neon::result::JsResult;
use neon::types::JsString;
use neon::register_module;

fn hello_world(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello"))
}

register_module!(mut m, { m.export_function("helloWorld", hello_world)});