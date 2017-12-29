const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

//Set Storage engine(Multer stuff)
const storage = multer.diskStorage({
  destination : './public/uploads',
  filename : function(req,file,cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initiliaze upload
const upload = multer({
  storage : storage,
  limits:{
    fileSize:2000000 // Limit : 2MB
  },
  fileFilter : function(req,file,cb){
    checkFileType(file,cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file,cb){
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  //Check extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check MIME Type
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  }else{
    cb('Error : Only Image Upload is allowed!');
  }
}

//Initiliaze the app
const app = express();

//Set up the View engine
app.set('view engine','ejs');

//Set Public Static Folder
app.use(express.static('./public'));

app.get('/',(req,res)=>{
  res.render('index');
});

app.post('/upload',(req,res)=>{
  upload(req,res,(err)=>{
    if(err){
      res.render('index',{
        msg:err
      })
    } else{
      if(req.file == undefined){
        res.render('index',{
          msg:'Error : No File Selected'
        })
      } else {
        res.render('index',{
          msg: 'File Successfully Uploaded!',
          file : `uploads/${req.file.filename}`
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});
