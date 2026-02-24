// db/db.js

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath);

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      engine TEXT,
      mode TEXT,
      prompt TEXT,
      fileAUrl TEXT,
      fileBUrl TEXT,
      externalID TEXT,
      outputUrl TEXT,
      status TEXT DEFAULT 'queued',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

});

function createProject(data) {

  return new Promise((resolve, reject) => {

    db.run(
      `
      INSERT INTO projects
      (engine, mode, prompt, fileAUrl, fileBUrl, status)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        data.engine,
        data.mode,
        data.prompt,
        data.fileAUrl,
        data.fileBUrl,
        "queued"
      ],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );

  });

}

function updateProcessing(id, externalID) {

  return new Promise((resolve, reject) => {

    db.run(
      `
      UPDATE projects
      SET status='processing', externalID=?
      WHERE id=?
      `,
      [externalID, id],
      (err) => err ? reject(err) : resolve()
    );

  });

}

function completeJob(id, outputUrl) {

  return new Promise((resolve, reject) => {

    db.run(
      `
      UPDATE projects
      SET status='completed', outputUrl=?
      WHERE id=?
      `,
      [outputUrl, id],
      (err) => err ? reject(err) : resolve()
    );

  });

}

function failJob(id) {

  return new Promise((resolve, reject) => {

    db.run(
      `
      UPDATE projects
      SET status='failed'
      WHERE id=?
      `,
      [id],
      (err) => err ? reject(err) : resolve()
    );

  });

}

function getProcessingRunwayJobs() {

  return new Promise((resolve, reject) => {

    db.all(
      `
      SELECT * FROM projects
      WHERE engine='runway'
      AND status='processing'
      `,
      [],
      (err, rows) => err ? reject(err) : resolve(rows)
    );

  });

}

module.exports = {
  createProject,
  updateProcessing,
  completeJob,
  failJob,
  getProcessingRunwayJobs
};
