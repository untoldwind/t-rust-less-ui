use neon::prelude::*;

mod clipboard;
mod errors;
mod service;
mod store;

register_module!(mut m, {
    m.export_class::<service::JsService>("Service")?;

    Ok(())
});
