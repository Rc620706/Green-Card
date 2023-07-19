const pool = require('../config/database');


const getAPData = async () => {
  const [rows, fields] = await pool.query('SELECT * FROM `green_card`.`ECT & PSYCHOACTIVE MEDICATIONS`');
  return rows;
};

const getData = async (req, res, next) => {
  const apData = await getAPData();
  res.send(apData);
}




module.exports = {
  getData,
  
};
