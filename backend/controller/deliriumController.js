const pool = require('../config/database');

const getAPData = async () => {
    const [rows, fields] = await pool.query('SELECT * FROM `green_card`.`ANTICHOLINERGIC ACTIVITY`');
    return rows;
  };


const getData = async (req, res, next) => {
  const apData = await getAPData();
  res.send(apData);
}

const updateData = async (req, res, next) => {
  try {
    const { name, column, value } = req.body;
    await pool.query('UPDATE `green_card`.`ANTICHOLINERGIC ACTIVITY` SET ' + column + ' = ' + '"' + value + '"' + ' WHERE Description = ' + '"' + name + '"');
    res.send("Updated Successfully!");
  } catch (error) {
    console.log(error);
    next(error);
    throw error;
  }
};

const drugData = async (req, res, next) => {
  const {
    listHeader, description
  } = req.body;
  
  try {
    await pool.query(
      "INSERT INTO `green_card`.`ANTICHOLINERGIC ACTIVITY` (`LIST_HEADERS_Id`,`Description`) VALUES (?, ?)",
      [
        listHeader, description
      ]
    );
    
    res.send('Drug was submitted successfully');
  } catch (err) {
    next(err);
    throw err;
  }
};

module.exports = { getData, updateData, drugData };