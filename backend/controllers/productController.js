const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const sequelize = require('../utils/db');
const Product = require('../models/ProductModel');
// const { getAllProducts } = require('../services/productServices');

const sendFolders = (req, res) => {
  function getFolders(directory) {
    return fs.readdirSync(directory).filter(file => {
      return fs.statSync(path.join(directory, file)).isDirectory();
    });
  }

  const directoryPath = path.join(__dirname, '..', 'vendors');
  const folders = getFolders(directoryPath);

  res.send(folders);
  console.log(folders);
}

// const uploadDoc = async (req, res) => {
  
//   const folderName = req.body.folderName;

//   // Construct the path to the folder
//   const folderPath = path.join(__dirname, '..', 'vendors', folderName);

//   // Check if the folder exists
//   if (!fs.existsSync(folderPath)) {
//     return res.status(404).send('Folder not found.');
//   }

//   // Read all files in the folder
//   fs.readdir(folderPath, (err, files) => {
//     if (err) {
//       console.error('Error reading folder:', err);
//       return res.status(500).send('Error reading folder.');
//     }

//     // Find the first Excel or CSV file
//     const excelFile = files.find(file => ['.xls', '.xlsx'].includes(path.extname(file).toLowerCase()));
//     const csvFile = files.find(file => path.extname(file).toLowerCase() === '.csv');

//     if (excelFile) { console.log("Excel File : ", excelFile) }
//     else if (csvFile) { console.log("CSV File : ", csvFile) }
//     else { console.log("No File Found.") }

//     if (!excelFile && !csvFile) {
//       return res.status(404).send('No Excel or CSV files found in the folder.');
//     }

//     // Read and process the Excel or CSV file
//     if (excelFile) {

//       const excelFilePath = path.join(folderPath, excelFile);

//       try {
//         const workbook = xlsx.readFile(excelFilePath);
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, range: 1 });

//         // Process the data as needed
//         console.log(data);

//         res.send('Excel file read successfully.');
//       } catch (error) {
//         console.error('Error reading Excel file:', error);
//         res.status(500).send('Error reading Excel file.');
//       }
//     } else {
//       // Read CSV file
//       const csvFilePath = path.join(folderPath, csvFile);
//       fs.readFile(csvFilePath, 'utf8', (err, data) => {
//         if (err) {
//           console.error('Error reading CSV file:', err);
//           return res.status(500).send('Error reading CSV file.');
//         }

//         const rows = data.split('\n');

//         const rowData = rows.slice(1);

//         const csvData = rowData.map(row => {

//           const cleanedRow = row.replace(/[?\r]/g, '');
//           return cleanedRow.split(',');
//         });

//         console.log(csvData);

//         res.send('CSV file read successfully.');
//       });
//     }
//   });
// };

const uploadDoc = async (req, res) => {
  const folderName = req.body.folderName;
  const folderPath = path.join(__dirname, '..', 'vendors', folderName);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).send('Folder not found.');
  }

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  fs.readdir(folderPath, async (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return res.status(500).send('Error reading folder.');
    }

    const excelFile = files.find(file => ['.xls', '.xlsx'].includes(path.extname(file).toLowerCase()));
    const csvFile = files.find(file => path.extname(file).toLowerCase() === '.csv');

    if (!excelFile && !csvFile) {
      return res.status(404).send('No Excel or CSV files found in the folder.');
    }

    if (excelFile) {
      const excelFilePath = path.join(folderPath, excelFile);
      try {
        const workbook = xlsx.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
        console.log(data);
        await saveDataToDatabase(data, folderName, res); 
        res.send('Excel file read successfully.');
      } catch (error) {
        console.error('Error reading Excel file:', error);
        res.status(500).send('Error reading Excel file.');
      }
    } else {
      const csvFilePath = path.join(folderPath, csvFile);
      fs.readFile(csvFilePath, 'utf8', async (err, data) => {
        if (err) {
          console.error('Error reading CSV file:', err);
          return res.status(500).send('Error reading CSV file.');
        }

        const rows = data.split('\n');
        const rowData = rows.slice(1);
        const csvData = rowData.map(row => {
          const cleanedRow = row.replace(/[?\r]/g, '');
          return cleanedRow.split(',');
        });
        console.log(csvData);
        await saveDataToDatabase(csvData, folderName); // Save data to database
        res.send('CSV file read successfully.');
      });
    }
  });
};

// async function saveDataToDatabase(data, vendorName) {
//   const values = data.map(row => `('${row[1]}', ${row[2]}, ${row[3]}, '${vendorName}')`).join(',');

//   const query = `INSERT INTO product (productName, price, quantity, vendorName) VALUES ${values}`;

//   try {
//     await sequelize.query(query);
//   } catch (error) {
//     console.error('Error saving data to database:', error);
//     throw new Error('Error saving data to database.');
//   }
// }

// async function saveDataToDatabase(data, vendorName) {
//   try {
//     for (const row of data) {
//       const [product, created] = await Product.findOrCreate({
//         where: {
//           productName: row[1],
//           price: row[2],
//           quantity: row[3],
//           vendorName: vendorName
//         },
//         defaults: {
//           productName: row[1],
//           price: row[2],
//           quantity: row[3],
//           vendorName: vendorName
//         }
//       });
      
//       if (!created) {
//         console.log(`Product '${row[0]}' already exists. Skipping insertion.`);
//       }
//     }
//   } catch (error) {
//     console.error('Error saving data to database:', error);
//     throw new Error('Error saving data to database.');
//   }
// }

// async function saveDataToDatabase(data, vendorName) {
//   try {
//     for (const row of data) {
//       const roundedPrice = Math.round(row[2]);

//       const existingProduct = await Product.findOne({
//         where: {
//           productName: row[1],
//           price: roundedPrice,
//           quantity: row[3],
//           vendorName: vendorName
//         }
//       });

//       if (!existingProduct) {
//         await Product.create({
//           productName: row[1],
//           price: roundedPrice, 
//           quantity: row[3],
//           vendorName: vendorName
//         });
//       } else {
//         console.log(`Product '${row[0]}' already exists. Skipping insertion.`);
//       }
//     }
//   } catch (error) {
//     console.error('Error saving data to database:', error);
//     throw new Error('Error saving data to database.');
//   }
// }

// Function to save data to the database and send SSE messages for logging

async function saveDataToDatabase(data, vendorName, res) {
  try {
    for (const row of data) {
      const roundedPrice = Math.round(row[2]); 
      const existingProduct = await Product.findOne({
        where: {
          productName: row[1],
          vendorName: vendorName
        }
      });

      if (existingProduct) {
        if (existingProduct.price !== roundedPrice || existingProduct.quantity !== row[3]) {
          await existingProduct.update({
            price: roundedPrice,
            quantity: row[3]
          });
          res.write(`data: ${JSON.stringify({ message: "Updated", data: row })}\n\n`);
          console.log(`Product id'${row[0]}' updated.`);
        } else {
          res.write(`data: ${JSON.stringify({ message: "Skipped", data: row })}\n\n`);
          console.log(`Product id'${row[0]}' already exists with the same data. Skipping insertion.`);
        }
      } else {
        await Product.create({
          productName: row[1],
          price: roundedPrice, 
          quantity: row[3],
          vendorName: vendorName
        });
        res.write(`data: ${JSON.stringify({ message: "Inserted", data: row })}\n\n`);
        console.log(`Product id'${row[0]}' inserted.`);
      }
    }
    res.end();
  } catch (error) {
    console.error('Error saving data to database:', error);
    res.status(500).send('Error saving data to database.');
  }
}


module.exports = {
  sendFolders,
  uploadDoc
}