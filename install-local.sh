#!/bin/sh

yarn clean
yarn dist
cp src-tauri/target/release/t-rust-less-ui "$HOME/bin/t-rust-less-ui"

cat <<END >"$HOME/.local/share/applications/t-rust-lest-ui.desktop"
[Desktop Entry]
Name=T-Rust-Less
Type=Application
Exec="$HOME/bin/t-rust-less-ui"
END
