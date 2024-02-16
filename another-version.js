const express = require('express');
const fs = require('fs');
const pg = require('pg');
const readline = require('readline');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000;

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const pool = new pg.Pool(config);

app.post('/upload', async (req, res) => {
    const csvFilePath = process.env.CSV_FILE_PATH;
    const fileStream = fs.createReadStream(csvFilePath);
    const rl = readline.createInterface({ input: fileStream });
    const users = [];
    let headers;

    rl.on('line', (line) => {
        if (!headers) {
            headers = line.split(',');
        } else {
            const obj = {};
            const currentline = line.split(',');

            for(let j=0; j<headers.length; j++){
                setProp(obj, headers[j], currentline[j]);
            }

            users.push(obj);
        }
    });

    rl.on('close', async () => {
        for(const user of users){
            const name = user.name.firstName + ' ' + user.name.lastName;
            const age = user.age;
            const address = { line1: user.address?.line1, line2: user.address?.line2, city: user.address?.city, state: user.address?.state };
            const additional_info = { gender: user.gender };

            await pool.query('INSERT INTO public.users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)', [name, age, JSON.stringify(address), JSON.stringify(additional_info)]);
        }

        const result = await pool.query('SELECT age, COUNT(*) as count FROM public.users GROUP BY age');
        const ageDistribution = { '< 20': 0, '20 to 40': 0, '40 to 60': 0, '> 60': 0 };
        let total = 0;

        for(const row of result.rows){
            total += row.count;
            if(row.age < 20){
                ageDistribution['< 20'] += row.count;
            } else if(row.age <= 40){
                ageDistribution['20 to 40'] += row.count;
            } else if(row.age <= 60){
                ageDistribution['40 to 60'] += row.count;
            } else {
                ageDistribution['> 60'] += row.count;
            }
        }

        for(const ageGroup in ageDistribution){
            ageDistribution[ageGroup] = (ageDistribution[ageGroup] / total) * 100;
        }

        console.log('Age-Group % Distribution', ageDistribution);
        res.send('Data uploaded successfully');
    });
});

function setProp(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    parts.reduce((o, part) => o[part] = o[part] || {}, obj)[last] = value;
}

app.listen(port, () => console.log(`Server is running on port ${port}`));
