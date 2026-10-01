require('dotenv').config();
const express=require('express'),Database=require('better-sqlite3'),bcrypt=require('bcryptjs'),jwt=require('jsonwebtoken'),rateLimit=require('express-rate-limit'),helmet=require('helmet');
const SECRET=process.env.JWT_SECRET;if(!SECRET){console.error('Set JWT_SECRET in .env');process.exit(1)}
const db=new Database(process.env.DB_PATH||'./smartmarket.db');db.pragma('foreign_keys=ON');
db.exec(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,phone TEXT NOT NULL UNIQUE,password TEXT NOT NULL,location TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY,seller_id INTEGER NOT NULL REFERENCES users(id),title TEXT NOT NULL,description TEXT,category TEXT,brand TEXT,price INTEGER NOT NULL,condition TEXT,location TEXT,status TEXT DEFAULT 'Active',created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
try{db.exec("CREATE UNIQUE INDEX IF NOT EXISTS ux_listing ON products(seller_id,lower(trim(title)))")}catch(e){console.log('Old duplicate rows exist; remove them to enable the unique index')}
db.prepare("DELETE FROM products WHERE seller_id IN(SELECT id FROM users WHERE email='demo@smartmarket.local')").run(); // remove old demo data
const app=express();app.use(helmet({contentSecurityPolicy:false}));app.use(express.json({limit:'100kb'}));
app.use('/api/',rateLimit({windowMs:60000,max:120}));
const s=(v,n=200)=>String(v??'').trim().slice(0,n);
const auth=(q,r,n)=>{try{q.uid=jwt.verify((q.headers.authorization||'').replace('Bearer ',''),SECRET).uid;n()}catch{r.status(401).json({error:'Please log in first.'})}};
const pub=u=>({id:u.id,name:u.name,email:u.email,location:u.location});
app.post('/api/register',(q,r)=>{const{name,email,phone,password,location}=q.body||{};
 if(s(name).length<2||!/^\S+@\S+\.\S+$/.test(s(email))||!/^\d{10}$/.test(s(phone))||s(password,100).length<8)return r.status(400).json({error:'Enter name, valid email, 10-digit mobile and a password of 8+ characters.'});
 if(db.prepare('SELECT 1 FROM users WHERE email=? OR phone=?').get(s(email).toLowerCase(),s(phone)))return r.status(409).json({error:'This email or mobile is already registered. Please log in.'});
 const id=db.prepare('INSERT INTO users(name,email,phone,password,location) VALUES(?,?,?,?,?)').run(s(name,80),s(email).toLowerCase(),s(phone),bcrypt.hashSync(s(password,100),10),s(location,80)).lastInsertRowid;r.json({token:jwt.sign({uid:id},SECRET,{expiresIn:'7d'}),user:pub(db.prepare('SELECT * FROM users WHERE id=?').get(id))})});
app.post('/api/login',(q,r)=>{const u=db.prepare('SELECT * FROM users WHERE email=?').get(s(q.body?.email).toLowerCase());
 if(!u||!bcrypt.compareSync(s(q.body?.password,100),u.password))return r.status(401).json({error:'Wrong email or password. New here? Register first.'});
 r.json({token:jwt.sign({uid:u.id},SECRET,{expiresIn:'7d'}),user:pub(u)})});
app.get('/api/me',auth,(q,r)=>{const u=db.prepare('SELECT * FROM users WHERE id=?').get(q.uid);u?r.json({user:pub(u)}):r.status(401).json({error:'Session expired.'})});
app.get('/api/products',auth,(q,r)=>r.json(db.prepare(`SELECT p.*,u.name seller_name FROM products p JOIN users u ON u.id=p.seller_id WHERE p.status IN('Active','Under Review') OR p.seller_id=? ORDER BY p.id DESC`).all(q.uid)));
app.post('/api/products',auth,(q,r)=>{const b=q.body||{},price=Math.round(+b.price);
 if(s(b.title).length<3||!(price>0))return r.status(400).json({error:'Title and a valid price are required.'});
 const st=['Active','Draft','Under Review'].includes(b.status)?b.status:'Active';
 if(db.prepare('SELECT 1 FROM products WHERE seller_id=? AND lower(trim(title))=lower(?)').get(q.uid,s(b.title,120)))return r.status(409).json({error:'You already listed an item with this title. Edit or delete the old one.'});
 try{db.prepare('INSERT INTO products(seller_id,title,description,category,brand,price,condition,location,status) VALUES(?,?,?,?,?,?,?,?,?)').run(q.uid,s(b.title,120),s(b.description,1000),s(b.category,40),s(b.brand,40),price,s(b.condition,30),s(b.location,60),st);r.json({ok:true})}
 catch(e){e.code?.startsWith('SQLITE_CONSTRAINT')?r.status(409).json({error:'You already listed an item with this title. Edit or delete the old one.'}):r.status(500).json({error:'Server error.'})}});
app.delete('/api/products/:id',auth,(q,r)=>{db.prepare('DELETE FROM products WHERE id=? AND seller_id=?').run(+q.params.id,q.uid);r.json({ok:true})});
const F=n=>(q,r)=>r.sendFile(require('path').join(__dirname,n));app.get('/',F('index.html'));app.get('/index.html',F('index.html'));app.get('/style.css',F('style.css'));app.get('/app.js',F('app.js'));
app.listen(process.env.PORT||3000,()=>console.log('SmartMarket AI running'));
