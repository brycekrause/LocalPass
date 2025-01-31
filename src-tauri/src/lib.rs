mod cryptography;

use cryptography::{decrypt, encrypt};
use serde::{Serialize, Deserialize};
use serde_json::{to_writer_pretty, from_reader, Value};
use std::fs::OpenOptions;
use std::io::{BufWriter, BufReader, Seek, SeekFrom};
use tauri::Error;

#[derive(Serialize, Deserialize)]
struct Data{
    title: String,
    login: String,
    password: String,
    note: String,
}

#[tauri::command]
fn append_json(title: &str, login: &str, password: &str, note: &str) -> Result<String, Error> {
    let encrypted_password = encrypt(password);
    let data = Data {
        title: title.to_string(),
        login: login.to_string(),
        password: encrypted_password,
        note: note.to_string(),
    };

    {
        let mut file = OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .open("data.json")
            .map_err(|e| Error::from(e))?;

        let mut reader = BufReader::new(&file);
        let mut json_data: Value = match from_reader(&mut reader) {
            Ok(value) => value,
            Err(e) => {
                eprintln!("Failed to read JSON data: {:?}", e);
                Value::Array(vec![])
            },
        };

        if let Value::Array(ref mut arr) = json_data {
            arr.push(serde_json::to_value(&data).map_err(|e| {
                eprintln!("Failed to convert data to JSON value: {:?}", e);
                Error::from(e)
            })?);
        }

        file.set_len(0).map_err(|e| {
            eprintln!("Failed to truncate file: {:?}", e);
            Error::from(e)
        })?;
        file.seek(SeekFrom::Start(0)).map_err(|e| {
            eprintln!("Failed to seek to start of file: {:?}", e);
            Error::from(e)
        })?;

        let writer = BufWriter::new(file);
        to_writer_pretty(writer, &json_data).map_err(|e| {
            eprintln!("Failed to write JSON data: {:?}", e);
            Error::from(e)
        })?;
    }

    Ok("Data appended successfully".to_string())
}


#[tauri::command]
fn read_json(f: String) -> Result<Vec<Data>, Error> {
    let file = OpenOptions::new()
        .read(true)
        .open(f)
        .map_err(|e| Error::from(e))?;
    let reader = BufReader::new(file);
    let mut data: Vec<Data> = serde_json::from_reader(reader)
        .map_err(|e| Error::from(e))?;

    for entry in &mut data {
        entry.password = decrypt(&entry.password);
    }

    Ok(data)
}

#[tauri::command]
fn delete_json(title: String) -> Result<String, Error> {
    let mut file = OpenOptions::new()
        .read(true)
        .write(true)
        .open("data.json")
        .map_err(|e| Error::from(e))?;

    let mut json_data: Value = from_reader(BufReader::new(&file)).unwrap_or_else(|_| Value::Array(vec![]));

    if let Value::Array(ref mut arr) = json_data {
        arr.retain(|entry| {
            if let Value::Object(map) = entry {
                if let Some(Value::String(entry_title)) = map.get("title") {
                    return entry_title != &title;
                }
            }
            true
        });
    }

    file.set_len(0).map_err(|e| {
        eprintln!("Failed to truncate file: {:?}", e);
        Error::from(e)
    })?;
    file.seek(SeekFrom::Start(0)).map_err(|e| {
        eprintln!("Failed to seek to start of file: {:?}", e);
        Error::from(e)
    })?;

    let writer = BufWriter::new(file);
    to_writer_pretty(writer, &json_data).map_err(|e| {
        eprintln!("Failed to write JSON data: {:?}", e);
        Error::from(e)
    })?;

    Ok("Data deleted successfully".to_string())
}

#[tauri::command]
fn erase_json() -> Result<String, Error> {
    OpenOptions::new()
        .write(true)
        .truncate(true)
        .open("data.json")
        .map_err(|e| {
            eprintln!("Failed to open file: {:?}", e);
            Error::from(e)
        })?;

    Ok("Data erased successfully".to_string())
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![append_json, read_json, delete_json, erase_json])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}