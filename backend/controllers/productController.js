const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const sequelize = require('../utils/db');
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
        
        await saveDataToDatabase(data, folderName); // Save data to database
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

        await saveDataToDatabase(csvData, folderName); // Save data to database
        res.send('CSV file read successfully.');
      });
    }
  });
};

async function saveDataToDatabase(data, vendorName) {
  const values = data.map(row => `('${vendorName}', '${row.join("', '")}')`).join(',');

  const query = `
    INSERT INTO product (productName, price, quantity, vendorName) 
    VALUES ${values}
  `;

  try {
    await sequelize.query(query);
  } catch (error) {
    console.error('Error saving data to database:', error);
    throw new Error('Error saving data to database.');
  }
}



module.exports = {
  sendFolders,
  uploadDoc
}