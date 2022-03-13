const express = require("express");
const client = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(`${__dirname}/signup.html`);
});

client.setConfig({
    apiKey: "mailchimp api key here",
    server: "mailchimp server here",
});

app.post("/", function (req, res) {
    const firstName = req.body.firstNameInput;
    const lastName = req.body.lastNameInput;
    const email = req.body.emailInput;
    //console.log(firstName, lastName, email);

    const firstLetterFName = firstName.slice(0,1).toUpperCase();
    const firstLetterLName = lastName.slice(0,1).toUpperCase();
    const restOfFName = firstName.slice(1, firstName.length).toLowerCase();
    const restOfLName = lastName.slice(1, lastName.length).toLowerCase();
    //if the person put their entire name lowercase or uppercase it will be fixed to only the first letter to be uppercase and the rest of the name to be lowercase

    const run = async () => {
        try {
            const response = await client.lists.addListMember("mailchimp audience ID here", {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: `${firstLetterFName + restOfFName}`,
                    LNAME: `${firstLetterLName + restOfLName}`
                }
            });
            //console.log(response);
            res.sendFile(`${__dirname}/success.html`);
        } catch (err) {
            //console.log(err.status);
            res.sendFile(`${__dirname}/failure.html`);
        }
    };

    run();
});


app.listen(process.env.PORT || 3000)
