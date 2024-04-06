

#[derive(serde::Deserialize)]
pub struct WriteFileArgs {
    path: String,
    contents: String,
}

#[tauri::command]
pub fn write_file(args: WriteFileArgs) -> Result<(), String> {
    match std::fs::write(&args.path, &args.contents) {
        Ok(_) => Ok(()),
        Err(err) => Err(err.to_string()),
    }
}
