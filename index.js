const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');

const app = express();
const PORT = 3000;

//Express middleware
app.use(express.urlencoded({ extended: false }));

//Routes to fetch all the users 
app.get('/api/users', (req, res) => {
    return res.json(users);
})

app.get('/users', (req, res) => {
    const html = `
   <ul>
        ${users.map(users => `<li>${users.first_name}</li>`).join('')}
   </ul>
   `;

    return res.send(html);
})


app.route('/api/users/:id')
    .get((req, res) => {
        //Get user by id
        const id = req.params.id;
        const user = users.find(user => user.id === parseInt(id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    }).patch((req, res) => {
        //Edit user with id
        const id = req.params.id;
        const user = users.find(user => user.id === parseInt(id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        Object.keys(req.body).forEach(key => { //iterate over every property of the response body
            user[key] = req.body[key];
        });

        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) =>{
            if (err) {
                return res.status(500).json({ message: 'Error updating user' });
            }
            return res.json({status: `Successfuly user with ID ${id} updated`});
        });
    }).delete((req, res) => {
        //Delete user with id
        const id = req.params.id;
        const userIndex = users.findIndex(user => user.id === parseInt(id));
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
        users.splice(userIndex, 1); //delete the index of the user
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) =>{
            if (err) {
                return res.status(500).json({ message: 'Error deleting user' });
            }
            return res.json({status: `success: user deleted with ID ${id}`});
        });
    });

//create new user
app.post('/api/users', (req, res) => {
    const body = req.body;
    users.push({id:users.length + 1, ...body});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) =>{
        if (err) {
            return res.status(500).json({ message: 'Error creating user' });
        }
        return res.json({status: `success: user created with ID ${users.length}`});
    });
});


app.listen(PORT, () => console.log(`Server started at ${PORT}`));