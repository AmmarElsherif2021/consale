// src-tauri/src/main.rs
extern crate dotenv;
use dotenv::dotenv;
use std::env;
use tauri::{Builder, command};

#[command]
fn check_credentials(username: String, password: String) -> String {
    dotenv().ok();
    let username1 = env::var("USERNAME1").expect("USERNAME1 is not set");
    let pass1 = env::var("PASS1").expect("PASS1 is not set");

    // Here you would add logic to verify the credentials, for example:
    if username == username1 && password == pass1 {
        "Credentials are valid".to_string()
    } else {
        "Invalid credentials".to_string()
    }
}

fn main() {
    dotenv().ok();
    Builder::default()
        .invoke_handler(tauri::generate_handler![check_credentials])
        .plugin(tauri_plugin_sql::Builder::default().build()) // Uncomment if you're using the SQL plugin
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


// fn read_file(file_path: &str) -> Result<String> {
//     // Read the contents of the file
//     let content = fs::read_to_string(file_path)?;
//     Ok(content)
// }

// fn write_file(file_path: &str, content: &str) -> Result<()> {
//     // Write the content to the file
//     fs::write(file_path, content)?;
//     Ok(())
// }

// fn append_json_object(file_path: &str, json_object: Value) -> Result<()> {
//     // Read existing content
//     let mut content = read_file(file_path)?;

//     // Parse existing content as JSON
//     let mut existing_json: Value = serde_json::from_str(&content)?;

//     // Append the new JSON object
//     if let Value::Object(existing_map) = &mut existing_json {
//         if let Value::Object(new_map) = json_object {
//             existing_map.extend(new_map);
//         }
//     }

//     // Serialize the updated JSON
//     let updated_content = serde_json::to_string_pretty(&existing_json)?;

//     // Write the updated content back to the file
//     write_file(file_path, &updated_content)?;

//     Ok(())
// }