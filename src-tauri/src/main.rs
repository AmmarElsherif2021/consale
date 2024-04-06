// src-tauri/src/main.rs

use std::fs;
use serde_json::{Value, json};
use tauri::api::Result;
use tauri::Builder; // Import the correct module

fn read_file(file_path: &str) -> Result<String> {
    // Read the contents of the file
    let content = fs::read_to_string(file_path)?;
    Ok(content)
}

fn write_file(file_path: &str, content: &str) -> Result<()> {
    // Write the content to the file
    fs::write(file_path, content)?;
    Ok(())
}

fn append_json_object(file_path: &str, json_object: Value) -> Result<()> {
    // Read existing content
    let mut content = read_file(file_path)?;

    // Parse existing content as JSON
    let mut existing_json: Value = serde_json::from_str(&content)?;

    // Append the new JSON object
    if let Value::Object(existing_map) = &mut existing_json {
        if let Value::Object(new_map) = json_object {
            existing_map.extend(new_map);
        }
    }

    // Serialize the updated JSON
    let updated_content = serde_json::to_string_pretty(&existing_json)?;

    // Write the updated content back to the file
    write_file(file_path, &updated_content)?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
