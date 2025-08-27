use std::env;
use std::sync::Arc;

use log::info;

use t_rust_less_lib::service::{
  config::LocalConfigProvider, local::LocalTrustlessService, ServiceResult, TrustlessService,
};

pub fn create_service() -> ServiceResult<Arc<dyn TrustlessService>> {
  info!("Creating");
  info!("Current: {:?}", env::current_dir());

  Ok(Arc::new(LocalTrustlessService::new(LocalConfigProvider::new(
    "/data/data/io.github.untoldwind/files/config.toml",
  ))?))
}
