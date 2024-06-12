const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const sequelize = require('../utils/db');
const Product = require('../models/ProductModel');
const FileStatus = require('../models/FileStatus');

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
};

const uploadDoc = async (req, res) => {
  const folderName = req.params.folderName;
  const folderPath = path.join(__dirname, '..', 'vendors', folderName);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).send('Folder not found.');
  }

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendLog = (message, type = 'info') => {
    res.write(`data: ${JSON.stringify({ message, type })}\n\n`);
  };

  fs.readdir(folderPath, async (err, files) => {
    if (err) {
      sendLog('Error reading folder:', 'error');
      return;
    }

    const excelFile = files.find(file => ['.xls', '.xlsx'].includes(path.extname(file).toLowerCase()));
    const csvFile = files.find(file => path.extname(file).toLowerCase() === '.csv');

    if (!excelFile && !csvFile) {
      // sendLog('No Excel or CSV files found in the folder.', 'error');
      res.status(200).json({message : "No Excel or CSV files found in the folder."})
      return;
    }

    if (excelFile) {
      const excelFilePath = path.join(folderPath, excelFile);
      try {
        const workbook = xlsx.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, range: 1 });
        await saveDataToDatabase(data, folderName, sendLog);
        sendLog('Excel file read successfully.', 'success');
      } catch (error) {
        sendLog('Error reading Excel file:', 'error');
      }
    } else {
      const csvFilePath = path.join(folderPath, csvFile);
      fs.readFile(csvFilePath, 'utf8', async (err, data) => {
        if (err) {
          sendLog('Error reading CSV file:', 'error');
          return;
        }

        const rows = data.split('\n');
        const rowData = rows.slice(1);
        const csvData = rowData.map(row => {
          const cleanedRow = row.replace(/[?\r]/g, '');
          return cleanedRow.split(',');
        });

        await saveDataToDatabase(csvData, folderName, sendLog);
        sendLog('CSV file read successfully.', 'success');
      });
    }
  });
};

// async function saveDataToDatabase(data, vendorName, sendLog) {
//   try {
//     for (const row of data) {
//       const roundedPrice = Math.round(row[2]); 
//       const existingProduct = await Product.findOne({
//         where: {
//           productName: row[1],
//           vendorName: vendorName
//         }
//       });

//       if (existingProduct) {
//         if (existingProduct.price !== roundedPrice || existingProduct.quantity !== row[3]) {
//           await existingProduct.update({
//             price: roundedPrice,
//             quantity: row[3]
//           });
//           sendLog(`Product id '${row[0]}' updated.`, 'update');
//         } else {
//           sendLog(`Product id '${row[0]}' already exists with the same data. Skipping insertion.`, 'skip');
//         }
//       } else {
//         await Product.create({
//           productName: row[1],
//           price: roundedPrice, 
//           quantity: row[3],
//           vendorName: vendorName
//         });
//         sendLog(`Product id '${row[0]}' inserted.`, 'success');
//       }
//     }
//   } catch (error) {
//     sendLog('Error saving data to database:', 'error');
//   }
// }

async function saveDataToDatabase(data, vendorName, sendLog) {
  try {
    let rowsInserted = 0;
    let rowsUpdated = 0;
    let rowsSkipped = 0;

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
          rowsUpdated++;
          sendLog(`Product id '${row[0]}' updated.`, 'update');
        } else {
          rowsSkipped++;
          sendLog(`Product id '${row[0]}' already exists with the same data. Skipping insertion.`, 'skip');
        }
      } else {
        await Product.create({
          productName: row[1],
          price: roundedPrice, 
          quantity: row[3],
          vendorName: vendorName
        });
        rowsInserted++;
        sendLog(`Product id '${row[0]}' inserted.`, 'success');
      }
    }

    await FileStatus.create({
      rowsInserted,
      rowsUpdated,
      rowsSkipped,
      vendorName,
      status: 'Success'
    });

  } catch (error) {
    sendLog('Error saving data to database:', 'error');
    await FileStatus.create({
      rowsInserted,
      rowsUpdated,
      rowsSkipped,
      vendorName,
      status: 'Failed'
    });
  }
}

const fileStatus = async (req,res) => {
  try {
    const fileStatuses = await FileStatus.findAll();
    console.log("file Status: ",fileStatuses);
    res.json(fileStatuses);
  } catch (error) {
    console.error('Error fetching file status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  sendFolders,
  uploadDoc,
  fileStatus
};
