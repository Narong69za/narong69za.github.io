exports.updateStatus = (id,status)=>{

   db.run(
      "UPDATE projects SET status=? WHERE id=?",
      [status,id]
   );

};

exports.saveExternalJobID = (id,externalID)=>{

   db.run(
      "UPDATE projects SET externalJobID=? WHERE id=?",
      [externalID,id]
   );

};

exports.updateResult = (externalID,data)=>{

   db.run(
      `UPDATE projects SET
      status='complete',
      progress=100,
      resultURL=?
      WHERE externalJobID=?`,
      [data.resultURL,externalID]
   );

};
