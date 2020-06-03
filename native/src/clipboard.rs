use crate::errors::ToJsResult;
use neon::prelude::*;
use std::sync::Arc;
use t_rust_less_lib::service::ClipboardControl;

pub struct ClipboardHandle {
    pub clipboard: Option<Arc<dyn ClipboardControl>>,
}

declare_types! {
    pub class JsClipboardControl for ClipboardHandle {
        init(_) {
            Ok(
                ClipboardHandle {
                    clipboard: None,
                }
            )
        }

        method isDone(mut cx) {
            let this = cx.this();
            cx.borrow(&this, |handle| {
                handle.clipboard.as_ref().map(|clipboard| clipboard.is_done())
            }).to_js(&mut cx)
        }

        method currentlyProviding(mut cx) {
            let this = cx.this();
            cx.borrow(&this, |handle| {
                handle.clipboard.as_ref().map(|clipboard| clipboard.currently_providing())
            }).to_js(&mut cx)
        }

        method destroy(mut cx) {
            let this = cx.this();
            cx.borrow(&this, |handle| {
                handle.clipboard.as_ref().map(|clipboard| clipboard.destroy())
            }).to_js(&mut cx)
        }
    }
}
