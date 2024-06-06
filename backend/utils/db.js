const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('vendordata','root','',{
    host: "localhost",
    // logging: true,
    dialect: 'mysql'
})

sequelize.authenticate()
    .then(()=> {
        console.log("Connection has been established successfully.");
    })
    .catch((error)=> {
        console.log("Database Connection Error : ",error);
    });

module.exports = sequelize;