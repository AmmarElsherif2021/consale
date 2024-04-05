use std::fs;

#[derive(serde::Deserialize)]
pub struct WriteFileArgs {
  path: String,
  contents: String,
}

#[derive(serde::Deserialize)]
pub struct ReadFileArgs {
  path: String,
}

#[tauri::command]
pub fn write_file(args: WriteFileArgs) -> Result<(), String> {
  std::fs::write(args.path, args.contents).map_err(|err| err.to_string())
}

#[tauri::command]
pub fn read_file(args: ReadFileArgs) -> Result<String, String> {
  fs::read_to_string(&args.path).map_err(|err| err.to_string())
}
