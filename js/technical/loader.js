// Load files

for (file in modInfo.modFiles) {
    let script = document.createElement("script");
    script.setAttribute("src", "js/" + modInfo.modFiles[file]);
    script.setAttribute("async", "false");
    let temp = document.getElementById("temp");
    if (temp) {
        document.head.insertBefore(script, temp);
    } else {
        document.head.appendChild(script);
    }
}

