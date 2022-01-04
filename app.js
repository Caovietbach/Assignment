const express = require('express')
const async = require('hbs/lib/async')
const app = express()
const {ObjectId} = require('mongodb')

const {insertObjectToCollection, getAllDocumentsFromCollection, deleteDocumentById, updateCollection, getDocumentById} = require('./databaseHandler')


app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.post('/edit',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const id = req.body.txtId
    
    const myquery = { _id: ObjectId(id) }
    const newvalues = { $set: {name: nameInput, price: priceInput,picURL:picURLInput } }
    const collectionName = "Products"
    await updateCollection(collectionName, myquery, newvalues)
    res.redirect('/view')
})

app.get('/edit',async (req,res)=>{
    const id = req.query.id
    const collectionName = "Products"
    const productToEdit = await getDocumentById(collectionName, id)
    res.render('edit',{product:productToEdit})
})
app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/product',async (req,res)=>{
    res.render('product')
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    console.log("id can xoa:"+ id)
    const collectionName = "Products"
    await deleteDocumentById(collectionName, id)
    res.redirect('/view')
})

app.get('/view',async (req,res)=>{
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('view',{products:results})
})

app.post('/product',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL

    if (nameInput.length == 0){
        const errorMessage = "San pham phai co ten";
        const oldValues = {name:nameInput,price:priceInput,picURL:picURLInput}
        res.render('product',{errorName:errorMessage,oldValues:oldValues})
        console.log("a")
        return;
    } else if (priceInput.length == 0){
        const errorMessage = "San pham phai co gia";
        const oldValues = {name:nameInput,price:priceInput,picURL:picURLInput}
        res.render('product',{errorPrice:errorMessage,oldValues:oldValues})
        console.log("b")
        return;
    } else if(isNaN(priceInput)== true){
        const errorMessage = "Gia phai la so!"
        const oldValues = {name:nameInput,price:priceInput,picURL:picURLInput}
        res.render('product',{errorPriceNaN:errorMessage,oldValues:oldValues})
        console.log("c")
        return;
    } else if (picURLInput.length == 0 ) {
        const errorMessage = "San pham phai co anh"
        const oldValues = {name:nameInput,price:priceInput,picURL:picURLInput}
        res.render('product',{errorLink:errorMessage,oldValues:oldValues})
        console.log("d")
        return;
    } else {
        const newP = {name:nameInput,price:Number.parseFloat(priceInput),picURL:picURLInput}
        const collectionName = "Products"
        await insertObjectToCollection(collectionName,newP)   
        res.redirect('/view')
    }
    
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running!')

