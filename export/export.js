const mongoose = require('mongoose');
const Export = mongoose.model('Export');
const Profile = mongoose.model('Profile');
const fs = require('fs');
const json2csv = require('json2csv');
const path = require('path');

exports.getExports = (req, res) => {
    Export.find({
        _pid: req.params.pid
    }).exec()
        .then((exports) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(exports);
        })
        .catch((err => {
            res.status(404).json({
                error: err
            })
        }))
};

exports.createExport = (req, res) => {
    const exportRecord = new Export({
        _pid: req.params.pid,
        _id: new mongoose.Types.ObjectId(),
    });
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    for (let i = 0; i < keys.length; i += 1) {
        exportRecord[keys[i]] = values[i];
    }

    Export.collection.insertOne(exportRecord);

    Profile.update(
        { _id: req.params.pid },
        { $addToSet: { imports: exportRecord } }
    )
        .exec()
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(404).json({ error: err })
        })
}

exports.exportCSVfile = (req, res, err) => {
    if (err) {
        res.json(err)
    }
    else {
        // grab data from server

        const fields = ['date', 'category', 'description', 'amount'];
        const opts = {fields};
        const fileName = path.join(__dirname, '/random.csv');
        const csv = json2csv(
            { data: req.body.body, 
                fields: opts
            }
        );
        fs.writeFile(csv, (error) => {
            if (error) { 
                throw error; 
            }
            else {
                console.log(fileName);
                res.download(fileName);
            }
        }
    )};
}