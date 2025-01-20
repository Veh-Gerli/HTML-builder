const fs = require("fs");
const output = fs.createWriteStream("destination.txt");
output.on("data", (chunk) => output.write(chunk));
output.on("error", (error) => console.log("Error", error.message));
