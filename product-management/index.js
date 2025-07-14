const express = require('express')

const router = require("./routers/client/index.router")

const app = express()
const port = 3001

app.set('views', './views')
app.set('view engine', 'pug')
 
//router
router(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
