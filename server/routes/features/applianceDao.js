/**
Data Access layer to get data from dashdb about appliance temperature
*/
const ibmdb = require('ibm_db');

var dashdb =  {
        db: "BLUDB",
        hostname: "bluemix05.bluforcloud.com",
        port: 50000,
        username: "dash013069",
        password: "_kW0oSvXUg_8"
     };

var connString = "DRIVER={DB2};DATABASE=" + dashdb.db + ";UID=" + dashdb.username + ";PWD=" + dashdb.password + ";HOSTNAME=" + dashdb.hostname + ";port=" + dashdb.port;

exports.dashQuery= function(req,next){
  ibmdb.open(connString, function(err, conn) {
 			if (err ) { next({"Error":err.message});}
 			conn.query("SELECT ROOMTEMPERATURE,FOODCOMPTEMP,FREEZERTEMP, CAPACITY,ENERGYUSE,SYMPTOM ,FAILURE, RFAILURE,RRPFAILURE from DASH013069.APPLIANCES  FETCH FIRST 10 ROWS ONLY", function(err, data, moreResultSets) {
       				if ( !err ) {
                dataView=[]
                for (var i = 0; i < data.length; i++) {
                  dataView.push({'Room_Temperature':data[i]['ROOMTEMPERATURE'],
                      'Food_Compartment_Temperature':data[i]['FOODCOMPTEMP'],
                      'Freezer_Temperature':data[i]['FREEZERTEMP'],
                      'Capacity':data[i]['CAPACITY'],
                      'Energy_Use_KWh_per_day':data[i]['ENERGYUSE'],
                      'Symptom':data[i]['SYMPTOM'],
                      'Failure':data[i]['FAILURE'],
                      'RFailure':data[i]['RFAILURE'],
                      'RRPFailure':data[i]['RRPFAILURE'],});
                }
       					next( dataView);
       				} else {
       				  next({"Error":err.messag});
              }
           });
 				/*
 					Close the connection to the database
 					param 1: The callback function to execute on completion of close function.
 				*/
 				conn.close(function(){
 					console.log("Connection Closed");
 					});
 				});
}; //dash query
